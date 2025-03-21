import { forwardRef, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseService } from '../../common/bases/base.service';
import {
  getPagingData,
  PaginationMetadata
} from '../../common/util/pagination-data.util';
import { ErrorManager } from '../../common/exceptions/error.manager';
import {
  Conditions,
  DynamicQueryBuilder
} from '../../common/util/dynamic-query-builder.util';
import {
  ProfessionalDegree,
  Patient,
  Prescription,
  ChargeItem,
  Practitioner,
  PractitionerAppointment,
  PractitionerRole,
  Appointment,
  Location
} from '../../domain/entities';
import { EntityManager, Repository, SelectQueryBuilder } from 'typeorm';
import { Gender, Role } from '../../domain/enums';
import * as bcrypt from 'bcrypt';
import axios from 'axios';
import { CreatePractitionerDto, UpdatePractitionerDto } from '../../domain/dtos/practitioner/practitioner.dto';
import { PractitionerFilteredPaginationDto } from '../../domain/dtos/practitioner/practitioner-filtered-pagination.dto';
import { AuthService } from '../auth/auth.service';
import { plainToInstance } from 'class-transformer';
import { SerializerPractitionerDto } from '../../domain/dtos';
import { JwtPayload } from '../auth/interfaces/jwt-payload.interface';

@Injectable()
export class PractitionerService extends BaseService<
  Practitioner,
  CreatePractitionerDto,
  UpdatePractitionerDto
