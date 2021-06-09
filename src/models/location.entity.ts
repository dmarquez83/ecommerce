import {
    AfterLoad,
    Column,
    Entity,
    Index,
    JoinColumn,
    ManyToOne,
    OneToMany,
    PrimaryGeneratedColumn,
    UpdateDateColumn
} from 'typeorm';
import { Business, Municipality, User } from '.';
import { ProductStock } from './productStock.entity';

@Index('locations_pkey', ['id'], { unique: true })
@Entity('locations', { schema: 'public' })
export class Location {
    @PrimaryGeneratedColumn({ type: 'bigint', name: 'id' })
    id: number;

    @Column('character varying', { name: 'postal_code', length: 50 })
    postalCode: string;

    @Column('character varying', { name: 'status', length: 100 })
    status: string;

    @Column('text', { name: 'description', nullable: true })
    description: string | null;

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

    @ManyToOne(
        () => User,
        users => users.myLocations
    )
    @JoinColumn([{ name: 'creation_user', referencedColumnName: 'id' }])
    creationUser: User;

    @Column('int8', { name: 'id_business' })
    idBusiness: number;

    @Column('int4', { name: 'id_municipality' })
    @ManyToOne(
        () => Municipality,
        municipality => municipality.locations
    )
    @JoinColumn([{ name: 'id_municipality', referencedColumnName: 'id' }])
    idMunicipality: Municipality;

    @Column({ name: 'modification_user', type: 'int4', select: false })
    @ManyToOne(
        () => User,
        users => users.locationsUpdatedByMe
    )
    @JoinColumn([{ name: 'modification_user', referencedColumnName: 'id' }])
    modificationUser: User;

    /**
     *  Business of the location
     */
    @ManyToOne(
        () => Business,
        business => business.locations, { eager: true }
    )
    @JoinColumn([{ name: 'id_business', referencedColumnName: 'id' }])
    business: Business;

    /**
     *  Municipality of the Location
     */
    @ManyToOne(
        () => Municipality,
        municipalities => municipalities.locations, { eager: true }
    )
    @JoinColumn([{ name: 'id_municipality', referencedColumnName: 'id' }])
    municipality: Municipality;

    /**
     *  product stock associate of this location
     */
    @OneToMany(
        () => ProductStock,
        productStock => productStock.location
    )
    productStock: ProductStock[];

    @AfterLoad()
    loadMunicipality() {
        if (this.municipality) {
            delete this.municipality.status;
        }
    }
}
