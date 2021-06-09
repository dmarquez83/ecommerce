import { Column, Entity, Index, JoinColumn, ManyToOne, OneToMany, OneToOne } from 'typeorm';
import { User } from '.';

@Index('words_pkey', ['word'], { unique: true })
@Entity('words', { schema: 'system' })
export class Word {

    @Column('character varying', { primary: true, name: 'word', length: 255 })
    word: string;

    @Column('boolean', { name: 'levenshtein', default: () => false})
    levenshtein: boolean;

    @Column('timestamp without time zone', {
        name: 'creation_date',
        default: () => 'CURRENT_TIMESTAMP',
        select: false
    })
    creationDate: Date;

    @Column('int8', { primary: true, name: 'creation_user', select: false })
    creationUser: number;
}
