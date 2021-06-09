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
import { Tickets, User } from './';

@Index('ticket_types_code_key', ['code'], { unique: true })
@Index('ticket_types_pkey', ['id'], { unique: true })
@Index('ticket_types_name_key', ['name'], { unique: true })
@Entity('ticket_types', { schema: 'system' })
export class TicketTypes {
    @PrimaryGeneratedColumn({ type: 'integer', name: 'id' })
    id: number;

    @Column('character varying', { name: 'code', unique: true, length: 10 })
    code: string;

    @Column('character varying', { name: 'name', unique: true, length: 255 })
    name: string;

    @Column('text', { name: 'description' })
    description: string;

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

    @ManyToOne(() => User, (users) => users.ticketTypesCreated)
    @JoinColumn([{ name: 'creation_user', referencedColumnName: 'id' }])
    creationUser: User;

    @ManyToOne(() => User, (users) => users.ticketTypesModified)
    @JoinColumn([{ name: 'modification_user', referencedColumnName: 'id' }])
    modificationUser: User;

    @OneToMany(() => Tickets, (tickets) => tickets.ticketType)
    tickets: Tickets[];
}
