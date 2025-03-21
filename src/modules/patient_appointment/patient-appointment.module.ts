import { Module } from '@nestjs/common';
import { PatientAppointment } from '../../domain/entities';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PatientAppointmentController } from './patient-appointment.controller';
import { PatientAppointmentService } from './patient-appointment.service';

@Module({
  imports: [TypeOrmModule.forFeature([PatientAppointment])],
  controllers: [PatientAppointmentController],
  providers: [PatientAppointmentService]
})
export class PatientAppointmentModule {}
