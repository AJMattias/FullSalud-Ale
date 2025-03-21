import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseService } from '../../common/bases/base.service';
import { PaginationDto } from '../../common/dtos/pagination-common.dto';
import { ErrorManager } from '../../common/exceptions/error.manager';
import {
  getPagingData,
  PaginationMetadata
} from '../../common/util/pagination-data.util';
import { CreateDepartmentDto, UpdateDepartmentDto } from '../../domain/dtos';
import { Department } from '../../domain/entities';
import { Repository } from 'typeorm';

@Injectable()
export class DepartmentService extends BaseService<
  Department,
  CreateDepartmentDto,
  UpdateDepartmentDto
> {
  constructor(
    @InjectRepository(Department) protected repository: Repository<Department>
  ) {
    super(repository);
  }

  // Método para obtener todas las localidades por provinceId con loadEagerRelations: false
  async findByProvince(
    provinceId: string,
    paginationDto: PaginationDto
  ): Promise<{ data: Department[]; meta: PaginationMetadata }> {
    try {
      const { page, limit } = paginationDto;
      const departments = await this.repository.find({
        where: { province: { id: provinceId } },
        skip: (page - 1) * limit,
        take: limit, // Filtra por provinceId y que no esté eliminada
        loadEagerRelations: false // Desactiva la carga de relaciones eager
      });
      if (!departments || departments.length === 0) {
        throw new ErrorManager(
          `Province with id ${provinceId} not found`,
          HttpStatus.NOT_FOUND
        );
      }
      const meta = getPagingData(departments, page, limit);
      return {
        data: departments,
        meta
      };
    } catch (error) {
      throw ErrorManager.createSignatureError((error as Error).message);
    }
  }
}
