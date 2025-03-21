import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseService } from '../../common/bases/base.service';
import { PaginationDto } from '../../common/dtos/pagination-common.dto';
import { ErrorManager } from '../../common/exceptions/error.manager';
import {
  getPagingData,
  PaginationMetadata
} from '../../common/util/pagination-data.util';
import { CreateProvinceDto, UpdateProvinceDto } from '../../domain/dtos';
import { Province } from '../../domain/entities';
import { Repository } from 'typeorm';

@Injectable()
export class ProvinceService extends BaseService<
  Province,
  CreateProvinceDto,
  UpdateProvinceDto
> {
  constructor(
    @InjectRepository(Province) protected repository: Repository<Province>
  ) {
    super(repository);
  }

  async findByCountry(
    countryId: string,
    paginationDto: PaginationDto
  ): Promise<{ data: Province[]; meta: PaginationMetadata }> {
    try {
      const { page, limit } = paginationDto;

      // Usar el método find en vez de findAndCount
      const provinces = await this.repository.find({
        where: { country: { id: countryId } },
        skip: (page - 1) * limit,
        take: limit,
        loadEagerRelations: false
      });

      // Verificar si no se encontraron provincias
      if (!provinces || provinces.length === 0) {
        throw new ErrorManager(
          `Country with id ${countryId} not found`,
          HttpStatus.NOT_FOUND
        );
      }

      // Usar la función getPagingData para calcular los metadatos de paginación
      const meta = getPagingData(provinces, page, limit);

      return {
        data: provinces,
        meta // Devolver la metadata calculada por getPagingData
      };
    } catch (error) {
      throw ErrorManager.createSignatureError((error as Error).message);
    }
  }
}
