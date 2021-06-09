import { Column, Entity, Index, JoinColumn, ManyToOne } from "typeorm";
import { Users } from "./Users";
import { Categories } from "./Categories";

@Index("category_words_pkey", ["idCategory", "word"], { unique: true })
@Entity("category_words", { schema: "system" })
export class CategoryWords {
  @Column("bigint", { primary: true, name: "id_category" })
  idCategory: string;

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
    users => users.categoryWords
  )
  @JoinColumn([{ name: "creation_user", referencedColumnName: "id" }])
  creationUser: Users;

  @ManyToOne(
    () => Categories,
    categories => categories.categoryWords
  )
  @JoinColumn([{ name: "id_category", referencedColumnName: "id" }])
  idCategory2: Categories;
}
