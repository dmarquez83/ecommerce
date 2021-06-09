import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn
} from "typeorm";
import { Packages } from "./Packages";
import { ProductReviews } from "./ProductReviews";
import { PurchaseOrderProducts } from "./PurchaseOrderProducts";
import { Users } from "./Users";

@Index("idx_purchase_order_date", ["creationDate"], {})
@Index("purchase_orders_pkey", ["id"], { unique: true })
@Entity("purchase_orders", { schema: "public" })
export class PurchaseOrders {
  @PrimaryGeneratedColumn({ type: "bigint", name: "id" })
  id: string;

  @Column("numeric", { name: "subtotal", precision: 24, scale: 10 })
  subtotal: string;

  @Column("numeric", { name: "shipping", precision: 24, scale: 10 })
  shipping: string;

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
    () => Packages,
    packages => packages.idPurchaseOrder
  )
  packages: Packages[];

  @OneToMany(
    () => ProductReviews,
    productReviews => productReviews.idPurchaseOrder2
  )
  productReviews: ProductReviews[];

  @OneToMany(
    () => PurchaseOrderProducts,
    purchaseOrderProducts => purchaseOrderProducts.idPurchaseOrder2
  )
  purchaseOrderProducts: PurchaseOrderProducts[];

  @ManyToOne(
    () => Users,
    users => users.purchaseOrders
  )
  @JoinColumn([{ name: "creation_user", referencedColumnName: "id" }])
  creationUser: Users;

  @ManyToOne(
    () => Users,
    users => users.purchaseOrders2
  )
  @JoinColumn([{ name: "id_user", referencedColumnName: "id" }])
  idUser: Users;

  @ManyToOne(
    () => Users,
    users => users.purchaseOrders3
  )
  @JoinColumn([{ name: "modification_user", referencedColumnName: "id" }])
  modificationUser: Users;
}
