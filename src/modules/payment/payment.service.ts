import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseService } from '../../common/bases/base.service';
import { CreatePaymentDto, UpdatePaymentDto } from '../../domain/dtos';
import { Payment } from '../../domain/entities';
import { Repository } from 'typeorm';

@Injectable()
export class PaymentService extends BaseService<
  Payment,
  CreatePaymentDto,
  UpdatePaymentDto
> {
  constructor(
    @InjectRepository(Payment)
    protected repository: Repository<Payment>
  ) {
    super(repository);
  }
}
