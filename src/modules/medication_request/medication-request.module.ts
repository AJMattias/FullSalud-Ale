import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MedicationRequest } from '../../domain/entities/medication-request.entity';
import { MedicationRequestsController } from './medication-request.controller';
import { AuthModule } from '../auth/auth.module';
import { PractitionerModule } from '../practitioner/practitioner.module';
import { PatientModule } from '../patient/patient.module';
import { MedicationRequestsService } from './medication-request.service';

@Module({
  imports: [TypeOrmModule.forFeature([MedicationRequest]),AuthModule,PractitionerModule,PatientModule],
  controllers: [MedicationRequestsController],
  providers: [MedicationRequestsService]
})
export class MedicationRequestsModule {}
