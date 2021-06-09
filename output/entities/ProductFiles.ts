import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToOne
} from "typeorm";
import { Users } from "./Users";
import { Products } from "./Products";
import { ProductVariations } from "./ProductVariations";
import { Files } from "./Files";

@Index("product_files_pkey", ["imgCode"], { unique: true })
@Entity("product_files", { schema: "public" })
export class ProductFiles {
  @Column("character varying", { primary: true, name: "img_code", length: 50 })
  imgCode: string;

  @Column("smallint", { name: "position", nullable: true })
  position: number | null;

  @Column("timestamp without time zone", {
    name: "creation_date",
    default: () => "CURRENT_TIMESTAMP"
  })
  creationDate: Date;

  @ManyToOne(
    () => Users,
    users => users.productFiles
  )
  @JoinColumn([{ name: "creation_user", referencedColumnName: "id" }])
  creationUser: Users;

  @ManyToOne(
    () => Products,
    products => products.productFiles
  )
  @JoinColumn([{ name: "id_product", referencedColumnName: "id" }])
  idProduct: Products;

  @ManyToOne(
    () => ProductVariations,
    productVariations => productVariations.productFiles
  )
  @JoinColumn([{ name: "id_product_variation", referencedColumnName: "id" }])
  idProductVariation: ProductVariations;

  @OneToOne(
    () => Files,
    files => files.productFiles
  )
  @JoinColumn([{ name: "img_code", referencedColumnName: "name" }])
  imgCode2: Files;
}
