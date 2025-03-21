import { Column, Entity } from 'typeorm';
import { MedicalProviderNotificationPreference } from './notification-preference.entity';
import { ApiProperty } from '@nestjs/swagger';

//Esta entidad antes se denominaba SpecialistsNotificationPreferences
@Entity('practitioner_notification_preference')
export class PractitionerNotificationPreference extends MedicalProviderNotificationPreference {
  @Column({
    type: 'boolean',
    name: 'turn_requests',
    default: true
  })
  @ApiProperty({ examples: ['false', 'true'] })
  turnRequests: boolean;
}
