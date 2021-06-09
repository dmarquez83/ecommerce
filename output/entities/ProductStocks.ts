import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn
} from "typeorm";
import { Users } from "./Users";
import { Locations } from "./Locations";
import { Products } from "./Products";
import { ProductVariations } from "./ProductVariations";
import { PurchaseOrderProducts } from "./PurchaseOrderProducts";
import { ShoppingCartProducts } from "./ShoppingCartProducts";

@Index("product_stocks_pkey", ["id"], { unique: true })
@Index("product_stocks_idx", ["idLocation", "idProduct"], { unique: true })
@Index("variation_stocks_idx", ["idLocation", "idProductVariation"], {
  unique: true
})
@Index(
  "product_stocks_id_product_id_product_variation_id_location_key",
  ["idLocation", "idProduct", "idProductVariation"],
  { unique: true }
)
@Entity("product_stocks", { schema: "public" })
export class ProductStocks {
  @PrimaryGeneratedColumn({ type: "bigint", name: "id" })
  id: string;

  @Column("bigint", { name: "id_product", nullable: true, unique: true })
  idProduct: string | null;

  @Column("bigint", {
    name: "id_product_variation",
    nullable: true,
    unique: true
  })
  idProductVariation: string | null;

  @Column("bigint", { name: "id_location", unique: true })
  idLocation: string;

  @Column("integer", { name: "stock" })
  stock: number;

  @Column("numeric", { name: "price", precision: 24, scale: 10 })
  price: string;

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

  @ManyToOne(
    () => Users,
    users => users.productStocks
  )
  @JoinColumn([{ name: "creation_user", referencedColumnName: "id" }])
  creationUser: Users;

  @ManyToOne(
    () => Locations,
    locations => locations.productStocks
  )
  @JoinColumn([{ name: "id_location", referencedColumnName: "id" }])
  idLocation2: Locations;

  @ManyToOne(
    () => Products,
    products => products.productStocks
  )
  @JoinColumn([{ name: "id_product", referencedColumnName: "id" }])
  idProduct2: Products;

  @ManyToOne(
    () => ProductVariations,
    productVariations => productVariations.productStocks
  )
  @JoinColumn([{ name: "id_product_variation", referencedColumnName: "id" }])
  idProductVariation2: ProductVariations;

  @ManyToOne(
    () => Users,
    users => users.productStocks2
  )
  @JoinColumn([{ name: "modification_user", referencedColumnName: "id" }])
  modificationUser: Users;

  @OneToMany(
    () => PurchaseOrderProducts,
    purchaseOrderProducts => purchaseOrderProducts.idProductStock2
  )
  purchaseOrderProducts: PurchaseOrderProducts[];

  @OneToMany(
    () => ShoppingCartProducts,
    shoppingCartProducts => shoppingCartProducts.idProductStock2
  )
  shoppingCartProducts: ShoppingCartProducts[];
}
