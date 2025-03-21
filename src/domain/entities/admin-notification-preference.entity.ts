import { Column, Entity } from 'typeorm';
import { NotificationPreference } from './notification-preference.entity';
import { ApiProperty } from '@nestjs/swagger';

//Esta entidad antes se denominaba AdminsNotificationPreferences
@Entity('admin_notification_preference')
export class AdminNotificationPreference extends NotificationPreference {
  @Column({
    type: 'boolean',
    default: true
  })
  @ApiProperty({ examples: ['false', 'true'] })
  applications: boolean;

  @Column({
    type: 'boolean',
    name: 'daily_patients_list',
    default: true
  })
  @ApiProperty({ examples: ['false', 'true'] })
  dailyPatientsList: boolean;

  @Column({
    type: 'boolean',
    name: 'turn_requests',
    default: true
  })
  @ApiProperty({ examples: ['false', 'true'] })
  turnRequests: boolean;

  @Column({
    type: 'boolean',
    name: 'derivation_requests',
    default: true
  })
  @ApiProperty({ examples: ['false', 'true'] })
  derivationRequests: boolean;

  @Column({
    type: 'boolean',
    name: 'cancelled_turns',
    default: true
  })
  @ApiProperty({ examples: ['false', 'true'] })
  cancelledTurns: boolean;

  @Column({
    type: 'boolean',
    default: true
  })
  @ApiProperty({ examples: ['false', 'true'] })
  commssions: boolean;
}
