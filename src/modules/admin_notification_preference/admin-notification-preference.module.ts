import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { AdminNotificationPreferenceController } from './admin-notification-preference.controller';
import { AdminNotificationPreferenceService } from './admin-notification-preference.service';
import { AdminNotificationPreference } from '../../domain/entities';

@Module({
  imports: [TypeOrmModule.forFeature([AdminNotificationPreference])],
  controllers: [AdminNotificationPreferenceController],
  providers: [AdminNotificationPreferenceService],
  exports: [AdminNotificationPreferenceService]
})
export class AdminNotificationPreferenceModule {}
