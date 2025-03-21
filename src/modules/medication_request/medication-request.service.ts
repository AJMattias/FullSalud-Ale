import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseService } from '../../common/bases/base.service';
import { Repository } from 'typeorm';
import { MedicationRequest } from '../../domain/entities/medication-request.entity';
import { ErrorManager } from '../../common/exceptions/error.manager';
import { Medication } from '../../domain/entities';
import { PatientService } from '../patient/patient.service';
import { PractitionerService } from '../practitioner/practitioner.service';
import { CreateMedicationRequestDto, UpdateMedicationRequestDto } from '../../domain/dtos/medication-request/medication-request.dto';
import { FilteredMedicationRequestDto } from '../../domain/dtos/medication-request/FilteredMedicationRequest.dto';

@Injectable()
export class MedicationRequestsService extends BaseService<
    MedicationRequest,
    CreateMedicationRequestDto,
    UpdateMedicationRequestDto
> {
    constructor(
        @InjectRepository(MedicationRequest) protected repository: Repository<MedicationRequest>,
        protected readonly patientService: PatientService,
        protected readonly SpecialistService: PractitionerService,
    ) {
        super(repository);
    }

    override async create(createDto: CreateMedicationRequestDto): Promise<MedicationRequest> {
        try {
            const doctor = await this.SpecialistService.findOne(createDto.practitionerId)
            if (!doctor) {
                throw ErrorManager.createSignatureError('Doctor not found');
            }

            const patient = await this.patientService.findOne(createDto.patientId)
            if (!patient) {
                throw ErrorManager.createSignatureError('Patient not found');
            }
            //falta control de lista de medicine, conviene hacerlo en el servicio de medicine
            return await this.repository.manager.transaction(
                async (transactionalEntityManager) => {
                    const newMedicationRequest = new MedicationRequest();
                    //TODO añadir nuevos atributos
                    newMedicationRequest.prolonged_treatment = createDto.prolonged_treatment;
                    newMedicationRequest.hiv = createDto.hiv;
                    newMedicationRequest.generic_name = createDto.generic_name;
                    newMedicationRequest.medicine_presentation = createDto.medicine_presentation;
                    newMedicationRequest.medicine_pharmaceutical_form = createDto.medicine_pharmaceutical_form;
                    newMedicationRequest.medicine_quantity = createDto.medicine_quantity
                    newMedicationRequest.indications = createDto.indications;
                    newMedicationRequest.diagnosis = createDto.diagnosis;
                    newMedicationRequest.isValidSignature = createDto.isValidSignature ?? false;
                    newMedicationRequest.practitioner = doctor;
                    newMedicationRequest.patient = patient;
                    const medicines: Medication[] = [];
                    for (const medicineDto of createDto.medicines) {
                        const medicine = await transactionalEntityManager.findOne(Medication, {
                            where: { id: medicineDto.id },
                        });
                        if (medicine) {
                            medicines.push(medicine);
                        } else {
                            throw new Error(`Medicine with ID ${medicineDto.id} not found`);
                        }
                    }

                    newMedicationRequest.medicines = medicines;
                    await transactionalEntityManager.save(MedicationRequest, newMedicationRequest);
                    return newMedicationRequest;
                }
            );
        } catch (error) {
            throw ErrorManager.createSignatureError((error as Error).message);
        }
    }

    override async update(id: string, updateDto: UpdateMedicationRequestDto): Promise<MedicationRequest> {
        try {
            console.log('to update: ', updateDto)
            const existingMedicationRequest = await this.repository.findOne({
                where: { id },
                relations: ['practitioner', 'patient', 'medicines'],
            });

            if (!existingMedicationRequest) {
                throw ErrorManager.createSignatureError('MedicationRequest not found');
            }

            const doctor = updateDto.practitionerId
                ? await this.SpecialistService.findOne(updateDto.practitionerId)
                : existingMedicationRequest.practitioner;

            if (!doctor) {
                throw ErrorManager.createSignatureError('Doctor not found');
            }

            const patient = updateDto.patientId
                ? await this.patientService.findOne(updateDto.patientId)
                : existingMedicationRequest.patient;

            if (!patient) {
                throw ErrorManager.createSignatureError('Patient not found');
            }

            return await this.repository.manager.transaction(
                async (transactionalEntityManager) => {
                    existingMedicationRequest.indications = updateDto.indications ?? existingMedicationRequest.indications;
                    existingMedicationRequest.diagnosis = updateDto.diagnosis ?? existingMedicationRequest.diagnosis;
                    existingMedicationRequest.isValidSignature = updateDto.isValidSignature ?? existingMedicationRequest.isValidSignature;
                    existingMedicationRequest.practitioner = doctor;
                    existingMedicationRequest.patient = patient;
                    //nuevos atributos
                    existingMedicationRequest.prolonged_treatment = updateDto.prolonged_treatment ?? existingMedicationRequest.prolonged_treatment;
                    existingMedicationRequest.hiv = updateDto.hiv ?? existingMedicationRequest.hiv;
                    existingMedicationRequest.generic_name = updateDto.generic_name ?? existingMedicationRequest.generic_name;
                    existingMedicationRequest.medicine_presentation = updateDto.medicine_presentation ?? existingMedicationRequest.medicine_presentation;
                    existingMedicationRequest.medicine_pharmaceutical_form = updateDto.medicine_pharmaceutical_form ?? existingMedicationRequest.medicine_pharmaceutical_form;
                    existingMedicationRequest.medicine_quantity = updateDto.medicine_quantity ?? existingMedicationRequest.medicine_quantity

                    if (updateDto.medicines) {
                        const updatedMedicines: Medication[] = [];
                        for (const medicineDto of updateDto.medicines) {
                            const medicine = await transactionalEntityManager.findOne(Medication, {
                                where: { id: medicineDto.id },
                            });
                            if (!medicine) {
                                throw new Error(`Medicine with ID ${medicineDto.id} not found`);
                            }
                            updatedMedicines.push(medicine);
                        }
                        existingMedicationRequest.medicines = updatedMedicines;
                    }

                    return await transactionalEntityManager.save(MedicationRequest, existingMedicationRequest);
                }
            );
        } catch (error) {
            throw ErrorManager.createSignatureError((error as Error).message);
        }
    }


    async findAllMedicationRequestByDoctorId(doctorId: string, page: number, limit: number): Promise<{data: MedicationRequest[]; total: number; lastPage: number}> {
        try {

            const doctor = await this.SpecialistService.findOne(doctorId)
            console.log('get one doctor: ', doctor)
            if (!doctor) {
                console.log('doctor was not found')
                throw ErrorManager.createSignatureError('Doctor not found');
            }

            const queryRunner = this.repository.manager.connection.createQueryRunner();
            await queryRunner.connect();
            await queryRunner.startTransaction();

            const skip = (page - 1) * limit;


            const total = await queryRunner.manager.count(MedicationRequest, {
                where: {
                practitioner:{
                    id: doctorId
                },
                deletedAt: null,
                },
            });

            const lastPage = Math.ceil(total / limit);

            const MedicationRequests = await this.repository.find({
                where: {
                    practitioner: { id: doctorId },
                },
                relations: ['practitioner', 'patient', 'medicines'],
                skip, 
                take: limit,
            });
            return {
                total, lastPage, data: MedicationRequests}
        } catch (error) {
            throw ErrorManager.createSignatureError((error as Error).message);
        }
    }

    async findAllMedicationRequestByPatientId(patientId: string, page: number, limit: number): Promise<{data: MedicationRequest[]; total: number; lastPage: number}> {
        try {

            const doctor = await this.SpecialistService.findOne(patientId)
            console.log('get one doctor: ', doctor)
            if (!doctor) {
                console.log('doctor was not found')
                throw ErrorManager.createSignatureError('Doctor not found');
            }

            const queryRunner = this.repository.manager.connection.createQueryRunner();
            await queryRunner.connect();
            await queryRunner.startTransaction();

            const skip = (page - 1) * limit;


            const total = await queryRunner.manager.count(MedicationRequest, {
                where: {
                patient:{
                    id: patientId
                },
                deletedAt: null,
                },
            });

            const lastPage = Math.ceil(total / limit);

            const MedicationRequests = await this.repository.find({
                where: {
                    patient: { id: patientId },
                },
                relations: ['practitioner', 'patient', 'medicines'],
                skip, 
                take: limit,
            });
            return {
                total, lastPage, data: MedicationRequests}
        } catch (error) {
            throw ErrorManager.createSignatureError((error as Error).message);
        }
    }

    async removeMedicineRequest (id: string) {
        try {
          const medicineRequestToRemove = await this.repository.findOne({
            where:{id, deletedAt: null}
          });
      
          if(!medicineRequestToRemove){
            throw new NotFoundException(`Medicine Request with id ${id} was not faound, try again `)
          }
      
          const deletedMedicationRequest= await this.repository.softRemove(medicineRequestToRemove)
      
          return {
            message: 'mMdicine Request remove successfully',
            deletedMedicationRequest,
          }
        } catch (error) {
          throw ErrorManager.createSignatureError((error as Error).message);
        }
      }

    async recoverMedicineRequest (id: string) {
        try {
          const medicineRequestToRecover = await this.repository.findOne({
            where:{id},
            withDeleted: true,
          });
      
          if(!medicineRequestToRecover || !medicineRequestToRecover.deletedAt){
            throw new NotFoundException(`Medicine Request with id ${id} was not faound, try again `)
          }
      
          const medicationRequestRecovered = await this.repository.recover(medicineRequestToRecover)
      
          return {
            message: 'Medicine Request recovered successfully',
            medicationRequestRecovered
          }
        } catch (error) {
          throw ErrorManager.createSignatureError((error as Error).message);
        }
      }

      //TODO find filtered paginated
    //   async findAllPaginated(
    //     filteredDto: FilteredMedicationRequestDto
    //     // page: number = 1, limit: number = 10
    //     ): Promise<{medicationRequests: MedicationRequest[], page: number, lastPage: number,  total: number}> {
    //     try {
    //         const {page, limit} = filteredDto 

    //         // Construir array de relaciones
    //         let relations: string[] = [];

    //         // Verificar si hay filtros para agregar relaciones
    //         if (filteredDto.practitionerId) {
    //         relations.push('practitioner');
    //         }
    //         if (filteredDto.patientId) {
    //         relations.push('patient');  // 'specialities' es la relación en la entidad Practitioner
    //         }
    //         if (filteredDto.medicines) {
    //         relations.push('medicines');
    //         }

    //         // Construir el objeto 'where' para los filtros
    //         const where: FindOptions<MedicationRequest> = {}; // Objeto para las condiciones WHERE

    //         for (const key in filteredDto) {
    //         if (Object.prototype.hasOwnProperty.call(filteredDto, key)) {
    //             const value = filteredDto[key];

    //             // Excluir relaciones y campos undefined/null
    //             if (key !== 'degree' && key !== 'speciality' && key !== 'socialWorkId' && value !== undefined && value !== null) {
    //             where[key] = value; // Filtro exacto por atributo
    //             }
    //         }
    //         }

    //         // Opciones de búsqueda y relaciones a incluir
    //         const findOptions: unknown = {
    //         where: where,
    //         relations: relations.length > 0 ? relations : undefined,
    //         skip: (page - 1) * limit,
    //         take: limit,
    //         };

    //         const [data, total] = await this.repository
    //         .createQueryBuilder('medicationRequest')
    //         .leftJoinAndSelect('medicationRequest.practitioner', 'practitioner')
    //         .leftJoinAndSelect('medicationRequest.patient', 'patient')
    //         .leftJoinAndSelect('medicationRequest.acceptedSocialWorks', 'acceptedSocialWorks')
    //         //.leftJoinAndSelect('medicationRequest.specialistAttentionHour', 'specialistAttentionHour')
    //         .leftJoinAndSelect('specialistAttentionHour.office', 'office')  // Si "office" también es una relación
    //         .addSelect([
    //           'medicationRequest.indications',
    //           'medicationRequest.diagnosis',
    //           'medicationRequest.isValidSignature',
    //           'medicationRequest.prolonged_treatment',
    //           'medicationRequest.hiv',
    //           'medicationRequest.generic_name',
    //           'medicationRequest.medicine_presentation',
    //           'medicationRequest.medicine_pharmaceutical_form',
    //           'medicationRequest.medicine_quantity',
    //         ])
    //         .where('medicationRequest.deletedAt IS NULL')
    //         .skip((page - 1) * limit)
    //         .take(limit)
    //         .getManyAndCount();
    //         console.log('medicationRequests: ', data)
    //         const lastPage = Math.ceil(total / limit);
    //       return { medicationRequests: data, page, lastPage, total };
    //     } catch (error) {
    //       throw ErrorManager.createSignatureError((error as Error).message);
    //     }
    //   }

    async findAllPaginated(
        filteredDto: FilteredMedicationRequestDto
    ): Promise<{ data: MedicationRequest[], lastPage: number, total: number, msg?:string }> {
        try {
            const { page, limit, ...filters } = filteredDto;
    
            const queryBuilder = this.repository
                .createQueryBuilder('medicationRequest')
                .leftJoinAndSelect('medicationRequest.practitioner', 'practitioner')
                .leftJoinAndSelect('medicationRequest.patient', 'patient')
                .leftJoinAndSelect('medicationRequest.medicines', 'medicines')
                .addSelect([
                    'medicationRequest.indications',
                    'medicationRequest.diagnosis',
                    'medicationRequest.isValidSignature',
                    'medicationRequest.prolonged_treatment',
                    'medicationRequest.hiv',
                    'medicationRequest.generic_name',
                    'medicationRequest.medicine_presentation',
                    'medicationRequest.medicine_pharmaceutical_form',
                    'medicationRequest.medicine_quantity',
                ])
                .where('medicationRequest.deletedAt IS NULL');
    
            // Manejar filtros de practitionerId
            if (filters.practitionerId) {
                queryBuilder.andWhere('practitioner.id = :practitionerId', { practitionerId: filters.practitionerId });
            }
    
            // Manejar filtros generales
            for (const key in filters) {
                if (Object.prototype.hasOwnProperty.call(filters, key) && filters[key] !== undefined && filters[key] !== null) {
                    if (key === 'patientId') {
                        queryBuilder.andWhere('patient.id = :patientId', { patientId: filters[key] });
                    } else if (key === 'medicines') {
                        queryBuilder.leftJoinAndSelect('medicationRequest.medicines', 'medicines').andWhere('medicines.id = :medicineId', { medicineId: filters[key]});
                    }
                    else {
                        queryBuilder.andWhere(`medicationRequest.${key} = :${key}`, { [key]: filters[key] });
                    }
                }
            }
    
            const [medicationRequests, total] = await queryBuilder
                .skip((page - 1) * limit)
                .take(limit)
                .getManyAndCount();
    
            const lastPage = Math.ceil(total / limit);
            let msg ="" 
            if(total == 0) msg="No se encontraron datos"
            return { data: medicationRequests, lastPage, total, msg };
        } catch (error) {
            throw ErrorManager.createSignatureError((error as Error).message);
        }
    }

}
