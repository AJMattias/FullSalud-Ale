import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PractitionerSecretary } from '../../domain/entities';
import { PractitionerSecretaryService } from './practitioner-secretary.service';
import { PractitionerSecretaryController } from './practitioner-secretary.controller';

@Module({
  imports: [TypeOrmModule.forFeature([PractitionerSecretary])],
  controllers: [PractitionerSecretaryController],
  providers: [PractitionerSecretaryService]
})
export class PractitionerSecretaryModule {}
