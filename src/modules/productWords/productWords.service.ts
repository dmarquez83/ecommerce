import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import _ = require('lodash');
import { Repository } from 'typeorm';
import { ProductWord } from '../../models';
import { EntityWordsService } from '../entityWords/entityWords.service';
import { WordsService } from '../words/words.service';

@Injectable()
export class ProductWordsService extends EntityWordsService<ProductWord> {

    constructor(
        @InjectRepository(ProductWord)
        private readonly productWordRepository: Repository<ProductWord>,
        _wordsService: WordsService,
    ) {
        super(  productWordRepository, 
                _wordsService, 
                {
                    name: 60,
                    tags: 15,
                    brand: 5,
                    description: 10,
                    images: 10
                }
            );
    }
    
    /**
     * Get the keywords of a product to save them in the database
     * 
     * @param product product to which you want to obtain the keywords
     * @param idUser user making the request
     */
    async saveProductWords(product: any, idUser: number) {
        const id = {idProduct: product.id};

        await this.saveEntityWords(product, id , idUser);
    }
}
