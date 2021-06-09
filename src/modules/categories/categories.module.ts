import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Category } from '../../models';
import { CategoryWordsModule } from '../categoryWords/categoryWords.module';
import { TranslationsModule } from '../translations/translations.module';
import { WordsModule } from '../words/words.module';
import { CategoriesController } from './categories.controller';
import { CategoriesService } from './categories.service';

@Module({
    imports: [TypeOrmModule.forFeature([Category]), TranslationsModule, CategoryWordsModule, WordsModule],
    providers: [CategoriesService],
    controllers: [CategoriesController],
    exports: [CategoriesService]
})
export class CategoriesModule {}
