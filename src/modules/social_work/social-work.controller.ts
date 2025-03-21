import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { SocialWorkService } from './social-work.service';
import { ControllerFactory } from '../../common/factories/controller.factory';
import { SocialWork } from '../../domain/entities';
import { CreateSocialWorkDto, SerializerSocialWorkDto, UpdateSocialWorkDto } from '../../domain/dtos';
import { ApiCreatedResponse, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { toDto } from '../../common/util/transform-dto.util';

@ApiTags('Social Work')
@Controller('social-work')
export class SocialWorkController extends ControllerFactory<
  SocialWork,
  CreateSocialWorkDto,
  UpdateSocialWorkDto,
  SerializerSocialWorkDto
>(
  SocialWork,
  CreateSocialWorkDto,
  UpdateSocialWorkDto,
  SerializerSocialWorkDto
) {
  constructor(protected readonly socialWorkService: SocialWorkService) {
    super();
  }

  @Post()
  @ApiOperation({ description: 'Crear una Obra Social' })
  @ApiCreatedResponse({
    description: 'Obra Social creada exitosamente',
    type: SerializerSocialWorkDto,
  })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  async createSocialWork(@Body() createSocialWorkDto: CreateSocialWorkDto) {
    return await this.socialWorkService.createSocialWork(createSocialWorkDto);
  }

  @Get()
  async getAll(
    @Query('page') page: string = '1',
    @Query('limit') limit: string = '10',
  ): Promise<{ total: number; page: number; limit: number; socialWorks: SerializerSocialWorkDto[] }> {
    const pageNumber = Number(page);
    const limitNumber = Number(limit);
    const { socialWorks, total } = await this.socialWorkService.getAll(pageNumber, limitNumber);
    return {
      socialWorks: socialWorks.map((socialWork) => toDto(SerializerSocialWorkDto, socialWork)),
      total,
      page: pageNumber,
      limit: limitNumber,
    };
  }

  @Get(':id')
  async getOneSocialWork(@Param('id') id: string) {
    return await this.socialWorkService.getOne(id);
  }

  @Patch(':id')
  async updateSocialWork(
    @Param('id') id: string,
    @Body() updateSocialWorkDto: UpdateSocialWorkDto,
  ) {
    return await this.socialWorkService.update(id, updateSocialWorkDto);
  }

  @Delete(':id')
  async softDelete(@Param('id') id: string) {
    return await this.socialWorkService.softDelete(id);
  }

  @Post('/recover/:id')
  async recover(@Param('id') id: string) {
    return await this.socialWorkService.recover(id);
  }
}