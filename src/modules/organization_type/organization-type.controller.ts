import { Controller } from '@nestjs/common';
import { ControllerFactory } from '../../common/factories/controller.factory';
import {
  CreateOrganizationTypeDto,
  UpdateOrganizationTypeDto,
  SerializerInstitutionTypeDto
} from '../../domain/dtos';
import { OrganizationType } from '../../domain/entities';
import { OrganizationTypeService } from './organization-type.service';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Organization Type')
@Controller('organization-type')
export class OrganizationTypeController extends ControllerFactory<
  OrganizationType,
  CreateOrganizationTypeDto,
  UpdateOrganizationTypeDto,
  SerializerInstitutionTypeDto
>(
  OrganizationType,
  CreateOrganizationTypeDto,
  UpdateOrganizationTypeDto,
  SerializerInstitutionTypeDto
) {
  constructor(protected service: OrganizationTypeService) {
    super();
  }
}
