import { Controller } from '@nestjs/common';
import { ChargeItemService } from './charge-item.service';
import { ChargeItem } from '../../domain/entities';
import { ControllerFactory } from '../../common/factories/controller.factory';
import {
  CreateChargeItemDto,
  SerializerChargeItemDto,
  UpdateChargeItemDto
} from '../../domain/dtos';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('ChargeItem')
@Controller('charge-item')
export class ChargeItemController extends ControllerFactory<
  ChargeItem,
  CreateChargeItemDto,
  UpdateChargeItemDto,
  SerializerChargeItemDto
>(ChargeItem, CreateChargeItemDto, UpdateChargeItemDto, SerializerChargeItemDto) {
  constructor(protected service: ChargeItemService) {
    super();
  }
}
