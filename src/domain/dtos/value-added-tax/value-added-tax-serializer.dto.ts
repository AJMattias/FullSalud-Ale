import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { ShortBaseDto } from '../../../common/dtos';

export class SerializerValueAddedTaxDto extends ShortBaseDto {
  @Expose()
  @ApiProperty({ example: 'General' })
  type: string;
}
