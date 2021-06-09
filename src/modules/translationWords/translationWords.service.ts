import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import _ = require('lodash');
import { Repository } from 'typeorm';
import { TranslationWord } from '../../models';
import { EntityWordsService } from '../entityWords/entityWords.service';
import { WordsService } from '../words/words.service';

@Injectable()
export class TranslationWordsService extends EntityWordsService<TranslationWord> {

    constructor(
        @InjectRepository(TranslationWord)
        private readonly translationWordRepository: Repository<TranslationWord>,
        _wordsService: WordsService,
    ) {
        super(  translationWordRepository, 
                _wordsService, 
                {
                    langText: 100,
                }
            );
    }
    
    /**
     * Get the keywords of a translation to save them in the database
     * 
     * @param translation translation to which you want to obtain the keywords
     * @param idUser user making the request
     */
    async saveTranslationWords(translation: any, idUser: number) {
        const id = {idTranslation: translation.id};

        await this.saveEntityWords(translation, id , idUser);
    }
}
