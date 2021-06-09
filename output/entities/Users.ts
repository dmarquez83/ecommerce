import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn
} from "typeorm";
import { AnswerVotes } from "./AnswerVotes";
import { AnswersToQuestions } from "./AnswersToQuestions";
import { Audits } from "./Audits";
import { BankAccounts } from "./BankAccounts";
import { Banks } from "./Banks";
import { Businesses } from "./Businesses";
import { BuyerLevels } from "./BuyerLevels";
import { Categories } from "./Categories";
import { CategoryProperties } from "./CategoryProperties";
import { CategoryWords } from "./CategoryWords";
import { Characteristics } from "./Characteristics";
import { ChatMessages } from "./ChatMessages";
import { Chats } from "./Chats";
import { Configurations } from "./Configurations";
import { Currencies } from "./Currencies";
import { CurrencyHistory } from "./CurrencyHistory";
import { Devices } from "./Devices";
import { Drafts } from "./Drafts";
import { ExchangePetitionProducts } from "./ExchangePetitionProducts";
import { ExchangePetitions } from "./ExchangePetitions";
import { ExchangeReviews } from "./ExchangeReviews";
import { Exchanges } from "./Exchanges";
import { Files } from "./Files";
import { LevenshteinWords } from "./LevenshteinWords";
import { ListOptions } from "./ListOptions";
import { Lists } from "./Lists";
import { Locations } from "./Locations";
import { MeasurementConversions } from "./MeasurementConversions";
import { MeasurementUnits } from "./MeasurementUnits";
import { Municipalities } from "./Municipalities";
import { OfferAcquisitions } from "./OfferAcquisitions";
import { OfferReviews } from "./OfferReviews";
import { Offers } from "./Offers";
import { PackageProducts } from "./PackageProducts";
import { Packages } from "./Packages";
import { PermissionDependecies } from "./PermissionDependecies";
import { Permissions } from "./Permissions";
import { ProductFiles } from "./ProductFiles";
import { ProductReviews } from "./ProductReviews";
import { ProductStocks } from "./ProductStocks";
import { ProductVariations } from "./ProductVariations";
import { ProductWords } from "./ProductWords";
import { Products } from "./Products";
import { Properties } from "./Properties";
import { PropertyCharacteristics } from "./PropertyCharacteristics";
import { PropertyCombos } from "./PropertyCombos";
import { PurchaseOrderProducts } from "./PurchaseOrderProducts";
import { PurchaseOrders } from "./PurchaseOrders";
import { QuestionVotes } from "./QuestionVotes";
import { Questions } from "./Questions";
import { RefreshTokens } from "./RefreshTokens";
import { RequirementTypes } from "./RequirementTypes";
import { Requirements } from "./Requirements";
import { RequirementsDelivered } from "./RequirementsDelivered";
import { RequirementsPerType } from "./RequirementsPerType";
import { RolePermissions } from "./RolePermissions";
import { Roles } from "./Roles";
import { ServiceFiles } from "./ServiceFiles";
import { ServiceProposals } from "./ServiceProposals";
import { Services } from "./Services";
import { ShippingCompanies } from "./ShippingCompanies";
import { ShoppingCartProducts } from "./ShoppingCartProducts";
import { States } from "./States";
import { TicketTypes } from "./TicketTypes";
import { Tickets } from "./Tickets";
import { TranslationWords } from "./TranslationWords";
import { Translations } from "./Translations";
import { UserBusinessRoles } from "./UserBusinessRoles";
import { UserRoles } from "./UserRoles";
import { Wallet } from "./Wallet";
import { VehicleBrands } from "./VehicleBrands";
import { VehicleFiles } from "./VehicleFiles";
import { Vehicles } from "./Vehicles";
import { VolatilityHistory } from "./VolatilityHistory";
import { WalletTransactions } from "./WalletTransactions";
import { WishListProducts } from "./WishListProducts";
import { WishLists } from "./WishLists";
import { Words } from "./Words";

