import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { FullBaseDto, ShortBaseDto } from '../../../common/dtos';
import { Day } from '../../enums';

export class SerializerPatientAppointmentDto extends FullBaseDto {
  @Expose()
  @ApiProperty({ example: '09:00' })
  openingHour: string;

  @Expose()
  @ApiProperty({ example: '13:30' })
  closeHour: string;

  @Expose()
  @ApiProperty({
    example: Object.values(Day).join(', ')
  })
  day: Day;
}

export class SerializerShortPatientAppointmentDto extends ShortBaseDto {
  @Expose()
  @ApiProperty({ example: '09:00' })
  openingHour: string;

  @Expose()
  @ApiProperty({ example: '13:30' })
  closeHour: string;

  @Expose()
  @ApiProperty({
    example: Object.values(Day).join(', ')
  })
  day: Day;
}
