import { Controller } from '@nestjs/common';
import { PatientAppointmentService } from './patient-appointment.service';
import { PatientAppointment } from '../../domain/entities';
import { ControllerFactory } from '../../common/factories/controller.factory';
import {
  CreatePatientAppointmentDto,
  SerializerPatientAppointmentDto,
  UpdatePatientAppointmentDto,
} from '../../domain/dtos';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('PatientAppointment')
@Controller('patient-appointment')
export class PatientAppointmentController extends ControllerFactory<
  PatientAppointment,
  CreatePatientAppointmentDto,
  UpdatePatientAppointmentDto,
  SerializerPatientAppointmentDto
>(
  PatientAppointment,
  CreatePatientAppointmentDto,
  UpdatePatientAppointmentDto,
  SerializerPatientAppointmentDto
) {
  constructor(protected service: PatientAppointmentService) {
    super();
  }
}