@Index("users_pkey", ["id"], { unique: true })
@Index("users_mail_key", ["mail"], { unique: true })
@Index("users_username_key", ["username"], { unique: true })
@Entity("users", { schema: "system" })
export class Users {
  @PrimaryGeneratedColumn({ type: "bigint", name: "id" })
  id: string;

  @Column("character varying", { name: "username", unique: true, length: 50 })
  username: string;

  @Column("character varying", { name: "first_name", length: 255 })
  firstName: string;

  @Column("character varying", { name: "last_name", length: 255 })
  lastName: string;

  @Column("character varying", { name: "status", length: 100 })
  status: string;

  @Column("character varying", { name: "mail", unique: true, length: 50 })
  mail: string;

  @Column("character varying", {
    name: "identity_document",
    nullable: true,
    length: 50
  })
  identityDocument: string | null;

  @Column("character varying", {
    name: "telephone",
    nullable: true,
    length: 50
  })
  telephone: string | null;

  @Column("character varying", { name: "provider", length: 50 })
  provider: string;

  @Column("text", { name: "address", nullable: true })
  address: string | null;

  @Column("character varying", { name: "password", length: 200 })
  password: string;

  @Column("timestamp without time zone", {
    name: "creation_date",
    default: () => "CURRENT_TIMESTAMP"
  })
  creationDate: Date;

  @Column("timestamp without time zone", {
    name: "modification_date",
    nullable: true
  })
  modificationDate: Date | null;

  @OneToMany(
    () => AnswerVotes,
    answerVotes => answerVotes.creationUser2
  )
  answerVotes: AnswerVotes[];

  @OneToMany(
    () => AnswersToQuestions,
    answersToQuestions => answersToQuestions.creationUser
  )
  answersToQuestions: AnswersToQuestions[];

  @OneToMany(
    () => AnswersToQuestions,
    answersToQuestions => answersToQuestions.modificationUser
  )
  answersToQuestions2: AnswersToQuestions[];

  @OneToMany(
    () => Audits,
    audits => audits.creationUser
  )
  audits: Audits[];

  @OneToMany(
    () => BankAccounts,
    bankAccounts => bankAccounts.approvalUser
  )
  bankAccounts: BankAccounts[];

  @OneToMany(
    () => BankAccounts,
    bankAccounts => bankAccounts.creationUser
  )
  bankAccounts2: BankAccounts[];

  @OneToMany(
    () => BankAccounts,
    bankAccounts => bankAccounts.modificationUser
  )
  bankAccounts3: BankAccounts[];

  @OneToMany(
    () => Banks,
    banks => banks.creationUser
  )
  banks: Banks[];

  @OneToMany(
    () => Banks,
    banks => banks.modificationUser
  )
  banks2: Banks[];

  @OneToMany(
    () => Businesses,
    businesses => businesses.creationUser
  )
  businesses: Businesses[];

  @OneToMany(
    () => Businesses,
    businesses => businesses.legalRepresentative
  )
  businesses2: Businesses[];

  @OneToMany(
    () => Businesses,
    businesses => businesses.modificationUser
  )
  businesses3: Businesses[];

  @OneToMany(
    () => BuyerLevels,
    buyerLevels => buyerLevels.creationUser
  )
  buyerLevels: BuyerLevels[];

  @OneToMany(
    () => BuyerLevels,
    buyerLevels => buyerLevels.modificationUser
  )
  buyerLevels2: BuyerLevels[];

  @OneToMany(
    () => Categories,
    categories => categories.creationUser
  )
  categories: Categories[];

  @OneToMany(
    () => Categories,
    categories => categories.modificationUser
  )
  categories2: Categories[];

  @OneToMany(
    () => CategoryProperties,
    categoryProperties => categoryProperties.creationUser
  )
  categoryProperties: CategoryProperties[];

