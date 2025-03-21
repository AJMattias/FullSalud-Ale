import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseService } from '../../common/bases/base.service';
import { CreateDiagnosticDto, UpdateDiagnosticDto } from '../../domain/dtos';
import { Diagnostic } from '../../domain/entities';
import { Repository } from 'typeorm';

@Injectable()
export class DiagnosticService extends BaseService<
  Diagnostic,
  CreateDiagnosticDto,
  UpdateDiagnosticDto
> {
  constructor(
    @InjectRepository(Diagnostic) protected repository: Repository<Diagnostic>
  ) {
    super(repository);
  }
}
