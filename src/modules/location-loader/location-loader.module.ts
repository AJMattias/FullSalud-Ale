import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LocationLoaderService } from './location-loader.service';
import { Department, Country, Province, Locality } from '../../domain/entities';

@Module({
  imports: [
    HttpModule,
    TypeOrmModule.forFeature([Country, Province, Locality, Department])
  ],
  providers: [LocationLoaderService]
})
export class LocationLoaderModule {}
