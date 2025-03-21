import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseService } from '../../common/bases/base.service';
import {
  CreateClinicalIndicationDetailDto,
  UpdateIndicationDetailDto
} from '../../domain/dtos';
import { ClinicalIndicationDetail } from '../../domain/entities';
import { Repository } from 'typeorm';

@Injectable()
export class ClinicalIndicationDetailService extends BaseService<
  ClinicalIndicationDetail,
  CreateClinicalIndicationDetailDto,
  UpdateIndicationDetailDto
> {
  constructor(
    @InjectRepository(ClinicalIndicationDetail)
    protected repository: Repository<ClinicalIndicationDetail>
  ) {
    super(repository);
  }
}
