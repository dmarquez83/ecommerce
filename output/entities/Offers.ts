import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn
} from "typeorm";
import { OfferAcquisitions } from "./OfferAcquisitions";
import { Users } from "./Users";
import { Businesses } from "./Businesses";
import { Categories } from "./Categories";

@Index("offers_pkey", ["id"], { unique: true })
@Index("offers_id_business_name_key", ["idBusiness", "name"], { unique: true })
@Index("idx_offers_property", ["properties"], {})
@Entity("offers", { schema: "public" })
export class Offers {
  @PrimaryGeneratedColumn({ type: "integer", name: "id" })
  id: number;

  @Column("bigint", { name: "id_business", unique: true })
  idBusiness: string;

  @Column("character varying", { name: "name", unique: true, length: 255 })
  name: string;

  @Column("character varying", { name: "status", length: 100 })
  status: string;

  @Column("character varying", { name: "type", length: 50 })
  type: string;

  @Column("numeric", { name: "price", precision: 24, scale: 10 })
  price: string;

  @Column("text", { name: "description" })
  description: string;

  @Column("jsonb", { name: "properties", nullable: true })
  properties: object | null;

  @Column("jsonb", { name: "images", nullable: true })
  images: object | null;

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
    () => OfferAcquisitions,
    offerAcquisitions => offerAcquisitions.idOffer
  )
  offerAcquisitions: OfferAcquisitions[];

  @ManyToOne(
    () => Users,
    users => users.offers
  )
  @JoinColumn([{ name: "creation_user", referencedColumnName: "id" }])
  creationUser: Users;

  @ManyToOne(
    () => Businesses,
    businesses => businesses.offers
  )
  @JoinColumn([{ name: "id_business", referencedColumnName: "id" }])
  idBusiness2: Businesses;

  @ManyToOne(
    () => Categories,
    categories => categories.offers
  )
  @JoinColumn([{ name: "id_category", referencedColumnName: "id" }])
  idCategory: Categories;

  @ManyToOne(
    () => Users,
    users => users.offers2
  )
  @JoinColumn([{ name: "modification_user", referencedColumnName: "id" }])
  modificationUser: Users;
}
