import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { FullBaseDto, ShortBaseDto } from '../../../common/dtos';

export class SerializerCategoryDto extends FullBaseDto {
  @Expose()
  @ApiProperty({ example: 'Salud Mental' })
  name: string;
}

export class SerializerShortCategoryDto extends ShortBaseDto {
  @Expose()
  @ApiProperty({ example: 'Salud Mental' })
  name: string;
}
