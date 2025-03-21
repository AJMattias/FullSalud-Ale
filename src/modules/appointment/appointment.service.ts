import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseService } from '../../common/bases/base.service';
import { ErrorManager } from '../../common/exceptions/error.manager';
import { CreateAppointmentDto, SerializerAppointmentDto, TimeDTO, UpdateAppointmentDto } from '../../domain/dtos';
import { PatientAppointment, Patient, Practitioner, Appointment } from '../../domain/entities';
import { AppointmentStatus, Role } from '../../domain/enums';
import 'multer';
import { In, Not, Repository } from 'typeorm';
import { plainToClass } from 'class-transformer';

@Injectable()
export class AppointmentService extends BaseService<
  Appointment,
  CreateAppointmentDto,
  UpdateAppointmentDto
> {
  constructor(
    @InjectRepository(Appointment) protected repository: Repository<Appointment>,
  ) {
    super(repository);
  }

  async createTurn(createTurnDto: CreateAppointmentDto): Promise<Appointment | { status: number; message: string }> {
    const queryRunner = this.repository.manager.connection.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      let patient: Patient;
      // Verificar si llega `patientId` o el objeto `patient`
      if (createTurnDto.patientId) {
        patient = await queryRunner.manager.findOne(Patient, {
          where: { id: createTurnDto.patientId },
        });

        if (!patient) {
          throw new NotFoundException(
            `Patient with ID ${createTurnDto.patientId} not found`
          );
        }
      } else if (createTurnDto.patient) {
        const existingPatient = await queryRunner.manager.findOne(Patient, {
          where: { dni: createTurnDto.patient.dni },
        });

        if (existingPatient) {
          patient = existingPatient;
        } else {
          patient = queryRunner.manager.create(Patient, {
            dni: createTurnDto.patient.dni,
            name: createTurnDto.patient.name,
            lastName: createTurnDto.patient.lastName,
            email: createTurnDto.patient.email,
            phone: createTurnDto.patient.phone,
            documentType: createTurnDto.patient.documentType,
            role: Role.PATIENT,
          });
          patient = await queryRunner.manager.save(patient);
        }
      } else {
        throw new BadRequestException(
          'Either patientId or patient object must be provided'
        );
      }

      const specialistIds = createTurnDto.practitionerIds.map((s) => s.id);

      // Asegurarnos de que los IDs no estén vacíos
      if (!specialistIds || specialistIds.length === 0) {
        throw new BadRequestException('At least one specialist ID must be provided');
      }

      const specialists = await queryRunner.manager.find(Practitioner, {
        where: { id: In(specialistIds) },
      });

      // Comprobamos si el número de especialistas encontrados coincide con los solicitados
      if (specialists.length !== specialistIds.length) {
        const notFoundIds = specialistIds.filter(id => !specialists.some(s => s.id === id));
        throw new NotFoundException(`Practitioner with IDs ${notFoundIds.join(', ')} not found`);
      }

      const newTurn = queryRunner.manager.create(Appointment, {
        date: createTurnDto.date,
        hour: createTurnDto.hour,
        observation: createTurnDto.observation,
        status: createTurnDto.status ?? AppointmentStatus.PENDING,
        patient,
        practitioners: specialists,
      });
      //----------  Validacion de superposicion de Turnos ------------------------ 
      const existingTurns = createTurnDto.date
        ? await this.repository
          .createQueryBuilder('appointment')
          .leftJoin('appointment.practitioners', 'practitioner') // Unir con la tabla practitioners
          .select(['appointment.hour', 'MAX(practitioner.consultationTime) AS consultationTime']) // Seleccionar hour y el máximo consultationTime
          .where('appointment.date = :date AND appointment.deletedAt IS NULL', { date: createTurnDto.date }) // Filtrar por fecha y no eliminados
          .groupBy('appointment.hour') // Agrupar por hour para obtener el máximo por cada hora
          .getRawMany() // Obtener los resultados en formato raw
        : null;
      const savedTurn = await queryRunner.manager.save(newTurn);
      const consultationTime = await this.maxConsultationTime(savedTurn.id);
      if (createTurnDto.date && createTurnDto.hour) {
        const validateTurn = await this.validateTurn(createTurnDto.hour, existingTurns, consultationTime);
        if (!validateTurn) {
          await queryRunner.release();
          await this.repository.delete(savedTurn.id);
          return {
            status: 400,
            message: "El turno se superpone con otro turno existente.",
          };
        }
      }
      //-----------------------------------------------------------------------------------

      // After saving, populate the practitionerIds
      savedTurn.practitionerId = specialists.map(specialist => specialist.id);

      if (createTurnDto.patientAppointment && createTurnDto.patientAppointment.length > 0) {
        const attentionHours = createTurnDto.patientAppointment.map((hourData) => {
          return queryRunner.manager.create(PatientAppointment, {
            openingHour: hourData.openingHour,
            closeHour: hourData.closeHour,
            day: hourData.day,
            turn: savedTurn,
          });
        });

        await queryRunner.manager.save(PatientAppointment, attentionHours);
        savedTurn.patientAppointment = attentionHours;
      }

      await queryRunner.commitTransaction();

      return savedTurn;
    } catch (error) {
      await queryRunner.rollbackTransaction();

      if (error instanceof NotFoundException || error instanceof BadRequestException) {
        throw error;
      }

      throw ErrorManager.createSignatureError((error as Error).message);
    } finally {
      await queryRunner.release();
    }
  }

  async getOne(id: string): Promise<Appointment> {
    try {
      const turn = await this.repository.findOne({
        where: { id, deletedAt: null },
        relations: ['patient', 'practitioners'],
      });

      if (!turn) {
        throw new NotFoundException(`Turn with ID ${id} not found`);
      }

      return turn;
    } catch (error) {
      throw ErrorManager.createSignatureError((error as Error).message);
    }
  }

  async getAll(page: number = 1, limit: number = 10): Promise<{
    turns: Appointment[];
    total: number;
    page: number;
    limit: number;
    previousPage: number | null;
  }> {
    try {
      const [data, total] = await this.repository.findAndCount({
        where: { deletedAt: null },
        relations: ['patient', 'practitioners'],
        skip: (page - 1) * limit,
        take: limit,
      });

      return {
        turns: data,
        total,
        page,
        limit,
        previousPage: page > 1 ? page - 1 : null,
      };
    } catch (error) {
      throw ErrorManager.createSignatureError((error as Error).message);
    }
  }

  // Turnos de un especialista por ID
  async getTurnsBySpecialist(specialistId: string, page: number = 1, limit: number = 10): Promise<{
    turns: Appointment[];
    total: number;
    page: number;
    limit: number;
    previousPage: number | null;
  }> {
    try {
      const [data, total] = await this.repository.findAndCount({
        where: {
          practitioners: { id: specialistId },
          status: In([AppointmentStatus.PENDING, AppointmentStatus.APPROVED, AppointmentStatus.NO_SHOW]),
          deletedAt: null,
        },
        relations: ['patient', 'practitioners'],
        skip: (page - 1) * limit,
        take: limit,
      });

      if (!data.length) {
        throw new NotFoundException(`No turns found for specialist with ID ${specialistId}`);
      }

      return {
        turns: data,
        total,
        page,
        limit,
        previousPage: page > 1 ? page - 1 : null,
      };
    } catch (error) {
      throw ErrorManager.createSignatureError((error as Error).message);
    }
  }

  async getTurnsBySpecialistAll(
    specialistId: string,
    page: number = 1,
    limit: number = 10,
  ): Promise<{
    turns: Appointment[];
    total: number;
    page: number;
    limit: number;
    previousPage: number | null;
  }> {
    try {
      const [data, total] = await this.repository.findAndCount({
        where: {
          practitioners: { id: specialistId },
          status: Not(AppointmentStatus.NO_SHOW),
          deletedAt: null,
        },
        relations: ['patient', 'practitioners'],
        skip: (page - 1) * limit,
        take: limit,
      });

      if (!data.length) {
        throw new NotFoundException(
          `No turns found for specialist with ID ${specialistId}`,
        );
      }

      return {
        turns: data,
        total,
        page,
        limit,
        previousPage: page > 1 ? page - 1 : null,
      };
    } catch (error) {
      throw ErrorManager.createSignatureError((error as Error).message);
    }
  }

  // Turnos de un paciente por ID
  async getTurnsByPatient(patientId: string, page: number = 1, limit: number = 10): Promise<{
    turns: Appointment[];
    total: number;
    page: number;
    limit: number;
    previousPage: number | null;
  }> {
    try {
      const [data, total] = await this.repository.findAndCount({
        where: {
          patient: { id: patientId },
          status: In([AppointmentStatus.PENDING, AppointmentStatus.APPROVED, AppointmentStatus.NO_SHOW]),
          deletedAt: null,
        },
        relations: ['patient', 'practitioners'],
        skip: (page - 1) * limit,
        take: limit,
      });

      if (!data.length) {
        throw new NotFoundException(`No turns found for patient with ID ${patientId}`);
      }

      return {
        total,
        page,
        limit,
        previousPage: page > 1 ? page - 1 : null,
        turns: data,
      };
    } catch (error) {
      throw ErrorManager.createSignatureError((error as Error).message);
    }
  }

  async getTurnsByPatientAll(
    patientId: string,
    page: number = 1,
    limit: number = 10,
  ): Promise<{
    turns: Appointment[];
    total: number;
    page: number;
    limit: number;
    previousPage: number | null;
  }> {
    try {
      const [data, total] = await this.repository.findAndCount({
        where: {
          patient: { id: patientId },
          status: Not(AppointmentStatus.NO_SHOW),
          deletedAt: null,
        },
        relations: ['patient', 'practitioners'],
        skip: (page - 1) * limit,
        take: limit,
      });

      if (!data.length) {
        throw new NotFoundException(
          `No turns found for patient with ID ${patientId}`,
        );
      }

      return {
        turns: data,
        total,
        page,
        limit,
        previousPage: page > 1 ? page - 1 : null,
      };
    } catch (error) {
      throw ErrorManager.createSignatureError((error as Error).message);
    }
  }

  //Obtener turnos completados por el ID del paciente (historial).
  async getCompletedTurnsByPatient(patientId: string, page: number = 1, limit: number = 10): Promise<{
    turns: Appointment[];
    total: number;
    page: number;
    limit: number;
    previousPage: number | null;
  }> {
    try {
      const [data, total] = await this.repository.findAndCount({
        where: {
          patient: { id: patientId },
          status: AppointmentStatus.COMPLETED,
          deletedAt: null,
        },
        relations: ['patient', 'practitioners'],
        skip: (page - 1) * limit,
        take: limit,
      });

      if (!data.length) {
        throw new NotFoundException(`No completed turns found for patient ID ${patientId}`);
      }

      return {
        total,
        page,
        limit,
        previousPage: page > 1 ? page - 1 : null,
        turns: data,
      };
    } catch (error) {
      throw ErrorManager.createSignatureError((error as Error).message);
    }
  }

  //Soft delete para eliminar un turno.
  async removeTurn(id: string): Promise<{ message: string; deletedTurn: Appointment }> {
    try {
      const turn = await this.repository.findOne({ where: { id, deletedAt: null } });

      if (!turn) {
        throw new NotFoundException(`Turn with ID ${id} not found`);
      }

      const deletedTurn = await this.repository.softRemove(turn);

      return {
        message: 'Turn deleted successfully',
        deletedTurn,
      };
    } catch (error) {
      throw ErrorManager.createSignatureError((error as Error).message);
    }
  }

  //Recover para restaurar un turno eliminado.
  async recoverTurn(id: string): Promise<Appointment> {
    try {
      const turn = await this.repository.findOne({ withDeleted: true, where: { id } });

      if (!turn) {
        throw new NotFoundException(`Turn with ID ${id} not found`);
      }

      await this.repository.recover(turn);
      return turn;
    } catch (error) {
      throw ErrorManager.createSignatureError((error as Error).message);
    }
  }

  //Actualizar un turno.
  async updateTurn(id: string, updateTurnDto: UpdateAppointmentDto): Promise<Appointment> {
    try {
      const turn = await this.repository.findOne({ where: { id, deletedAt: null } });

      if (!turn) {
        throw new NotFoundException(`Turn with ID ${id} not found`);
      }

      Object.assign(turn, updateTurnDto);
      return await this.repository.save(turn);
    } catch (error) {
      throw ErrorManager.createSignatureError((error as Error).message);
    }
  }

  // Verificar superposición de turnos
  async checkOverlapAndUpdateTurn(
    id: string,
    updateTurnDto: UpdateAppointmentDto,
  ): Promise<SerializerAppointmentDto> {
    try {

      const { date, hour } = updateTurnDto;

      // Validar que la fecha y hora estén presentes
      if (!date || !hour) {
        throw new BadRequestException('Date and hour are required');
      }

      // Validar el formato de la fecha (YYYY-MM-DD)
      const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
      if (!dateRegex.test(date)) {
        throw new BadRequestException('Invalid date format. Use YYYY-MM-DD');
      }

      // Validar el formato de la hora (HH:MM)
      const hourRegex = /^\d{2}:\d{2}$/;
      if (!hourRegex.test(hour)) {
        throw new BadRequestException('Invalid hour format. Use HH:MM');
      }

      // Obtener el turno existente
      const existingTurn = await this.repository.findOne({
        where: { id, deletedAt: null },
        relations: ['practitioners'],
      });

      if (!existingTurn) {
        throw new NotFoundException(`Turn with ID ${id} not found`);
      }

      // Verificar si hay superposición con otros turnos
      const overlappingTurn = await this.repository
        .createQueryBuilder('appointment')
        .where('appointment.date = :date', { date })
        .andWhere('appointment.hour = :hour', { hour })
        .andWhere('appointment.id != :id', { id }) // Excluir el turno actual
        .andWhere('appointment.deletedAt IS NULL')
        .getOne();

      if (overlappingTurn) {
        throw new BadRequestException(
          'The provided date and hour overlap with an existing turn',
        );
      }

      // Actualizar el turno si no hay superposición
      Object.assign(existingTurn, updateTurnDto);
      const updatedTurn = await this.repository.save(existingTurn);

      return plainToClass(SerializerAppointmentDto, updatedTurn, {
        excludeExtraneousValues: true,
      });
    } catch (error) {
      throw ErrorManager.createSignatureError((error as Error).message);
    }
  }

  async validateTurn(hour: string, existingTurns: TimeDTO[], consultationTime: string): Promise<boolean> {
    try {
      // Si no hay turnos existentes, se puede crear el nuevo turno
      if (existingTurns.length === 0 || null) {
        return true;
      }
      // Convertir la hora del nuevo turno a minutos desde la medianoche
      const newTurnTime = this.convertTimeToSeconds((hour));
      const newTurnTimeConsultation = this.convertTimeToSeconds(consultationTime);
      const newTurnEnd = newTurnTime + newTurnTimeConsultation;
      // Validar cada turno existente
      for (const turn of existingTurns) {
        const existingTurnTime = this.convertTimeToSeconds(turn.appointment_hour);
        const longestConsultationTime = this.convertTimeToSeconds((turn.consultationtime) ? turn.consultationtime : '00:30:00');
        const existingTurnEnd = existingTurnTime + longestConsultationTime;
        // Verificar si hay superposición
        if (
          (newTurnTime >= existingTurnTime && newTurnTime < existingTurnEnd) || // El nuevo turno comienza dentro del turno existente
          (newTurnEnd > existingTurnTime && newTurnEnd <= existingTurnEnd) || // El nuevo turno termina dentro del turno existente
          (newTurnTime <= existingTurnTime && newTurnEnd >= existingTurnEnd) // El nuevo turno cubre completamente el turno existente
        ) {
          return false;
        }
      }
      return true;
    } catch (error) {
      throw ErrorManager.createSignatureError((error as Error).message);
    }
  }



  private convertTimeToSeconds(time: string): number {
    if (time.split(':').length === 2) {
      time += ':00';
    }
    const [hours, minutes, seconds] = time.split(':').map(Number);
    return hours * 3600 + minutes * 60 + seconds;
  }
  async maxConsultationTime(id: string) {
    const data = await this.repository
      .createQueryBuilder('appointment')
      .leftJoin('appointment.practitioners', 'practitioner')
      .select('MAX(practitioner.consultationTime)', 'maxConsultationTime')
      .where('appointment.id = :id', { id: id })
      .getRawOne();

    return data.maxConsultationTime ? String(data.maxConsultationTime) : "00:30:00";
  }
}
