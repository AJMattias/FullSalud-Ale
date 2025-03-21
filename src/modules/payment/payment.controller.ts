import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ControllerFactory } from '../../common/factories/controller.factory';
import {
  CreatePaymentDto,
  UpdatePaymentDto,
  SerializerPaymentDto
} from '../../domain/dtos';
import { Payment } from '../../domain/entities';
import { PaymentService } from './payment.service';

@ApiTags('Payment')
@Controller('payment')
export class PaymentController extends ControllerFactory<
  Payment,
  CreatePaymentDto,
  UpdatePaymentDto,
  SerializerPaymentDto
>(Payment, CreatePaymentDto, UpdatePaymentDto, SerializerPaymentDto) {
  constructor(protected service: PaymentService) {
    super();
  }
}
