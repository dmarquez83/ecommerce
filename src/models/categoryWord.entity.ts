import { Column, Entity, Index } from 'typeorm';

@Index('category_words_pkey', ['idCategory', 'word'], { unique: true })
@Entity('category_words', { schema: 'system' })
export class CategoryWord {

    @Column('int8', { primary: true, name: 'id_category' })
    idCategory: number;

    @Column('character varying', { primary: true, name: 'word', length: 255 })
    word: string;

    @Column('numeric', { name: 'points', precision: 24, scale: 10 , nullable: true, default: () => 0})
    points: number | null;

    @Column('timestamp without time zone', {
        name: 'creation_date',
        default: () => 'CURRENT_TIMESTAMP',
        select: false
    })
    creationDate: Date;

    @Column('int8', { primary: true, name: 'creation_user', select: false })
    creationUser: number;
}
