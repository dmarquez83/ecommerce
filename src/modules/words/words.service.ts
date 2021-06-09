import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import _ = require('lodash');
import { In, Repository } from 'typeorm';
import { LevenshteinWord, Word } from '../../models';
const lDistance = require('fastest-levenshtein').distance;

@Injectable()
export class WordsService {

    private forbiddenWords = ['y', 'el', 'la', 'lo', 'de', 'del', 'para', 'and'];
    private levenshteinTolerance = 3;

    constructor(
        @InjectRepository(Word)
        private readonly wordRepository: Repository<Word>,
        @InjectRepository(LevenshteinWord)
        private readonly levenshteinWordRepository: Repository<LevenshteinWord>,
    ) {
    }

    /**
     * Analyze a set of words in order to find words that match each other in order to optimize searches
     * 
     * @param words words to analyze
     * @param idUser user making the request
     */
    async analyzeWords(words: string[], idUser: number) {
        const wordsByLength = _.groupBy(words, 'length');
        let lWords = [];

        for (const length of Object.keys(wordsByLength)) {
            const possiblesLW = await this.findPossibleLevenshteinWords(+length);
            
            for await (const newWord of wordsByLength[length]) {
                const newLWords = await this.getLevenshteinWords(newWord, possiblesLW);

                if (newLWords) {
                    lWords = lWords.concat(newLWords);
                }
            }
        }

        await this.saveLevenshteinWords(this.getDifferentLevenshteinWords(lWords), idUser);
        await this.wordRepository.createQueryBuilder().update()
                .set({levenshtein: true})
                .where(`word = any(:words)`, {words})
                .execute();
    }

    /**
     * Word to remove the accents and put it in lowercase
     * 
     * @param word word to convert
     */
    convertWord(word: string): string {
        word = word.toLowerCase().trim();
        const letters = {
            á: 'a',
            é: 'e',
            í: 'i',
            ó: 'o',
            ú: 'u',
            ü: 'u'
        };
        
        let newWord = '';
        const length = word.length;

        for (let i = 0; i < length; i++) {
            let letter = word[i];

            if ((i === (length - 1) || i === 0) && this.isForbiddenCharter(word[i])) {
                letter = '';
            } else {
                const findLetter = _.find(letters, (value, i) => i === letter);
                letter = findLetter ? findLetter : letter;
            }

            newWord += letter;
        }

        return newWord;
    }

    /**
     * Check if the word pair exists in database
     * 
     * @param lw levenshtein pair of word
     */
    async existLevenshteinWord(lw: LevenshteinWord): Promise<boolean> {
        const row = await this.levenshteinWordRepository.findOne({
                where: [
                    {word1: lw.word1, word2: lw.word2},
                    {word1: lw.word2, word2: lw.word1}
                ]
            });

        return row ? true : false;
    }

    /**
     * Given a string length, search database for possible candidates for a levenshtein analysis
     * 
     * @param length length to analyze
     */
    async findPossibleLevenshteinWords(length: number): Promise<string[]> {

        const min = +length - this.levenshteinTolerance;
        const max = +length + this.levenshteinTolerance;

        const possiblesLW = await this.wordRepository.createQueryBuilder('W')
                .where('length(word) BETWEEN :min AND :max', {min, max})
                .getMany();
            
        return possiblesLW.map(e => e.word);
    }

    /**
     * Given a levenshtein word array, get the different pairs
     * 
     * @param lw levenshtein words array
     */
    getDifferentLevenshteinWords(lw: LevenshteinWord[]) {
        const differentLW = [];

        lw.forEach(element => {
            const existLW = differentLW.some((value) => {
                return (value.word1 === element.word1 && value.word2 === element.word2)
                    || (value.word2 === element.word1 && value.word1 === element.word2);
            });

            if (!existLW) {
                differentLW.push(element);
            }
        });

        return differentLW;
    }

    /**
     * Given a word and an array of possible words, get all the Levenshtein words with a distance less 
     * than or equal to 3 and that no changes are made of more than 50% of the original word
     * 
     * @param word word to get its levenshtein words
     * @param plws possible levenshtein words
     */
    async getLevenshteinWords(word: string, plws: string[]): Promise<LevenshteinWord[]> {
        const lWords = [];
        plws.forEach(dbWord => {
            if (word !== dbWord) {
                let word1 = '';
                let word2 = '';

                if (word.length > dbWord.length) {
                    word1 = word;
                    word2 = dbWord;
                } else {
                    word1 = dbWord;
                    word2 = word;
                }

                const distance = lDistance(word1, word2);
                const percent1 = distance / word1.length;
                const percent2 = distance / word2.length;

                if (percent1 < 0.32) {
                    lWords.push({word1, word2, distance, percent1, percent2});
                }
            }
        });

        return lWords;
    }

    /**
     * Given a text, obtain the words found in it
     * 
     * @param text text to analyse
     */
    getWords(text: string): string[] {
        const words = [];

        text.replace(/(?:\r\n|,|&|\(|\r|\n|\))/g, ' ').split(' ').forEach(w => {
            if (w !== '') {
                const convertedWord = this.convertWord(w);
                if (convertedWord !== '') {
                    words.push(this.convertWord(w));
                }
            }
        });

        return _.difference(words, this.forbiddenWords);
    }

    /**
     * Function to identify if a character is a forbidden 
     * character at the beginning or end of a string
     * 
     * @param words array of words
     * @param totalPoints Points assigned to the word array
     */
    isForbiddenCharter(c: any): boolean {
        const forbiddenCharters = [
            ',', '.', ';', ':', '-', '_', '|', '/', '*', '&'
        ];

        return forbiddenCharters.some(e => e === c);
    }

    /**
     * Save a set of levenshtein words in database
     * 
     * @param lws levenshtein words
     * @param idUser user making the request
     */
    async saveLevenshteinWords(lws: LevenshteinWord[], idUser: number) {
        for await (const lw of lws) {
            if (! (await this.existLevenshteinWord(lw))) {
                lw.creationUser = idUser;
                await this.levenshteinWordRepository.save(lw);
            }
        }
    }

    /**
     * Save a set of words in database
     * 
     * @param words words to save
     * @param idUser user making the request
     */
    async saveWords(words: string[], idUser: number) {
        const dbWords = (await this.wordRepository.find({
            where: {word: In(words)}
        })).map(element => element.word);
        
        const differentWords = _.difference(words, dbWords);

        for await (const word of differentWords) {
            const row = { word, creationUser: idUser};

            if (word !== '' && word.length > 2) {
                await this.wordRepository.save(row);
            }
        }

        if (differentWords) {
            await this.analyzeWords(differentWords, idUser);
        }
    }
}