  @OneToMany(
    () => CategoryProperties,
    categoryProperties => categoryProperties.modificationUser
  )
  categoryProperties2: CategoryProperties[];

  @OneToMany(
    () => CategoryWords,
    categoryWords => categoryWords.creationUser
  )
  categoryWords: CategoryWords[];

  @OneToMany(
    () => Characteristics,
    characteristics => characteristics.creationUser
  )
  characteristics: Characteristics[];

  @OneToMany(
    () => Characteristics,
    characteristics => characteristics.modificationUser
  )
  characteristics2: Characteristics[];

  @OneToMany(
    () => ChatMessages,
    chatMessages => chatMessages.creationUser
  )
  chatMessages: ChatMessages[];

  @OneToMany(
    () => Chats,
    chats => chats.creationUser2
  )
  chats: Chats[];

  @OneToMany(
    () => Chats,
    chats => chats.idExchange2
  )
  chats2: Chats[];

  @OneToMany(
    () => Chats,
    chats => chats.idOffer2
  )
  chats3: Chats[];

  @OneToMany(
    () => Chats,
    chats => chats.modificationUser
  )
  chats4: Chats[];

  @OneToMany(
    () => Configurations,
    configurations => configurations.creationUser
  )
  configurations: Configurations[];

  @OneToMany(
    () => Configurations,
    configurations => configurations.modificationUser
  )
  configurations2: Configurations[];

  @OneToMany(
    () => Currencies,
    currencies => currencies.creationUser
  )
  currencies: Currencies[];

  @OneToMany(
    () => Currencies,
    currencies => currencies.modificationUser
  )
  currencies2: Currencies[];

  @OneToMany(
    () => CurrencyHistory,
    currencyHistory => currencyHistory.creationUser
  )
  currencyHistories: CurrencyHistory[];

  @OneToMany(
    () => Devices,
    devices => devices.creationUser
  )
  devices: Devices[];

  @OneToMany(
    () => Devices,
    devices => devices.idUser
  )
  devices2: Devices[];

  @OneToMany(
    () => Drafts,
    drafts => drafts.creationUser
  )
  drafts: Drafts[];

  @OneToMany(
    () => Drafts,
    drafts => drafts.modificationUser
  )
  drafts2: Drafts[];

  @OneToMany(
    () => ExchangePetitionProducts,
    exchangePetitionProducts => exchangePetitionProducts.creationUser
  )
  exchangePetitionProducts: ExchangePetitionProducts[];

  @OneToMany(
    () => ExchangePetitions,
    exchangePetitions => exchangePetitions.creationUser
  )
  exchangePetitions: ExchangePetitions[];

  @OneToMany(
    () => ExchangePetitions,
    exchangePetitions => exchangePetitions.idUser2
  )
  exchangePetitions2: ExchangePetitions[];

  @OneToMany(
    () => ExchangePetitions,
    exchangePetitions => exchangePetitions.modificationUser
  )
  exchangePetitions3: ExchangePetitions[];

  @OneToMany(
    () => ExchangeReviews,
    exchangeReviews => exchangeReviews.creationUser
  )
  exchangeReviews: ExchangeReviews[];

  @OneToMany(
    () => ExchangeReviews,
    exchangeReviews => exchangeReviews.modificationUser
  )
  exchangeReviews2: ExchangeReviews[];

  @OneToMany(
    () => Exchanges,
    exchanges => exchanges.creationUser
  )
  exchanges: Exchanges[];

  @OneToMany(
    () => Exchanges,
    exchanges => exchanges.idUser2
  )
  exchanges2: Exchanges[];

  @OneToMany(
    () => Exchanges,
    exchanges => exchanges.modificationUser
  )
  exchanges3: Exchanges[];

  @OneToMany(
    () => Files,
    files => files.creationUser
  )
  files: Files[];

  @OneToMany(
    () => LevenshteinWords,
    levenshteinWords => levenshteinWords.creationUser
  )
  levenshteinWords: LevenshteinWords[];

