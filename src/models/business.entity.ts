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
import { File, Location, Offer, Product, User, UserBusinessRole, Wallet } from '.';

@Index('businesses_pkey', ['id'], { unique: true })
@Index('businesses_id_wallet_key', ['idWallet'], { unique: true })
@Entity('businesses', { schema: 'public' })
export class Business {
    @PrimaryGeneratedColumn({ type: 'bigint', name: 'id' })
    id: number;

    @Column('character varying', { name: 'name', unique: true, length: 255 })
    name: string;

    @Column('character varying', { name: 'status', length: 100 })
    status: string;

    @Column('bigint', { name: 'id_wallet', select: false })
    idWallet: number;

    @Column('text', { name: 'description', nullable: true })
    description: string | null;

    @Column('character varying', { name: 'img_code', length: 50, select: false })
    imgCode: string | null;

    @Column('timestamp without time zone', {
        name: 'creation_date',
        default: () => 'CURRENT_TIMESTAMP',
        select: false,
    })
    creationDate: Date;

    @UpdateDateColumn({
        type: 'timestamp without time zone',
        name: 'modification_date',
        nullable: true,
        select: false
    })
    modificationDate: Date | null;

    @Column('int8', { name: 'legal_representative' })
    legalRepresentative: number;

    @Column('boolean', { name: 'personal', default: () => 'false' })
    personal: boolean;

    /**
     *  User creation of this business
     */
    @ManyToOne(
        () => User,
        user => user.businesses
    )
    @JoinColumn([{ name: 'creation_user', referencedColumnName: 'id' }])
    creationUser: User;

    /**
     * Profile Image of the business
     */
    @OneToOne(
        () => File,
        File => File.name
    )
    @JoinColumn([{ name: 'img_code', referencedColumnName: 'name' }])
    image: File;

    /**
     * User modification of this business
     */
    @ManyToOne(
        () => User,
        users => users.businessesModifiedBy
    )
    @JoinColumn([{ name: 'modification_user', referencedColumnName: 'id' }])
    modificationUser: User;

    /**
     *  Locations of the business
     */
    @OneToMany(
        () => Location,
        location => location.business
    )
    locations: Location[];

    /**
     *  Products of this business
     */
    @OneToMany(
        () => Product,
        products => products.business
    )
    products: Product[];

    /**
     *  Relation of the representative legal of the business
     */
    @ManyToOne(
        () => User,
        users => users.businessesLegalRepresentative
    )
    @JoinColumn([{ name: 'legal_representative', referencedColumnName: 'id' }])
    legalRepresentativeEntity: User;

    /**
     *  Wallet of the business
     */
    @OneToOne(
        () => Wallet,
        wallet => wallet.business
    )
    @JoinColumn([{ name: 'id_wallet', referencedColumnName: 'id' }])
    wallet: Wallet;

    /**
     * Offers of the business
     */
    @OneToMany(
        () => Offer,
        offers => offers.business
    )
    offers: Offer[];

    /**
     * User business roles that exist in the business
     */
    @OneToMany(
        () => UserBusinessRole,
        userBusinessRoles => userBusinessRoles.business
    )
    userBusinessRoles: UserBusinessRole[];
}
