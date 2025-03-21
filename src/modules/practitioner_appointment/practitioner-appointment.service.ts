import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseService } from '../../common/bases/base.service';
import {
  CreatePractitionerAppointmentDto,
  UpdatePractitionerAppointmentDto
} from '../../domain/dtos';
import { PractitionerAppointment } from '../../domain/entities';
import { Repository } from 'typeorm';

@Injectable()
export class PractitionerAppointmentService extends BaseService<
  PractitionerAppointment,
  CreatePractitionerAppointmentDto,
  UpdatePractitionerAppointmentDto
> {
  constructor(
    @InjectRepository(PractitionerAppointment)
    protected repository: Repository<PractitionerAppointment>
  ) {
    super(repository);
  }
}
