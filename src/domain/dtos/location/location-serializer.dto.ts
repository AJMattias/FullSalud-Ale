import { FullBaseDto } from '../../../common/dtos';
import { SerializerShortAddressDto } from '..';
import { Expose, Type } from 'class-transformer';
import { ApiProperty, OmitType } from '@nestjs/swagger';

export class SerializerLocationDto extends FullBaseDto {
  @Expose()
  @ApiProperty({
    example: 'Consultorio del Parque'
  })
  name: string;

  @Expose()
  @ApiProperty({
    example: '2615623164'
  })
  phone?: string;

  @Expose()
  @Type(() => SerializerShortAddressDto)
  address: SerializerShortAddressDto;
}

export class SerializerShortLocationDto extends OmitType(SerializerLocationDto, [
  'createdAt',
  'deletedAt',
  'address'
] as const) {}
