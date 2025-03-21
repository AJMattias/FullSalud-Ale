import { ApiHideProperty, ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose, Type } from 'class-transformer';
import { FullBaseDto } from '../../../common/dtos';
import { SerializerLocalityDto } from '../locality/locality-serializer.dto';

export class SerializerAddressDto extends FullBaseDto {
  @Expose()
  @ApiProperty({ example: 'San Martín' })
  street: string;

  @Expose()
  @ApiProperty({ example: 1023 })
  num?: number;

  @Expose()
  @ApiProperty({ example: '3' })
  floor?: string;

  @Expose()
  @ApiProperty({ example: '5507' })
  zipCode: string;

  @Expose()
  @ApiProperty({ example: 'Depto 5' })
  observation: string;

  @Expose()
  @ApiProperty({ example: '69' })
  latitude?: string;

  @Expose()
  @ApiProperty({ example: '96' })
  longitude?: string;

  @Expose()
  @Type(() => SerializerLocalityDto)
  locality: SerializerLocalityDto;
}

export class SerializerShortAddressDto extends SerializerAddressDto {
  @Exclude()
  @ApiHideProperty()
  deletedAt!: string;

  @Exclude()
  @ApiHideProperty()
  createdAt!: string;
}
