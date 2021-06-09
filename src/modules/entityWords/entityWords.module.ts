import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductWord } from '../../models';
import { WordsModule } from '../words/words.module';
import { EntityWordsService } from './entityWords.service';

@Module({
  imports: [TypeOrmModule.forFeature([ProductWord]), WordsModule],
  providers: [EntityWordsService],
  exports: [EntityWordsService]
})
export class EntityWordsModule {}
