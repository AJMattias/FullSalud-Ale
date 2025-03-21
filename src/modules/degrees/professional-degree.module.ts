import { Module } from '@nestjs/common';
import { ProfessionalDegreeService } from './professional-degree.service';
import { ProfessionalDegreeController } from './professional-degree.controller';
import { ProfessionalDegree } from '../../domain/entities';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([ProfessionalDegree])],
  controllers: [ProfessionalDegreeController],
  providers: [ProfessionalDegreeService],
  exports: [ProfessionalDegreeService]
})
export class ProfessionalDegreeModule {}
