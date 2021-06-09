import { Column, Entity, Index } from 'typeorm';

@Index('levenshtein_words_pkey', ['word1', 'word2'], { unique: true })
@Index('levenshtein_words_word2_word1_key', ['word2', 'word1'], { unique: true })
@Entity('levenshtein_words', { schema: 'system' })
export class LevenshteinWord {

    @Column('character varying', { primary: true, name: 'word1', length: 255 })
    word1: string;

    @Column('character varying', { primary: true, name: 'word2', length: 255 })
    word2: string;

    @Column('integer', { name: 'distance'})
    distance: number;

    @Column('numeric', { name: 'percent1', precision: 24, scale: 10 })
    percent1: number;

    @Column('numeric', { name: 'percent2', precision: 24, scale: 10 })
    percent2: number;

    @Column('timestamp without time zone', {
        name: 'creation_date',
        default: () => 'CURRENT_TIMESTAMP',
        select: false
    })
    creationDate: Date;

    @Column('int8', { primary: true, name: 'creation_user', select: false })
    creationUser: number;
}
