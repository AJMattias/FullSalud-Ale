import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseService } from '../../common/bases/base.service';
import { CreateClinicalIndicationDto, UpdateClinicalIndicationDto } from '../../domain/dtos';
import { ClinicalIndication } from '../../domain/entities';
import { Repository } from 'typeorm';

@Injectable()
export class ClinicalIndicationService extends BaseService<
  ClinicalIndication,
  CreateClinicalIndicationDto,
  UpdateClinicalIndicationDto
> {
  constructor(
    @InjectRepository(ClinicalIndication)
    protected repository: Repository<ClinicalIndication>
  ) {
    super(repository);
  }
}
