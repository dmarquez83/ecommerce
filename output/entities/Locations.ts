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
import { Businesses } from "./Businesses";
import { Municipalities } from "./Municipalities";
import { ProductStocks } from "./ProductStocks";

@Index("locations_pkey", ["id"], { unique: true })
@Index("locations_uq_idx", ["idBusiness", "idMunicipality"], { unique: true })
@Entity("locations", { schema: "public" })
export class Locations {
  @PrimaryGeneratedColumn({ type: "bigint", name: "id" })
  id: string;

  @Column("bigint", { name: "id_business" })
  idBusiness: string;

  @Column("integer", { name: "id_municipality" })
  idMunicipality: number;

  @Column("character varying", { name: "postal_code", length: 50 })
  postalCode: string;

  @Column("character varying", { name: "status", length: 100 })
  status: string;

  @Column("text", { name: "description", nullable: true })
  description: string | null;

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
    users => users.locations
  )
  @JoinColumn([{ name: "creation_user", referencedColumnName: "id" }])
  creationUser: Users;

  @ManyToOne(
    () => Businesses,
    businesses => businesses.locations
  )
  @JoinColumn([{ name: "id_business", referencedColumnName: "id" }])
  idBusiness2: Businesses;

  @ManyToOne(
    () => Municipalities,
    municipalities => municipalities.locations
  )
  @JoinColumn([{ name: "id_municipality", referencedColumnName: "id" }])
  idMunicipality2: Municipalities;

  @ManyToOne(
    () => Users,
    users => users.locations2
  )
  @JoinColumn([{ name: "modification_user", referencedColumnName: "id" }])
  modificationUser: Users;

  @OneToMany(
    () => ProductStocks,
    productStocks => productStocks.idLocation2
  )
  productStocks: ProductStocks[];
}
