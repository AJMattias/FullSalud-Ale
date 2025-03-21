import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateDiagnosticDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({ example: 'Asma' })
  name: string;
}

export class UpdateDiagnosticDto extends PartialType(CreateDiagnosticDto) {}
