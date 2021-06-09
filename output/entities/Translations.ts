import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn
} from "typeorm";
import { TranslationWords } from "./TranslationWords";
import { Users } from "./Users";

@Index("translations_en_text_lang_key", ["enText", "lang"], { unique: true })
@Index("translations_pkey", ["id"], { unique: true })
@Entity("translations", { schema: "system" })
export class Translations {
  @PrimaryGeneratedColumn({ type: "bigint", name: "id" })
  id: string;

  @Column("character varying", { name: "en_text", unique: true, length: 255 })
  enText: string;

  @Column("character varying", { name: "lang", unique: true, length: 50 })
  lang: string;

  @Column("character varying", { name: "lang_text", length: 255 })
  langText: string;

  @Column("timestamp without time zone", {
    name: "creation_date",
    default: () => "CURRENT_TIMESTAMP"
  })
  creationDate: Date;

  @OneToMany(
    () => TranslationWords,
    translationWords => translationWords.idTranslation2
  )
  translationWords: TranslationWords[];

  @ManyToOne(
    () => Users,
    users => users.translations
  )
  @JoinColumn([{ name: "creation_user", referencedColumnName: "id" }])
  creationUser: Users;
}