  @OneToMany(
    () => ListOptions,
    listOptions => listOptions.creationUser
  )
  listOptions: ListOptions[];

  @OneToMany(
    () => ListOptions,
    listOptions => listOptions.modificationUser
  )
  listOptions2: ListOptions[];

  @OneToMany(
    () => Lists,
    lists => lists.creationUser
  )
  lists: Lists[];

  @OneToMany(
    () => Lists,
    lists => lists.modificationUser
  )
  lists2: Lists[];

  @OneToMany(
    () => Locations,
    locations => locations.creationUser
  )
  locations: Locations[];

  @OneToMany(
    () => Locations,
    locations => locations.modificationUser
  )
  locations2: Locations[];

  @OneToMany(
    () => MeasurementConversions,
    measurementConversions => measurementConversions.creationUser
  )
  measurementConversions: MeasurementConversions[];

  @OneToMany(
    () => MeasurementConversions,
    measurementConversions => measurementConversions.modificationUser
  )
  measurementConversions2: MeasurementConversions[];

  @OneToMany(
    () => MeasurementUnits,
    measurementUnits => measurementUnits.creationUser
  )
  measurementUnits: MeasurementUnits[];

  @OneToMany(
    () => MeasurementUnits,
    measurementUnits => measurementUnits.modificationUser
  )
  measurementUnits2: MeasurementUnits[];

  @OneToMany(
    () => Municipalities,
    municipalities => municipalities.creationUser
  )
  municipalities: Municipalities[];

  @OneToMany(
    () => Municipalities,
    municipalities => municipalities.modificationUser
  )
  municipalities2: Municipalities[];

  @OneToMany(
    () => OfferAcquisitions,
    offerAcquisitions => offerAcquisitions.creationUser
  )
  offerAcquisitions: OfferAcquisitions[];

  @OneToMany(
    () => OfferAcquisitions,
    offerAcquisitions => offerAcquisitions.idUser
  )
  offerAcquisitions2: OfferAcquisitions[];

  @OneToMany(
    () => OfferAcquisitions,
    offerAcquisitions => offerAcquisitions.modificationUser
  )
  offerAcquisitions3: OfferAcquisitions[];

  @OneToMany(
    () => OfferReviews,
    offerReviews => offerReviews.creationUser
  )
  offerReviews: OfferReviews[];

  @OneToMany(
    () => OfferReviews,
    offerReviews => offerReviews.modificationUser
  )
  offerReviews2: OfferReviews[];

  @OneToMany(
    () => Offers,
    offers => offers.creationUser
  )
  offers: Offers[];

  @OneToMany(
    () => Offers,
    offers => offers.modificationUser
  )
  offers2: Offers[];

  @OneToMany(
    () => PackageProducts,
    packageProducts => packageProducts.creationUser
  )
  packageProducts: PackageProducts[];

  @OneToMany(
    () => PackageProducts,
    packageProducts => packageProducts.modificationUser
  )
  packageProducts2: PackageProducts[];

  @OneToMany(
    () => Packages,
    packages => packages.creationUser
  )
  packages: Packages[];

  @OneToMany(
    () => Packages,
    packages => packages.modificationUser
  )
  packages2: Packages[];

  @OneToMany(
    () => PermissionDependecies,
    permissionDependecies => permissionDependecies.creationUser
  )
  permissionDependecies: PermissionDependecies[];

  @OneToMany(
    () => Permissions,
    permissions => permissions.creationUser
  )
  permissions: Permissions[];

  @OneToMany(
    () => Permissions,
    permissions => permissions.modificationUser
  )
  permissions2: Permissions[];

  @OneToMany(
    () => ProductFiles,
    productFiles => productFiles.creationUser
  )
  productFiles: ProductFiles[];

  @OneToMany(
    () => ProductReviews,
    productReviews => productReviews.creationUser
  )
  productReviews: ProductReviews[];

