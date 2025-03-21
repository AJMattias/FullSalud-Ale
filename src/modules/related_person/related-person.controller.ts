import { Controller } from '@nestjs/common';
import { ControllerFactory } from '../../common/factories/controller.factory';
import {
  CreateRelatedPersonDto,
  SerializerRelatedPersonDto,
  UpdateRelatedPersonDto
} from '../../domain/dtos';
import { RelatedPerson } from '../../domain/entities/related-person.entity';
import { RelatedPersonService } from './related-person.service';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('RelatedPerson')
@Controller('related-person')
export class RelatedPersonController extends ControllerFactory<
  RelatedPerson,
  CreateRelatedPersonDto,
  UpdateRelatedPersonDto,
  SerializerRelatedPersonDto
>(
  RelatedPerson,
  CreateRelatedPersonDto,
  UpdateRelatedPersonDto,
  SerializerRelatedPersonDto
) {
  constructor(protected service: RelatedPersonService) {
    super();
  }
}
