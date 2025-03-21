import { Module } from '@nestjs/common';
import { ProcedureService } from './procedure.service';
import { ProcedureController } from './procedure.controller';
import { Procedure } from '../../domain/entities';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([Procedure])],
  controllers: [ProcedureController],
  providers: [ProcedureService]
})
export class ProcedureModule {}
