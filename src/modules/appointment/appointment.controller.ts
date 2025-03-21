import {
  Body,
  Controller,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Get,
  Query,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import 'multer';
import { AppointmentService } from './appointment.service';
import { Appointment } from '../../domain/entities';
import { ControllerFactory } from '../../common/factories/controller.factory';
import {
  CreateAppointmentDto,
  SerializerAppointmentDto,
  UpdateAppointmentDto
} from '../../domain/dtos';
import {
  ApiBody,
  ApiOperation,
  ApiResponse,
  ApiTags,
  ApiCreatedResponse,
  ApiParam
} from '@nestjs/swagger';
import { toDto } from '../../common/util/transform-dto.util';

@ApiTags('Appointment')
@Controller('appointment')
export class AppointmentController extends ControllerFactory<
  Appointment,
  CreateAppointmentDto,
  UpdateAppointmentDto,
  SerializerAppointmentDto
>(Appointment, CreateAppointmentDto, UpdateAppointmentDto, SerializerAppointmentDto) {
  constructor(protected service: AppointmentService) {
    super();
  }

  @Post()
  @ApiOperation({ description: 'Crear un turno y un paciente si no existe' })
  @ApiCreatedResponse({
    description: 'Turno creado exitosamente con un paciente asociado',
    type: SerializerAppointmentDto,
  })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiResponse({ status: 404, description: 'Especialista no encontrado' })
  async createTurnWithPatient(
    @Body() createTurnDto: CreateAppointmentDto,
  ) {
    return await this.service.createTurn(createTurnDto);
  }

  @Get(':id')
  @ApiOperation({ description: 'Obtener un turno por su ID' })
  @ApiParam({ name: 'id', description: 'UUID del turno', type: String })
  @ApiResponse({ status: 200, description: 'Turno encontrado', type: SerializerAppointmentDto })
  @ApiResponse({ status: 404, description: 'Turno no encontrado' })
  async getTurnById(
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string
  ): Promise<SerializerAppointmentDto> {
    const turn = await this.service.getOne(id);
    return toDto(SerializerAppointmentDto, turn);
  }

  @Get()
  @ApiOperation({ description: 'Obtener todos los turnos con paginación' })
  @ApiResponse({ status: 200, description: 'Lista de turnos paginada', type: [SerializerAppointmentDto] })
  async getAllTurns(
    @Query('page') page: string = '1',
    @Query('limit') limit: string = '10'
  ): Promise<{
    total: number;
    page: number;
    limit: number;
    previousPage: number | null;
    turns: SerializerAppointmentDto[]
  }> {
    const pageNumber = Number(page);
    const limitNumber = Number(limit);
    const { turns, total, previousPage } = await this.service.getAll(pageNumber, limitNumber);
    return {
      turns: turns.map((turn) => toDto(SerializerAppointmentDto, turn)),
      total,
      page: pageNumber,
      limit: limitNumber,
      previousPage,
    };
  }

  @Get('specialist/:specialistId')
  @ApiOperation({ description: 'Obtener turnos por el ID de un especialista con paginación' })
  @ApiParam({ name: 'specialistId', description: 'UUID del especialista', type: String })
  @ApiResponse({ status: 200, description: 'Turnos encontrados', type: [SerializerAppointmentDto] })
  @ApiResponse({ status: 404, description: 'No se encontraron turnos para el especialista' })
  async getTurnsBySpecialist(
    @Param('specialistId', new ParseUUIDPipe({ version: '4' })) specialistId: string,
    @Query('page') page: string = '1',
    @Query('limit') limit: string = '10'
  ): Promise<{
    total: number;
    page: number;
    limit: number;
    previousPage: number | null;
    turns: SerializerAppointmentDto[]
  }> {
    const pageNumber = Number(page);
    const limitNumber = Number(limit);
    const { turns, total, previousPage } = await this.service.getTurnsBySpecialist(specialistId, pageNumber, limitNumber);
    return {
      turns: turns.map((turn) => toDto(SerializerAppointmentDto, turn)),
      total,
      page: pageNumber,
      limit: limitNumber,
      previousPage,
    };
  }

  @Get('specialist-all/:specialistId')
  @ApiOperation({ description: 'Obtener turnos por el ID de un especialista con paginación, exluyendo estado no_show' })
  @ApiParam({ name: 'specialistId', description: 'UUID del especialista', type: String })
  @ApiResponse({ status: 200, description: 'Turnos encontrados', type: [SerializerAppointmentDto] })
  @ApiResponse({ status: 404, description: 'No se encontraron turnos para el especialista' })
  async getTurnsBySpecialistAll(
    @Param('specialistId', new ParseUUIDPipe({ version: '4' })) specialistId: string,
    @Query('page') page: string = '1',
    @Query('limit') limit: string = '10'
  ): Promise<{
    total: number;
    page: number;
    limit: number;
    previousPage: number | null;
    turns: SerializerAppointmentDto[]
  }> {
    const pageNumber = Number(page);
    const limitNumber = Number(limit);
    const { turns, total, previousPage } = await this.service.getTurnsBySpecialistAll(specialistId, pageNumber, limitNumber);
    return {
      turns: turns.map((turn) => toDto(SerializerAppointmentDto, turn)),
      total,
      page: pageNumber,
      limit: limitNumber,
      previousPage,
    };
  }

  @Get('patient/:patientId')
  @ApiOperation({ description: 'Obtener turnos por el ID de un paciente con paginación' })
  @ApiParam({ name: 'patientId', description: 'UUID del paciente', type: String })
  @ApiResponse({ status: 200, description: 'Turnos encontrados', type: [SerializerAppointmentDto] })
  @ApiResponse({ status: 404, description: 'No se encontraron turnos para el paciente' })
  async getTurnsByPatient(
    @Param('patientId', new ParseUUIDPipe({ version: '4' })) patientId: string,
    @Query('page') page: string = '1',
    @Query('limit') limit: string = '10'
  ): Promise<{
    total: number;
    page: number;
    limit: number;
    previousPage: number | null;
    turns: SerializerAppointmentDto[]
  }> {
    const pageNumber = Number(page);
    const limitNumber = Number(limit);
    const { turns, total, previousPage } = await this.service.getTurnsByPatient(patientId, pageNumber, limitNumber);
    return {
      turns: turns.map((turn) => toDto(SerializerAppointmentDto, turn)),
      total,
      page: pageNumber,
      limit: limitNumber,
      previousPage,
    };
  }

  @Get('patient-all/:patientId')
  @ApiOperation({ description: 'Obtener turnos por el ID de un paciente con paginación, exluyendo estado no_show' })
  @ApiParam({ name: 'patientId', description: 'UUID del paciente', type: String })
  @ApiResponse({ status: 200, description: 'Turnos encontrados', type: [SerializerAppointmentDto] })
  @ApiResponse({ status: 404, description: 'No se encontraron turnos para el paciente' })
  async getTurnsByPatientAll(
    @Param('patientId', new ParseUUIDPipe({ version: '4' })) patientId: string,
    @Query('page') page: string = '1',
    @Query('limit') limit: string = '10'
  ): Promise<{
    total: number;
    page: number;
    limit: number;
    previousPage: number | null;
    turns: SerializerAppointmentDto[]
  }> {
    const pageNumber = Number(page);
    const limitNumber = Number(limit);
    const { turns, total, previousPage } = await this.service.getTurnsByPatientAll(patientId, pageNumber, limitNumber);
    return {
      turns: turns.map((turn) => toDto(SerializerAppointmentDto, turn)),
      total,
      page: pageNumber,
      limit: limitNumber,
      previousPage,
    };
  }

  @Get('completed/patient/:patientId')
  @ApiOperation({ description: 'Obtener turnos completados por el ID de un paciente con paginación' })
  @ApiParam({ name: 'patientId', description: 'UUID del paciente', type: String })
  @ApiResponse({ status: 200, description: 'Turnos completados encontrados', type: [SerializerAppointmentDto] })
  @ApiResponse({ status: 404, description: 'No se encontraron turnos completados para el paciente' })
  async getCompletedTurnsByPatient(
    @Param('patientId', new ParseUUIDPipe({ version: '4' })) patientId: string,
    @Query('page') page: string = '1',
    @Query('limit') limit: string = '10'
  ): Promise<{
    total: number;
    page: number;
    limit: number;
    previousPage: number | null;
    turns: SerializerAppointmentDto[]
  }> {
    const pageNumber = Number(page);
    const limitNumber = Number(limit);
    const { turns, total, previousPage } = await this.service.getCompletedTurnsByPatient(patientId, pageNumber, limitNumber);
    return {
      turns: turns.map((turn) => toDto(SerializerAppointmentDto, turn)),
      total,
      page: pageNumber,
      limit: limitNumber,
      previousPage,
    };
  }

  @Patch('/remove/:id')
  @ApiOperation({ description: 'Eliminar (soft delete) un turno' })
  @ApiParam({ name: 'id', description: 'UUID del turno', type: String })
  @ApiResponse({ status: 200, description: 'Turno eliminado correctamente', schema: { example: { message: 'Turn deleted successfully', deletedTurn: { /* ejemplo del turno */ } } } })
  @ApiResponse({ status: 404, description: 'Turno no encontrado' })
  async removeTurn(
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
  ): Promise<{ message: string; deletedTurn: Appointment }> {
    return this.service.removeTurn(id);
  }

  @Patch('/recover/:id')
  @ApiOperation({ description: 'Recuperar un turno eliminado' })
  @ApiParam({ name: 'id', description: 'UUID del turno', type: String })
  @ApiResponse({ status: 200, description: 'Turno recuperado correctamente', type: SerializerAppointmentDto })
  @ApiResponse({ status: 404, description: 'Turno no encontrado' })
  async recoverTurn(
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
  ): Promise<SerializerAppointmentDto> {
    const turn = await this.service.recoverTurn(id);
    return toDto(SerializerAppointmentDto, turn);
  }

  @Patch(':id')
  @ApiOperation({ description: 'Actualizar un turno' })
  @ApiParam({ name: 'id', description: 'UUID del turno', type: String })
  @ApiBody({ type: UpdateAppointmentDto })
  @ApiResponse({ status: 200, description: 'Turno actualizado correctamente', type: SerializerAppointmentDto })
  @ApiResponse({ status: 404, description: 'Turno no encontrado' })
  async updateTurn(
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
    @Body() updateTurnDto: UpdateAppointmentDto,
  ): Promise<SerializerAppointmentDto> {
    const turn = await this.service.updateTurn(id, updateTurnDto);
    return toDto(SerializerAppointmentDto, turn);
  }

  @Patch('check-overlap/:id')
  @ApiOperation({ description: 'Verificar superposición y actualizar un turno' })
  @ApiParam({ name: 'id', description: 'UUID del turno', type: String })
  @ApiBody({ type: UpdateAppointmentDto })
  @ApiResponse({ status: 200, description: 'Turno actualizado correctamente', type: SerializerAppointmentDto })
  @ApiResponse({ status: 400, description: 'Superposición de turnos o datos inválidos' })
  @ApiResponse({ status: 404, description: 'Turno no encontrado' })
  async checkOverlapAndUpdateTurn(
    @Param('id') id: string,
    @Body() updateTurnDto: UpdateAppointmentDto,
  ): Promise<SerializerAppointmentDto> {
    try {
      const updatedTurn = await this.service.checkOverlapAndUpdateTurn(id, updateTurnDto);
      return updatedTurn;
    } catch (error) {
      if (error instanceof BadRequestException || error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException('Failed to update turn');
    }
  }

}
