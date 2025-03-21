import { Controller } from '@nestjs/common';
import { DiagnosticService } from './diagnostic.service';
import { Diagnostic } from '../../domain/entities';
import { ControllerFactory } from '../../common/factories/controller.factory';
import {
  CreateDiagnosticDto,
  SerializerDiagnosticDto,
  UpdateDiagnosticDto
} from '../../domain/dtos';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Diagnostic')
@Controller('diagnostic')
export class DiagnosticController extends ControllerFactory<
  Diagnostic,
  CreateDiagnosticDto,
  UpdateDiagnosticDto,
  SerializerDiagnosticDto
>(
  Diagnostic,
  CreateDiagnosticDto,
  UpdateDiagnosticDto,
  SerializerDiagnosticDto
) {
  constructor(protected service: DiagnosticService) {
    super();
  }
}
