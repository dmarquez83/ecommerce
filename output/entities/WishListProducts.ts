import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn
} from "typeorm";
import { PurchaseOrderProducts } from "./PurchaseOrderProducts";
import { ShoppingCartProducts } from "./ShoppingCartProducts";
import { Users } from "./Users";
import { ProductVariations } from "./ProductVariations";
import { WishLists } from "./WishLists";

@Index("wish_list_products_pkey", ["id"], { unique: true })
@Index(
  "wish_list_products_id_wish_list_id_product_variation_key",
  ["idProductVariation", "idWishList"],
  { unique: true }
)
@Entity("wish_list_products", { schema: "public" })
export class WishListProducts {
  @PrimaryGeneratedColumn({ type: "bigint", name: "id" })
  id: string;

  @Column("bigint", { name: "id_wish_list", unique: true })
  idWishList: string;

  @Column("bigint", { name: "id_product_variation", unique: true })
  idProductVariation: string;

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

  @OneToMany(
    () => PurchaseOrderProducts,
    purchaseOrderProducts => purchaseOrderProducts.idWishListProduct
  )
  purchaseOrderProducts: PurchaseOrderProducts[];

  @OneToMany(
    () => ShoppingCartProducts,
    shoppingCartProducts => shoppingCartProducts.idWishListProduct
  )
  shoppingCartProducts: ShoppingCartProducts[];

  @ManyToOne(
    () => Users,
    users => users.wishListProducts
  )
  @JoinColumn([{ name: "creation_user", referencedColumnName: "id" }])
  creationUser: Users;

  @ManyToOne(
    () => ProductVariations,
    productVariations => productVariations.wishListProducts
  )
  @JoinColumn([{ name: "id_product_variation", referencedColumnName: "id" }])
  idProductVariation2: ProductVariations;

  @ManyToOne(
    () => WishLists,
    wishLists => wishLists.wishListProducts
  )
  @JoinColumn([{ name: "id_wish_list", referencedColumnName: "id" }])
  idWishList2: WishLists;

  @ManyToOne(
    () => Users,
    users => users.wishListProducts2
  )
  @JoinColumn([{ name: "modification_user", referencedColumnName: "id" }])
  modificationUser: Users;
}
