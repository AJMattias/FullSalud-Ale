import { TypeOrmModule } from '@nestjs/typeorm';
import { OrganizationNotificationPreference } from '../../domain/entities';
import { OrganizationNotificationPreferenceController } from './organization-notification-preference.controller';
import { OrganizationNotificationPreferenceService } from './organization-notification-preference.service';
import { Module } from '@nestjs/common';

@Module({
  imports: [TypeOrmModule.forFeature([OrganizationNotificationPreference])],
  controllers: [OrganizationNotificationPreferenceController],
  providers: [OrganizationNotificationPreferenceService],
  exports: [OrganizationNotificationPreferenceService]
})
export class OrganizationNotificationPreferenceModule {}
