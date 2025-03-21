import { Module } from '@nestjs/common';
import { SocialWorkService } from './social-work.service';
import { SocialWorkController } from './social-work.controller';
import { SocialWork } from '../../domain/entities';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([SocialWork])],
  controllers: [SocialWorkController],
  providers: [SocialWorkService],
  exports: [SocialWorkService],
})
export class SocialWorkModule {}
