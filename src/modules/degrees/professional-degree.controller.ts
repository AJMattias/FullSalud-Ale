import { Controller } from '@nestjs/common';
import { ControllerFactory } from '../../common/factories/controller.factory';
import {
  CreateProfessionalDegreeDto,
  SerializerProfessionalDegreeDto,
  UpdateProfessionalDegreeDto
} from '../../domain/dtos';
import { ProfessionalDegree } from '../../domain/entities';
import { ProfessionalDegreeService } from './professional-degree.service';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('ProfessionalDegree')
@Controller('professional-degree')
export class ProfessionalDegreeController extends ControllerFactory<
  ProfessionalDegree,
  CreateProfessionalDegreeDto,
  UpdateProfessionalDegreeDto,
  SerializerProfessionalDegreeDto
>(ProfessionalDegree, CreateProfessionalDegreeDto, UpdateProfessionalDegreeDto, SerializerProfessionalDegreeDto) {
  constructor(protected service: ProfessionalDegreeService) {
    super();
  }
}
