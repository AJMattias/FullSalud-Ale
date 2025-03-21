import { Column, Entity } from 'typeorm';
import { MedicalProviderNotificationPreference } from './notification-preference.entity';
import { ApiProperty } from '@nestjs/swagger';

//Esta entidad anteriormente se denominaba InstitutionsNotificationPreferences
@Entity('organization_notification_preferences')
export class OrganizationNotificationPreference extends MedicalProviderNotificationPreference {
  @Column({
    type: 'boolean',
    name: 'derivation_requests',
    default: true
  })
  @ApiProperty({ examples: ['false', 'true'] })
  derivationRequests: boolean;
}
