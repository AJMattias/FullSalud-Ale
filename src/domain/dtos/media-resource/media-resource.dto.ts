import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsUrl } from 'class-validator';

export class CreateImageBaseDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({ example: 'image1.jpg' })
  name: string;

  @IsNotEmpty()
  @IsUrl()
  @ApiProperty({
    example:
      'https://res.cloudinary.com/<cloud_name>/<asset_type>/<delivery_type>/<transformations>/<version>/<public_id>.<extension>'
  })
  url: string;
}

export class UpdateImageBaseDto extends PartialType(CreateImageBaseDto) {}
