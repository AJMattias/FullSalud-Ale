import { Controller } from '@nestjs/common';
import { AppointmentSlotService } from './appointment-slot.service';
import { AppointmentSlot  } from '../../domain/entities';
import { ControllerFactory } from '../../common/factories/controller.factory';
import {
  CreateAppointmentSlotDto,
  SerializerAppointmentSlotDto,
  UpdateAppointmentSlotDto
} from '../../domain/dtos';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('AppointmentSlot')
@Controller('appointment-slot')
export class AppointmentSlotController extends ControllerFactory<
  AppointmentSlot ,
  CreateAppointmentSlotDto,
  UpdateAppointmentSlotDto,
  SerializerAppointmentSlotDto
>(
  AppointmentSlot ,
  CreateAppointmentSlotDto,
  UpdateAppointmentSlotDto,
  SerializerAppointmentSlotDto
) {
  constructor(protected service: AppointmentSlotService) {
    super();
  }
}
