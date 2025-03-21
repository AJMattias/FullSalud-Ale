import { ApiProperty, PartialType } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNotEmpty, IsString, ValidateNested } from 'class-validator';
import { ShortBaseDto } from '../../../common/dtos';

export class CreateLocalityDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({ example: 'Villa Nueva' })
  name: string;

  //recibe el id de una provincia ya creada
  @IsNotEmpty()
  @ValidateNested()
  @Type(() => ShortBaseDto)
  department: ShortBaseDto;
}

export class UpdateLocalityDto extends PartialType(CreateLocalityDto) {}
