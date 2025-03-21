import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseService } from '../../common/bases/base.service';
import {
  CreateOrganizationTypeDto,
  UpdateOrganizationTypeDto
} from '../../domain/dtos';
import { OrganizationType } from '../../domain/entities';
import { Repository } from 'typeorm';

@Injectable()
export class OrganizationTypeService extends BaseService<
  OrganizationType,
  CreateOrganizationTypeDto,
  UpdateOrganizationTypeDto
> {
  constructor(
    @InjectRepository(OrganizationType)
    protected repository: Repository<OrganizationType>
  ) {
    super(repository);
  }
}
