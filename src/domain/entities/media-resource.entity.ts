import { ApiProperty } from '@nestjs/swagger';
import { Base } from '../../common/bases/base.entity';
import { Column } from 'typeorm';

//Esta entidad anteriormente se denominaba ImageBase
export abstract class MediaResource extends Base {
  @Column({
    type: 'varchar'
  })
  @ApiProperty({ example: 'image1' })
  name: string;

  @Column({
    type: 'varchar'
  })
  @ApiProperty({
    examples: [
      'https://res.cloudinary.com/<cloud_name>/<asset_type>/<delivery_type>/<transformations>/<version>/<public_id>.<extension>',
      'https://<bucket_name>.s3.<region>.amazonaws.com/<prefix>/<uuid>'
    ]
  })
  url: string;

  @Column({
    type: 'varchar',
    nullable: true
  })
  @ApiProperty({ example: 'image_one' })
  public_id: string;
}
