import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PublicationPack } from './entities/publication-pack.entity';

@Module({
  imports: [TypeOrmModule.forFeature([PublicationPack])],
})
export class PacksModule {}