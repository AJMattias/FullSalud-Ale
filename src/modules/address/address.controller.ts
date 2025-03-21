import { Controller } from '@nestjs/common';
import { AddressService } from './address.service';
import { Address } from '../../domain/entities';
import {
  CreateAddressDto,
  SerializerAddressDto,
  UpdateAddressDto
} from '../../domain/dtos';
import { ControllerFactory } from '../../common/factories/controller.factory';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Addresses')
@Controller('addresses')
export class AddressController extends ControllerFactory<
  Address,
  CreateAddressDto,
  UpdateAddressDto,
  SerializerAddressDto
>(Address, CreateAddressDto, UpdateAddressDto, SerializerAddressDto) {
  constructor(protected service: AddressService) {
    super();
  }
}
