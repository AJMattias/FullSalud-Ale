import { Column, Entity } from 'typeorm';
import { NotificationPreference } from './notification-preference.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity('secretary_notifications_preference')
export class SecretaryNotificationPreference extends NotificationPreference {
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
