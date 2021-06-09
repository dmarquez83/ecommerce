import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Bank, User, Wallet } from './';

@Index('bank_accounts_account_key', ['account'], { unique: true })
@Index('bank_accounts_pkey', ['id'], { unique: true })
@Entity('bank_accounts', { schema: 'financial' })
export class BankAccount {
  @PrimaryGeneratedColumn({ type: 'bigint', name: 'id' })
  id: number;

  @Column('character varying', { name: 'account', unique: true, length: 20 })
  account: string;

  @Column('character varying', { name: 'name', length: 255 })
  name: string;

  @Column('character varying', { name: 'identity_document', length: 50 })
  identityDocument: string;

  @Column({ type: 'int4', name: 'id_bank' })
  idBank: number;

  @Column({ type: 'int8', name: 'id_wallet' })
  idWallet: number;

  @Column('character varying', { name: 'status', length: 100 })
  status: string;

  @Column('timestamp without time zone', {
    name: 'creation_date',
    default: () => 'CURRENT_TIMESTAMP',
    select: false
  })
  creationDate: Date;

  @Column('timestamp without time zone', {
    name: 'approval_date',
    nullable: true,
  })
  approvalDate: Date | null;

  @UpdateDateColumn({
    type: 'timestamp without time zone',
    name: 'modification_date',
    nullable: true,
    select: false
  })
  modificationDate: Date | null;

  @ManyToOne(() => User, (users) => users.bankAccountsApproved)
  @JoinColumn([{ name: 'approval_user', referencedColumnName: 'id' }])
  approvalUser: User;

  @ManyToOne(() => User, (users) => users.bankAccountsCreated)
  @JoinColumn([{ name: 'creation_user', referencedColumnName: 'id' }])
  creationUser: User;

  @ManyToOne(() => Bank, (banks) => banks.bankAccount)
  @JoinColumn([{ name: 'id_bank', referencedColumnName: 'id' }])
  bank: Bank;

  @ManyToOne(() => Wallet, (wallet) => wallet.bankAccounts)
  @JoinColumn([{ name: 'id_wallet', referencedColumnName: 'id' }])
  wallet: Wallet;

  @ManyToOne(() => User, (users) => users.bankAccountsModified)
  @JoinColumn([{ name: 'modification_user', referencedColumnName: 'id' }])
  modificationUser: User;

}
