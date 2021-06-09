import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductWord } from '../../models';
import { EntityWordsModule } from '../entityWords/entityWords.module';
import { WordsModule } from '../words/words.module';
import { ProductWordsService } from './productWords.service';

@Module({
  imports: [TypeOrmModule.forFeature([ProductWord]), WordsModule],
  providers: [ProductWordsService, EntityWordsModule],
  exports: [ProductWordsService]
})
export class ProductWordsModule {}
