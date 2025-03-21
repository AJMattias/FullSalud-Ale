import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateProfessionalDegreeDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({ example: 'Doctor' })
  degree: string;
}

export class UpdateProfessionalDegreeDto extends PartialType(CreateProfessionalDegreeDto) {}
