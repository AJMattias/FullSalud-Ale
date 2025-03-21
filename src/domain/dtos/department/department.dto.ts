import { ApiProperty, PartialType } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNotEmpty, IsString, ValidateNested } from 'class-validator';
import { ShortBaseDto } from '../../../common/dtos';

export class CreateDepartmentDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({ example: 'Maipú' })
  name: string;

  @IsNotEmpty()
  @ValidateNested()
  @Type(() => ShortBaseDto)
  province: ShortBaseDto;
}

export class UpdateDepartmentDto extends PartialType(CreateDepartmentDto) {}
