import { ApiHideProperty, ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';
import { ShortBaseDto } from '../../../common/dtos';

export class SerializerShortMediaResourceDto extends ShortBaseDto {
  @Exclude()
  @ApiHideProperty()
  name: string;

  @Expose()
  @ApiProperty({
    example:
      'https://res.cloudinary.com/<cloud_name>/<asset_type>/<delivery_type>/<transformations>/<version>/<public_id>.<extension>'
  })
  url: string;
}

export class SerializerMediaResourceDto extends ShortBaseDto {
  @Expose()
  @ApiProperty({ example: 'image1.jpg' })
  name: string;

  @Expose()
  @ApiProperty({
    example:
      'https://res.cloudinary.com/<cloud_name>/<asset_type>/<delivery_type>/<transformations>/<version>/<public_id>.<extension>'
  })
  url: string;

  @Expose()
  @ApiProperty({ example: '50436717-8608-4bff-bf41-373f14a8b888' })
  public_id: string;
}
