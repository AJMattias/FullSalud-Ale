import { ApiProperty } from '@nestjs/swagger';
import { FullBaseDto } from '../../../common/dtos';
import { SerializerShortPracticeDto, SerializerShortPractitionerDto } from '..';
import { Expose, Type } from 'class-transformer';

export class SerializerChargeItemDto extends FullBaseDto {
  @Expose()
  @ApiProperty({ example: '8000' })
  price: number;

  @Expose()
  @Type(() => SerializerShortPractitionerDto)
  practitioner: SerializerShortPractitionerDto;

  @Expose()
  @Type(() => SerializerShortPracticeDto)
  practice: SerializerShortPracticeDto;
}
