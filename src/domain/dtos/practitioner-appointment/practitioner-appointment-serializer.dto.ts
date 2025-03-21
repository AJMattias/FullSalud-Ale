import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import { FullBaseDto, ShortBaseDto } from '../../../common/dtos';
import { Day } from '../../enums';
import { SerializerLocationDto, SerializerShortLocationDto } from '..';

export class ShortSerializerPractitionerAppointmentDto extends ShortBaseDto {
  @Expose()
  @ApiProperty({ example: '09:00' })
  startHour: string;

  @Expose()
  @ApiProperty({ example: '13:00' })
  endHour: string;

  @Expose()
  @ApiProperty({ example: 'Sunday' })
  day: Day;

  @Expose()
  @Type(() => SerializerShortLocationDto)
  office: SerializerShortLocationDto;
}

export class SerializerPractitionerAppointmentDto extends FullBaseDto {
  @Expose()
  @ApiProperty({ example: '2024-09-13T09:00:00Z' })
  startHour: string;

  @Expose()
  @ApiProperty({ example: '2024-09-13T09:00:00Z' })
  endHour: string;

  @Expose()
  @ApiProperty({ example: 'Sunday' })
  day: Day;

  @Expose()
  @Type(() => SerializerLocationDto)
  office: SerializerLocationDto;
}
