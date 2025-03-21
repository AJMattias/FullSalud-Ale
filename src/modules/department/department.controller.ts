import { Controller, Get, Param, Query } from '@nestjs/common';
import {
  ApiExtraModels,
  ApiOperation,
  ApiParam,
  ApiTags
} from '@nestjs/swagger';
import { ControllerFactory } from '../../common/factories/controller.factory';
import {
  CreateDepartmentDto,
  SerializerDepartmentDto,
  SerializerShortDepartmentDto,
  UpdateDepartmentDto
} from '../../domain/dtos';
import { Department } from '../../domain/entities';
import { DepartmentService } from './department.service';
import { PaginationDto } from '../../common/dtos/pagination-common.dto';
import { toDtoList } from '../../common/util/transform-dto.util';
import { ApiPaginationResponse } from '../../common/swagger/api-pagination-response';

@ApiTags('Department')
@ApiExtraModels(SerializerShortDepartmentDto) // Registrar el DTO en Swagger
@Controller('department')
export class DepartmentController extends ControllerFactory<
  Department,
  CreateDepartmentDto,
  UpdateDepartmentDto,
  SerializerDepartmentDto
>(
  Department,
  CreateDepartmentDto,
  UpdateDepartmentDto,
  SerializerDepartmentDto
) {
  constructor(protected service: DepartmentService) {
    super();
  }

  @Get('by-province/:provinceId')
  @ApiParam({
    name: 'provinceId',
    type: 'string',
    description: 'ID de la provincia'
  })
  @ApiOperation({
    description: 'Obtener departamentos por ID de provincia con paginación'
  })
  @ApiPaginationResponse(SerializerShortDepartmentDto) // Aplicar el decorador ApiPaginationResponse
  async findByProvince(
    @Param('provinceId') provinceId: string,
    @Query() paginationDto: PaginationDto
  ) {
    const { data, meta } = await this.service.findByProvince(
      provinceId,
      paginationDto
    );
    return { data: toDtoList(SerializerShortDepartmentDto, data), meta };
  }
}
