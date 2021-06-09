import { ForbiddenException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { getRepository, Not, Repository } from 'typeorm';
import { Transactional } from 'typeorm-transactional-cls-hooked';
import { Status } from '../../common/enum/status.enum';
import { IResponseStructure } from '../../common/interfaces';
import { businessResponses } from '../../common/responses/business.response';
import { productResponses } from '../../common/responses/product.response';
import { BasicService } from '../../common/services/base.service';
import { Location, Product, ProductVariation } from '../../models';
import { ProductStock } from '../../models/productStock.entity';
import { IUserReq } from '../users/interfaces/userReq.interface';

@Injectable()
export class ProductStocksService extends BasicService<ProductStock> {

    constructor(
        @InjectRepository(ProductStock)
        private readonly productStockRepository: Repository<ProductStock>,
    ) {
        super(productStockRepository);
    }

    /**
     *  Create a new productStock in DB
     * @param data data to save
     * @param user Logged User
     */
    async create(data: any, user: IUserReq) {
        return await this.save(data, user);
    }

    /**
     * Update the productStock
     * @param data data to update
     * @param productStock productStock entity
     * @param user  Logged User
     */
    async update(data: any, productStock: ProductStock, user: IUserReq) {
        return await this.updateEntity(data, productStock, user);
    }

    /**
     * Get location of this productStock
     * @param idProductStock 
     */
    async getLocationAssociate(idProductStock: number) {
        return await getRepository(Location).findOneOrFail(idProductStock, { 
            where: { status: Not(Status.DELETED) }
        })
        .catch(() => {
            throw new ForbiddenException(businessResponses.list.noPermission);
        });
    }

    /**
     *  Save the product stock when the product is variant
     *  that means it is referred to a productVariation id.
     * @param productStocks ProductStock data
     * @param idProductVariation id of the current product variation
     * @param user logged user extracted from the token
     */
    async saveProductStockWhenIsVariant(productStocks: any[], user: IUserReq, idProductVariation: number, response: IResponseStructure) {
        
        for (const item of productStocks) {
            
            const location = await this.getLocationAssociate(item.id);
            
            const productStock: {
                idProductVariation: number;
                idLocation: number;
                stock: number;
                price: number;
                status: string;
            } = {
                idProductVariation,
                idLocation: item.id,
                stock: item.stock,
                price: item.price,
                status: location.status
            };
            
            await this.create(productStock, user)
                .catch(() => {
                    throw new InternalServerErrorException(response);
                });
        }
    }

    /**
     * Save the product stock whhen the product is non-variant
     * @param productStocks Locations where the product is present
     * @param idProduct id of the product
     * @param user logged user extracted from the token
     * @param resonse Response with code and message
     */
    async saveProductStock(productStocks: any[], idProduct: number, user: IUserReq, response: IResponseStructure) {
        
        for (const item of productStocks) {

            const productStock: {
                idProduct: number;
                idLocation: number;
                stock: number;
                price: number;
            } = {
                idProduct,
                idLocation: item.id,
                stock: item.stock,
                price: item.price
            };

            await this.create(productStock, user)
                .catch(() => {
                    throw new InternalServerErrorException(response);
                });
        }
    }

    /**
     *  Update the product stock in the location
     *  
     * @param productStocks Locations data
     * @param idProductVariation id of the current product variation
     * @param user logged user extracted from the token
     */
    async updateproductStockWhenIsVariant(productStocks: any[],
                                          productVariation: ProductVariation, user: IUserReq, response: any) {
        
        const productStockAux = [];
        for (const item of productStocks) {

            const location = await this.getLocationAssociate(item.id);

            const productStock: {
                idProductVariation: number;
                idLocation: number;
                stock: number;
                price: number;
                status: string;
            } = {
                idProductVariation: productVariation.id,
                idLocation: item.id,
                stock: item.stock,
                price: item.price,
                status: location.status,
            };
            
            productStockAux.push(productStock);

            // check if a location with this variation exists in the database
            const productStockDB = productVariation.productStocks.find(element => {
                return +element.idLocation === +item.id;
            });
            
            // If it exists, it updates it, otherwise creates it
            if (productStockDB) {
                await this.updateEntity(productStock, productStockDB, user)
                    .catch(() => {
                        throw new InternalServerErrorException(
                            productResponses.modification.errorProductStock);
                    });
            } else {
                await this.save(productStock, user)
                    .catch(() => {
                        throw new InternalServerErrorException(
                            productResponses.creation.errorProductStock);
                    });
            }
        }

        // determine which ones to delete
        const productStockToDelete = productVariation.productStocks.filter(element => {
            return !productStockAux.some(e => {
                return element.idLocation === e.idLocation;
            });
        });
        
        await this.deleteProductStock(productStockToDelete, user, response.disable.errorProductStock);
    }

    /**
     *  Disable product stocks 
     * @param locations Locations to disable by id
     */
    async disableProductStock(locations: any, user: IUserReq, response: IResponseStructure) {
        for (const location of locations) {
            if (location.id) {
                await this.disableEntityByStatus(location, user)
                    .catch(() => {
                        throw new InternalServerErrorException(response);
                    });
            }
        }
    }

    /**
     *  Disable product stocks by Location id
     * @param locations Locations to disable by id
     */
    @Transactional()
    async disableProductStocksByLocation(idLocation: number, user: IUserReq, response: IResponseStructure) {
        
        const productStocksToDisable = await this.find({ where: [{ idLocation,
                                                status: Not( Status.DELETED )}] });
        
        for (const productStock of productStocksToDisable) {
            if (productStock.id && productStock.status !== Status.DELETED) {
                await this.disableEntityByStatus(productStock, user)
                    .catch(() => {
                        throw new InternalServerErrorException(response);
                    });
            }
        }
    }

    /**
     *  Delete product stocks by Location id
     * @param locations Locations to delete by id
     */
    @Transactional()
    async deleteProductStocksByLocation(idLocation: number, user: IUserReq,
                                        response: IResponseStructure) {
        
        const deleteProductStocksByLocation = await this.find({ where: [{ idLocation }] });

        for (const productStock of deleteProductStocksByLocation) {
            if (productStock.id && productStock.status !== Status.DELETED) {
                // set stock to zero
                productStock.stock = 0;
                
                await this.deleteEntityByStatus(productStock, user)
                    .catch(() => {
                        throw new InternalServerErrorException(response);
                    });
            }
        }
    }

    /**
     *  Enalbe product stocks by Location id
     * @param locations Locations to delete by id
     */
    @Transactional()
    async enableProductStocksByLocation(idLocation: number, user: IUserReq,
                                        response: IResponseStructure) {
        
        const productStocksToEnable = await this.find({ where: [{ idLocation,
                                                status: Not( Status.DELETED )}] });
        
        for (const productStock of productStocksToEnable) {
            if (productStock.id && productStock.status !== Status.DELETED) {
                await this.activateEntityByStatus(productStock, user)
                    .catch(() => {
                        throw new InternalServerErrorException(response);
                    });
            }
        }
    }

    /**
     *  Delete product stocks when the product variation is deleted
     * @param productStocks Locations to detele by id
     */
    async deleteProductStock(productStocks: any, user: IUserReq,
                             response: IResponseStructure) {
        for (const productStock of productStocks) {
            if (productStock.id) {
                // set stock to zero
                productStock.stock = 0;

                await this.deleteEntityByStatus(productStock, user)
                    .catch(() => {
                        throw new InternalServerErrorException(response);
                    });
            }
        }
    }

    /**
     * Disable product stock by product id
     * @param idProduct product id
     */
    async disableProductStocksByProduct(idProduct: number, user: IUserReq, response: IResponseStructure) {

        const productStocks = await this.find({
            where: { idProduct }
        });

        await this.disableProductStock(productStocks, user, response);
    }

    /**
     * Delete product stock by product id
     * @param idProduct product id
     */
    async deleteProductStockByProduct(idProduct: number, user: IUserReq, response: IResponseStructure) {

        const productStocks = await this.find({ where: { idProduct } });

        await this.deleteProductStock(productStocks, user, response);
    }

    /**
     *  Update the product stock when the product is not a variant
     * @param productStocks locations to update
     * @param product current product
     * @param user logged user extracted from the token
     */
    async updateProductStocksWhenIsNoVariant(productStocks: any[], product: Product,
                                             user: IUserReq, response: any) {
        
        const productStockAux = [];
        for (const item of productStocks) {
            
            const location = await this.getLocationAssociate(item.id);
            
            const productStock: {
                idProduct: number;
                idLocation: number;
                stock: number;
                price: number;
                status: string;
            } = {
                idProduct: product.id,
                idLocation: item.id,
                stock: item.stock,
                price: item.price,
                status: location.status,
            };

            productStockAux.push(productStock);
            
            const productStockDB = product.productStocks.find(element => {
                return +element.idLocation === +item.id;
            });

            if (productStockDB) {
                await this.update(productStock, productStockDB, user)
                    .catch(() => {
                        throw new InternalServerErrorException(response.modification.errorProductStock);
                    });
            } else {
                await this.save(productStock, user)
                    .catch(() => {
                        throw new InternalServerErrorException(response.creation.errorProductStock);
                    });
            }
        }

        const productStocksToDelete = product.productStocks.filter(element => {
            return !productStockAux.some(e => {
                return +element.idLocation === +e.idLocation;
            });
        });

        await this.deleteProductStock(productStocksToDelete, user,
                                             response.delete.errorProductStock);
    }

}
