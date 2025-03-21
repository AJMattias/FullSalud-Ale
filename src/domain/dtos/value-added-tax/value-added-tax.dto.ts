import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateValueAddedTaxDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({ example: 'General' })
  type: string;
}

export class UpdateValueAddedTaxDto extends PartialType(CreateValueAddedTaxDto) {}
