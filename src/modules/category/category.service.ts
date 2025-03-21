import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseService } from '../../common/bases/base.service';
import { CreateCategoryDto, UpdateCategoryDto } from '../../domain/dtos';
import { Category } from '../../domain/entities';
import { Repository } from 'typeorm';

@Injectable()
export class CategoryService extends BaseService<Category, CreateCategoryDto, UpdateCategoryDto> {
  constructor(
    @InjectRepository(Category)
    protected repository: Repository<Category>
  ) {
    super(repository);
  }
}
