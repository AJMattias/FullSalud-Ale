import { Expose, Type } from 'class-transformer';
import { ShortBaseDto } from '../../../common/dtos';
import { SerializerCountryDto } from '..';
import { ApiProperty } from '@nestjs/swagger';

export class SerializerProvinceDto extends ShortBaseDto {
  @Expose()
  @ApiProperty({ example: 'Mendoza' })
  name: string;

  @Expose()
  @Type(() => SerializerCountryDto)
  country: SerializerCountryDto;
}

export class SerializerShortProvinceDto extends ShortBaseDto {
  @Expose()
  @ApiProperty({ example: 'Mendoza' })
  name: string;
}
