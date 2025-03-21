import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseUUIDPipe,
  Query
} from '@nestjs/common';
import { BaseService } from './base.service';
import { Base } from './base.entity';
import { DeepPartial } from 'typeorm';
import { PaginationDto } from '../dtos/pagination-common.dto';

@Controller()
export class BaseController<
  T extends Base,
  CreateDto extends DeepPartial<T>,
  UpdateDto extends DeepPartial<T>
> {
  constructor(
    private readonly baseService: BaseService<T, CreateDto, UpdateDto>
  ) {}

  @Post()
  create(@Body() createDto: CreateDto) {
    return this.baseService.create(createDto);
  }

  @Get()
  findAll(@Query() paginationDto: PaginationDto) {
    return this.baseService.findAll(paginationDto);
  }

  @Get('including-deleted')
  findAllIncludeDeletes(@Query() paginationDto: PaginationDto) {
    return this.baseService.findAllIncludeDeletes(paginationDto);
  }

  @Get(':id')
  findOne(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.baseService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() updateDto: UpdateDto
  ) {
    return this.baseService.update(id, updateDto);
  }

  @Delete('soft-delete/:id')
  softRemove(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.baseService.softRemove(id);
  }

  @Delete(':id')
  remove(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.baseService.remove(id);
  }

  @Patch('restore/:id')
  retore(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.baseService.restore(id);
  }
}
