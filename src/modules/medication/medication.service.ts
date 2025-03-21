import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseService } from '../../common/bases/base.service';
import { CreateMedicationDto, UpdateMedicationDto } from '../../domain/dtos';
import { Medication } from '../../domain/entities';
import { Repository } from 'typeorm';

@Injectable()
export class MedicationService extends BaseService<
  Medication,
  CreateMedicationDto,
  UpdateMedicationDto
> {
  constructor(
    @InjectRepository(Medication)
    protected repository: Repository<Medication>
  ) {
    super(repository);
  }
}
