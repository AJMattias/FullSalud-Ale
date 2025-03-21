import {
  Body,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Put,
  Query
} from '@nestjs/common';
import { ApiBody, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ControllerFactory } from '../../common/factories/controller.factory';
import { MedicationRequest } from '../../domain/entities/medication-request.entity';
import { toDto } from '../../common/util/transform-dto.util';
import { MedicationRequestsService } from './medication-request.service';
import { SerializerMedicationRequestDto } from '../../domain/dtos/medication-request/medication-request-serializer.dto';
import { CreateMedicationRequestDto, UpdateMedicationRequestDto } from '../../domain/dtos/medication-request/medication-request.dto';
import { FilteredMedicationRequestDto } from '../../domain/dtos/medication-request/FilteredMedicationRequest.dto';

@ApiTags('MedicationRequests')
@Controller('medication-request')
export class MedicationRequestsController extends ControllerFactory<
  MedicationRequest,
  CreateMedicationRequestDto,
  UpdateMedicationRequestDto,
  SerializerMedicationRequestDto
>(MedicationRequest, CreateMedicationRequestDto, UpdateMedicationRequestDto, SerializerMedicationRequestDto) {
  constructor(protected service: MedicationRequestsService) {
    super();
  }
  @Post('create')
  @ApiOperation({ summary: 'Crear una nueva receta' })
  @ApiBody({ type: CreateMedicationRequestDto })
  @ApiResponse({ type: SerializerMedicationRequestDto })
  async create(
    @Body() createMedicationRequestDto: CreateMedicationRequestDto
  ): Promise<SerializerMedicationRequestDto> {
    const data = await this.service.create(createMedicationRequestDto);
    return toDto(SerializerMedicationRequestDto, data);
  }

  @Get('by-doctor')
  @ApiOperation({
    summary: 'Obtener todas las recetas asociadas a un doctor'
  })
  @ApiResponse({ type: SerializerMedicationRequestDto, isArray: true })
  async findAllMedicationRequestByDoctorId(
    @Query('doctorId') doctorId: string,
    @Query('page') page: number = 1,
    @Query('limit') limit:  number = 10,
  ): Promise<{
    data:SerializerMedicationRequestDto[]; 
    total: number; 
    lastPage: number}> {
    const {data, total, lastPage} = await this.service.findAllMedicationRequestByDoctorId(doctorId, page, limit);
    const serializedData = data.map((medication)=> toDto(SerializerMedicationRequestDto, medication))
    return {
      data: serializedData,
      total, lastPage
    };
  }

  @Get('by-patient')
  @ApiOperation({
    summary: 'Obtener todas las recetas asociadas a un paciente'
  })
  @ApiResponse({ type: SerializerMedicationRequestDto, isArray: true })
  async findAllMedicationRequestByPatientId(
    @Query('patientId') patientId: string,
    @Query('page') page: number = 1,
    @Query('limit') limit:  number = 10,
  ): Promise<{
    data:SerializerMedicationRequestDto[]; 
    total: number; 
    lastPage: number}> {
    const {data, total, lastPage} = await this.service.findAllMedicationRequestByPatientId(patientId, page, limit);
    const serializedData = data.map((medication)=> toDto(SerializerMedicationRequestDto, medication))
    return {
      data: serializedData,
      total, lastPage
    };
  }

  @Put(':id')
  @ApiOperation({ summary: 'Actualizar una receta existente' })
  @ApiBody({ type: UpdateMedicationRequestDto })
  @ApiResponse({ type: SerializerMedicationRequestDto })
  async updateMedicationRequest(
    @Param('id') id: string,
    @Body() updateMedicationRequestDto: UpdateMedicationRequestDto
  ): Promise<SerializerMedicationRequestDto> {
    const data = await this.service.update(id, updateMedicationRequestDto);
    return toDto(SerializerMedicationRequestDto, data);
  }

   @Patch('/remove/:id')
    @ApiOperation({ description: 'Eliminar (soft delete) de Medicine Request' })
    @ApiParam({ name: 'id', description: 'UUID del Medicine Request', type: String })
    @ApiResponse({ status: 200, description: 'Medicine Request eliminado correctamente', schema: { example: { message: 'Favorito deleted successfully', deletedFavorito: { /* ejemplo del turno */ } } } })
    @ApiResponse({ status: 404, description: 'Medicine Request no encontrado' })
    async removeMedicineRequest(
      @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
    ): Promise<{ message: string; deletedMedicationRequest: MedicationRequest }> {
      return this.service.removeMedicineRequest(id);
    }
  
    @Patch('/recover/:id')
    @ApiOperation({ description: 'Recuperar (soft delete) de Medication Request' })
    @ApiParam({ name: 'id', description: 'UUID del Medication Request', type: String })
    @ApiResponse({ status: 200, description: 'Medication Request recuperado correctamente', schema: { example: { message: 'Favorito deleted successfully', deletedFavorito: { /* ejemplo del turno */ } } } })
    @ApiResponse({ status: 404, description: 'Medication Request no encontrado' })
    async recoverMedicationRequest(
      @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
    ): Promise<{ message: string; medicationRequestRecovered: MedicationRequest }> {
      return this.service.recoverMedicineRequest(id);
    }

    //TODO find filtered paginated
    @Get()
    @ApiOperation({
      summary: 'Obtener todas las recetas filtradas'
    })
    @ApiResponse({ type: SerializerMedicationRequestDto, isArray: true })
    async findAllFiltered(
      @Query() filteredDto: FilteredMedicationRequestDto,
    ): Promise<{
      data:SerializerMedicationRequestDto[]; 
      total: number; 
      lastPage: number,  msg:string}> {
      const {data, total, lastPage, msg} = await this.service.findAllPaginated(filteredDto);
      const serializedData = data.map((medication)=> toDto(SerializerMedicationRequestDto, medication))
      return {
        data: serializedData,
        total, lastPage, msg
      };
    }
}
