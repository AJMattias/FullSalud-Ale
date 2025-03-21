import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrganizationType } from '../../domain/entities';
import { OrganizationTypeController } from './organization-type.controller';
import { OrganizationTypeService } from './organization-type.service';

@Module({
  imports: [TypeOrmModule.forFeature([OrganizationType])],
  controllers: [OrganizationTypeController],
  providers: [OrganizationTypeService],
  exports: [OrganizationTypeService]
})
export class OrganizationTypeModule {}
