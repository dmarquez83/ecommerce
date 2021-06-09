import {
    Column,
    Entity,
    Index,
    PrimaryGeneratedColumn
} from 'typeorm';

@Index('translations_pkey', ['id'], { unique: true })
@Index('translations_en_text_lang_key', ['enText', 'lang'], { unique: true })
@Entity('translations', { schema: 'system' })
export class Translation {
    @PrimaryGeneratedColumn({ type: 'bigint', name: 'id' })
    id: number;

    @Column('character varying', { primary: true, name: 'en_text', length: 255 })
    enText: string;

    @Column('character varying', { primary: true, name: 'lang', length: 50 })
    lang: string;

    @Column('character varying', { name: 'lang_text', length: 255 })
    langText: string;
}
