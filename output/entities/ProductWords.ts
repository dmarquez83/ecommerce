import { Column, Entity, Index, JoinColumn, ManyToOne } from "typeorm";
import { Users } from "./Users";
import { Products } from "./Products";

@Index("product_words_pkey", ["idProduct", "word"], { unique: true })
@Entity("product_words", { schema: "public" })
export class ProductWords {
  @Column("bigint", { primary: true, name: "id_product" })
  idProduct: string;

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
    users => users.productWords
  )
  @JoinColumn([{ name: "creation_user", referencedColumnName: "id" }])
  creationUser: Users;

  @ManyToOne(
    () => Products,
    products => products.productWords
  )
  @JoinColumn([{ name: "id_product", referencedColumnName: "id" }])
  idProduct2: Products;
}
