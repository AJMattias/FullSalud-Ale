import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { ShortBaseDto } from '../../../common/dtos';

export class SerializerCountryDto extends ShortBaseDto {
  @Expose()
  @ApiProperty({ example: 'Argentina' })
  name: string;
}
