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
import { CurrencyHistory } from "./CurrencyHistory";
import { VolatilityHistory } from "./VolatilityHistory";
import { WalletTransactions } from "./WalletTransactions";

@Index("currencies_code_key", ["code"], { unique: true })
@Index("currencies_pkey", ["id"], { unique: true })
@Index("currencies_name_key", ["name"], { unique: true })
@Entity("currencies", { schema: "financial" })
export class Currencies {
  @PrimaryGeneratedColumn({ type: "integer", name: "id" })
  id: number;

  @Column("character varying", { name: "code", unique: true, length: 10 })
  code: string;

  @Column("character varying", { name: "name", unique: true, length: 255 })
  name: string;

  @Column("numeric", { name: "value", precision: 24, scale: 10 })
  value: string;

  @Column("numeric", {
    name: "vix",
    precision: 24,
    scale: 10,
    default: () => "0.00000000000"
  })
  vix: string;

  @Column("boolean", { name: "is_volatile", default: () => "false" })
  isVolatile: boolean;

  @Column("character varying", { name: "status", length: 100 })
  status: string;

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
    users => users.currencies
  )
  @JoinColumn([{ name: "creation_user", referencedColumnName: "id" }])
  creationUser: Users;

  @ManyToOne(
    () => Users,
    users => users.currencies2
  )
  @JoinColumn([{ name: "modification_user", referencedColumnName: "id" }])
  modificationUser: Users;

  @OneToMany(
    () => CurrencyHistory,
    currencyHistory => currencyHistory.idCurrency2
  )
  currencyHistories: CurrencyHistory[];

  @OneToMany(
    () => VolatilityHistory,
    volatilityHistory => volatilityHistory.idCurrency2
  )
  volatilityHistories: VolatilityHistory[];

  @OneToMany(
    () => WalletTransactions,
    walletTransactions => walletTransactions.idCurrency
  )
  walletTransactions: WalletTransactions[];
}
