import { ApiProperty, PartialType } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNotEmpty, IsString, ValidateNested } from 'class-validator';
import { ShortBaseDto } from '../../../common/dtos';

export class CreateProvinceDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({ example: 'Mendoza' })
  name: string;

  //recibe el id de un país ya creado
  @IsNotEmpty()
  @ValidateNested()
  @Type(() => ShortBaseDto)
  country: ShortBaseDto;
}

export class UpdateProvinceDto extends PartialType(CreateProvinceDto) {}
