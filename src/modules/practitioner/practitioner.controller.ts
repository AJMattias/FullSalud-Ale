import { Body, Controller, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { PractitionerService } from './practitioner.service';
import { Practitioner, Appointment } from '../../domain/entities';
import { ControllerFactory } from '../../common/factories/controller.factory';
import { CreatePractitionerDto, UpdatePractitionerDto } from '../../domain/dtos/practitioner/practitioner.dto';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { ApiPaginationResponse } from '../../common/swagger/api-pagination-response';
import { toDtoList } from '../../common/util/transform-dto.util';
import { PaginationMetadata } from '../../common/util/pagination-data.util';
import { plainToClass } from 'class-transformer';
import { SerializerPractitionerDto } from '../../domain/dtos/practitioner/practitioner-serializer.dto';
import { PractitionerFilteredPaginationDto } from '../../domain/dtos/practitioner/practitioner-filtered-pagination.dto';
import { SerializerShortPractitionerRoleDto } from '../../domain/dtos';
import { PractitionerFilteredDto } from '../../domain/dtos/practitioner/practitioner-filterd.dto';

@ApiTags('Practitioner')
@Controller('practitioner')
export class PractitionerController extends ControllerFactory<
  Practitioner,
  CreatePractitionerDto,
  UpdatePractitionerDto,
  SerializerPractitionerDto
>(
  Practitioner,
  CreatePractitionerDto,
  UpdatePractitionerDto,
  SerializerPractitionerDto
) {
  constructor(protected service: PractitionerService) {
    super();
  }

  @Post()
  @ApiOperation({ description: 'Crear un nuevo especialista' })
  async create(@Body() createSpecialistDto: CreatePractitionerDto) {
    return await this.service.createSpecialist(createSpecialistDto);
  }

  // @Get()
  // @ApiOperation({ description: 'Get all specialists' })
  // async getAll(): Promise<SerializerPractitionerDto[]> {
  //   const specialists = await this.service.getAll();
  //   return plainToClass(SerializerPractitionerDto, specialists);
  // }

  @Get(':id')
  @ApiOperation({ description: 'Get a practitioner by ID' })
  async getOne(@Param('id') id: string): Promise<SerializerPractitionerDto> {
    const practitioner = await this.service.getOne(id);
    return plainToClass(SerializerPractitionerDto, practitioner);
  }

  @Patch(':id')
  @ApiOperation({ description: 'Update a practitioner' })
  async update(
    @Param('id') id: string,
    @Body() updateSpecialistDto: UpdatePractitionerDto,
  ): Promise<SerializerPractitionerDto> {
    const practitioner = await this.service.update(id, updateSpecialistDto);
    return plainToClass(SerializerPractitionerDto, practitioner);
  }

  @Patch('soft-delete/:id')
  @ApiOperation({ description: 'Eliminar un practitioner (soft delete)' })
  async softDelete(@Param('id') id: string): Promise<{ message: string }> {
    return this.service.softDelete(id);
  }

  @Patch('recover/:id')
  @ApiOperation({ description: 'Recuperar un practitioner eliminado' })
  async recover(@Param('id') id: string): Promise<{ message: string }> {
    return this.service.recover(id);
  }

  @Get()
  @ApiOperation({
    description: 'Obtener practitioners paginados con filtros opcionales'
  })
  @ApiPaginationResponse(SerializerPractitionerDto)
  async findAllPaginated(
    @Query()
    paginationDto: PractitionerFilteredPaginationDto
  ): Promise<{data: SerializerPractitionerDto[]; total: number; lastPage: number; msg: string }> {
    const { data,  lastPage, total, msg} = await this.service.findAllPaginated(paginationDto);
    const serializedData = toDtoList(SerializerPractitionerDto, data);

    return { data: serializedData, total, lastPage, msg}
  }

  @Get('/with-turns')
  @ApiOperation({
    description: 'Get all practitioner with their turns'
  })
  async findAllWithTurns(): Promise<SerializerPractitionerDto[]> {
    const specialists = await this.service.findAllWithTurns();
    return toDtoList(SerializerPractitionerDto, specialists);
  }

}
