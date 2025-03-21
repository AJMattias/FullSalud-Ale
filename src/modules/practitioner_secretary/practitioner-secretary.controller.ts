import { Controller } from '@nestjs/common';
import { ControllerFactory } from '../../common/factories/controller.factory';
import {
  CreatePractitionerSecretaryDto,
  SerializerPractitionerSecretaryDto,
  UpdatePractitionerSecretaryDto
} from '../../domain/dtos';
import { PractitionerSecretary } from '../../domain/entities';
import { PractitionerSecretaryService } from './practitioner-secretary.service';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Practitioner Secretary')
@Controller('practitioner-secretary')
export class PractitionerSecretaryController extends ControllerFactory<
  PractitionerSecretary,
  CreatePractitionerSecretaryDto,
  UpdatePractitionerSecretaryDto,
  SerializerPractitionerSecretaryDto
>(
  PractitionerSecretary,
  CreatePractitionerSecretaryDto,
  UpdatePractitionerSecretaryDto,
  SerializerPractitionerSecretaryDto
) {
  constructor(protected service: PractitionerSecretaryService) {
    super();
  }
}
