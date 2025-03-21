import { Controller, Get, Query } from '@nestjs/common';
import { OrganizationService } from './organization.service';
import { Organization } from '../../domain/entities';
import { ControllerFactory } from '../../common/factories/controller.factory';
import {
  CreateOrganizationDto,
  SerializerOrganizationDto,
  UpdateOrganizationDto
} from '../../domain/dtos';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { ApiPaginationResponse } from '../../common/swagger/api-pagination-response';
import { OrganizationPaginationDto } from '../../domain/dtos/organization/organization-filtered-pagination.dto';
import { toDtoList } from '../../common/util/transform-dto.util';
import { PaginationMetadata } from '../../common/util/pagination-data.util';

@ApiTags('Organization')
@Controller('organization')
export class OrganizationController extends ControllerFactory<
  Organization,
  CreateOrganizationDto,
  UpdateOrganizationDto,
  SerializerOrganizationDto
>(
  Organization,
  CreateOrganizationDto,
  UpdateOrganizationDto,
  SerializerOrganizationDto
) {
  constructor(protected service: OrganizationService) {
    super();
  }

  @Get()
  @ApiOperation({
    description: 'Obtener institutions con filtros opcionales con paginación'
  })
  @ApiPaginationResponse(SerializerOrganizationDto)
  override async findAll(
    @Query() paginationDto: OrganizationPaginationDto
  ): Promise<{ data: SerializerOrganizationDto[]; meta: PaginationMetadata }> {
    const { data, meta } = await this.service.findAll(paginationDto);
    const serializedData = toDtoList(SerializerOrganizationDto, data);

    return { data: serializedData, meta };
  }
}
