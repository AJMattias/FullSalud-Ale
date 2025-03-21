import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseService } from '../../common/bases/base.service';
import {
  CreateAppointmentSlotDto,
  UpdateAppointmentSlotDto
} from '../../domain/dtos';
import { AppointmentSlot  } from '../../domain/entities';
import { Repository } from 'typeorm';

@Injectable()
export class AppointmentSlotService extends BaseService<
  AppointmentSlot ,
  CreateAppointmentSlotDto,
  UpdateAppointmentSlotDto
> {
  constructor(
    @InjectRepository(AppointmentSlot )
    protected repository: Repository<AppointmentSlot >
  ) {
    super(repository);
  }
}
