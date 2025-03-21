import { Module } from '@nestjs/common';
import { PractitionerRoleService } from './practitioner-role.service';
import { PractitionerRoleController } from './practitioner-role.controller';
import { PractitionerRole } from '../../domain/entities';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([PractitionerRole])],
  controllers: [PractitionerRoleController],
  providers: [PractitionerRoleService],
  exports: [PractitionerRoleService]
})
export class PractitionerRoleModule { }
