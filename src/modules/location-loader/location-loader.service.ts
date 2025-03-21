import { Injectable, OnModuleInit } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Country, Locality, Province, Department } from '../../domain/entities';
import { firstValueFrom } from 'rxjs';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class LocationLoaderService implements OnModuleInit {
  constructor(
    private readonly httpService: HttpService,
    @InjectRepository(Country)
    private readonly countryRepository: Repository<Country>,
    @InjectRepository(Province)
    private readonly provinceRepository: Repository<Province>,
    @InjectRepository(Department)
    private readonly departmentRepository: Repository<Department>,
    @InjectRepository(Locality)
    private readonly localityRepository: Repository<Locality>
  ) {}

  // Ejecutar el método automáticamente al iniciar el módulo
  async onModuleInit() {
    await this.fetchAndSaveData();
  }

  async fetchAndSaveData(): Promise<void> {
    // Solicitud a la url para obtener los datos del JSON de departamentos
    const responseDepartments = await firstValueFrom(
      this.httpService.get(
        'https://infra.datos.gob.ar/georef/departamentos.json'
      )
    );
    const departamentos = responseDepartments.data.departamentos;

    // Obtener o crear el país
    let country = await this.countryRepository.findOne({
      where: { name: 'Argentina' }
    });
    if (!country) {
      country = this.countryRepository.create({
        id: uuidv4(),
        name: 'Argentina'
      });
      await this.countryRepository.save(country);
    }

    // Iterar cada departamento en los datos
    for (const departamento of departamentos) {
      const provinciaData = departamento.provincia;
      let province = await this.provinceRepository.findOne({
        where: { name: provinciaData.nombre }
      });
      // Crear la provincia asociada al departamento si no existe
      if (!province) {
        province = this.provinceRepository.create({
          id: uuidv4(),
          name: provinciaData.nombre,
          country
        });
        await this.provinceRepository.save(province);
      }

      // Verificar si el departamento ya existe usando su ID único del JSON
      let department = await this.departmentRepository.findOne({
        where: {
          name: departamento.nombre,
          province: { name: provinciaData.nombre }
        }
      });

      if (!department) {
        department = this.departmentRepository.create({
          id: uuidv4(), // Generar un nuevo UUID
          name: departamento.nombre,
          province
        });
        await this.departmentRepository.save(department);
      }
    }

    // Solicitud a la url para obtener los datos del JSON de localidades
    const responseLocalities = await firstValueFrom(
      this.httpService.get('https://infra.datos.gob.ar/georef/localidades.json')
    );
    const localidades = responseLocalities.data.localidades;

    // Procesar localidades
    for (const localidad of localidades) {
      const departamentoData = localidad.departamento;
      const department = await this.departmentRepository.findOne({
        where: {
          name: departamentoData.nombre,
          province: { name: localidad.provincia.nombre }
        }
      });

      if (department) {
        // Buscar localidad por nombre y departamento
        let locality = await this.localityRepository.findOne({
          where: {
            name: localidad.nombre,
            department: { id: department.id }
          }
        });

        if (!locality) {
          locality = this.localityRepository.create({
            id: uuidv4(),
            name: localidad.nombre,
            department
          });
          await this.localityRepository.save(locality);
        } else {
          // Actualizar la localidad existente si es necesario
          locality.name = localidad.nombre;
          await this.localityRepository.save(locality);
        }
      }
    }
  }
}
