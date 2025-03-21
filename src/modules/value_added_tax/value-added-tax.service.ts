import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseService } from '../../common/bases/base.service';
import { CreateValueAddedTaxDto, UpdateValueAddedTaxDto } from '../../domain/dtos';
import { ValueAddedTax  } from '../../domain/entities';
import { Repository } from 'typeorm';

@Injectable()
export class ValueAddedTaxService extends BaseService<
  ValueAddedTax ,
  CreateValueAddedTaxDto,
  UpdateValueAddedTaxDto
> {
  constructor(@InjectRepository(ValueAddedTax ) protected repository: Repository<ValueAddedTax >) {
    super(repository);
  }
}
