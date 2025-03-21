import { Controller } from '@nestjs/common';
import { ValueAddedTaxService } from './value-added-tax.service';
import { ValueAddedTax  } from '../../domain/entities';
import { ControllerFactory } from '../../common/factories/controller.factory';
import { CreateValueAddedTaxDto, SerializerValueAddedTaxDto, UpdateValueAddedTaxDto } from '../../domain/dtos';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('ValueAddedTax')
@Controller('value-added-tax')
export class ValueAddedTaxController extends ControllerFactory<
  ValueAddedTax ,
  CreateValueAddedTaxDto,
  UpdateValueAddedTaxDto,
  SerializerValueAddedTaxDto
>(ValueAddedTax , CreateValueAddedTaxDto, UpdateValueAddedTaxDto, SerializerValueAddedTaxDto) {
  constructor(protected service: ValueAddedTaxService) {
    super();
  }
}
