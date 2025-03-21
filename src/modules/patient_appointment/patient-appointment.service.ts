import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseService } from '../../common/bases/base.service';
import {
  CreatePatientAppointmentDto,
  UpdatePatientAppointmentDto
} from '../../domain/dtos';
import { PatientAppointment } from '../../domain/entities';
import { Repository } from 'typeorm';

@Injectable()
export class PatientAppointmentService extends BaseService<
  PatientAppointment,
  CreatePatientAppointmentDto,
  UpdatePatientAppointmentDto
> {
  constructor(
    @InjectRepository(PatientAppointment)
    protected repository: Repository<PatientAppointment>
  ) {
    super(repository);
  }
}
