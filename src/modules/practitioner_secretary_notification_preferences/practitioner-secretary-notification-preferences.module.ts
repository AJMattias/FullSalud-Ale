import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { PractitionerSecretaryNotificationPreferences } from '../../domain/entities';
import { PractitionerSecretaryNotificationPreferencesController } from './practitioner-secretary-notification-preferences.controller';
import { PractitionerSecretaryNotificationPreferencesService } from './practitioner-secretary-notification-preferences.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([PractitionerSecretaryNotificationPreferences])
  ],
  controllers: [PractitionerSecretaryNotificationPreferencesController],
  providers: [PractitionerSecretaryNotificationPreferencesService],
  exports: [PractitionerSecretaryNotificationPreferencesService]
})
export class PractitionerSecretaryNotificationPreferencesModule {}
