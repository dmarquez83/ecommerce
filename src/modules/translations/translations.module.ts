import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Translation} from '../../models';
import { TranslationWordsModule } from '../translationWords/translationWords.module';
import { TranslationsService } from './translations.service';

@Module({
    imports: [TypeOrmModule.forFeature([Translation]), TranslationWordsModule],
    providers: [TranslationsService],
    exports: [TranslationsService]
})
export class TranslationsModule {}
