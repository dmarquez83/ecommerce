import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CategoryWord, ProductWord } from '../../models';
import { EntityWordsModule } from '../entityWords/entityWords.module';
import { WordsModule } from '../words/words.module';
import { CategoryWordsService } from './categoryWords.service';

@Module({
  imports: [TypeOrmModule.forFeature([CategoryWord]), WordsModule],
  providers: [CategoryWordsService, EntityWordsModule],
  exports: [CategoryWordsService]
})
export class CategoryWordsModule {}
