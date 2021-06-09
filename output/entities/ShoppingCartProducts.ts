import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn
} from "typeorm";
import { Users } from "./Users";
import { ProductStocks } from "./ProductStocks";
import { ProductVariations } from "./ProductVariations";
import { WishListProducts } from "./WishListProducts";

@Index("shopping_cart_products_pkey", ["id"], { unique: true })
@Index(
  "shopping_cart_products_id_user_id_product_stock_key",
  ["idProductStock", "idUser"],
  { unique: true }
)
@Entity("shopping_cart_products", { schema: "public" })
export class ShoppingCartProducts {
  @PrimaryGeneratedColumn({ type: "bigint", name: "id" })
  id: string;

  @Column("bigint", { name: "id_user", unique: true })
  idUser: string;

  @Column("bigint", { name: "id_product_stock", nullable: true, unique: true })
  idProductStock: string | null;

  @Column("integer", { name: "quantity" })
  quantity: number;

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
    users => users.shoppingCartProducts
  )
  @JoinColumn([{ name: "creation_user", referencedColumnName: "id" }])
  creationUser: Users;

  @ManyToOne(
    () => ProductStocks,
    productStocks => productStocks.shoppingCartProducts
  )
  @JoinColumn([{ name: "id_product_stock", referencedColumnName: "id" }])
  idProductStock2: ProductStocks;

  @ManyToOne(
    () => ProductVariations,
    productVariations => productVariations.shoppingCartProducts
  )
  @JoinColumn([{ name: "id_product_variation", referencedColumnName: "id" }])
  idProductVariation: ProductVariations;

  @ManyToOne(
    () => Users,
    users => users.shoppingCartProducts2
  )
  @JoinColumn([{ name: "id_user", referencedColumnName: "id" }])
  idUser2: Users;

  @ManyToOne(
    () => WishListProducts,
    wishListProducts => wishListProducts.shoppingCartProducts
  )
  @JoinColumn([{ name: "id_wish_list_product", referencedColumnName: "id" }])
  idWishListProduct: WishListProducts;

  @ManyToOne(
    () => Users,
    users => users.shoppingCartProducts3
  )
  @JoinColumn([{ name: "modification_user", referencedColumnName: "id" }])
  modificationUser: Users;
}