> {
  constructor(
    @InjectRepository(Practitioner) protected repository: Repository<Practitioner>,
    @InjectRepository(PractitionerRole) private readonly specialityRepository: Repository<PractitionerRole>,
    @InjectRepository(Patient) private readonly patientRepository: Repository<Patient>,
    @InjectRepository(Location) private readonly officeRepository: Repository<Location>,
    @InjectRepository(ProfessionalDegree) private readonly degreeRepository: Repository<ProfessionalDegree>,
    @Inject(forwardRef(() => AuthService)) private readonly authService: AuthService,
  ) {
    super(repository);
  }

  // Crear un nuevo especialista
  async createSpecialist(createSpecialistDto: CreatePractitionerDto) {
    try {
      const { password, dni, license, email, username, officeId, ...userData } = createSpecialistDto;
  
      // Validar en Specialist y Patient
      const existingUser = await this.repository.findOne({
        where: [{ dni }, { email }, { username }, { phone: userData.phone }],
      });

      const existingPatient = await this.patientRepository.findOne({
        where: [{ email }, { username }],
      });

      if (existingUser || existingPatient) {
        throw new ErrorManager(
          'User with provided DNI, email, username, or phone already exists',
          400,
        );
      }

      // Consultar SISA para validar al médico
      const sisaUrl = `https://sisa.msal.gov.ar/sisa/services/rest/profesional/obtener?nrodoc=${dni}&usuario=jlllado&clave=$FullSalud123`;
      const sisaResponse = await axios.get(sisaUrl);
      const sisaData = sisaResponse.data;  
 
      // Validar respuesta del SISA
      if (sisaData.resultado !== 'OK') {
        throw new ErrorManager('No valid professional found in SISA', 400);
      }
  
      if (sisaData.numeroDocumento !== dni) {
        throw new ErrorManager('DNI does not match with SISA records', 400);
      }
  
      // Validar si la matrícula proporcionada coincide con una habilitada en SISA
      const matriculas = Array.isArray(sisaData.matriculas)
        ? sisaData.matriculas
        : sisaData.matriculas
        ? [sisaData.matriculas]
        : [];
  
      const validMatricula = matriculas.find(
        (matricula) =>
          matricula.estado === 'Habilitado' && matricula.matricula === license,
      );
  
      if (!validMatricula) {
        throw new ErrorManager(
          `No valid license (${license}) found for this professional in SISA`,
          400,
        );
      }

      let office: Location | null = null;
      if (officeId) {
        office = await this.officeRepository.findOne({ where: { id: officeId } });
        if (!office) {
          throw new ErrorManager(`Office with ID ${officeId} not found`, 400);
        }
      }
  
      const hashedPassword = password ? await bcrypt.hash(password, 10) : null;
  
      const practitioner = this.repository.create({
        ...userData,
        dni,
        password: hashedPassword,
        role: Role.SPECIALIST,
        license,
        email,
        username,
        office,
      });
  
      const savedPractitioner = await this.repository.save(practitioner);

      const payload: JwtPayload = { id: savedPractitioner.id, email: savedPractitioner.email, role: savedPractitioner.role, name: savedPractitioner.name, lastName: savedPractitioner.lastName };
      const token = await this.authService.signJWT(payload);

      const practitionerDto = plainToInstance(SerializerPractitionerDto, savedPractitioner);

      return { ...practitionerDto, accessToken: token };
    } catch (error) {
      throw ErrorManager.createSignatureError((error as Error).message);
    }
  }  

  // Obtener todos los especialistas
  async getAll(): Promise<Practitioner[]> {
    try {
      return await this.repository.find({ where: { deletedAt: null } });
    } catch (error) {
      throw ErrorManager.createSignatureError((error as Error).message);
    }
  }

  // Obtener un especialista por ID
  async getOne(id: string): Promise<Practitioner> {
    try {
      const practitioner = await this.repository.findOne({
        where: { id },
        relations: ['specialities', 'degree'],
      });

      if (!practitioner) {
        throw new NotFoundException(`Specialist with ID ${id} not found`);
      }

      return practitioner;
    } catch (error) {
      throw ErrorManager.createSignatureError((error as Error).message);
    }
  }

   // Actualizar un especialista
   async update(id: string, updateSpecialistDto: UpdatePractitionerDto): Promise<Practitioner> {
    try {
      const practitioner = await this.getOne(id);

      const { specialities, degreeId, ...updatedData } = updateSpecialistDto;

      if (specialities) {
        const specialityEntities = await this.specialityRepository.findByIds(
          specialities.map((s) => s.id),
        );
        if (specialityEntities.length !== specialities.length) {
          throw new ErrorManager('Some specialities not found', 400);
        }
        practitioner.specialities = specialityEntities;
      }

      if (degreeId) {
        const degreeEntity = await this.degreeRepository.findOne({ where: { id: degreeId } });
        if (!degreeEntity) {
          throw new ErrorManager(`Degree with id "${degreeId}" not found`, 400);
        }
        practitioner.degree = degreeEntity;
      }

      Object.assign(practitioner, updatedData);
      return await this.repository.save(practitioner);
    } catch (error) {
      throw ErrorManager.createSignatureError((error as Error).message);
    }
  }

  // Eliminar especialista (soft delete)
  async softDelete(id: string): Promise<{ message: string }> {
    try {
      const practitioner = await this.getOne(id);

      await this.repository.softRemove(practitioner);

      return { message: 'Specialist soft deleted successfully' };
    } catch (error) {
      throw ErrorManager.createSignatureError((error as Error).message);
    }
  }

  // Recuperar un especialista eliminado
  async recover(id: string): Promise<{ message: string }> {
    try {
      const practitioner = await this.repository.findOne({
        where: { id },
        withDeleted: true,
      });

      if (!practitioner || !practitioner.deletedAt) {
        throw new NotFoundException(`Specialist with ID ${id} not found or not deleted`);
      }

      await this.repository.recover(practitioner);

      return { message: 'Specialist recovered successfully' };
    } catch (error) {
      throw ErrorManager.createSignatureError((error as Error).message);
    }
  }

  //condiciones que se agregarán al query builder para filtrar los patient turn
  private practitionerConditions: Conditions<Practitioner> = {
    name: (queryBuilder: SelectQueryBuilder<Practitioner>, value: string) =>
      queryBuilder.andWhere('user.name LIKE :name', { name: `%${value}%` }),
    lastName: (queryBuilder: SelectQueryBuilder<Practitioner>, value: string) =>
      queryBuilder.andWhere('user.last_name LIKE :lastName', {
        lastName: `%${value}%`
      }),
    dni: (queryBuilder: SelectQueryBuilder<Practitioner>, value: string) =>
      queryBuilder.andWhere('user.dni LIKE :dni', { dni: `%${value}%` }),
    gender: (queryBuilder: SelectQueryBuilder<Practitioner>, value: Gender) =>
      queryBuilder.andWhere('user.gender = :gender', { gender: value }),
    birth: (queryBuilder: SelectQueryBuilder<Practitioner>, value: Date) =>
      queryBuilder.andWhere(
        '( YEAR(user.birth) = YEAR(:birth) ' +
          'AND MONTH(user.birth) = MONTH(:birth) ' +
          'AND DAY(user.birth) = DAY(:birth) ) ',
        { birth: value }
      ),
    homeService: (
      queryBuilder: SelectQueryBuilder<Practitioner>,
      value: boolean
    ) =>
      queryBuilder.andWhere('practitioner.home_service = :homeservice', {
        homeservice: value
      }),
    license: (queryBuilder: SelectQueryBuilder<Practitioner>, value: string) =>
      queryBuilder.andWhere('practitioner.license = :license', {
        license: value
      }),
    speciality: (queryBuilder: SelectQueryBuilder<Practitioner>, value: string) =>
      queryBuilder.andWhere('practitioner_role.id = :id', { id: value }),
    socialWorkEnrollmentId: (
      queryBuilder: SelectQueryBuilder<Practitioner>,
      value: string
    ) => queryBuilder.andWhere('social_work_enrrollment.id = :id', { id: value }),
    degree: (queryBuilder: SelectQueryBuilder<Practitioner>, value: string) =>
      queryBuilder.andWhere('degree.id = :id', { id: value })
  };

  //Override del método base findAll para filtrar por propiedades
  async findAllDeprecated(
    paginationDto: PractitionerFilteredPaginationDto
  ): Promise<{ data: Practitioner[]; meta: PaginationMetadata }> {
    try {
      const { page, limit } = paginationDto;
      //crea un query builder base para traer la entidad con las relaciones que necesita el Serializer
      const queryBuilderBase = this.repository
        .createQueryBuilder('practitioner')
        .leftJoinAndSelect(
          'practitioner.specialistAttentionHour',
          'specialistAttentionHour'
        )
        .leftJoinAndSelect('practitioner.degree', 'degree')
        .leftJoinAndSelect('practitioner.specialities', 'speciality')
        //.leftJoinAndSelect('practitioner.acceptedSocialWorks', 'social_work');

      //añade las condiciones where al query builder
      const query = DynamicQueryBuilder.buildSelectQuery<Practitioner>(
        queryBuilderBase,
        this.practitionerConditions,
        paginationDto
      );

      //añade la paginación al query creada
      query.skip((page - 1) * limit).take(limit);

      //ejecuta la query
      const entities = await query.getMany();

      //retorna los resultados
      console.log(entities);
      return {
        data: entities,
        meta: getPagingData(entities, page, limit)
      };
    } catch (error) {
      throw ErrorManager.createSignatureError((error as Error).message);
    }
  }

  override async remove(id: string): Promise<string> {
    try {
      const entity = await this.findOne(id);
      return this.repository.manager.transaction(
        async (manager: EntityManager) => {
          await manager //eliminar el especialista de turno
            .createQueryBuilder()
            .update(Appointment)
            .set({ practitioner: null })
            .where('specialist_id = :id', { id: entity.id })
            .execute();
          await manager //eliminar el especialista de prescripcion
            .createQueryBuilder()
            .update(Prescription)
            .set({ practitioner: null })
            .where('specialist_id = :id', { id: entity.id })
            .execute();
          await manager.delete(PractitionerAppointment, { practitioner: entity });
          await manager.delete(ChargeItem, { practitioner: entity });
          await manager.remove(Practitioner, entity);
          return `Entity with id ${id} deleted`;
        }
      );
    } catch (error) {
      throw ErrorManager.createSignatureError((error as Error).message);
    }
  }

  override async softRemove(id: string): Promise<string> {
    try {
      const entity = await this.findOne(id);
      return this.repository.manager.transaction(
        async (manager: EntityManager) => {
          await manager.softDelete(ChargeItem, { practitioner: entity });
          await manager.softRemove(entity);
          return `Entity with id ${id} soft deleted`;
        }
      );
    } catch (error) {
      throw ErrorManager.createSignatureError((error as Error).message);
    }
  }

  override async restore(id: string): Promise<Practitioner> {
    try {
      const entity = await this.repository.findOne({
        where: { id },
        withDeleted: true
      });
      return this.repository.manager.transaction(
        async (manager: EntityManager) => {
          const recovered = await manager.recover(entity);
          await manager.restore(ChargeItem, { practitioner: entity });
          return recovered;
        }
      );
    } catch (error) {
      throw ErrorManager.createSignatureError((error as Error).message);
    }
  }

  async findAllWithTurns(): Promise<Practitioner[]> {
    try {
      return await this.repository
        .createQueryBuilder('practitioner')      
        .leftJoinAndSelect('practitioner.specialistAttentionHour', 'specialistAttentionHour')
        .leftJoinAndSelect('practitioner.degree', 'degree')
        .leftJoinAndSelect('practitioner.speciality', 'speciality')
        //.leftJoinAndSelect('practitioner.acceptedSocialWorks', 'social_work')
        .leftJoinAndSelect('practitioner.turns', 'turn')
        //.leftJoinAndSelect('turn.Patient', 'Patient') // Opcional: otras relaciones de Turn
        .getMany();
    } catch (error) {
      console.error('Error fetching specialists with turns:', error);
      throw ErrorManager.createSignatureError((error as Error).message);
    }
  }

  async findAllPaginated(
    filteredDto: PractitionerFilteredPaginationDto,
  ): Promise<{ data: Practitioner[]; lastPage: number; total: number; msg?: string }> {
    try {
      const { page, limit, ...filters } = filteredDto;

      const queryBuilder = this.repository
        .createQueryBuilder('practitioner')
        .leftJoinAndSelect('practitioner.degree', 'degree')
        .leftJoinAndSelect('practitioner.specialities', 'specialities')
        .leftJoinAndSelect('practitioner.socialWorkEnrollment', 'socialWorkEnrollment')
        .leftJoinAndSelect('practitioner.specialistAttentionHour', 'appointments')
        .leftJoinAndSelect('practitioner.favorite', 'favorite')
        .leftJoinAndSelect('practitioner.office', 'office')
        .where('practitioner.deletedAt IS NULL');

      // Filtros por relaciones
      if (filters.degree) {
        queryBuilder.andWhere('degree.id = :degreeId', { degreeId: filters.degree });
      }

      if (filters.speciality) {
        queryBuilder.andWhere('specialities.id = :specialityId', { specialityId: filters.speciality });
      }

      if (filters.socialWorkEnrollmentId) {
        queryBuilder.andWhere('socialWorkEnrollment.id = :socialWorkEnrollmentId', { socialWorkEnrollmentId: filters.socialWorkEnrollmentId });
      }

      // Filtros de office
      if (filters.officeName) {
        queryBuilder.andWhere('office.name = :officeName', { officeName: filters.officeName });
      }

      // Filtros de appointment
      if (filters.appointmentDay) {
        queryBuilder.andWhere('appointments.day = :appointmentDay', { appointmentDay: filters.appointmentDay });
      }

      // Filtros generales
      for (const key in filters) {
        if (Object.prototype.hasOwnProperty.call(filters, key) && filters[key] !== undefined && filters[key] !== null) {
          if (key !== 'degree' && key !== 'speciality' && key !== 'socialWorkId' && key !== 'officeName' && key !== 'appointmentDay') {
            queryBuilder.andWhere(`practitioner.${key} = :${key}`, { [key]: filters[key] });
          }
        }
      }

      const [practitioners, total] = await queryBuilder
        .skip((page - 1) * limit)
        .take(limit)
        .getManyAndCount();

      const lastPage = Math.ceil(total / limit);
      let msg = '';
      if (total === 0) msg = 'No se encontraron datos';
      return { data: practitioners, lastPage, total, msg };
    } catch (error) {
      throw ErrorManager.createSignatureError((error as Error).message);
    }
  }
  
}
