import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { FullBaseDto, ShortBaseDto } from '../../../common/dtos';

export class SerializerPracticeDto extends FullBaseDto {
  @Expose()
  @ApiProperty({ example: 'Consulta médica' })
  name: string;
}

export class SerializerShortPracticeDto extends ShortBaseDto {
  @Expose()
  @ApiProperty({ example: 'Consulta médica' })
  name: string;
}
