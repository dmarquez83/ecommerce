import { Column, Entity, Index, JoinColumn, ManyToOne } from "typeorm";
import { Users } from "./Users";
import { Products } from "./Products";
import { PurchaseOrders } from "./PurchaseOrders";

@Index("product_reviews_pkey", ["idProduct", "idPurchaseOrder"], {
  unique: true
})
@Entity("product_reviews", { schema: "public" })
export class ProductReviews {
  @Column("bigint", { primary: true, name: "id_purchase_order" })
  idPurchaseOrder: string;

  @Column("bigint", { primary: true, name: "id_product" })
  idProduct: string;

  @Column("text", { name: "review" })
  review: string;

  @Column("character varying", { name: "status", length: 100 })
  status: string;

  @Column("smallint", { name: "score", default: () => "0" })
  score: number;

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
    users => users.productReviews
  )
  @JoinColumn([{ name: "creation_user", referencedColumnName: "id" }])
  creationUser: Users;

  @ManyToOne(
    () => Products,
    products => products.productReviews
  )
  @JoinColumn([{ name: "id_product", referencedColumnName: "id" }])
  idProduct2: Products;

  @ManyToOne(
    () => PurchaseOrders,
    purchaseOrders => purchaseOrders.productReviews
  )
  @JoinColumn([{ name: "id_purchase_order", referencedColumnName: "id" }])
  idPurchaseOrder2: PurchaseOrders;

  @ManyToOne(
    () => Users,
    users => users.productReviews2
  )
  @JoinColumn([{ name: "modification_user", referencedColumnName: "id" }])
  modificationUser: Users;
}
