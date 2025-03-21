import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateOrganizationTypeDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({ example: 'Diagnostico por imagenes' })
  type: string;
}
export class UpdateOrganizationTypeDto extends PartialType(
  CreateOrganizationTypeDto
) {}
