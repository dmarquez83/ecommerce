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
import { Businesses } from "./Businesses";
import { PurchaseOrders } from "./PurchaseOrders";
import { ShippingCompanies } from "./ShippingCompanies";

@Index("packages_pkey", ["id"], { unique: true })
@Index(
  "packages_id_shipping_company_tracking_key",
  ["idShippingCompany", "tracking"],
  { unique: true }
)
@Entity("packages", { schema: "public" })
export class Packages {
  @PrimaryGeneratedColumn({ type: "bigint", name: "id" })
  id: string;

  @Column("integer", { name: "id_shipping_company", unique: true })
  idShippingCompany: number;

  @Column("character varying", { name: "tracking", unique: true, length: 200 })
  tracking: string;

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
    packageProducts => packageProducts.idPackage2
  )
  packageProducts: PackageProducts[];

  @ManyToOne(
    () => Users,
    users => users.packages
  )
  @JoinColumn([{ name: "creation_user", referencedColumnName: "id" }])
  creationUser: Users;

  @ManyToOne(
    () => Businesses,
    businesses => businesses.packages
  )
  @JoinColumn([{ name: "id_business", referencedColumnName: "id" }])
  idBusiness: Businesses;

  @ManyToOne(
    () => PurchaseOrders,
    purchaseOrders => purchaseOrders.packages
  )
  @JoinColumn([{ name: "id_purchase_order", referencedColumnName: "id" }])
  idPurchaseOrder: PurchaseOrders;

  @ManyToOne(
    () => ShippingCompanies,
    shippingCompanies => shippingCompanies.packages
  )
  @JoinColumn([{ name: "id_shipping_company", referencedColumnName: "id" }])
  idShippingCompany2: ShippingCompanies;

  @ManyToOne(
    () => Users,
    users => users.packages2
  )
  @JoinColumn([{ name: "modification_user", referencedColumnName: "id" }])
  modificationUser: Users;
}
