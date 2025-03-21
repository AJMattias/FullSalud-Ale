import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseService } from '../../common/bases/base.service';
import { ErrorManager } from '../../common/exceptions/error.manager';
import { CreateLocationDto, UpdateOfficeDto } from '../../domain/dtos';
import { Location } from '../../domain/entities';
import { Repository } from 'typeorm';

@Injectable()
export class LocationService extends BaseService<
  Location,
  CreateLocationDto,
  UpdateOfficeDto
> {
  constructor(
    @InjectRepository(Location) protected officeRepository: Repository<Location>
  ) {
    super(officeRepository);
  }

  async createOffice(createOfficeDto: CreateLocationDto): Promise<Location> {
    try {
      const { name, phone, address, ...data } = createOfficeDto;
      
      const existingOffice = await this.officeRepository.findOne({
        where: [{ phone }],
      });

      if (existingOffice) {
        throw new ErrorManager(
          'Office with provided phone already exists',
          400,
        );
      }

      const newOffice = this.officeRepository.create({
        ...data,
        name,
        phone,
        address,
      });

      return await this.officeRepository.save(newOffice);
    } catch (error) {
      throw ErrorManager.createSignatureError((error as Error).message);
    }
  }

  async getAll(page: number = 1, limit: number = 10): Promise<{ offices: Location[]; total: number; page: number; limit: number; previousPage: number | null; }> {
    try {
      const [data, total] = await this.officeRepository.findAndCount({
        where: { deletedAt: null },
        skip: (page - 1) * limit,
        take: limit,
      });

      return { 
        offices: data, 
        total, 
        page, 
        limit,
        previousPage: page > 1 ? page - 1 : null,
      };
    } catch (error) {
      throw ErrorManager.createSignatureError((error as Error).message);
    }
  }

  async getOne(id: string): Promise<Location> {
    try {
      const office = await this.officeRepository.findOne({
        where: { id },
        relations: ['address', 'practitioners']
      });

      if (!office) {
        throw new NotFoundException(`Office with ID ${id} not found`);
      }

      return office;
    } catch (error) {
      throw ErrorManager.createSignatureError((error as Error).message);
    }
  }

  async update(id: string, updateOfficeDto: UpdateOfficeDto): Promise<Location> {
    try {
      const office = await this.getOne(id);

      if (!office) {
        throw new NotFoundException(`Office with ID ${id} not found`);
      }

      Object.assign(office, updateOfficeDto);
      return await this.officeRepository.save(office);
    } catch (error) {
      throw ErrorManager.createSignatureError((error as Error).message);
    }
  }

  async softDelete(id: string): Promise<{ message: string }> {
    try {
      const office = await this.getOne(id);
      
      if (!office) {
        throw new NotFoundException(`Office with ID ${id} not found`);
      }

      await this.officeRepository.softRemove(office);
      return { message: 'Office soft deleted successfully' };
    } catch (error) {
      throw ErrorManager.createSignatureError((error as Error).message);
    }
  }

  async recover(id: string): Promise<{ message: string }> {
    try {
      const office = await this.officeRepository.findOne({
        where: { id },
        withDeleted: true,
      });

      if (!office || !office.deletedAt) {
        throw new NotFoundException(`Office with ID ${id} not found or not deleted`);
      }

      await this.officeRepository.recover(office);
      return { message: 'Office recovered successfully' };
    } catch (error) {
      throw ErrorManager.createSignatureError((error as Error).message);
    }
  }

}
