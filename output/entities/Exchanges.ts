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
import { ExchangePetitionProducts } from "./ExchangePetitionProducts";
import { ExchangePetitions } from "./ExchangePetitions";
import { ExchangeReviews } from "./ExchangeReviews";
import { Users } from "./Users";
import { Categories } from "./Categories";

@Index("exchanges_pkey", ["id"], { unique: true })
@Index("exchanges_id_user_name_key", ["idUser", "name"], { unique: true })
@Entity("exchanges", { schema: "public" })
export class Exchanges {
  @PrimaryGeneratedColumn({ type: "integer", name: "id" })
  id: number;

  @Column("bigint", { name: "id_user", unique: true })
  idUser: string;

  @Column("character varying", { name: "name", unique: true, length: 255 })
  name: string;

  @Column("character varying", { name: "status", length: 100 })
  status: string;

  @Column("text", { name: "description" })
  description: string;

  @Column("jsonb", { name: "properties", nullable: true })
  properties: object | null;

  @Column("jsonb", { name: "images", nullable: true })
  images: object | null;

  @Column("boolean", { name: "is_new" })
  isNew: boolean;

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
    () => ExchangePetitionProducts,
    exchangePetitionProducts => exchangePetitionProducts.idExchange2
  )
  exchangePetitionProducts: ExchangePetitionProducts[];

  @OneToMany(
    () => ExchangePetitions,
    exchangePetitions => exchangePetitions.idExchange
  )
  exchangePetitions: ExchangePetitions[];

  @OneToOne(
    () => ExchangeReviews,
    exchangeReviews => exchangeReviews.idExchange2
  )
  exchangeReviews: ExchangeReviews;

  @ManyToOne(
    () => Users,
    users => users.exchanges
  )
  @JoinColumn([{ name: "creation_user", referencedColumnName: "id" }])
  creationUser: Users;

  @ManyToOne(
    () => Categories,
    categories => categories.exchanges
  )
  @JoinColumn([{ name: "id_category", referencedColumnName: "id" }])
  idCategory: Categories;

  @ManyToOne(
    () => Users,
    users => users.exchanges2
  )
  @JoinColumn([{ name: "id_user", referencedColumnName: "id" }])
  idUser2: Users;

  @ManyToOne(
    () => Users,
    users => users.exchanges3
  )
  @JoinColumn([{ name: "modification_user", referencedColumnName: "id" }])
  modificationUser: Users;
}
