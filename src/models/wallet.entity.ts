import {
    Column,
    Entity,
    Index,
    JoinColumn,
    ManyToOne,
    OneToMany,
    OneToOne,
    PrimaryGeneratedColumn,
    UpdateDateColumn
} from 'typeorm';
import { BankAccount, Business, User } from './';

@Index('wallet_code_key', ['code'], { unique: true })
@Index('wallet_pkey', ['id'], { unique: true })
@Entity('wallet', { schema: 'financial' })
export class Wallet {
    @PrimaryGeneratedColumn({ type: 'bigint', name: 'id' })
    id: number;

    @Column('character varying', { name: 'code', unique: true, length: 15 })
    code: string;

    @Column('numeric', { name: 'balance', precision: 24, scale: 10 })
    balance: number;

    @Column('timestamp without time zone', {
        name: 'creation_date',
        select: false,
        default: () => 'CURRENT_TIMESTAMP'
    })
    creationDate: Date;

    @UpdateDateColumn({
        type: 'timestamp without time zone',
        name: 'modification_date',
        nullable: true,
        select: false
    })
    modificationDate: Date | null;

    /**
     *  Business of the wallet
     */
    @OneToOne(
        () => Business,
        business => business.wallet
    )
    business: Business;

    @OneToOne(
        () => User,
        users => users.wallet
    )
    user: User;

    @ManyToOne(
        () => User,
        users => users.wallets
    )
    @JoinColumn([{ name: 'creation_user', referencedColumnName: 'id' }])
    creationUser: User;

    @ManyToOne(
        () => User,
        users => users.walletsModifiedBy
    )
    @JoinColumn([{ name: 'modification_user', referencedColumnName: 'id' }])
    modificationUser: User;

    @OneToMany(() => BankAccount, (bankAccounts) => bankAccounts.wallet)
    bankAccounts: BankAccount[];

}
