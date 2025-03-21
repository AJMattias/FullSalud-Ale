import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { LocationService } from './location.service';
import { ControllerFactory } from '../../common/factories/controller.factory';
import { Location } from '../../domain/entities';
import { CreateLocationDto, SerializerLocationDto, UpdateOfficeDto } from '../../domain/dtos';
import { ApiTags } from '@nestjs/swagger';
import { toDto } from '../../common/util/transform-dto.util';

@ApiTags('Location')
@Controller('location')
export class LocationController extends ControllerFactory<
  Location,
  CreateLocationDto,
  UpdateOfficeDto,
  SerializerLocationDto
>(Location, CreateLocationDto, UpdateOfficeDto, SerializerLocationDto) {
  constructor(protected readonly officesService: LocationService) {
    super();
  }

  @Post()
  async createOffice(@Body() createOfficeDto: CreateLocationDto) {
    return await this.officesService.createOffice(createOfficeDto);
  }

  @Get()
  async getAll(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10
  ): Promise<{ total: number; page: number; limit: number; offices: SerializerLocationDto[] }> {
    const { offices, total } = await this.officesService.getAll(page, limit);
    return { offices: offices.map((office) => toDto(SerializerLocationDto, office)), total, page, limit };
  }

  @Get(':id')
  async getOneOffice(@Param('id') id: string) {
    return await this.officesService.getOne(id);
  }

  @Patch(':id')
  async updateOffice(@Param('id') id: string, @Body() updateOfficeDto: UpdateOfficeDto) {
    return await this.officesService.update(id, updateOfficeDto);
  }

  @Delete(':id')
  async softDelete(@Param('id') id: string) {
    return await this.officesService.softDelete(id);
  }

  @Post('/recover/:id')
  async recover(@Param('id') id: string) {
    return await this.officesService.recover(id);
  }
}
