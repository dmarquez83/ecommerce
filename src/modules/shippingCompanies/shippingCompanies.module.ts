import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ShippingCompany } from '../../models/shippingCompany.entity';
import { ShippingCompaniesController } from './shippingCompanies.controller';
import { ShippingCompaniesService } from './shippingCompanies.service';

@Module({
  imports: [TypeOrmModule.forFeature([ShippingCompany])],
  providers: [ShippingCompaniesService],
  controllers: [ShippingCompaniesController]
})
export class ShippingCompaniesModule {}
