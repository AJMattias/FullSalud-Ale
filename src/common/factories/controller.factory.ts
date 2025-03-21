import {
  Body,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
  Type
} from '@nestjs/common';
import { PaginationDto } from '../dtos/pagination-common.dto';
import { AbstractValidationPipe } from '../pipes/abstract-validation.pipe';
import { BaseService } from '../bases/base.service';
import { Base } from '../bases/base.entity';
import { DeepPartial } from 'typeorm';
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiCreatedResponse,
  ApiExtraModels,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation
} from '@nestjs/swagger';
import { ShortBaseDto } from '../dtos/base-short.dto';
import { ApiPaginationResponse } from '../swagger/api-pagination-response';
import { toDto, toDtoList } from '../util/transform-dto.util';
import { PaginationMetadata } from '../util/pagination-data.util';

export interface ICrudController<
  T extends Base,
  C extends DeepPartial<T>,
  U extends DeepPartial<T>,
  S extends DeepPartial<T>
> {
  create(createDto: C): Promise<S>;
  findAll(
    paginationDto: PaginationDto
  ): Promise<{ data: S[]; meta: PaginationMetadata }>;
  findAllIncludeDeletes(
    paginationDto: PaginationDto
  ): Promise<{ data: S[]; meta: PaginationMetadata }>;
  findOne(id: string): Promise<S>;
  update(id: string, updateDto: U): Promise<S>;
  softRemove(id: string): Promise<string>;
  remove(id: string): Promise<string>;
  restore(id: string): Promise<S>;
}

export function ControllerFactory<
  T extends Base,
  C extends DeepPartial<T>,
  U extends DeepPartial<T>,
  S extends DeepPartial<T>
>(
  entity: Type<T>,
  createDto: Type<C>,
  updateDto: Type<U>,
  serializerDto: Type<S>
): Type<ICrudController<T, C, U, S>> {
  const createPipe = new AbstractValidationPipe(
    { whitelist: true, transform: true },
    { body: createDto }
  );
  const updatePipe = new AbstractValidationPipe(
    { whitelist: true, transform: true },
    { body: updateDto }
  );
  const paginationPipe = new AbstractValidationPipe(
    { whitelist: true, transform: true },
    { query: PaginationDto }
  );

  @ApiBadRequestResponse({ description: 'Error: Bad Request' })
  @ApiExtraModels(PaginationDto, ShortBaseDto)
  class CrudController<
    T extends Base,
    C extends DeepPartial<T>,
    U extends DeepPartial<T>,
    S extends DeepPartial<T>
  > implements ICrudController<T, C, U, S>
  {
    protected service: BaseService<T, C, U>;

    @Post()
    @ApiOperation({ description: 'Crear un registro' })
    @ApiBody({ type: createDto })
    @ApiCreatedResponse({
      description: 'The record has been successfully created',
      type: serializerDto
    })
    async create(@Body(createPipe) createDto: C) {
      const data = await this.service.create(createDto);

      return toDto(serializerDto, data) as unknown as S;
    }

    @Get()
    @ApiOperation({ description: 'Obtener registros páginados' })
    @ApiPaginationResponse(serializerDto)
    async findAll(@Query(paginationPipe) paginationDto: PaginationDto) {
      const { data, meta } = await this.service.findAll(paginationDto);
      const serializedData = toDtoList(serializerDto, data) as unknown as S[];

      return { data: serializedData, meta };
    }

    @Get('including-deleted')
    @ApiOperation({
      description:
        'Obtener registros páginados incluyendo registros eliminados de manera lógica'
    })
    @ApiPaginationResponse(serializerDto)
    async findAllIncludeDeletes(
      @Query(paginationPipe) paginationDto: PaginationDto
    ) {
      const { data, meta } =
        await this.service.findAllIncludeDeletes(paginationDto);
      const serializedData = toDtoList(serializerDto, data) as unknown as S[];

      return { data: serializedData, meta };
    }

    @Get(':id')
    @ApiOperation({ description: 'Obtener un registro mediante su id (UUID)' })
    @ApiNotFoundResponse({
      description: 'Record not found'
    })
    @ApiOkResponse({
      description: 'Record found',
      type: serializerDto
    })
    async findOne(@Param('id', new ParseUUIDPipe()) id: string) {
      const data = await this.service.findOne(id);

      return toDto(serializerDto, data) as unknown as S;
    }

    @Patch(':id')
    @ApiBody({ type: updateDto })
    @ApiOperation({ description: 'Actualizar un registro' })
    @ApiNotFoundResponse({
      description: 'Record not found'
    })
    @ApiOkResponse({
      description: 'Record updated successfully',
      type: serializerDto
    })
    async update(
      @Param('id', new ParseUUIDPipe()) id: string,
      @Body(updatePipe) updateDto: U
    ) {
      const data = await this.service.update(id, updateDto);

      return toDto(serializerDto, data) as unknown as S;
    }

    @Delete('soft-delete/:id')
    @ApiOperation({ description: 'Eliminar un registro lógicamente' })
    @ApiNotFoundResponse({
      description: 'Record not found'
    })
    @ApiOkResponse({
      description: 'Record soft deleted successfully'
    })
    softRemove(@Param('id', new ParseUUIDPipe()) id: string) {
      return this.service.softRemove(id);
    }

    @Delete(':id')
    @ApiOperation({ description: 'Eliminar un registro definitivamente' })
    @ApiNotFoundResponse({
      description: 'Record not found'
    })
    @ApiOkResponse({
      description: 'Record deleted successfully'
    })
    remove(@Param('id', new ParseUUIDPipe()) id: string) {
      return this.service.remove(id);
    }

    @Patch('restore/:id')
    @ApiOperation({
      description: 'Recuperar un registro lógicamente eliminado'
    })
    @ApiNotFoundResponse({
      description: 'Record not found or not deleted'
    })
    @ApiOkResponse({
      description: 'Record restored successfully',
      type: serializerDto
    })
    async restore(@Param('id', new ParseUUIDPipe()) id: string) {
      const data = await this.service.restore(id);

      return toDto(serializerDto, data) as unknown as S;
    }
  }

  return CrudController;
}
