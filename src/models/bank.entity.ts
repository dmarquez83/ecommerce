import {
    Column,
    Entity,
    Index,
    JoinColumn,
    ManyToOne,
    OneToMany,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm';
import { BankAccount, User } from '.';

@Index('banks_code_key', ['code'], { unique: true })
@Index('banks_pkey', ['id'], { unique: true })
@Index('banks_name_key', ['name'], { unique: true })
@Entity('banks', { schema: 'financial' })
export class Bank {
    @PrimaryGeneratedColumn({ type: 'integer', name: 'id' })
    id: number;

    @Column('character varying', { name: 'name', unique: true, length: 255 })
    name: string;

    @Column('character varying', { name: 'code', unique: true, length: 4 })
    code: string;

    @Column('character varying', { name: 'status', length: 100, select: false })
    status: string;

    @Column('timestamp without time zone', {
        name: 'creation_date',
        default: () => 'CURRENT_TIMESTAMP',
        select: false
    })
    creationDate: Date;

    @UpdateDateColumn({
        type: 'timestamp without time zone',
        name: 'modification_date',
        nullable: true,
        select: false
    })
    modificationDate: Date | null;

    @OneToMany(() => BankAccount, (bankAccounts) => bankAccounts.bank)
    bankAccount: BankAccount[];

    @ManyToOne(() => User, (users) => users.banksCreated)
    @JoinColumn([{ name: 'creation_user', referencedColumnName: 'id' }])
    creationUser: User;

    @ManyToOne(() => User, (users) => users.banksModified)
    @JoinColumn([{ name: 'modification_user', referencedColumnName: 'id' }])
    modificationUser: User;
}
