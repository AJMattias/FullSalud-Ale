import { Module } from '@nestjs/common';
import { MedicationService } from './medication.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Medication } from '../../domain/entities';
import { MedicationController } from './medication.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Medication])],
  controllers: [MedicationController],
  providers: [MedicationService]
})
export class MedicationModule {}
