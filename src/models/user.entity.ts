import {
    Column,
    Entity,
    Index,
    JoinColumn,
    ManyToOne,
    OneToMany,
    OneToOne,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm';
import {
    Audit, Bank, BankAccount, Business, BuyerLevel, Category,
    CategoryProperty, Characteristics, Currency, Device, Exchange, File,
    ListOptions, Lists, Location,
    MeasurementUnit, Municipality, Offer, Permissions, Product, ProductFile,
    ProductStock, ProductVariation, Property, PropertyCharacteristic, PropertyCombo,
    RefreshToken, Role, RolePermissions, ServiceFile, ServiceProposal, ShippingCompany,
    State, Tickets, TicketTypes, TransportService, UserBusinessRole,
    UserRole, Vehicle, VehicleBrand, VehicleFile, Wallet
} from './';
import { Draft } from './draft.entity';

@Index('users_pkey', ['id'], { unique: true })
@Index('users_identity_document_key', ['identityDocument'], { unique: true })
@Index('users_mail_key', ['mail'], { unique: true })
@Index('users_username_key', ['username'], { unique: true })
@Entity('users', { schema: 'system' })

export class User {
    @PrimaryGeneratedColumn({ type: 'bigint', name: 'id' })
    id: number;

    @Column('bigint', { name: 'id_wallet' })
    idWallet: number;

    // to allow a user to enter the application
    @Column('character varying', { name: 'username', unique: true, length: 50 })
    username: string;

    // User first name
    @Column('character varying', { name: 'first_name', length: 255 })
    firstName: string;

    // User last name
    @Column('character varying', { name: 'last_name', length: 255 })
    lastName: string;

    // User status, e.g: active, deleted...
    @Column('character varying', { name: 'status', length: 100 })
    status: string;

    // User email
    @Column('character varying', { name: 'mail', unique: true, length: 50 })
    mail: string;

    // Identity doc of the user
    @Column('character varying',
        {
            name: 'identity_document',
            nullable: true, unique: true, length: 50
        })
    identityDocument: string | null;

    // Phone number
    @Column('character varying', { name: 'telephone', length: 50, nullable: true })
    telephone: string | null;

    // Provider to login (google, facebook)
    @Column('character varying', { name: 'provider', length: 50 })
    provider: string;

    // Provider to login (google, facebook)
    @Column('character varying', { name: 'img_code', length: 50, select: false })
    imgCode: string | null;

    /**
     * Profile Image of the user
     */
    @OneToOne(
        () => File,
        File => File.name
    )
    @JoinColumn([{ name: 'img_code', referencedColumnName: 'name' }])
    image: File;

    // User address
    @Column('text', { name: 'address', nullable: true })
    address: string | null;

    // User secret password
    @Column('character varying', { name: 'password', length: 200, select: false })
    password: string;

    // creation date and time of the user
    @Column('timestamp without time zone', {
        name: 'creation_date',
        default: () => 'CURRENT_TIMESTAMP',
        select: false
    })
    creationDate: Date;

    // Modification date and time of the user
    @UpdateDateColumn({
        type: 'timestamp without time zone',
        name: 'modification_date',
        nullable: true,
        select: false
    })
    modificationDate: Date | null;

    /**
     * Wallet of the user
     */
    @OneToOne(
        () => Wallet,
        wallet => wallet.user
    )
    @JoinColumn([{ name: 'id_wallet', referencedColumnName: 'id' }])
    wallet: Wallet;

    // Buyer level id (in case the user is buyer).
    @Column('int4', { name: 'id_buyer_level', nullable: true })
    idBuyerLevel: number;

    // Municipality where the user lives
    @Column('int4', { name: 'id_municipality', nullable: true })
    idMunicipality: number;

    /**
     *  Municipality of the user
     */
    @ManyToOne(
        () => Municipality,
        municipalities => municipalities.users
    )
    @JoinColumn([{ name: 'id_municipality', referencedColumnName: 'id' }])
    municipality: Municipality;

    /**
     * Municipalities created by the user
     */
    @OneToMany(
        () => Municipality,
        municipality => municipality.creationUser,
    )
    municipalities: Municipality[];

    /**
     * States created by the user
     */
    @OneToMany(
        () => State,
        states => states.creationUser,
    )
    states: State[];

    /**
     * Audits registered by the user
     */
    @OneToMany(
        () => Audit,
        audit => audit.user,
    )
    audits: Audit[];

    /**
     *  Buyer level of the user
     */
    @ManyToOne(
        () => BuyerLevel,
        buyerLevels => buyerLevels.users
    )
    @JoinColumn([{ name: 'id_buyer_level', referencedColumnName: 'id' }])
    buyerLevel: BuyerLevel;

    /**
     * Buyer levels created by the user
     */
    @OneToMany(
        () => BuyerLevel,
        buyerLevels => buyerLevels.modificationUser
    )
    buyerLevels: BuyerLevel[];

    /**
     * Offers created by the user
     */
    @OneToMany(
        () => Offer,
        offers => offers.creationUser
    )
    offers: Offer;

    /**
     * Offers modified by the user
     */
    @OneToMany(
        () => Offer,
        offers => offers.modificationUser
    )
    offersModifiedBy: Offer[];

    /**
     * Businesses created by the user
     */
    @OneToMany(
        () => Business,
        business => business.creationUser
    )
    businesses: Business[];

    /**
     * Businesses where the user is legal representative
     */
    @OneToMany(
        () => Business,
        business => business.legalRepresentativeEntity
    )
    businessesLegalRepresentative: Business[];

    /**
     * Businesses modified by the user
     */
    @OneToMany(
        () => Business,
        business => business.modificationUser
    )
    businessesModifiedBy: Business[];

    /**
     * Wallets created by the user
     */
    @OneToMany(
        () => Wallet,
        wallets => wallets.creationUser
    )
    wallets: Wallet[];

    /**
     * Wallets modified by the user
     */
    @OneToMany(
        () => Wallet,
        wallets => wallets.modificationUser
    )
    walletsModifiedBy: Wallet[];

    /**
     * Roles created by the user
     */
    @OneToMany(
        () => Role,
        roles => roles.creationUser
    )
    createdRoles: Role[];

    /**
     * Roles modified by the user
     */
    @OneToMany(
        () => Role,
        roles => roles.modificationUser
    )
    modifiedRoles: Role[];

    /**
     * Products created by the user
     */
    @OneToMany(
        () => Product,
        products => products.creationUser
    )
    createdProducts: Product[];

    /**
     * Products modified by the user
     */
    @OneToMany(
        () => Product,
        products => products.modificationUser
    )
    modifiedProducts: Product[];

    /**
     * Categories created by the user
     */
    @OneToMany(
        () => Category,
        categories => categories.creationUser
    )
    createdCategories: Category[];

    /**
     * Categories modified by the user
     */
    @OneToMany(
        () => Category,
        categories => categories.modificationUser
    )
    modifiedCategories: Category[];

    /**
     *  User updated
     */
    @ManyToOne(
        () => User,
        user => user.updatedByMe
    )
    @JoinColumn([{ name: 'modification_user', referencedColumnName: 'id' }])
    modificationUser: User;

    /**
     * Roles of the user
     */
    @OneToMany(
        () => UserRole,
        userRoles => userRoles.user
    )
    userRol: UserRole[];

    /**
     *  Users updated by me
     */
    @OneToMany(
        () => User,
        users => users.modificationUser
    )
    updatedByMe: User[];

    /**
     *  My Locations
     */
    @OneToMany(
        () => Location,
        Location => Location.creationUser
    )
    myLocations: Location[];

    /**
     *  Locations updated by me
     */
    @OneToMany(
        () => Location,
        Location => Location.modificationUser
    )
    locationsUpdatedByMe: Location[];

    /**
     *  Product variation created by the user
     */
    @OneToMany(
        () => ProductVariation,
        productVariations => productVariations.creationUser
    )
    productVariations: ProductVariation[];

    /**
     *  Product Stock by the user.
     */
    @OneToMany(
        () => ProductStock,
        productStock => productStock.creationUser
    )
    productStock: ProductStock[];

    /**
     *  Product stock updated by the user
     */
    @OneToMany(
        () => ProductStock,
        productStock => productStock.modificationUser
    )
    productStockModifiedBy: ProductStock[];

    /**
     * Measurement units created by the user
     */
    @OneToMany(
        () => MeasurementUnit,
        measurementUnits => measurementUnits.creationUser
    )
    measurementUnitsCreated: MeasurementUnit[];

    /**
     * Measurement units modified by the user
     */
    @OneToMany(
        () => MeasurementUnit,
        measurementUnits => measurementUnits.modificationUser
    )
    measurementUnitsModifiedBy: MeasurementUnit[];

    /**
     * Exchanges that belong to the user
     */
    @OneToMany(
        () => Exchange,
        exchanges => exchanges.exchangeUser
    )
    userExchange: Exchange[];

    /**
     * Exchanges created by the user
     */
    @OneToMany(
        () => Exchange,
        exchanges => exchanges.creationUser
    )
    exchangesCreated: Exchange[];

    /**
     * Exchanges modified by the user
     */
    @OneToMany(
        () => Exchange,
        exchanges => exchanges.modificationUser
    )
    exchangesModifiedBy: Exchange[];

    /**
     * Category properties created by the user
     */
    @OneToMany(
        () => CategoryProperty,
        CategoryProperty => CategoryProperty.creationUser
    )
    categoryPropertiesCreated: CategoryProperty[];

    /**
     * Category properties modified by the user
     */
    @OneToMany(
        () => CategoryProperty,
        CategoryProperty => CategoryProperty.modificationUser
    )
    categoryPropertiesModifiedBy: CategoryProperty[];

    /**
     * User Business Roles properties created by the user
     */
    @OneToMany(
        () => UserBusinessRole,
        userBusinessRoles => userBusinessRoles.creationUser
    )
    userBusinessRolesCreated: UserBusinessRole[];

    /**
     * User Business Roles granted to the user
     */
    @OneToMany(
        () => UserBusinessRole,
        userBusinessRoles => userBusinessRoles.user
    )
    userBusinessRoles: UserBusinessRole[];

    /**
     * User Business Roles modified by the user
     */
    @OneToMany(
        () => UserBusinessRole,
        userBusinessRoles => userBusinessRoles.modificationUser
    )
    userBusinessRolesModified: UserBusinessRole[];

    /**
     * Role permissions created by the user
     */
    @OneToMany(
        () => RolePermissions,
        rolePermissions => rolePermissions.creationUser
    )
    rolePermissionsCreated: RolePermissions[];

    /**
     * Permissions created by the user
     */
    @OneToMany(
        () => Permissions,
        permissions => permissions.creationUser
    )
    permissionsCreated: Permissions[];

    /**
     * Permissions modified by the user
     */
    @OneToMany(
        () => Permissions,
        permissions => permissions.modificationUser
    )
    permissionsModified: Permissions[];

    /**
     * Lists created by the user 
     */
    @OneToMany(
        () => Lists,
        lists => lists.creationUser
    )
    listsCreated: Lists[];

    /**
     * Lists modified by the user 
     */
    @OneToMany(
        () => Lists,
        lists => lists.modificationUser
    )
    listsModified: Lists[];

    /**
     * List options created by the user
     */
    @OneToMany(
        () => ListOptions,
        listOptions => listOptions.creationUser
    )
    listOptionsCreated: ListOptions[];

    /**
     * List options created by the user
     */
    @OneToMany(
        () => ListOptions,
        listOptions => listOptions.modificationUser
    )
    listOptionsModified: ListOptions[];

    /**
     * Property created by the user
     */
    @OneToMany(
        () => Property,
        properties => properties.creationUser
    )
    propertiesCreated: Property[];

    /**
     * Property modified by the user
     */
    @OneToMany(
        () => Property,
        properties => properties.modificationUser
    )
    propertiesModified: Property[];

    /**
     * Characteristics created by the user
     */
    @OneToMany(
        () => Characteristics,
        characteristics => characteristics.creationUser
    )
    characteristicsCreated: Characteristics[];

    /**
     * Characteristics created by the user
     */
    @OneToMany(
        () => Characteristics,
        characteristics => characteristics.modificationUser
    )
    characteristicsModified: Characteristics[];

    /**
     * PropertyCharacteristics created by the user
     */
    @OneToMany(
        () => PropertyCharacteristic,
        propertyCharacteristics => propertyCharacteristics.creationUser
    )
    propertyCharacteristicsCreated: PropertyCharacteristic[];

    /**
     * PropertyCharacteristics created by the user
     */
    @OneToMany(
        () => PropertyCharacteristic,
        propertyCharacteristics => propertyCharacteristics.modificationUser
    )
    propertyCharacteristicsModified: PropertyCharacteristic[];

    /**
     *  Refresh token relations
     */
    @OneToMany(
        () => RefreshToken,
        (refreshtokens) => refreshtokens.user)
    refreshtokens: RefreshToken[];

    /**
     *  PropertyCombos created by the user
     */
    @OneToMany(
        () => PropertyCombo,
        PropertyCombos => PropertyCombos.creationUser
    )
    propertyCombosCreated: PropertyCombo[];

    /**
     *  PropertyCombos modified by the user
     */
    @OneToMany(
        () => PropertyCombo,
        PropertyCombos => PropertyCombos.modificationUser
    )
    propertyCombosModified: PropertyCombo[];

    /**
     * Tickets created by the user
     */
    @OneToMany(
        () => Tickets,
        tickets => tickets.creationUser
    )
    ticketsCreated: Tickets[];

    /**
     * Tickets modified by the user
     */
    @OneToMany(
        () => Tickets,
        tickets => tickets.modificationUser
    )
    ticketsModified: Tickets[];

    @OneToMany(
        () => TicketTypes,
        ticketTypes => ticketTypes.creationUser
    )
    ticketTypesCreated: TicketTypes[];

    @OneToMany(
        () => TicketTypes,
        ticketTypes => ticketTypes.modificationUser
    )
    ticketTypesModified: TicketTypes[];

    /* ShippingCompanies created by the user
    */
    @OneToMany(
        () => ShippingCompany,
        shippingCompany => shippingCompany.creationUser
    )
    shippingCompaniesCreated: ShippingCompany[];

    /**
     * ShippingCompanies modified by the user
     */
    @OneToMany(
        () => ShippingCompany,
        shippingCompany => shippingCompany.modificationUser
    )
    shippingCompaniesModified: ShippingCompany[];

    /**
     * Banks created by the user
     */
    @OneToMany(
        () => Bank,
        bank => bank.creationUser
    )
    banksCreated: Bank[];

    /**
     * Banks modified by the user
     */
    @OneToMany(
        () => Bank,
        bank => bank.modificationUser
    )
    banksModified: Bank[];

    /**
     * Bank Accounts created by the user
     */
    @OneToMany(
        () => BankAccount,
        bankAccount => bankAccount.creationUser
    )
    bankAccountsCreated: BankAccount[];

    /**
     * Bank Accounts modified by the user
     */
    @OneToMany(
        () => BankAccount,
        bankAccount => bankAccount.modificationUser
    )
    bankAccountsModified: BankAccount[];

    /**
     * Bank Accounts approved by the user
     */
    @OneToMany(
        () => BankAccount,
        bankAccount => bankAccount.approvalUser
    )
    bankAccountsApproved: BankAccount[];

    /**
     * Currencies created by the user
     */
    @OneToMany(
        () => Currency,
        currency => currency.creationUser
    )
    currenciesCreated: Currency[];

    /**
     * Currencies modified by the user
     */
    @OneToMany(
        () => Currency,
        currency => currency.modificationUser
    )
    currenciesModified: Currency[];

    /**
     *  Files uploads by the user
     */
    @OneToMany(
        () => File,
        files => files.creationUser
    )
    files: File[];

    /**
     *  Files uploads by the user
     */
    @OneToMany(
        () => ProductFile,
        productFile => productFile.creationUser
    )
    productFiles: ProductFile[];

    /**
     *  Vehicle brands created by
     */
    @OneToMany(
        () => VehicleBrand,
        vehicleBrand => vehicleBrand.creationUser
    )
    vehicleBrandsCreated: VehicleBrand[];

    /**
     * Vehicle brands updated by
     */
    @OneToMany(
        () => VehicleBrand,
        vehicleBrand => vehicleBrand.modificationUser
    )
    vehicleBrandsModified: VehicleBrand[];

    /**
     *  Vehicle created by
     */
    @OneToMany(
        () => Vehicle,
        vehicles => vehicles.creationUser
    )
    vehiclesCreated: Vehicle[];

    /**
     *  Vehicle modified by
     */
    @OneToMany(
        () => Vehicle,
        vehicles => vehicles.modificationUser
    )
    vehiclesModified: Vehicle[];

    /**
     *  Services created by 
     */
    @OneToMany(
        () => TransportService,
        transportService => transportService.creationUser
    )
    servicesCreated: TransportService[];

    /**
     *  Services modified by
     */
    @OneToMany(
        () => TransportService,
        transportService => transportService.modificationUser
    )
    servicesModified: TransportService[];

    /**
     *  Vehicles files created by
     */
    @OneToMany(
        () => VehicleFile,
        vehicleFiles => vehicleFiles.creationUser
    )
    vehicleFilesCreated: VehicleFile[];

    /**
     * Service Files created by 
     */
    @OneToMany(
        () => ServiceFile,
        serviceFiles => serviceFiles.creationUser
    )
    serviceFilesCreated: ServiceFile[];

    /**
     * Service proposals created by
     */
    @OneToMany(
        () => ServiceProposal,
        serviceProposals => serviceProposals.creationUser
    )
    serviceProposal: ServiceProposal[];

    /**
     *  Devices created by
     */
    @OneToMany(
        () => Device,
        devices => devices.creationUser
    )
    devices: Device[];

    /**
     * Service proposals created by
     */
    @OneToMany(
        () => ServiceProposal,
        serviceProposals => serviceProposals.modificationUser
    )
    spModifyBy: ServiceProposal[];

    /**
     * Draft created by
     */
    @OneToMany(
        () => Draft,
        drafts => drafts.creationUser
    )
    drafts: Draft[];

    /**
     * Draft modified by
     */
    @OneToMany(
        () => Draft,
        drafts => drafts.modificationUser
    )
    draftModified: Draft[];
}
