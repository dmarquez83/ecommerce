import { Column, Entity, Index, JoinColumn, ManyToOne } from "typeorm";
import { Users } from "./Users";

@Index("words_pkey", ["word"], { unique: true })
@Entity("words", { schema: "system" })
export class Words {
  @Column("character varying", { primary: true, name: "word", length: 255 })
  word: string;

  @Column("boolean", { name: "levenshtein", default: () => "false" })
  levenshtein: boolean;

  @Column("timestamp without time zone", {
    name: "creation_date",
    default: () => "CURRENT_TIMESTAMP"
  })
  creationDate: Date;

  @ManyToOne(
    () => Users,
    users => users.words
  )
  @JoinColumn([{ name: "creation_user", referencedColumnName: "id" }])
  creationUser: Users;
}
