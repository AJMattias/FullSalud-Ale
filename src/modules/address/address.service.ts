import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseService } from '../../common/bases/base.service';
import { CreateAddressDto, UpdateAddressDto } from '../../domain/dtos';
import { Address } from '../../domain/entities';
import { Repository } from 'typeorm';

@Injectable()
export class AddressService extends BaseService<
  Address,
  CreateAddressDto,
  UpdateAddressDto
> {
  constructor(
    @InjectRepository(Address) protected repository: Repository<Address>
  ) {
    super(repository);
  }
}
