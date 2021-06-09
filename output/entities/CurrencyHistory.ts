import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn
} from "typeorm";
import { Users } from "./Users";
import { Currencies } from "./Currencies";

@Index("idx_currency_history", ["creationDate", "idCurrency"], {})
@Index("currency_history_pkey", ["id"], { unique: true })
@Entity("currency_history", { schema: "financial" })
export class CurrencyHistory {
  @PrimaryGeneratedColumn({ type: "bigint", name: "id" })
  id: string;

  @Column("integer", { name: "id_currency" })
  idCurrency: number;

  @Column("numeric", { name: "value", precision: 24, scale: 10 })
  value: string;

  @Column("timestamp without time zone", {
    name: "creation_date",
    default: () => "CURRENT_TIMESTAMP"
  })
  creationDate: Date;

  @ManyToOne(
    () => Users,
    users => users.currencyHistories
  )
  @JoinColumn([{ name: "creation_user", referencedColumnName: "id" }])
  creationUser: Users;

  @ManyToOne(
    () => Currencies,
    currencies => currencies.currencyHistories
  )
  @JoinColumn([{ name: "id_currency", referencedColumnName: "id" }])
  idCurrency2: Currencies;
}
