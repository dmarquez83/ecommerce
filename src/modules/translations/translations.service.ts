import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import _ = require('lodash');
import { Repository } from 'typeorm';
import { BasicService } from '../../common/services/base.service';
import { Translation } from '../../models';
import { TranslationWordsService } from '../translationWords/translationWords.service';


@Injectable()
export class TranslationsService extends BasicService<Translation> {

    constructor(
        @InjectRepository(Translation)
        private readonly translationRepository: Repository<Translation>,
        private readonly translationWordsService: TranslationWordsService,

    ) {
        super(translationRepository);
    }

    /**
     * Function to get translations of a specific language
     * 
     * @param sentences sentences to be translated
     * @param lang language to get translation
     */
    async getTranslations(sentences: string[], lang: string): Promise<Translation[]> {
        let queryBuilder = this.createQueryBuilder('t')
                            .where('t.lang = :lang', {lang});
        if (sentences.length) {
            queryBuilder = queryBuilder.andWhere('t.en_text iLike any(:sentences)', {sentences});
        }
        
        return await queryBuilder.getMany();
    }

    async analyzeTranslationWords() {
        const translations = await this.translationRepository.find();

        for await (const translation of translations) {
            await this.translationWordsService.saveTranslationWords(translation, 1);
        }
    }
}
