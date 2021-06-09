import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn
} from "typeorm";
import { Locations } from "./Locations";
import { Offers } from "./Offers";
import { Packages } from "./Packages";
import { Products } from "./Products";
import { RequirementsDelivered } from "./RequirementsDelivered";
import { Users } from "./Users";
import { Wallet } from "./Wallet";
import { Files } from "./Files";
import { UserStoreRoles } from "./UserStoreRoles";

@Index("stores_pkey", ["id"], { unique: true })
@Index("stores_id_wallet_key", ["idWallet"], { unique: true })
@Entity("stores", { schema: "public" })
export class Stores {
  @PrimaryGeneratedColumn({ type: "bigint", name: "id" })
  id: string;

  @Column("character varying", { name: "name", length: 255 })
  name: string;

  @Column("character varying", { name: "status", length: 100 })
  status: string;

  @Column("bigint", { name: "id_wallet", unique: true })
  idWallet: string;

  @Column("text", { name: "description", nullable: true })
  description: string | null;

  @Column("boolean", { name: "personal", default: () => "false" })
  personal: boolean;

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
    () => Locations,
    locations => locations.idStore2
  )
  locations: Locations[];

  @OneToMany(
    () => Offers,
    offers => offers.idStore2
  )
  offers: Offers[];

  @OneToMany(
    () => Packages,
    packages => packages.idStore
  )
  packages: Packages[];

  @OneToOne(
    () => Products,
    products => products.idStore2
  )
  products: Products;

  @OneToMany(
    () => RequirementsDelivered,
    requirementsDelivered => requirementsDelivered.idStore
  )
  requirementsDelivereds: RequirementsDelivered[];

  @ManyToOne(
    () => Users,
    users => users.stores
  )
  @JoinColumn([{ name: "creation_user", referencedColumnName: "id" }])
  creationUser: Users;

  @OneToOne(
    () => Wallet,
    wallet => wallet.stores
  )
  @JoinColumn([{ name: "id_wallet", referencedColumnName: "id" }])
  idWallet2: Wallet;

  @ManyToOne(
    () => Files,
    files => files.stores
  )
  @JoinColumn([{ name: "img_code", referencedColumnName: "name" }])
  imgCode: Files;

  @ManyToOne(
    () => Users,
    users => users.stores2
  )
  @JoinColumn([{ name: "legal_representative", referencedColumnName: "id" }])
  legalRepresentative: Users;

  @ManyToOne(
    () => Users,
    users => users.stores3
  )
  @JoinColumn([{ name: "modification_user", referencedColumnName: "id" }])
  modificationUser: Users;

  @OneToMany(
    () => UserStoreRoles,
    userStoreRoles => userStoreRoles.idStore2
  )
  userStoreRoles: UserStoreRoles[];
}
