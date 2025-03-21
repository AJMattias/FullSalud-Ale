import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseService } from '../../common/bases/base.service';
import { CreateFinancialTransactionDto, UpdateFinancialTransactionDto } from '../../domain/dtos';
import { FinancialTransaction } from '../../domain/entities/financial-transaction.entity';
import { Repository } from 'typeorm';

@Injectable()
export class FinancialTransactionService extends BaseService<
  FinancialTransaction,
  CreateFinancialTransactionDto,
  UpdateFinancialTransactionDto
> {
  constructor(
    @InjectRepository(FinancialTransaction)
    protected repository: Repository<FinancialTransaction>
  ) {
    super(repository);
  }
}
