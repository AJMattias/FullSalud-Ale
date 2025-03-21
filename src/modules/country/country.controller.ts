import { Controller } from '@nestjs/common';
import { CountryService } from './country.service';
import { Country } from '../../domain/entities';
import { ControllerFactory } from '../../common/factories/controller.factory';
import {
  CreateCountryDto,
  SerializerCountryDto,
  UpdateCountryDto
} from '../../domain/dtos';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Countries')
@Controller('countries')
export class CountryController extends ControllerFactory<
  Country,
  CreateCountryDto,
  UpdateCountryDto,
  SerializerCountryDto
>(Country, CreateCountryDto, UpdateCountryDto, SerializerCountryDto) {
  constructor(protected service: CountryService) {
    super();
  }
}
