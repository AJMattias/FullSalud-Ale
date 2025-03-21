import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { ShortBaseDto } from '../../../common/dtos';

export class SerializerRelatedPersonDto extends ShortBaseDto {
  @Expose()
  @ApiProperty({ example: 'Hijo' })
  relation: string;
}
