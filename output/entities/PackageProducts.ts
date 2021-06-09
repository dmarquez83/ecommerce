import { Column, Entity, Index, JoinColumn, ManyToOne } from "typeorm";
import { Users } from "./Users";
import { Packages } from "./Packages";
import { PurchaseOrderProducts } from "./PurchaseOrderProducts";

@Index("package_products_pkey", ["idPackage", "idPurOrdPro"], { unique: true })
@Entity("package_products", { schema: "public" })
export class PackageProducts {
  @Column("bigint", { primary: true, name: "id_package" })
  idPackage: string;

  @Column("bigint", { primary: true, name: "id_pur_ord_pro" })
  idPurOrdPro: string;

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
    users => users.packageProducts
  )
  @JoinColumn([{ name: "creation_user", referencedColumnName: "id" }])
  creationUser: Users;

  @ManyToOne(
    () => Packages,
    packages => packages.packageProducts
  )
  @JoinColumn([{ name: "id_package", referencedColumnName: "id" }])
  idPackage2: Packages;

  @ManyToOne(
    () => PurchaseOrderProducts,
    purchaseOrderProducts => purchaseOrderProducts.packageProducts
  )
  @JoinColumn([{ name: "id_pur_ord_pro", referencedColumnName: "id" }])
  idPurOrdPro2: PurchaseOrderProducts;

  @ManyToOne(
    () => Users,
    users => users.packageProducts2
  )
  @JoinColumn([{ name: "modification_user", referencedColumnName: "id" }])
  modificationUser: Users;
}
