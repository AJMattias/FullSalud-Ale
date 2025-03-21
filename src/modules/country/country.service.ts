import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseService } from '../../common/bases/base.service';
import { CreateCountryDto, UpdateCountryDto } from '../../domain/dtos';
import { Country } from '../../domain/entities';
import { Repository } from 'typeorm';

@Injectable()
export class CountryService extends BaseService<
  Country,
  CreateCountryDto,
  UpdateCountryDto
> {
  constructor(
    @InjectRepository(Country) protected repository: Repository<Country>
  ) {
    super(repository);
  }
}
