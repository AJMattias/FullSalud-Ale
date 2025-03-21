import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseService } from '../../common/bases/base.service';
import { PaginationDto } from '../../common/dtos/pagination-common.dto';
import { ErrorManager } from '../../common/exceptions/error.manager';
import {
  getPagingData,
  PaginationMetadata
} from '../../common/util/pagination-data.util';
import { CreateLocalityDto, UpdateLocalityDto } from '../../domain/dtos';
import { Locality } from '../../domain/entities';
import { Repository } from 'typeorm';

@Injectable()
export class LocalityService extends BaseService<
  Locality,
  CreateLocalityDto,
  UpdateLocalityDto
> {
  constructor(
    @InjectRepository(Locality) protected repository: Repository<Locality>
  ) {
    super(repository);
  }

  // Método para obtener todas las localidades por provinceId con loadEagerRelations: false
  async findByDepartment(
    departmentId: string,
    paginationDto: PaginationDto
  ): Promise<{ data: Locality[]; meta: PaginationMetadata }> {
    try {
      const { page, limit } = paginationDto;

      // Usamos el método find en vez de findAndCount
      const localities = await this.repository.find({
        where: { department: { id: departmentId } }, // Filtrar por departmentId y no eliminadas
        skip: (page - 1) * limit,
        take: limit, // Limitar la cantidad de resultados por página
        loadEagerRelations: false // Desactivar carga de relaciones eager
      });

      if (!localities || localities.length === 0) {
        throw new ErrorManager(
          `Department with id ${departmentId} not found`,
          HttpStatus.NOT_FOUND
        );
      }

      // Calcular los metadatos usando getPagingData
      const meta = getPagingData(localities, page, limit);

      return {
        data: localities,
        meta // Devolver los metadatos calculados
      };
    } catch (error) {
      throw ErrorManager.createSignatureError((error as Error).message);
    }
  }
}
