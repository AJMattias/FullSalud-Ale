import { Module } from '@nestjs/common';
import { ClinicalIndicationController } from './clinical-indication.controller';
import { ClinicalIndicationService } from './clinical-indication.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClinicalIndication } from '../../domain/entities';

@Module({
  imports: [TypeOrmModule.forFeature([ClinicalIndication])],
  controllers: [ClinicalIndicationController],
  providers: [ClinicalIndicationService]
})
export class ClinicalIndicationModule {}
