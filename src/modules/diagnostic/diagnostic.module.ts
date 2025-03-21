import { Module } from '@nestjs/common';
import { DiagnosticService } from './diagnostic.service';
import { DiagnosticController } from './diagnostic.controller';
import { Diagnostic } from '../../domain/entities';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([Diagnostic])],
  controllers: [DiagnosticController],
  providers: [DiagnosticService]
})
export class DiagnosticModule {}
