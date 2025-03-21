import { Module } from '@nestjs/common';
import { SocialWorkEnrollmentService } from './social-work-enrollment.service';
import { SocialWorkEnrollment } from '../../domain/entities';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([SocialWorkEnrollment])],
  controllers: [],
  providers: [SocialWorkEnrollmentService]
})
export class SocialWorkEnrollmentModule {}
