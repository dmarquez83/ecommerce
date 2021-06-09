import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToOne
} from "typeorm";
import { Users } from "./Users";
import { Exchanges } from "./Exchanges";
import { ExchangePetitions } from "./ExchangePetitions";

@Index("exchange_reviews_pkey", ["idExchange"], { unique: true })
@Entity("exchange_reviews", { schema: "public" })
export class ExchangeReviews {
  @Column("bigint", { primary: true, name: "id_exchange" })
  idExchange: string;

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
    users => users.exchangeReviews
  )
  @JoinColumn([{ name: "creation_user", referencedColumnName: "id" }])
  creationUser: Users;

  @OneToOne(
    () => Exchanges,
    exchanges => exchanges.exchangeReviews
  )
  @JoinColumn([{ name: "id_exchange", referencedColumnName: "id" }])
  idExchange2: Exchanges;

  @ManyToOne(
    () => ExchangePetitions,
    exchangePetitions => exchangePetitions.exchangeReviews
  )
  @JoinColumn([{ name: "id_exchange_petition", referencedColumnName: "id" }])
  idExchangePetition: ExchangePetitions;

  @ManyToOne(
    () => Users,
    users => users.exchangeReviews2
  )
  @JoinColumn([{ name: "modification_user", referencedColumnName: "id" }])
  modificationUser: Users;
}
