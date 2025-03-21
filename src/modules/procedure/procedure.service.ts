import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseService } from '../../common/bases/base.service';
import { CreateProcedureDto, UpdateProcedureDto } from '../../domain/dtos';
import { Procedure } from '../../domain/entities';
import { Repository } from 'typeorm';

@Injectable()
export class ProcedureService extends BaseService<
  Procedure,
  CreateProcedureDto,
  UpdateProcedureDto
> {
  constructor(
    @InjectRepository(Procedure) protected repository: Repository<Procedure>
  ) {
    super(repository);
  }
}
