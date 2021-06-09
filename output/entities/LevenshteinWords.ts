import { Column, Entity, Index, JoinColumn, ManyToOne } from "typeorm";
import { Users } from "./Users";

@Index("levenshtein_words_word2_word1_key", ["word1", "word2"], {
  unique: true
})
@Index("levenshtein_words_pkey", ["word1", "word2"], { unique: true })
@Entity("levenshtein_words", { schema: "system" })
export class LevenshteinWords {
  @Column("character varying", {
    primary: true,
    name: "word1",
    unique: true,
    length: 255
  })
  word1: string;

  @Column("character varying", {
    primary: true,
    name: "word2",
    unique: true,
    length: 255
  })
  word2: string;

  @Column("smallint", { name: "distance" })
  distance: number;

  @Column("numeric", { name: "percent1", precision: 24, scale: 10 })
  percent1: string;

  @Column("numeric", { name: "percent2", precision: 24, scale: 10 })
  percent2: string;

  @Column("timestamp without time zone", {
    name: "creation_date",
    default: () => "CURRENT_TIMESTAMP"
  })
  creationDate: Date;

  @ManyToOne(
    () => Users,
    users => users.levenshteinWords
  )
  @JoinColumn([{ name: "creation_user", referencedColumnName: "id" }])
  creationUser: Users;
}
