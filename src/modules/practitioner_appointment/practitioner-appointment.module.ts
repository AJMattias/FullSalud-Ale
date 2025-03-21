import { Module } from '@nestjs/common';
import { PractitionerAppointmentService } from './practitioner-appointment.service';
import { PractitionerAppointmentController } from './practitioner-appointment.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PractitionerAppointment } from '../../domain/entities';

@Module({
  imports: [TypeOrmModule.forFeature([PractitionerAppointment])],
  controllers: [PractitionerAppointmentController],
  providers: [PractitionerAppointmentService]
})
export class PractitionerAppointmentModule {}
