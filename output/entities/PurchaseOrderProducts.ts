import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn
} from "typeorm";
import { PackageProducts } from "./PackageProducts";
import { Users } from "./Users";
import { ProductStocks } from "./ProductStocks";
import { PurchaseOrders } from "./PurchaseOrders";
import { WishListProducts } from "./WishListProducts";

@Index("purchase_order_products_pkey", ["id"], { unique: true })
@Index(
  "purchase_order_products_id_purchase_order_id_product_stock_key",
  ["idProductStock", "idPurchaseOrder"],
  { unique: true }
)
@Entity("purchase_order_products", { schema: "public" })
export class PurchaseOrderProducts {
  @PrimaryGeneratedColumn({ type: "bigint", name: "id" })
  id: string;

  @Column("bigint", { name: "id_purchase_order", unique: true })
  idPurchaseOrder: string;

  @Column("bigint", { name: "id_product_stock", unique: true })
  idProductStock: string;

  @Column("integer", { name: "quantity" })
  quantity: number;

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
    () => PackageProducts,
    packageProducts => packageProducts.idPurOrdPro2
  )
  packageProducts: PackageProducts[];

  @ManyToOne(
    () => Users,
    users => users.purchaseOrderProducts
  )
  @JoinColumn([{ name: "creation_user", referencedColumnName: "id" }])
  creationUser: Users;

  @ManyToOne(
    () => ProductStocks,
    productStocks => productStocks.purchaseOrderProducts
  )
  @JoinColumn([{ name: "id_product_stock", referencedColumnName: "id" }])
  idProductStock2: ProductStocks;

  @ManyToOne(
    () => PurchaseOrders,
    purchaseOrders => purchaseOrders.purchaseOrderProducts
  )
  @JoinColumn([{ name: "id_purchase_order", referencedColumnName: "id" }])
  idPurchaseOrder2: PurchaseOrders;

  @ManyToOne(
    () => WishListProducts,
    wishListProducts => wishListProducts.purchaseOrderProducts
  )
  @JoinColumn([{ name: "id_wish_list_product", referencedColumnName: "id" }])
  idWishListProduct: WishListProducts;

  @ManyToOne(
    () => Users,
    users => users.purchaseOrderProducts2
  )
  @JoinColumn([{ name: "modification_user", referencedColumnName: "id" }])
  modificationUser: Users;
}
