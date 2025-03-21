import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseService } from '../../common/bases/base.service';
import { CreateProfessionalDegreeDto, UpdateProfessionalDegreeDto } from '../../domain/dtos';
import { ProfessionalDegree } from '../../domain/entities';
import { Repository } from 'typeorm';

@Injectable()
export class ProfessionalDegreeService extends BaseService<
  ProfessionalDegree,
  CreateProfessionalDegreeDto,
  UpdateProfessionalDegreeDto
> {
  constructor(
    @InjectRepository(ProfessionalDegree) protected repository: Repository<ProfessionalDegree>
  ) {
    super(repository);
  }
}
