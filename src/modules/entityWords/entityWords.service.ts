import _ = require('lodash');
import { ObjectLiteral, Repository } from 'typeorm';
import { WordsService } from '../words/words.service';

export class EntityWordsService<Entity extends ObjectLiteral> {

    constructor(
        private readonly repository: Repository<Entity>,
        private readonly wordsService: WordsService,
        private pointStructure: {}
    ) {

    }

    /**
     * Get the keywords of an entity to save them in the database
     * 
     * @param entityObject entity object to which you want to obtain the keywords
     * @param idUser user making the request
     */
    protected async saveEntityWords(entityObject: any, id: {}, idUser: number) {

        const entityWords = this.getEntityWordsWithPoints(entityObject);

        const uniqWords = entityWords.map((word) => word.word);
        await this.wordsService.saveWords(uniqWords, idUser);
        await this.saveEntityWordsInDatabase(id, entityWords, idUser);
    }


    /**
     * Given a entity object, get the words with the calculated points (used in searches)
     * 
     * @param entity entity object to analyse
     */
    private getEntityWordsWithPoints(entity: any): any[] {
        const textFields = Object.keys(this.pointStructure);
        let wordsWithPoints = [];

        textFields.forEach(field => {
            wordsWithPoints = wordsWithPoints.concat(
                                this.getWordsWithPoints(
                                    this.getFieldWords(entity[field]), 
                                    this.pointStructure[field]
                                )
                            );
        });

        return this.sumFieldsPoint(wordsWithPoints);
    }

    /**
     * Given a entity field, get its words in an array
     * 
     * @param field field to get words
     */
    private getFieldWords(field: any): string[] {
        if (!field) {
            return [];
        }

        if (typeof(field) === 'string') {
            return this.wordsService.getWords(field);
        }

        if (typeof(field) === 'object') {
            if (field['tags']) {
                return this.getObjectWords(field['tags']);
            }
                
            return this.getObjectWords(field);
        }

        return [];
    }

    /**
     * Given an object, get its words in an array
     * 
     * @param object object to get words
     */
    private getObjectWords(object: any): string[] {
        let words = [];

        object.forEach(element => {
            words = words.concat(this.getFieldWords(element));
        });

        return words;
    }


    /**
     * Given an array of words, and the points that the array is worth in total. 
     * Get the points that each word is worth
     * 
     * @param words array of words
     * @param totalPoints Points assigned to the word array
     */
    private getWordsWithPoints(words: string[], totalPoints: number) {
        const uniqWords = _.uniq(words);
        const pointsByWord = totalPoints / uniqWords.length;
        const wordsWithPoints = [];

        uniqWords.forEach(element => {
            wordsWithPoints.push({word: element, points: pointsByWord});
        });
        
        return wordsWithPoints;
    }


    /**
     * Save entity words in database
     * 
     * @param id entity id
     * @param words words assigned to entity
     * @param idUser user making the request
     */
    private async saveEntityWordsInDatabase(id: {}, words: any[], idUser: number) {
        await this.repository.delete(id);

        words.forEach(async (wordObject) => {
            const row = {
                ...id,
                ...wordObject,
                creationUser: idUser
            };

            if (wordObject.word !== '') {
                await this.repository.save(row).catch();
            }
        });
    }

    /**
     * Function to add the points of repeated words
     * 
     * @param wordsWithPoints Array of words with points already assigned
     */
    private sumFieldsPoint(wordsWithPoints: any[]): any[] {
        const length = wordsWithPoints.length;
        const uniqWords = [];

        for (let i = 0; i < length; i++) {
            let points = wordsWithPoints[i].points;
            const word = wordsWithPoints[i].word;

            if (!uniqWords.some((e) => e.word === word)) {

                for (let j = i + 1; j < length; j++) {
                    if (word === wordsWithPoints[j].word) {
                        points += wordsWithPoints[j].points;
                    }
                }

                uniqWords.push({word, points});
            }            
        }

        return uniqWords;
    }
}
