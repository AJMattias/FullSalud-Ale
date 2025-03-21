import { Base } from '../../common/bases/base.entity';
import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Day } from '../enums';
import { ApiProperty } from '@nestjs/swagger';
import { Branch, Location } from '.';

//Esta entidad antes se denominaba AttentionHour
@Entity('appointment_slot ')
export class AppointmentSlot  extends Base {
  @Column({
    type: 'time',
    name: 'opening_hour',
    nullable: true
  })
  openingHour: string;

  @Column({
    type: 'time',
    name: 'close_hour',
    nullable: true
  })
  closeHour: string;

  @Column({
    type: 'enum',
    enum: Day
  })
  @ApiProperty({
    examples: [
      Day.SUNDAY,
      Day.MONDAY,
      Day.TUESDAY,
      Day.WEDNESDAY,
      Day.THURSDAY,
      Day.FRIDAY,
      Day.SATURDAY
    ]
  })
  day: Day;

  @ManyToOne(() => Branch, (headquarters) => headquarters.attentionHours)
  @JoinColumn({ name: 'headquarters_id' })
  headquarters: Branch;

  @ManyToOne(
    () => Location,
    (office) => office.attentionHour
  )
  @JoinColumn({ name: 'practitioner_id' })
  office: Location;
}
