import {
    Column,
    Entity,
    Index,
    JoinColumn,
    ManyToOne,
    PrimaryGeneratedColumn
} from 'typeorm';
import { Business, Category, User } from '../models';

@Index('offers_pkey', ['id'], { unique: true })
@Index('offers_id_business_name_key', ['idBusiness', 'name'], {
    unique: true
})
@Index('idx_offers_property', ['properties'], {})
@Entity('offers', { schema: 'public' })
export class Offer {
    @PrimaryGeneratedColumn({ type: 'integer', name: 'id' })
    id: number;

    @Column('bigint', { name: 'id_business', unique: true })
    idBusiness: number;

    @Column('bigint', { name: 'id_category', unique: true })
    idCategory: number;

    @Column('character varying', { name: 'name', unique: true, length: 255 })
    name: string;

    @Column('character varying', { name: 'status', length: 100 })
    status: string;

    @Column('character varying', { name: 'type', length: 50 })
    type: string;

    @Column('numeric', { name: 'price', precision: 24, scale: 10 })
    price: number;

    @Column('text', { name: 'description' })
    description: string;

    @Column('jsonb', { name: 'properties', nullable: true })
    properties: object | null;

    @Column('jsonb', { name: 'images', nullable: true })
    images: object | null;

    @Column('timestamp without time zone', {
        name: 'creation_date',
        default: () => 'CURRENT_TIMESTAMP',
        select: false
    })
    creationDate: Date;

    @Column('timestamp without time zone', {
        name: 'modification_date',
        nullable: true,
        select: false
    })
    modificationDate: Date | null;

    // @OneToMany(
    //   () => OfferAcquisitions,
    //   offerAcquisitions => offerAcquisitions.idOffer
    // )
    // offerAcquisitions: OfferAcquisitions[];

    @ManyToOne(
        () => User,
        users => users.offers
    )
    @JoinColumn([{ name: 'creation_user', referencedColumnName: 'id' }])
    creationUser: User;

    @ManyToOne(
        () => Category,
        categories => categories.offer
    )
    @JoinColumn([{ name: 'id_category', referencedColumnName: 'id' }])
    category: Category;

    /**
     * Business of the offer
     */
    @ManyToOne(
        () => Business,
        business => business.offers
    )
    @JoinColumn([{ name: 'id_business', referencedColumnName: 'id' }])
    business: Business;

    @ManyToOne(
        () => User,
        users => users.offersModifiedBy
    )
    @JoinColumn([{ name: 'modification_user', referencedColumnName: 'id' }])
    modificationUser: User;
}
