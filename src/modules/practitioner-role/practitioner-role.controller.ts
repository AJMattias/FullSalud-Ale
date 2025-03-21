import { Body, Controller, Delete, Get, HttpCode, Param, Patch, Post } from '@nestjs/common';
import { PractitionerRoleService } from './practitioner-role.service';
import { PractitionerRole } from '../../domain/entities';
import { ControllerFactory } from '../../common/factories/controller.factory';
import {
  CreatePractitionerRoleDto,
  SerializerPractitionerRoleDto,
  UpdatePractitionerRoleDto
} from '../../domain/dtos';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Practitioner Role')
@Controller('practitioner-role')
export class PractitionerRoleController extends ControllerFactory<
  PractitionerRole,
  CreatePractitionerRoleDto,
  UpdatePractitionerRoleDto,
  SerializerPractitionerRoleDto
>(
  PractitionerRole,
  CreatePractitionerRoleDto,
  UpdatePractitionerRoleDto,
  SerializerPractitionerRoleDto
) {
  constructor(protected service: PractitionerRoleService, private readonly specialitiesService: PractitionerRoleService) {
    super();
  }

  @Post()
  @ApiOperation({ summary: 'Create a new speciality' })
  @ApiResponse({ status: 201, description: 'Speciality created successfully' })
  async create(@Body() createSpecialityDto: CreatePractitionerRoleDto): Promise<PractitionerRole> {
    return await this.specialitiesService.createSpeciality(createSpecialityDto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a speciality by ID' })
  @ApiResponse({ status: 200, description: 'Speciality found' })
  @ApiResponse({ status: 404, description: 'Speciality not found' })
  async getOne(@Param('id') id: string): Promise<PractitionerRole> {
    return await this.specialitiesService.getOne(id);
  }

  @Get()
  @ApiOperation({ summary: 'Get all specialities' })
  @ApiResponse({ status: 200, description: 'List of specialities' })
  async getAll(): Promise<PractitionerRole[]> {
    return await this.specialitiesService.getAll();
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a speciality by ID' })
  @ApiResponse({ status: 200, description: 'Speciality updated successfully' })
  @ApiResponse({ status: 404, description: 'Speciality not found' })
  async update(
    @Param('id') id: string, 
    @Body() updateSpecialityDto: UpdatePractitionerRoleDto
  ): Promise<PractitionerRole> {
    return await this.specialitiesService.updateSpeciality(id, updateSpecialityDto);
  }

  @Delete(':id')
  @HttpCode(204)
  @ApiOperation({ summary: 'Soft delete a speciality by ID' })
  @ApiResponse({ status: 204, description: 'Speciality deleted successfully' })
  @ApiResponse({ status: 404, description: 'Speciality not found' })
  async removeSpeciality(@Param('id') id: string): Promise<void> {
    await this.specialitiesService.softDelete(id);
  }

  @Patch('/recover/:id')
  @ApiOperation({ summary: 'Recover a soft-deleted speciality by ID' })
  @ApiResponse({ status: 200, description: 'Speciality recovered successfully' })
  @ApiResponse({ status: 404, description: 'Speciality not found or not deleted' })
  async recover(@Param('id') id: string): Promise<PractitionerRole> {
    return await this.specialitiesService.recoverSpeciality(id);
  }

}
