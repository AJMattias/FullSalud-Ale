import { Controller } from '@nestjs/common';
import { PractitionerAppointmentService } from './practitioner-appointment.service';
import { ControllerFactory } from '../../common/factories/controller.factory';
import {
  CreatePractitionerAppointmentDto,
  UpdatePractitionerAppointmentDto,
  SerializerPractitionerAppointmentDto
} from '../../domain/dtos';
import { ApiTags } from '@nestjs/swagger';
import { PractitionerAppointment } from '../../domain/entities';

@ApiTags('Practitioner Appointment')
@Controller('practitioner-appointment')
export class PractitionerAppointmentController extends ControllerFactory<
  PractitionerAppointment,
  CreatePractitionerAppointmentDto,
  UpdatePractitionerAppointmentDto,
  SerializerPractitionerAppointmentDto
>(
  PractitionerAppointment,
  CreatePractitionerAppointmentDto,
  UpdatePractitionerAppointmentDto,
  SerializerPractitionerAppointmentDto
) {
  constructor(protected service: PractitionerAppointmentService) {
    super();
  }
}
