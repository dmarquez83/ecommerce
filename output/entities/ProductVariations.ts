import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn
} from "typeorm";
import { ProductFiles } from "./ProductFiles";
import { ProductStocks } from "./ProductStocks";
import { Users } from "./Users";
import { Products } from "./Products";
import { ShoppingCartProducts } from "./ShoppingCartProducts";
import { WishListProducts } from "./WishListProducts";

@Index("product_variations_pkey", ["id"], { unique: true })
@Index(
  "product_variations_id_product_variations_key",
  ["idProduct", "variations"],
  { unique: true }
)
@Index("idx_product_variations_products", ["idProduct"], {})
@Index("idx_product_variations", ["variations"], {})
@Entity("product_variations", { schema: "public" })
export class ProductVariations {
  @PrimaryGeneratedColumn({ type: "bigint", name: "id" })
  id: string;

  @Column("bigint", { name: "id_product", unique: true })
  idProduct: string;

  @Column("jsonb", { name: "variations", unique: true })
  variations: object;

  @Column("character varying", { name: "sku", nullable: true, length: 50 })
  sku: string | null;

  @Column("character varying", { name: "status", length: 100 })
  status: string;

  @Column("timestamp without time zone", {
    name: "creation_date",
    default: () => "CURRENT_TIMESTAMP"
  })
  creationDate: Date;

  @Column("timestamp without time zone", {
    name: "modification_date",
    nullable: true
  })
  modificationDate: Date | null;

  @OneToMany(
    () => ProductFiles,
    productFiles => productFiles.idProductVariation
  )
  productFiles: ProductFiles[];

  @OneToMany(
    () => ProductStocks,
    productStocks => productStocks.idProductVariation2
  )
  productStocks: ProductStocks[];

  @ManyToOne(
    () => Users,
    users => users.productVariations
  )
  @JoinColumn([{ name: "creation_user", referencedColumnName: "id" }])
  creationUser: Users;

  @ManyToOne(
    () => Products,
    products => products.productVariations
  )
  @JoinColumn([{ name: "id_product", referencedColumnName: "id" }])
  idProduct2: Products;

  @ManyToOne(
    () => Users,
    users => users.productVariations2
  )
  @JoinColumn([{ name: "modification_user", referencedColumnName: "id" }])
  modificationUser: Users;

  @OneToMany(
    () => ShoppingCartProducts,
    shoppingCartProducts => shoppingCartProducts.idProductVariation
  )
  shoppingCartProducts: ShoppingCartProducts[];

  @OneToMany(
    () => WishListProducts,
    wishListProducts => wishListProducts.idProductVariation2
  )
  wishListProducts: WishListProducts[];
}
