import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LevenshteinWord, Word } from '../../models'
import { WordsService } from './words.service';

@Module({
  imports: [TypeOrmModule.forFeature([LevenshteinWord, Word])],
  providers: [WordsService],
  exports: [WordsService]
})
export class WordsModule {}
