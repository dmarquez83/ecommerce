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
import { Banks } from "./Banks";
import { Wallet } from "./Wallet";
import { WalletTransactions } from "./WalletTransactions";

@Index("bank_accounts_account_key", ["account"], { unique: true })
@Index("bank_accounts_pkey", ["id"], { unique: true })
@Entity("bank_accounts", { schema: "financial" })
export class BankAccounts {
  @PrimaryGeneratedColumn({ type: "bigint", name: "id" })
  id: string;

  @Column("character varying", { name: "account", unique: true, length: 20 })
  account: string;

  @Column("character varying", { name: "name", length: 255 })
  name: string;

  @Column("character varying", { name: "identity_document", length: 50 })
  identityDocument: string;

  @Column("character varying", { name: "status", length: 100 })
  status: string;

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
    users => users.bankAccounts
  )
  @JoinColumn([{ name: "approval_user", referencedColumnName: "id" }])
  approvalUser: Users;

  @ManyToOne(
    () => Users,
    users => users.bankAccounts2
  )
  @JoinColumn([{ name: "creation_user", referencedColumnName: "id" }])
  creationUser: Users;

  @ManyToOne(
    () => Banks,
    banks => banks.bankAccounts
  )
  @JoinColumn([{ name: "id_bank", referencedColumnName: "id" }])
  idBank: Banks;

  @ManyToOne(
    () => Wallet,
    wallet => wallet.bankAccounts
  )
  @JoinColumn([{ name: "id_wallet", referencedColumnName: "id" }])
  idWallet: Wallet;

  @ManyToOne(
    () => Users,
    users => users.bankAccounts3
  )
  @JoinColumn([{ name: "modification_user", referencedColumnName: "id" }])
  modificationUser: Users;

  @OneToMany(
    () => WalletTransactions,
    walletTransactions => walletTransactions.idBankAccount
  )
  walletTransactions: WalletTransactions[];
}
