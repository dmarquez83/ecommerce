import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn
} from "typeorm";
import { ExchangePetitionProducts } from "./ExchangePetitionProducts";
import { Users } from "./Users";
import { Exchanges } from "./Exchanges";
import { ExchangeReviews } from "./ExchangeReviews";

@Index("idx_exchange_petitions_date", ["creationDate"], {})
@Index("exchange_petitions_pkey", ["id"], { unique: true })
@Index("idx_exchange_petitions_user", ["idUser"], {})
@Entity("exchange_petitions", { schema: "public" })
export class ExchangePetitions {
  @PrimaryGeneratedColumn({ type: "bigint", name: "id" })
  id: string;

  @Column("bigint", { name: "id_user" })
  idUser: string;

  @Column("character varying", { name: "status", length: 100 })
  status: string;

  @Column("text", { name: "message" })
  message: string;

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
    exchangePetitionProducts => exchangePetitionProducts.idExchangePetition2
  )
  exchangePetitionProducts: ExchangePetitionProducts[];

  @ManyToOne(
    () => Users,
    users => users.exchangePetitions
  )
  @JoinColumn([{ name: "creation_user", referencedColumnName: "id" }])
  creationUser: Users;

  @ManyToOne(
    () => Exchanges,
    exchanges => exchanges.exchangePetitions
  )
  @JoinColumn([{ name: "id_exchange", referencedColumnName: "id" }])
  idExchange: Exchanges;

  @ManyToOne(
    () => Users,
    users => users.exchangePetitions2
  )
  @JoinColumn([{ name: "id_user", referencedColumnName: "id" }])
  idUser2: Users;

  @ManyToOne(
    () => Users,
    users => users.exchangePetitions3
  )
  @JoinColumn([{ name: "modification_user", referencedColumnName: "id" }])
  modificationUser: Users;

  @OneToMany(
    () => ExchangeReviews,
    exchangeReviews => exchangeReviews.idExchangePetition
  )
  exchangeReviews: ExchangeReviews[];
}
