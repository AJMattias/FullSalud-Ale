import { Column, Entity } from 'typeorm';
import { MedicalProviderNotificationPreference } from './notification-preference.entity';
import { ApiProperty } from '@nestjs/swagger';

//Esta entidad antes se denominaba SpecialistsSecretaryNotificationPreferences  
@Entity('practitioner_secretary_notification_preferences')
export class PractitionerSecretaryNotificationPreferences extends MedicalProviderNotificationPreference {
  @Column({
    type: 'boolean',
    name: 'turn_requests',
    default: true
  })
  @ApiProperty({ examples: ['false', 'true'] })
  turnRequests: boolean;
}