  @OneToMany(
    () => ProductReviews,
    productReviews => productReviews.modificationUser
  )
  productReviews2: ProductReviews[];

  @OneToMany(
    () => ProductStocks,
    productStocks => productStocks.creationUser
  )
  productStocks: ProductStocks[];

  @OneToMany(
    () => ProductStocks,
    productStocks => productStocks.modificationUser
  )
  productStocks2: ProductStocks[];

  @OneToMany(
    () => ProductVariations,
    productVariations => productVariations.creationUser
  )
  productVariations: ProductVariations[];

  @OneToMany(
    () => ProductVariations,
    productVariations => productVariations.modificationUser
  )
  productVariations2: ProductVariations[];

  @OneToMany(
    () => ProductWords,
    productWords => productWords.creationUser
  )
  productWords: ProductWords[];

  @OneToMany(
    () => Products,
    products => products.creationUser
  )
  products: Products[];

  @OneToMany(
    () => Products,
    products => products.modificationUser
  )
  products2: Products[];

  @OneToMany(
    () => Properties,
    properties => properties.creationUser
  )
  properties: Properties[];

  @OneToMany(
    () => Properties,
    properties => properties.modificationUser
  )
  properties2: Properties[];

  @OneToMany(
    () => PropertyCharacteristics,
    propertyCharacteristics => propertyCharacteristics.creationUser
  )
  propertyCharacteristics: PropertyCharacteristics[];

  @OneToMany(
    () => PropertyCharacteristics,
    propertyCharacteristics => propertyCharacteristics.modificationUser
  )
  propertyCharacteristics2: PropertyCharacteristics[];

  @OneToMany(
    () => PropertyCombos,
    propertyCombos => propertyCombos.creationUser
  )
  propertyCombos: PropertyCombos[];

  @OneToMany(
    () => PropertyCombos,
    propertyCombos => propertyCombos.modificationUser
  )
  propertyCombos2: PropertyCombos[];

  @OneToMany(
    () => PurchaseOrderProducts,
    purchaseOrderProducts => purchaseOrderProducts.creationUser
  )
  purchaseOrderProducts: PurchaseOrderProducts[];

  @OneToMany(
    () => PurchaseOrderProducts,
    purchaseOrderProducts => purchaseOrderProducts.modificationUser
  )
  purchaseOrderProducts2: PurchaseOrderProducts[];

  @OneToMany(
    () => PurchaseOrders,
    purchaseOrders => purchaseOrders.creationUser
  )
  purchaseOrders: PurchaseOrders[];

  @OneToMany(
    () => PurchaseOrders,
    purchaseOrders => purchaseOrders.idUser
  )
  purchaseOrders2: PurchaseOrders[];

  @OneToMany(
    () => PurchaseOrders,
    purchaseOrders => purchaseOrders.modificationUser
  )
  purchaseOrders3: PurchaseOrders[];

  @OneToMany(
    () => QuestionVotes,
    questionVotes => questionVotes.creationUser2
  )
  questionVotes: QuestionVotes[];

  @OneToMany(
    () => Questions,
    questions => questions.creationUser
  )
  questions: Questions[];

  @OneToMany(
    () => Questions,
    questions => questions.modificationUser
  )
  questions2: Questions[];

  @OneToMany(
    () => RefreshTokens,
    refreshTokens => refreshTokens.idUser2
  )
  refreshTokens: RefreshTokens[];

  @OneToMany(
    () => RequirementTypes,
    requirementTypes => requirementTypes.creationUser
  )
  requirementTypes: RequirementTypes[];

  @OneToMany(
    () => RequirementTypes,
    requirementTypes => requirementTypes.modificationUser
  )
  requirementTypes2: RequirementTypes[];

  @OneToMany(
    () => Requirements,
    requirements => requirements.creationUser
  )
  requirements: Requirements[];

