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
import { Users } from "./Users";
import { Wallet } from "./Wallet";
import { Files } from "./Files";
import { Locations } from "./Locations";
import { Offers } from "./Offers";
import { Packages } from "./Packages";
import { Products } from "./Products";
import { RequirementsDelivered } from "./RequirementsDelivered";
import { UserBusinessRoles } from "./UserBusinessRoles";

@Index("businesses_pkey", ["id"], { unique: true })
@Index("businesses_id_wallet_key", ["idWallet"], { unique: true })
@Entity("businesses", { schema: "public" })
export class Businesses {
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

  @ManyToOne(
    () => Users,
    users => users.businesses
  )
  @JoinColumn([{ name: "creation_user", referencedColumnName: "id" }])
  creationUser: Users;

  @OneToOne(
    () => Wallet,
    wallet => wallet.businesses
  )
  @JoinColumn([{ name: "id_wallet", referencedColumnName: "id" }])
  idWallet2: Wallet;

  @ManyToOne(
    () => Files,
    files => files.businesses
  )
  @JoinColumn([{ name: "img_code", referencedColumnName: "name" }])
  imgCode: Files;

  @ManyToOne(
    () => Users,
    users => users.businesses2
  )
  @JoinColumn([{ name: "legal_representative", referencedColumnName: "id" }])
  legalRepresentative: Users;

  @ManyToOne(
    () => Users,
    users => users.businesses3
  )
  @JoinColumn([{ name: "modification_user", referencedColumnName: "id" }])
  modificationUser: Users;

  @OneToMany(
    () => Locations,
    locations => locations.idBusiness2
  )
  locations: Locations[];

  @OneToMany(
    () => Offers,
    offers => offers.idBusiness2
  )
  offers: Offers[];

  @OneToMany(
    () => Packages,
    packages => packages.idBusiness
  )
  packages: Packages[];

  @OneToOne(
    () => Products,
    products => products.idBusiness2
  )
  products: Products;

  @OneToMany(
    () => RequirementsDelivered,
    requirementsDelivered => requirementsDelivered.idBusiness
  )
  requirementsDelivereds: RequirementsDelivered[];

  @OneToMany(
    () => UserBusinessRoles,
    userBusinessRoles => userBusinessRoles.idBusiness2
  )
  userBusinessRoles: UserBusinessRoles[];
}
