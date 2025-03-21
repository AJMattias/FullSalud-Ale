import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ControllerFactory } from '../../common/factories/controller.factory';
import {
  CreateClinicalIndicationDto,
  SerializerClinicalIndicationDto,
  UpdateClinicalIndicationDto
} from '../../domain/dtos';
import { ClinicalIndication } from '../../domain/entities';
import { ClinicalIndicationService } from './clinical-indication.service';

@ApiTags('ClinicalIndication')
@Controller('clinical-indication')
export class ClinicalIndicationController extends ControllerFactory<
  ClinicalIndication,
  CreateClinicalIndicationDto,
  UpdateClinicalIndicationDto,
  SerializerClinicalIndicationDto
>(
  ClinicalIndication,
  CreateClinicalIndicationDto,
  UpdateClinicalIndicationDto,
  SerializerClinicalIndicationDto
) {
  constructor(protected service: ClinicalIndicationService) {
    super();
  }
}
