import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateCategoryDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({ example: 'Salud Mental' })
  name: string;
}

export class UpdateCategoryDto extends PartialType(CreateCategoryDto) {}
