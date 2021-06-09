import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import _ = require('lodash');
import { Repository } from 'typeorm';
import { CategoryWord } from '../../models';
import { EntityWordsService } from '../entityWords/entityWords.service';
import { WordsService } from '../words/words.service';

@Injectable()
export class CategoryWordsService extends EntityWordsService<CategoryWord> {

    constructor(
        @InjectRepository(CategoryWord)
        private readonly categoryWordRepository: Repository<CategoryWord>,
        _wordsService: WordsService,
    ) {
        super(  categoryWordRepository, 
                _wordsService, 
                {
                    name: 80,
                    description: 20
                }
            );
    }

    /**
     * Save words related to a specific category 
     * 
     * @param category category to save its words
     * @param idUser user id that makes the request 
     */
    async saveCategoryWords(category: any, idUser: number) {
        const id = {idCategory: category.id};

        await this.saveEntityWords(category, id , idUser);
    }
}
