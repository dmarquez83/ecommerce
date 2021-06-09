import { Inject, Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Status } from '../../common/enum/status.enum';
import { IPropertiesVariation } from '../../common/interfaces/productPropertiesVariations.interfaces';
import { productResponses } from '../../common/responses/product.response';
import { PropertyCombosService } from '../../common/services';
import { BasicService } from '../../common/services/base.service';
import { Product } from '../../models';
import { ProductVariation } from '../../models/productVariation.entity';
import { ProductFilesService } from '../productFiles/productFiles.service';
import { ProductVariationDto } from '../products/dto/createProductVariation.dto';
import { ProductStocksService } from '../productStocks/productStocks.service';
import { IUserReq } from '../users/interfaces/userReq.interface';

@Injectable()
export class ProductVariationsService extends BasicService<ProductVariation> {

    constructor(
        @InjectRepository(ProductVariation)
        private readonly productVarRepository: Repository<ProductVariation>,
        private readonly productFileService: ProductFilesService,
        @Inject('PropertyCombosService') private readonly propertyCombosService: PropertyCombosService,
        private readonly productStockService: ProductStocksService,
    ) {
        super(productVarRepository);
    }

    /**
     *  Create a new ProductVariation record
     * 
     * @param data Data to save the productVariation
     * @param user Logged user
     * @returns ProductVariation Created.
     */
    async create(data: ProductVariationDto, user: IUserReq): Promise<ProductVariation> {
        return await this.save(data, user);
    }

    /**
     *  Save the product Variations masive of the product
     * 
     * @param propertiesVariations Array with propertiesVariation to save
     * @param user Logged user
     * @param product current product
     */
    async saveProductVariationsMasive(propertiesVariations: IPropertiesVariation[],
                                      user: IUserReq, product: Product, response: any): Promise<void> {

        for (const propertiesVariation of propertiesVariations) {
            await this.saveProductVariation(propertiesVariation, user, product, response);
        }
    }

    /**
     *  Save one productVariation 
     * 
     * @param propertiesVariation PropertyVariation of the product
     * @param user Logged user
     * @param idProduct Id of the current product
     */
    async saveProductVariation(productsVariation: IPropertiesVariation,
                               user: IUserReq, product: Product, response: any):
                               Promise<ProductVariation> {
        const variationsArray = await this.propertyCombosService
            .getArrayReferencePropCombo(productsVariation.variation);

        const productVariation: ProductVariationDto = {
            idProduct: product.id,
            variations: variationsArray,
            sku: productsVariation.sku,
            status: product.status
        };

        const prodVariation = await this.create(productVariation, user)
            .catch(() => {
                throw new InternalServerErrorException(response.errorProductVariation);
            });
        
        if (productsVariation.images) {
            await this.productFileService.saveProductImgOrVariation(productsVariation.images, user,
                response.cantSaveImageProductVariation, product.id, prodVariation.id);
        }

        await this.productStockService
            .saveProductStockWhenIsVariant(productsVariation.locations, user, prodVariation.id, response.errorProductStock);
    
        return prodVariation;
    }

    /**
     * Save the product property 
     * 
     * @param data Product variations
     * @param user logged user extracted from the token
     * @param idProduct id of the current product
     * @param response response object with code and message
     */
    async updateProductVariation(propertiesVariations: IPropertiesVariation[],
                                 user: IUserReq, product: Product, response: any): Promise<void> {

        const productVariationAux = [];

        for (const element of propertiesVariations) {

            const variationsArray = await this.propertyCombosService
                .getArrayReferencePropCombo(element.variation);
            
            const productVariation: {
                idProduct: number;
                variations: number[];
                sku: string;
                status: string;
            } = {
                sku: element.sku,
                idProduct: product.id,
                variations: variationsArray,
                status: product.status
            };

            productVariationAux.push(productVariation);

            // check if a productVariation with this variation exists in the database
            let productVarDB = product.productVariations.find(element => {
                return this.arrayEquals(element.variations as [], productVariation.variations as []);
            });

            // If it not exists, saved it
            if (!productVarDB) {
                productVarDB = await this.saveProductVariation(element, user, product, response)
                    .catch(() => {
                        throw new InternalServerErrorException(
                            response.creation.errorProductVariation);
                    });

            } else {
                productVarDB = await this.updateAndGetRelations({ status: product.status }, productVarDB,
                    user, ['productStocks'])
                    .catch(() => {
                        throw new InternalServerErrorException(
                            response.modification.errorProductVariation);
                    });

                if (element.images) {
                    await this.productFileService.updateProductImgOrVariation(element.images, user,
                        productResponses.creation.cantSaveImages, product.id, productVarDB.id);
                }

                await this.productStockService
                    .updateproductStockWhenIsVariant(element.locations, productVarDB, user, response);
            }

            if (element.images) {
                await this.productFileService.saveProductImgOrVariation(element.images, user,
                    productResponses.creation.cantSaveImages, product.id, productVarDB.id);
            }

            // determine which ones to delete
            const productVarToDelete = product.productVariations.filter(element => {
                return !productVariationAux.some(e => {
                    return this.arrayEquals(e.variations as [], element.variations as []);
                });
            });

            await this.deleteProductVariation(productVarToDelete, user, response.delete.errorProductVariation);

        }

    }

    /**
     *  Save the product variations of the product 
     * @param propertiesVariations collection of the propertiesVariations
     * @param user logged user
     * @param product current product
     * @param response response with code and message
     */
    async saveProductVariations(propertiesVariations: IPropertiesVariation[], user: IUserReq,
                                product: Product, response: any) {
        await this.saveProductVariationsMasive(propertiesVariations, user, product, response);
    }

    /**
     *  Disable product varations
     * @param productVariations ProductVariation to disable
     * @param user Logged user
     * @param response Response with message and code
     */
    async disableProductVariation(productVariations: any,
                                  user: IUserReq, response: any): Promise<void> {
        for (const productVar of productVariations) {
            if (productVar.id && productVar.status !== Status.DELETED) {
                await this.disableEntity(productVar, user)
                .catch(() => {
                    throw new InternalServerErrorException(response.errorProductVariation);
                });
            }
        }
    }

    /**
     *  Delete product varations
     * @param productVariations ProductVariation to delete
     * @param user Logged user
     * @param response Response with message and code
     */
    async deleteProductVariation(productVariations: any,
                                 user: IUserReq, response: any): Promise<void> {
        for (const productVar of productVariations) {
            if (productVar.id) {
                await this.deleteEntityByStatus(productVar, user).then(async () => {

                    await this.productStockService.deleteProductStock(
                        productVar.productStocks, user, response.errorProductStock);
                }).catch(() => {
                    throw new InternalServerErrorException(response.errorProductVariation);
                });
            }
        }
    }
    /**
     *  Enable product varations
     * @param productVariations ProductVariation to enable
     * @param user Logged user
     * @param response Response with message and code
     */
    async enableProductVariation(productVariations: any,
                                 user: IUserReq, response: any): Promise<void> {
        for (const productVar of productVariations) {
            if (productVar.id && productVar.status !== Status.DISABLED) {
                await this.activateEntity(productVar, user)
                    .catch(() => {
                        throw new InternalServerErrorException(response.errorProductVariation);
                    });
            }
        }
    }

}
