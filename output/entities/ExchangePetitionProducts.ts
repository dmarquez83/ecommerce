import { Column, Entity, Index, JoinColumn, ManyToOne } from "typeorm";
import { Users } from "./Users";
import { Exchanges } from "./Exchanges";
import { ExchangePetitions } from "./ExchangePetitions";

@Index(
  "exchange_petition_products_pkey",
  ["idExchange", "idExchangePetition"],
  { unique: true }
)
@Entity("exchange_petition_products", { schema: "public" })
export class ExchangePetitionProducts {
  @Column("bigint", { primary: true, name: "id_exchange_petition" })
  idExchangePetition: string;

  @Column("bigint", { primary: true, name: "id_exchange" })
  idExchange: string;

  @Column("timestamp without time zone", {
    name: "creation_date",
    default: () => "CURRENT_TIMESTAMP"
  })
  creationDate: Date;

  @ManyToOne(
    () => Users,
    users => users.exchangePetitionProducts
  )
  @JoinColumn([{ name: "creation_user", referencedColumnName: "id" }])
  creationUser: Users;

  @ManyToOne(
    () => Exchanges,
    exchanges => exchanges.exchangePetitionProducts
  )
  @JoinColumn([{ name: "id_exchange", referencedColumnName: "id" }])
  idExchange2: Exchanges;

  @ManyToOne(
    () => ExchangePetitions,
    exchangePetitions => exchangePetitions.exchangePetitionProducts
  )
  @JoinColumn([{ name: "id_exchange_petition", referencedColumnName: "id" }])
  idExchangePetition2: ExchangePetitions;
}
