import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateRelatedPersonDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({ example: 'Hijo' })
  relation: string;
}

export class UpdateRelatedPersonDto extends PartialType(CreateRelatedPersonDto) {}
