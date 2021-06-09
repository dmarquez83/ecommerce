import {
    Column,
    Entity,
    Index,
    JoinColumn,
    ManyToOne,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm';
import { User } from './';

@Index('shipping_companies_pkey', ['id'], { unique: true })
@Index('shipping_companies_name_key', ['name'], { unique: true })
@Entity('shipping_companies', { schema: 'system' })
export class ShippingCompany {
    @PrimaryGeneratedColumn({ type: 'integer', name: 'id' })
    id: number;

    @Column('character varying', { name: 'name', unique: true, length: 255 })
    name: string;

    @Column('text', { name: 'icon' })
    icon: string;

    @Column('text', { name: 'description', nullable: true })
    description: string | null;

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

    // @OneToMany(() => Packages, (packages) => packages.idShippingCompany2)
    // packages: Packages[];

    @ManyToOne(() => User, (users) => users.shippingCompaniesCreated)
    @JoinColumn([{ name: 'creation_user', referencedColumnName: 'id' }])
    creationUser: User;

    @ManyToOne(() => User, (users) => users.shippingCompaniesModified)
    @JoinColumn([{ name: 'modification_user', referencedColumnName: 'id' }])
    modificationUser: User;
}
