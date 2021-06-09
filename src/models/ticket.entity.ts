import {
    Column,
    Entity,
    Index,
    JoinColumn,
    ManyToOne,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm';
import { TicketTypes, User } from './';

@Index('tickets_pkey', ['id'], { unique: true })
@Entity('tickets', { schema: 'public' })
export class Tickets {
    @PrimaryGeneratedColumn({ type: 'bigint', name: 'id' })
    id: number;

    @Column({ name: 'id_ticket_type', type: 'int4' })
    idTicketType: number;

    @Column('character varying', { name: 'status', length: 100, select: false })
    status: string;

    @Column('character varying', { name: 'subject', length: 140 })
    subject: string;

    @Column('text', { name: 'description' })
    description: string;

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

    @ManyToOne(() => User, (users) => users.ticketsCreated)
    @JoinColumn([{ name: 'creation_user', referencedColumnName: 'id' }])
    creationUser: User;

    @ManyToOne(() => TicketTypes, (ticketTypes) => ticketTypes.tickets)
    @JoinColumn([{ name: 'id_ticket_type', referencedColumnName: 'id' }])
    ticketType: TicketTypes;

    @ManyToOne(() => User, (users) => users.ticketsModified)
    @JoinColumn([{ name: 'modification_user', referencedColumnName: 'id' }])
    modificationUser: User;
}
