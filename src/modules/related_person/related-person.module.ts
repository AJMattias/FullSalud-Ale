import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RelatedPerson } from '../../domain/entities/related-person.entity';
import { RelatedPersonService } from './related-person.service';
import { RelatedPersonController } from './related-person.controller';

@Module({
  imports: [TypeOrmModule.forFeature([RelatedPerson])],
  controllers: [RelatedPersonController],
  providers: [RelatedPersonService]
})
export class RelatedPersonModule {}
