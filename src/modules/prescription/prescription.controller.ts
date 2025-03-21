import { Controller } from '@nestjs/common';
import { PrescriptionService } from './prescription.service';
import { Prescription } from '../../domain/entities';
import { ControllerFactory } from '../../common/factories/controller.factory';
import {
  CreatePrescriptionDto,
  SerializerPrescriptionDto,
  UpdatePrescriptionDto
} from '../../domain/dtos';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Prescription')
@Controller('prescription')
export class PrescriptionController extends ControllerFactory<
  Prescription,
  CreatePrescriptionDto,
  UpdatePrescriptionDto,
  SerializerPrescriptionDto
>(
  Prescription,
  CreatePrescriptionDto,
  UpdatePrescriptionDto,
  SerializerPrescriptionDto
) {
  constructor(protected service: PrescriptionService) {
    super();
  }
}
