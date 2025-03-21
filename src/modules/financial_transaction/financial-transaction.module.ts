import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FinancialTransaction } from '../../domain/entities';
import { FinancialTransactionController } from './financial-transaction.controller';
import { FinancialTransactionService } from './financial-transaction.service';

@Module({
  imports: [TypeOrmModule.forFeature([FinancialTransaction])],
  controllers: [FinancialTransactionController],
  providers: [FinancialTransactionService]
})
export class FinancialTransactionModule {}