  @OneToMany(
    () => Requirements,
    requirements => requirements.modificationUser
  )
  requirements2: Requirements[];

  @OneToMany(
    () => RequirementsDelivered,
    requirementsDelivered => requirementsDelivered.idUser
  )
  requirementsDelivereds: RequirementsDelivered[];

  @OneToMany(
    () => RequirementsPerType,
    requirementsPerType => requirementsPerType.creationUser
  )
  requirementsPerTypes: RequirementsPerType[];

  @OneToMany(
    () => RolePermissions,
    rolePermissions => rolePermissions.creationUser
  )
  rolePermissions: RolePermissions[];

  @OneToMany(
    () => Roles,
    roles => roles.creationUser
  )
  roles: Roles[];

  @OneToMany(
    () => Roles,
    roles => roles.modificationUser
  )
  roles2: Roles[];

  @OneToMany(
    () => ServiceFiles,
    serviceFiles => serviceFiles.creationUser
  )
  serviceFiles: ServiceFiles[];

  @OneToMany(
    () => ServiceProposals,
    serviceProposals => serviceProposals.creationUser2
  )
  serviceProposals: ServiceProposals[];

  @OneToMany(
    () => ServiceProposals,
    serviceProposals => serviceProposals.modificationUser
  )
  serviceProposals2: ServiceProposals[];

  @OneToMany(
    () => Services,
    services => services.creationUser
  )
  services: Services[];

  @OneToMany(
    () => Services,
    services => services.modificationUser
  )
  services2: Services[];

  @OneToMany(
    () => ShippingCompanies,
    shippingCompanies => shippingCompanies.creationUser
  )
  shippingCompanies: ShippingCompanies[];

  @OneToMany(
    () => ShippingCompanies,
    shippingCompanies => shippingCompanies.modificationUser
  )
  shippingCompanies2: ShippingCompanies[];

  @OneToMany(
    () => ShoppingCartProducts,
    shoppingCartProducts => shoppingCartProducts.creationUser
  )
  shoppingCartProducts: ShoppingCartProducts[];

  @OneToMany(
    () => ShoppingCartProducts,
    shoppingCartProducts => shoppingCartProducts.idUser2
  )
  shoppingCartProducts2: ShoppingCartProducts[];

  @OneToMany(
    () => ShoppingCartProducts,
    shoppingCartProducts => shoppingCartProducts.modificationUser
  )
  shoppingCartProducts3: ShoppingCartProducts[];

  @OneToMany(
    () => States,
    states => states.creationUser
  )
  states: States[];

  @OneToMany(
    () => States,
    states => states.modificationUser
  )
  states2: States[];

  @OneToMany(
    () => TicketTypes,
    ticketTypes => ticketTypes.creationUser
  )
  ticketTypes: TicketTypes[];

  @OneToMany(
    () => TicketTypes,
    ticketTypes => ticketTypes.modificationUser
  )
  ticketTypes2: TicketTypes[];

  @OneToMany(
    () => Tickets,
    tickets => tickets.creationUser
  )
  tickets: Tickets[];

  @OneToMany(
    () => Tickets,
    tickets => tickets.modificationUser
  )
  tickets2: Tickets[];

  @OneToMany(
    () => TranslationWords,
    translationWords => translationWords.creationUser
  )
  translationWords: TranslationWords[];

  @OneToMany(
    () => Translations,
    translations => translations.creationUser
  )
  translations: Translations[];

  @OneToMany(
    () => UserBusinessRoles,
    userBusinessRoles => userBusinessRoles.creationUser
  )
  userBusinessRoles: UserBusinessRoles[];

  @OneToMany(
    () => UserBusinessRoles,
    userBusinessRoles => userBusinessRoles.idUser2
  )
  userBusinessRoles2: UserBusinessRoles[];

  @OneToMany(
    () => UserBusinessRoles,
    userBusinessRoles => userBusinessRoles.modificationUser
  )
  userBusinessRoles3: UserBusinessRoles[];

