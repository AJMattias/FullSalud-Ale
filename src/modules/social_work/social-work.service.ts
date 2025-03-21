import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseService } from '../../common/bases/base.service';
import { CreateSocialWorkDto, UpdateSocialWorkDto } from '../../domain/dtos';
import { SocialWork } from '../../domain/entities';
import { Repository } from 'typeorm';
import { ErrorManager } from '../../common/exceptions/error.manager';

@Injectable()
export class SocialWorkService extends BaseService<
  SocialWork,
  CreateSocialWorkDto,
  UpdateSocialWorkDto
> {
  constructor(
    @InjectRepository(SocialWork) protected socialWorkRepository: Repository<SocialWork>
  ) {
    super(socialWorkRepository);
  }

  async createSocialWork(createSocialWorkDto: CreateSocialWorkDto) {
    try {
      const { name, phone, website } = createSocialWorkDto;

      const existingSocialWork = await this.socialWorkRepository.findOne({
        where: { name },
      });

      if (existingSocialWork) {
        throw new ErrorManager('Social Work with the same name already exists', 400);
      }

      const socialWork = this.socialWorkRepository.create({
        name,
        phone,
        website,
      });

      const savedSocialWork = await this.socialWorkRepository.save(socialWork);

      return savedSocialWork;
    } catch (error) {
      throw ErrorManager.createSignatureError((error as Error).message);
    }
  }

  async getAll(page: number = 1, limit: number = 10): Promise<{
    socialWorks: SocialWork[];
    total: number;
    page: number;
    limit: number;
    previousPage: number | null;
  }> {
    try {
      const [data, total] = await this.socialWorkRepository.findAndCount({
        where: { deletedAt: null },
        skip: (page - 1) * limit,
        take: limit,
      });

      return {
        socialWorks: data,
        total,
        page,
        limit,
        previousPage: page > 1 ? page - 1 : null,
      };
    } catch (error) {
      throw ErrorManager.createSignatureError((error as Error).message);
    }
  }

  async getOne(id: string): Promise<SocialWork> {
    try {
      const socialWork = await this.socialWorkRepository.findOne({
        where: { id },
      });

      if (!socialWork) {
        throw new NotFoundException(`Social Work with ID ${id} not found`);
      }

      return socialWork;
    } catch (error) {
      throw ErrorManager.createSignatureError((error as Error).message);
    }
  }

  async update(id: string, updateSocialWorkDto: UpdateSocialWorkDto): Promise<SocialWork> {
    try {
      const socialWork = await this.getOne(id);

      Object.assign(socialWork, updateSocialWorkDto);

      return await this.socialWorkRepository.save(socialWork);
    } catch (error) {
      throw ErrorManager.createSignatureError((error as Error).message);
    }
  }

  async softDelete(id: string): Promise<{ message: string }> {
    try {
      const socialWork = await this.getOne(id);

      await this.socialWorkRepository.softRemove(socialWork);

      return { message: 'Social Work soft deleted successfully' };
    } catch (error) {
      throw ErrorManager.createSignatureError((error as Error).message);
    }
  }

  async recover(id: string): Promise<{ message: string }> {
    try {
      const socialWork = await this.socialWorkRepository.findOne({
        where: { id },
        withDeleted: true,
      });

      if (!socialWork || !socialWork.deletedAt) {
        throw new NotFoundException(`Social Work with ID ${id} not found or not deleted`);
      }

      await this.socialWorkRepository.recover(socialWork);

      return { message: 'Social Work recovered successfully' };
    } catch (error) {
      throw ErrorManager.createSignatureError((error as Error).message);
    }
  }
}
