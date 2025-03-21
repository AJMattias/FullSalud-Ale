import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { ShortBaseDto } from '../../../common/dtos';

export class SerializerInstitutionTypeDto extends ShortBaseDto {
  @Expose()
  @ApiProperty({ example: 'Diagnostico por imagenes' })
  type: string;
}
