import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { FullBaseDto, ShortBaseDto } from '../../../common/dtos';

export class SerializerSocialWorkDto extends FullBaseDto {
  @Expose()
  @ApiProperty({ example: 'OSEP' })
  name: string;

  @Expose()
  @ApiProperty({ example: '2564859874' })
  phone: string;

  @Expose()
  @ApiProperty({ example: 'https://osepmendoza.com.ar/web/' })
  website: string;
}

export class SerializerShortSocialWorkDto extends ShortBaseDto {
  @Expose()
  @ApiProperty({ example: 'OSEP' })
  name: string;
}
