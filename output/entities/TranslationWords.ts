import { Column, Entity, Index, JoinColumn, ManyToOne } from "typeorm";
import { Users } from "./Users";
import { Translations } from "./Translations";

@Index("translation_words_pkey", ["idTranslation", "word"], { unique: true })
@Entity("translation_words", { schema: "system" })
export class TranslationWords {
  @Column("bigint", { primary: true, name: "id_translation" })
  idTranslation: string;

  @Column("character varying", { primary: true, name: "word", length: 255 })
  word: string;

  @Column("numeric", {
    name: "points",
    nullable: true,
    precision: 24,
    scale: 10
  })
  points: string | null;

  @Column("timestamp without time zone", {
    name: "creation_date",
    default: () => "CURRENT_TIMESTAMP"
  })
  creationDate: Date;

  @ManyToOne(
    () => Users,
    users => users.translationWords
  )
  @JoinColumn([{ name: "creation_user", referencedColumnName: "id" }])
  creationUser: Users;

  @ManyToOne(
    () => Translations,
    translations => translations.translationWords
  )
  @JoinColumn([{ name: "id_translation", referencedColumnName: "id" }])
  idTranslation2: Translations;
}
