import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import { ShortBaseDto } from '../../../common/dtos';
import { SerializerProvinceDto } from '..';
//asdasdas
export class SerializerDepartmentDto extends ShortBaseDto {
  @Expose()
  @ApiProperty({ example: 'Maipú' })
  name: string;

  @Expose()
  @Type(() => SerializerProvinceDto)
  province: SerializerProvinceDto;
}

export class SerializerShortDepartmentDto extends ShortBaseDto {
  @Expose()
  @ApiProperty({ example: 'Maipú' })
  name: string;
}
