import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateCountryDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({ example: 'Argentina' })
  name: string;
}

export class UpdateCountryDto extends PartialType(CreateCountryDto) {}
