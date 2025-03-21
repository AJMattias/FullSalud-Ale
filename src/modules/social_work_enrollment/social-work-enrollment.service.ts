import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseService } from '../../common/bases/base.service';
import {
  CreateSocialWorkEnrollmentDto,
  UpdateSocialWorkEnrollmentDto
} from '../../domain/dtos';
import { SocialWorkEnrollment } from '../../domain/entities';
import { Repository } from 'typeorm';

@Injectable()
export class SocialWorkEnrollmentService extends BaseService<
  SocialWorkEnrollment,
  CreateSocialWorkEnrollmentDto,
  UpdateSocialWorkEnrollmentDto
> {
  constructor(
    @InjectRepository(SocialWorkEnrollment)
    protected repository: Repository<SocialWorkEnrollment>
  ) {
    super(repository);
  }
}
