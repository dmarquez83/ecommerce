import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import configuration from './config/configuration';
import { AuditsModule } from './modules/audits/audits.module';
import { AuthModule } from './modules/auth/auth.module';
import { BankAccountsModule } from './modules/bankAccounts/bankAccounts.module';
import { BanksModule } from './modules/banks/banks.module';
import { BusinessesModule } from './modules/businesses/businesses.module';
import { CategoriesModule } from './modules/categories/categories.module';
import { CategoryPropertiesModule } from './modules/categoryProperties/categoryProperties.module';
import { CategoryWordsModule } from './modules/categoryWords/categoryWords.module';
import { CharacteristicsModule } from './modules/characteristics/characteristics.module';
import { CurrenciesModule } from './modules/currencies/currencies.module';
import { DevicesModule } from './modules/devices/devices.module';
import { EntityWordsModule } from './modules/entityWords/entityWords.module';
import { ExchangesModule } from './modules/exchanges/exchanges.module';
import { FilesModule } from './modules/files/files.module';
import { ListOptionsModule } from './modules/listOptions/listOptions.module';
import { ListsModule } from './modules/lists/lists.module';
import { LocationsModule } from './modules/locations/locations.module';
import { MeasurementUnitsModule } from './modules/measurementUnits/measurementUnits.module';
import { MessagesModule } from './modules/messages/messages.module';
import { MunicipalitiesModule } from './modules/municipalities/municipalities.module';
import { OffersModule } from './modules/offers/offers.module';
import { ProductFilesModule } from './modules/productFiles/productFiles.module';
import { ProductsModule } from './modules/products/products.module';
import { ProductStocksModule } from './modules/productStocks/productStocks.module';
import { ProductVariationsModule } from './modules/productVariations/productVariations.module';
import { ProductWordsModule } from './modules/productWords/productWords.module';
import { PropertiesModule } from './modules/properties/properties.module';
import { PropertyCharacteristicsModule } from './modules/propertyCharacteristics/propertyCharacteristics.module';
import { PropertyCombosModule } from './modules/propertyCombos/propertyCombos.module';
import { RolesModule } from './modules/roles/roles.module';
import { ServiceFilesModule } from './modules/serviceFiles/serviceFiles.module';
import { ServiceProposalsModule } from './modules/serviceProposals/serviceProposals.module';
import { ShippingCompaniesModule } from './modules/shippingCompanies/shippingCompanies.module';
import { StatesModule } from './modules/states/states.module';
import { TicketsModule } from './modules/tickets/tickets.module';
import { TicketTypesModule } from './modules/ticketTypes/ticketTypes.module';
import { TokenModule } from './modules/token/token.module';
import { TranslationsModule } from './modules/translations/translations.module';
import { TranslationWordsModule } from './modules/translationWords/translationWords.module';
import { TransportServicesModule } from './modules/transportServices/transportServices.module';
import { UserBusinessRolesModule } from './modules/userBusinessRoles/userBusinessRoles.module';
import { UserRolesModule } from './modules/userRoles/userRoles.module';
import { UsersModule } from './modules/users/users.module';
import { VehicleBrandsModule } from './modules/vehicleBrands/vehicleBrands.module';
import { VehicleFilesModule } from './modules/vehicleFiles/vehicleFiles.module';
import { VehiclesModule } from './modules/vehicles/vehicles.module';
import { WalletModule } from './modules/wallet/wallet.module';
import { WordsModule } from './modules/words/words.module';
import { DraftsModule } from './modules/drafts/drafts.module';

@Module({
    imports: [
        ConfigModule.forRoot({
            ignoreEnvFile: false,
            isGlobal: true,
            load: [configuration],
        }),
        TypeOrmModule.forRootAsync({
            inject: [ConfigService],
            useFactory: (configService: ConfigService) => {
                return {
                    type: configService.get('DATABASE_TYPE'),
                    host: configService.get('DATABASE_HOST'),
                    port: configService.get('DATABASE_PORT'),
                    username: configService.get('DATABASE_USERNAME'),
                    password: configService.get('DATABASE_PASSWORD'),
                    database: configService.get('DATABASE_NAME'),
                    entities: [configService.get('TYPEORM_ENTITIES')],
                    subscribers: [configService.get('TYPEORM_SUBSCRIBERS')],
                    synchronize: false,
                } as TypeOrmModuleOptions;
            },
        }),
        AuditsModule,
        UsersModule,
        AuthModule,
        StatesModule,
        MunicipalitiesModule,
        BusinessesModule,
        WalletModule,
        LocationsModule,
        CategoriesModule,
        ProductsModule,
        OffersModule,
        RolesModule,
        MeasurementUnitsModule,
        ExchangesModule,
        CategoryPropertiesModule,
        UserBusinessRolesModule,
        ListsModule,
        TicketsModule,
        ShippingCompaniesModule,
        TicketTypesModule,
        BanksModule,
        BankAccountsModule,
        ListOptionsModule,
        CurrenciesModule,
        FilesModule,
        ProductFilesModule,
        PropertiesModule,
        PropertyCombosModule,
        ProductVariationsModule,
        ProductStocksModule,
        CharacteristicsModule,
        PropertyCharacteristicsModule,
        VehicleBrandsModule,
        VehiclesModule,
        TransportServicesModule,
        VehicleFilesModule,
        TokenModule,
        TranslationsModule,
        ServiceFilesModule,
        UserRolesModule,
        ProductWordsModule,
        WordsModule,
        CategoryWordsModule,
        EntityWordsModule,
        ServiceProposalsModule,
        MessagesModule,
        DevicesModule,
        TranslationWordsModule,
        DraftsModule
    ],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule { }
