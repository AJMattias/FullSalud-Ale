import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ControllerFactory } from '../../common/factories/controller.factory';
import {
  CreateMedicationDto,
  SerializerMedicationDto,
  UpdateMedicationDto
} from '../../domain/dtos';
import { Medication } from '../../domain/entities';
import { MedicationService } from './medication.service';

@ApiTags('Medication')
@Controller('medication')
export class MedicationController extends ControllerFactory<
  Medication,
  CreateMedicationDto,
  UpdateMedicationDto,
  SerializerMedicationDto
>(Medication, CreateMedicationDto, UpdateMedicationDto, SerializerMedicationDto) {
  constructor(protected service: MedicationService) {
    super();
  }
}
