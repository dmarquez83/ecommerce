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
import { BankAccounts } from "./BankAccounts";
import { Businesses } from "./Businesses";
import { Users } from "./Users";
import { WalletTransactions } from "./WalletTransactions";

@Index("wallet_code_key", ["code"], { unique: true })
@Index("wallet_pkey", ["id"], { unique: true })
@Entity("wallet", { schema: "financial" })
export class Wallet {
  @PrimaryGeneratedColumn({ type: "bigint", name: "id" })
  id: string;

  @Column("character varying", { name: "code", unique: true, length: 15 })
  code: string;

  @Column("numeric", { name: "balance", precision: 24, scale: 10 })
  balance: string;

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
    () => BankAccounts,
    bankAccounts => bankAccounts.idWallet
  )
  bankAccounts: BankAccounts[];

  @OneToOne(
    () => Businesses,
    businesses => businesses.idWallet2
  )
  businesses: Businesses;

  @OneToMany(
    () => Users,
    users => users.idWallet
  )
  users: Users[];

  @ManyToOne(
    () => Users,
    users => users.wallets
  )
  @JoinColumn([{ name: "creation_user", referencedColumnName: "id" }])
  creationUser: Users;

  @ManyToOne(
    () => Users,
    users => users.wallets2
  )
  @JoinColumn([{ name: "modification_user", referencedColumnName: "id" }])
  modificationUser: Users;

  @OneToMany(
    () => WalletTransactions,
    walletTransactions => walletTransactions.idWalletFrom
  )
  walletTransactions: WalletTransactions[];

  @OneToMany(
    () => WalletTransactions,
    walletTransactions => walletTransactions.idWalletTo
  )
  walletTransactions2: WalletTransactions[];
}
