import { Column, Entity } from 'typeorm';
import { NotificationPreference } from './notification-preference.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity('patient_notification_preference')
export class PatientNotificationPreference extends NotificationPreference {
  @Column({
    type: 'boolean',
    name: 'medicine_time',
    default: true
  })
  @ApiProperty({ examples: ['false', 'true'] })
  medicineTime: boolean;

  @Column({
    type: 'boolean',
    default: true
  })
  promotional: boolean;
}
