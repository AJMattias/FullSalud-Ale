import { Module } from '@nestjs/common';
import { ValueAddedTaxService } from './value-added-tax.service';
import { ValueAddedTaxController } from './value-added-tax.controller';
import { ValueAddedTax  } from '../../domain/entities';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([ValueAddedTax ])],
  controllers: [ValueAddedTaxController],
  providers: [ValueAddedTaxService]
})
export class ValueAddedTaxModule {}
