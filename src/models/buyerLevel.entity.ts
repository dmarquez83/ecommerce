import {
    Column,
    Entity,
    Index,
    JoinColumn,
    ManyToOne,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
    OneToMany
} from 'typeorm';
import { User } from './';

@Index('buyer_levels_code_key', ['code'], { unique: true })
@Index('buyer_levels_pkey', ['id'], { unique: true })
@Index('buyer_levels_name_key', ['name'], { unique: true })
@Entity('buyer_levels', { schema: 'system' })
export class BuyerLevel {
    @PrimaryGeneratedColumn({ type: 'integer', name: 'id' })
    id: number;

    // Buyer Level code
    @Column('character varying', { name: 'code', unique: true, length: 50 })
    code: string;

    // Level name
    @Column('character varying', { name: 'name', unique: true, length: 255 })
    name: string;

    // Limit amount of the level
    @Column('numeric', { name: 'limit_amount', precision: 24, scale: 10 })
    limitAmount: string;

    // Creation date and time of the level
    @Column('timestamp without time zone', {
        name: 'creation_date',
        default: () => 'CURRENT_TIMESTAMP',
        select: false
    })
    creationDate: Date;

    // Modification date and time of the level
    @UpdateDateColumn({
        type: 'timestamp without time zone',
        name: 'modification_date',
        nullable: true,
        select: false
    })
    modificationDate: Date | null;

    // Modification user
    @ManyToOne(
        () => User,
        user => user.buyerLevels
    )
    @JoinColumn([{ name: 'modification_user', referencedColumnName: 'id' }])
    modificationUser: User;

    /**
     *  Users with this buyer level
     */
    @OneToMany(
        () => User,
        users => users.buyerLevel
    )
    users: User[];

}
