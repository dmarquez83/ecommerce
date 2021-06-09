import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Business, Permissions, RolePermissions, UserRole} from '../../models';
import { FilesModule } from '../files/files.module';
import { LocationsModule } from '../locations/locations.module';
import { OffersModule } from '../offers/offers.module';
import { ProductsModule } from '../products/products.module';
import { RolesModule } from '../roles/roles.module';
import { WalletModule } from '../wallet/wallet.module';
import { BusinessesController } from './businesses.controller';
import { BusinessesService } from './businesses.service';

@Module({
    imports: [TypeOrmModule.forFeature([Business,
            RolePermissions, Permissions, UserRole]), WalletModule,
            FilesModule, RolesModule, ProductsModule, LocationsModule, OffersModule],
    providers: [BusinessesService],
    controllers: [BusinessesController],
    exports: [BusinessesService],
})
export class BusinessesModule {}
