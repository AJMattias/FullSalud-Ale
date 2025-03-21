import { Controller } from '@nestjs/common';
import { CategoryService } from './category.service';
import { ControllerFactory } from '../../common/factories/controller.factory';
import { Category } from '../../domain/entities';
import { CreateCategoryDto, SerializerCategoryDto, UpdateCategoryDto } from '../../domain/dtos';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Category')
@Controller('category')
export class CategoryController extends ControllerFactory<
  Category,
  CreateCategoryDto,
  UpdateCategoryDto,
  SerializerCategoryDto
>(Category, CreateCategoryDto, UpdateCategoryDto, SerializerCategoryDto) {
  constructor(private readonly service: CategoryService) {
    super();
  }
}