  @OneToMany(
    () => UserRoles,
    userRoles => userRoles.creationUser
  )
  userRoles: UserRoles[];

  @OneToMany(
    () => UserRoles,
    userRoles => userRoles.idUser2
  )
  userRoles2: UserRoles[];

  @ManyToOne(
    () => BuyerLevels,
    buyerLevels => buyerLevels.users
  )
  @JoinColumn([{ name: "id_buyer_level", referencedColumnName: "id" }])
  idBuyerLevel: BuyerLevels;

  @ManyToOne(
    () => Municipalities,
    municipalities => municipalities.users
  )
  @JoinColumn([{ name: "id_municipality", referencedColumnName: "id" }])
  idMunicipality: Municipalities;

  @ManyToOne(
    () => Wallet,
    wallet => wallet.users
  )
  @JoinColumn([{ name: "id_wallet", referencedColumnName: "id" }])
  idWallet: Wallet;

  @ManyToOne(
    () => Files,
    files => files.users
  )
  @JoinColumn([{ name: "img_code", referencedColumnName: "name" }])
  imgCode: Files;

  @ManyToOne(
    () => Users,
    users => users.users
  )
  @JoinColumn([{ name: "modification_user", referencedColumnName: "id" }])
  modificationUser: Users;

  @OneToMany(
    () => Users,
    users => users.modificationUser
  )
  users: Users[];

  @OneToMany(
    () => VehicleBrands,
    vehicleBrands => vehicleBrands.creationUser
  )
  vehicleBrands: VehicleBrands[];

  @OneToMany(
    () => VehicleBrands,
    vehicleBrands => vehicleBrands.modificationUser
  )
  vehicleBrands2: VehicleBrands[];

  @OneToMany(
    () => VehicleFiles,
    vehicleFiles => vehicleFiles.creationUser
  )
  vehicleFiles: VehicleFiles[];

  @OneToMany(
    () => Vehicles,
    vehicles => vehicles.creationUser
  )
  vehicles: Vehicles[];

  @OneToMany(
    () => Vehicles,
    vehicles => vehicles.modificationUser
  )
  vehicles2: Vehicles[];

  @OneToMany(
    () => VolatilityHistory,
    volatilityHistory => volatilityHistory.creationUser
  )
  volatilityHistories: VolatilityHistory[];

  @OneToMany(
    () => Wallet,
    wallet => wallet.creationUser
  )
  wallets: Wallet[];

  @OneToMany(
    () => Wallet,
    wallet => wallet.modificationUser
  )
  wallets2: Wallet[];

  @OneToMany(
    () => WalletTransactions,
    walletTransactions => walletTransactions.approvalUser
  )
  walletTransactions: WalletTransactions[];

  @OneToMany(
    () => WalletTransactions,
    walletTransactions => walletTransactions.creationUser
  )
  walletTransactions2: WalletTransactions[];

  @OneToMany(
    () => WalletTransactions,
    walletTransactions => walletTransactions.modificationUser
  )
  walletTransactions3: WalletTransactions[];

  @OneToMany(
    () => WishListProducts,
    wishListProducts => wishListProducts.creationUser
  )
  wishListProducts: WishListProducts[];

  @OneToMany(
    () => WishListProducts,
    wishListProducts => wishListProducts.modificationUser
  )
  wishListProducts2: WishListProducts[];

  @OneToMany(
    () => WishLists,
    wishLists => wishLists.creationUser
  )
  wishLists: WishLists[];

  @OneToMany(
    () => WishLists,
    wishLists => wishLists.idUser2
  )
  wishLists2: WishLists[];

  @OneToMany(
    () => WishLists,
    wishLists => wishLists.modificationUser
  )
  wishLists3: WishLists[];

  @OneToMany(
    () => Words,
    words => words.creationUser
  )
  words: Words[];
}
