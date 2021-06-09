import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn
} from "typeorm";
import { Users } from "./Users";
import { BankAccounts } from "./BankAccounts";
import { Currencies } from "./Currencies";
import { Wallet } from "./Wallet";

@Index("wallet_transactions_pkey", ["id"], { unique: true })
@Entity("wallet_transactions", { schema: "financial" })
export class WalletTransactions {
  @PrimaryGeneratedColumn({ type: "bigint", name: "id" })
  id: string;

  @Column("numeric", { name: "asset_amount", precision: 24, scale: 10 })
  assetAmount: string;

  @Column("numeric", { name: "asset_rate", precision: 24, scale: 10 })
  assetRate: string;

  @Column("numeric", { name: "currency_amount", precision: 24, scale: 10 })
  currencyAmount: string;

  @Column("character varying", { name: "reference", length: 50 })
  reference: string;

  @Column("character varying", { name: "type", length: 50 })
  type: string;

  @Column("character varying", { name: "origin", length: 50 })
  origin: string;

  @Column("character varying", { name: "status", length: 100 })
  status: string;

  @Column("jsonb", { name: "response", nullable: true })
  response: object | null;

  @Column("text", { name: "description", nullable: true })
  description: string | null;

  @Column("timestamp without time zone", {
    name: "creation_date",
    default: () => "CURRENT_TIMESTAMP"
  })
  creationDate: Date;

  @Column("timestamp without time zone", {
    name: "approval_date",
    nullable: true
  })
  approvalDate: Date | null;

  @Column("timestamp without time zone", {
    name: "modification_date",
    nullable: true
  })
  modificationDate: Date | null;

  @ManyToOne(
    () => Users,
    users => users.walletTransactions
  )
  @JoinColumn([{ name: "approval_user", referencedColumnName: "id" }])
  approvalUser: Users;

  @ManyToOne(
    () => Users,
    users => users.walletTransactions2
  )
  @JoinColumn([{ name: "creation_user", referencedColumnName: "id" }])
  creationUser: Users;

  @ManyToOne(
    () => BankAccounts,
    bankAccounts => bankAccounts.walletTransactions
  )
  @JoinColumn([{ name: "id_bank_account", referencedColumnName: "id" }])
  idBankAccount: BankAccounts;

  @ManyToOne(
    () => Currencies,
    currencies => currencies.walletTransactions
  )
  @JoinColumn([{ name: "id_currency", referencedColumnName: "id" }])
  idCurrency: Currencies;

  @ManyToOne(
    () => Wallet,
    wallet => wallet.walletTransactions
  )
  @JoinColumn([{ name: "id_wallet_from", referencedColumnName: "id" }])
  idWalletFrom: Wallet;

  @ManyToOne(
    () => Wallet,
    wallet => wallet.walletTransactions2
  )
  @JoinColumn([{ name: "id_wallet_to", referencedColumnName: "id" }])
  idWalletTo: Wallet;

  @ManyToOne(
    () => Users,
    users => users.walletTransactions3
  )
  @JoinColumn([{ name: "modification_user", referencedColumnName: "id" }])
  modificationUser: Users;
}
