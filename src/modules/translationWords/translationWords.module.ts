import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TranslationWord } from '../../models';
import { EntityWordsModule } from '../entityWords/entityWords.module';
import { WordsModule } from '../words/words.module';
import { TranslationWordsService } from './translationWords.service';

@Module({
  imports: [TypeOrmModule.forFeature([TranslationWord]), WordsModule],
  providers: [TranslationWordsService, EntityWordsModule],
  exports: [TranslationWordsService]
})
export class TranslationWordsModule {}
