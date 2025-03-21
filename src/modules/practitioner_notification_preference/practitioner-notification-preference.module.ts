import { TypeOrmModule } from '@nestjs/typeorm';
import { PractitionerNotificationPreference } from '../../domain/entities';
import { Module } from '@nestjs/common';
import { PractitionerNotificationPreferenceController } from './practitioner-notification-preference.controller';
import { PractitionerNotificationPreferenceService } from './practitioner-notification-preference.service';

@Module({
  imports: [TypeOrmModule.forFeature([PractitionerNotificationPreference])],
  controllers: [PractitionerNotificationPreferenceController],
  providers: [PractitionerNotificationPreferenceService],
  exports: [PractitionerNotificationPreferenceService]
})
export class PractitionerNotificationPreferenceModule {}
