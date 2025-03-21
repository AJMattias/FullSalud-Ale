import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseService } from '../../common/bases/base.service';
import { CreateChargeItemDto, UpdateChargeItemDto } from '../../domain/dtos';
import { ChargeItem } from '../../domain/entities';
import { Repository } from 'typeorm';

@Injectable()
export class ChargeItemService extends BaseService<
  ChargeItem,
  CreateChargeItemDto,
  UpdateChargeItemDto
> {
  constructor(
    @InjectRepository(ChargeItem) protected repository: Repository<ChargeItem>
  ) {
    super(repository);
  }
}
