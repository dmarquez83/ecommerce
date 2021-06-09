import { ForbiddenException, Injectable, 
    InternalServerErrorException, NotAcceptableException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { getRepository, Not, Repository } from 'typeorm';
import { Transactional } from 'typeorm-transactional-cls-hooked';
import { Status } from '../../common/enum/status.enum';
import { IPaginationOptions, IResponseStructureReturn } from '../../common/interfaces';
import { productResponses } from '../../common/responses/product.response';
import { BasicService } from '../../common/services/base.service';
import { Business, Product } from '../../models';
import { CategoriesService } from '../categories/categories.service';
import { ProductFilesService } from '../productFiles/productFiles.service';
import { ProductStocksService } from '../productStocks/productStocks.service';
import { ProductVariationsService } from '../productVariations/productVariations.service';
import { ProductWordsService } from '../productWords/productWords.service'
import { PropertyCombosService } from '../propertyCombos/propertyCombos.service';
import { IUserReq } from '../users/interfaces/userReq.interface';
import { CreateProductDto } from './dto/createProduct.dto';
import { UpdateProductDto } from './dto/updateProduct.dto';
import { UpdateStockDto } from './dto/updateStock.dto';

@Injectable()
export class ProductsService extends BasicService<Product> {

    constructor(@InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
                private readonly categoryService: CategoriesService,
                private readonly ProductVariationService: ProductVariationsService,
                private readonly productFileService: ProductFilesService,
                private readonly productWordsService: ProductWordsService,
                private readonly productStockService: ProductStocksService,
                private readonly propertyCombosService: PropertyCombosService,
    ) {
        super(productRepository);
    }

    /**
     * Find all active Products
     */
    async findAll(options: IPaginationOptions) {
        options.where = [{ status: Status.ENABLED }];
        const query = this.productRepository.createQueryBuilder('P')
            .innerJoinAndSelect('P.Category', 'C', 'P.idCategory = C.id')
            .innerJoinAndSelect('P.Business', 'E', 'P.idBusiness = E.id');

        const result = await this.paginate(options, query);

        return {
            code: 4130,
            message: 'Product List',
            status: true,
            result
        };

    }

    /**
     * Find products by category
     * 
     * @param idLocation Location id
     * @param lang language to translate
     * @param options options to paginate
     * @param user logged user extracted from the token
     */
    async findByLocation(idLocation: number, lang: string, options: IPaginationOptions,
                         response: IResponseStructureReturn) {

        const products = await this.productRepository.createQueryBuilder('P')
            .addSelect('"F"."stock"', 'P_stock')
            .addSelect('"F"."variations"', 'P_quantityVariations')
            .innerJoinAndSelect('P.category', 'C', 'P.idCategory = C.id')
            .innerJoinAndSelect('P.business', 'E', 'P.idBusiness = E.id')
            .leftJoinAndSelect('P.productFiles', 'pf', 'pf.idProduct = P.id')
            .leftJoinAndSelect('pf.files', 'f', 'f.name = pf.imgCode')
            .innerJoin(`(select d.* from get_product_location_stock(array[${idLocation}]) d)`, 'F', 'P.id = "F"."id_product"')
            .where('P.id IN (select ps.id_product FROM get_products_location(:idLocation) ps)', { idLocation })
            .andWhere('P.status <> :status', { status: Status.DELETED })
            .getMany();

        await this.categoryService.translateProductCategories(products, lang);
        await this.productFileService.mapProductsImages(products);

        const results = await this.paginate(options, products);

        return this.formatReturn(response, 'result', results);
    }
    /**
     * List product by id
     * 
     * @param productId product id to list
     * @param user logged user extracted from token
     * @param lang language to translate
     */
    async findById(productId: number, response: IResponseStructureReturn, lang ?: string) {

        const product = await this.productRepository.createQueryBuilder('P')
            .innerJoinAndSelect('P.category', 'C', 'C.id = P.idCategory')
            .innerJoinAndSelect('P.business', 'E', 'E.id = P.idBusiness')
            .leftJoinAndSelect('P.productFiles', 'pf', 'pf.idProduct = P.id')
            .leftJoinAndSelect('pf.files', 'f', 'f.name = pf.imgCode')
            .leftJoinAndSelect('P.productVariations', 'pv', 'pv.idProduct = P.id AND pv.status <> :status', { status: (Status.DELETED) })
            .leftJoinAndSelect('pv.productFiles', 'pf_pv', 'pf_pv.idProductVariation = pv.id')
            .leftJoinAndSelect('pf_pv.files', 'f_pv', 'f_pv.name = pf_pv.imgCode')
            .leftJoinAndSelect('pv.productStocks', 'ps', 'ps.idProductVariation = pv.id AND ps.status <> :status', { status: (Status.DELETED) })
            .leftJoinAndSelect('P.productStocks', 'pps', 'pps.idProduct = P.id AND pps.status <> :status', { status: (Status.DELETED) })
            .where('P.id = :productId', { productId })
            .andWhere('P.status <> :status', { status: Status.DELETED })
            .getOne();

        if (!product) {
            throw new InternalServerErrorException(productResponses.list.noPermission);
        }

        await this.mapProductDetail(product);
        
        product['categoryPath'] = await this.categoryService.findCategoryPath(product.idCategory);

        await this.categoryService.translateProductCategory(product, lang);
        return this.formatReturn(response, 'product', product);
    }

    /**
     *  Map the attributes of the product
     * @param product current product
     */
    async mapProductDetail(product: Product) {

        if (product.isVariant) {
            product['propertiesVariations'] = product.productVariations;

            await this.cleanProductVariation(product['propertiesVariations']);
            await this.getAndMapProperties(product);

            delete product.productVariations;
            delete product.productStocks;

            product['variations'] = {
                properties: product['propertiesVar'],
                propertiesVariations: product['propertiesVariations'],
            };

            delete product['productVariations'];
            delete product['productStocks'];
            delete product['propertiesVariations'];

            delete product['propertiesVar'];

        } else {
            this.cleanProductStocks(product.productStocks);

            delete product.productVariations;

            product['locations'] = product.productStocks;

            delete product.productStocks;
        }

        if (product.properties) {

            const properties = await this.propertyCombosService
                .getPropertyCombosByIds(product.properties as []);

            this.mapPropertiesCombos(properties);

            properties.map(e => {
                delete e.id;
                delete e.idProperty;
                return e;
            });

            product['properties'] = properties;
        } else {
            delete product['properties'];
        }

        if (product.productFiles) {
            this.productFileService.mapProductImages(product);
        }
    }

    /**
     * Map properties of the product
     * @param product current product
     */
    async getAndMapProperties(product: any) {
        let auxProperties = [];
        for (const propVar of product.propertiesVariations) {
            propVar.variation.forEach(e => {
                auxProperties.push({ name: e.property, type: e.type, characteristics: e.characteristics, idProperty: e.idProperty, id: e.id });
            });
        }

        const propertyGrouped = await this.groupBy(auxProperties, 'idProperty');

        product['propertiesVar'] = [];
        Object.keys(propertyGrouped).forEach((key: string) => {
            auxProperties = [];
            propertyGrouped[key].forEach(e => {

                const checkCombo = auxProperties.some(element => {
                    return +element.id === +e.id;
                });

                if (!checkCombo) {
                    auxProperties.push(e);
                }

            });
            const auxCharacteristics = [];

            const property: {
                name: string;
                type: string;
                characteristics: any[];
            } = {
                name: '',
                type: '',
                characteristics: [],
            };

            auxProperties.forEach(e => {
                property.name = e.name;
                property.type = e.type;
                auxCharacteristics.push(e.characteristics);
            });

            property.characteristics = auxCharacteristics;

            product['propertiesVar'].push(property);

        });

        // To delete the ids
        for (const propVar of product.propertiesVariations) {
            propVar.variation.forEach(e => {
                delete e.id;
                delete e.idProperty;
            });
        }
    }

    /**
     *  Clean properties to show the product
     * @param productVariations product variations
     */
    async cleanProductVariation(propertiesVariations: any[]) {

        for (const propertiesVariation of propertiesVariations) {
            const propCombos = await this.propertyCombosService
                .getPropertyCombosByIds(propertiesVariation.variations);

            this.mapPropertiesCombos(propCombos);

            propertiesVariation['variation'] = propCombos;

            delete propertiesVariation.variations;

            delete propertiesVariation.idProduct;
            delete propertiesVariation.images;

            if (propertiesVariation.productFiles) {
                propertiesVariation['images'] = await this.productFileService.
                                                mapProductFiles(propertiesVariation.productFiles);
            }

            delete propertiesVariation.productFiles;

            propertiesVariation.locations = propertiesVariation.productStocks;
            delete propertiesVariation.productStocks;

            for (const location of propertiesVariation.locations) {
                location.id = +location.idLocation;
                location.stock = +location.stock;
                location.price = +location.price;

                delete location.idProductVariation;
                delete location.idLocation;
                delete location.idProduct;
            }
        }

    }

    /**
     *  Clean properties of the characteristics
     */
    async mapPropertiesCombos(propertiesCombos: any[]) {
        propertiesCombos.map(e => {
            delete e.creationUser;
            delete e.creationDate;
            delete e.modificationDate;
            e.characteristics.map(element => {
                delete element.system;
                delete element.label;
                return element;
            });
            return e;
        });
    }

    /**
     * Clean properties of the locations to show
     * @param locations Locations to clean
     */
    cleanProductStocks(locations: any[]) {
        locations.map(e => {
            e.id = +e.idLocation;
            delete e.idProductVariation;
            delete e.idLocation;
            delete e.idProduct;
        });
    }
    /**
     * Find products by category
     */
    async findByCategory(idCategory: number, options: IPaginationOptions,
                         response: any) {

        options.where = [{ status: Not(Status.DELETED), idCategory }];

        await this.categoryService.findOneOrFail(idCategory)
            .catch(() => {
                throw new NotAcceptableException(response.error);
            });

        const result = await this.paginate(options);
        return this.formatReturn(response.success, 'result', result);
    }

    /**
     * Find products by category
     * 
     * @param idBusiness business id
     * @param lang language to translate
     * @param options options to paginate
     * @param user logged user extracted from the token
     */
    async findByBusiness(idBusiness: number, lang: string, options: IPaginationOptions, response: IResponseStructureReturn) {
        await getRepository(Business)
            .findOneOrFail(idBusiness)
            .catch(() => {
                throw new ForbiddenException(productResponses.list.noPermission);
            });

        options.where = [{ idBusiness }];

        const products = await this.productRepository.createQueryBuilder('P')
            .addSelect('"F"."stock"', 'P_stock')
            .addSelect('"F"."variations"', 'P_quantityVariations')
            .innerJoinAndSelect('P.category', 'C', 'P.idCategory = C.id')
            .innerJoinAndSelect('P.business', 'E', 'P.idBusiness = E.id')
            .leftJoinAndSelect('P.productFiles', 'pf', 'pf.idProduct = P.id')
            .leftJoinAndSelect('pf.files', 'f', 'f.name = pf.imgCode')
            .innerJoin(`(select d.* from get_product_business_stock(array[${idBusiness}]) d)`, 'F', 'P.id = "F"."id_product"')
            .where('P.status <> :status', { status: Status.DELETED })
            .getMany();

        await this.categoryService.translateProductCategories(products, lang);
        await this.productFileService.mapProductsImages(products);

        const results = await this.paginate(options, products);

        return this.formatReturn(response, 'result', results);
    }

    /**
     * Responsible for transforming the product from non-variant to variant
     * @param variations JSON of the variations
     * @param user logged user extracted from the token
     * @param product current product
     */
    async noVariantToVariant(variations: any, user: IUserReq, product: Product, response: any) {
        await this.propertyCombosService.saveProperties(variations, user, response.creation.errorProperty);

        await this.ProductVariationService
            .updateProductVariation(variations.propertiesVariations, user, product, response);

        await this.productStockService.deleteProductStockByProduct(product.id,
            user, response.disable.errorProductStock);
    }

    /**
     * Responsible for transforming the product from variant to non-variant
     * 
     * @param Locations JSON of the locations
     * @param user logged user extracted from the token
     * @param product current product
     */
    async variantToNoVariant(locations: any, user: IUserReq, product: Product, response: any) {
        await this.ProductVariationService.deleteProductVariation(product.productVariations, user, response.disable);

        await this.productStockService.updateProductStocksWhenIsNoVariant(locations, product, user, response);
    }

    /**
     *  Update the product when is variant
     * @param variations JSON variations
     * @param user logged user extracted from the token
     * @param product current product
     */
    async variantToVariant(variations: any, user: IUserReq, product: Product, response: any) {
        await this.propertyCombosService.saveProperties(variations, user, response.modification.errorProperty);

        await this.ProductVariationService
            .updateProductVariation(variations.propertiesVariations, user, product, response);
    }

    /**
     * Update the product when is non-variant
     * @param locations JSON locations
     * @param user logged user extracted from the token
     * @param product current product
     */
    async noVariantToNoVariant(locations: any, user: IUserReq, product: Product, response: any) {
        await this.productStockService
            .updateProductStocksWhenIsNoVariant(locations, product, user, response);
    }

    /**
     * Create a new product
     * 
     * @param data body to create the product
     * @param user logged user extracted from the auth token
     */
    @Transactional()
    async create(data: CreateProductDto, user: IUserReq,
                 response: any): Promise<any> {

        await this.checkProductExistInBusinessByName(data.name, data.idBusiness, response.nameBeUnique);

        if (data.properties) {
            data.properties = await this.propertyCombosService.saveStaticProperties(data.properties,
                user, response.errorProperty);
        } else {
            data.properties = null;
        }

        const newProduct = await this.save(data, user)
            .catch(() => {
                throw new InternalServerErrorException(response.error);
            });

        if (data.images) {
            await this.productFileService.saveProductImgOrVariation(data.images, user,
                response.cantSaveImages, newProduct.id);
        }

        if (data.isVariant) {

            await this.propertyCombosService.saveProperties(data.variations, user, response.errorProperty);

            // Perform logic for saving if variant
            await this.ProductVariationService
                .saveProductVariations(data.variations.propertiesVariations, user, newProduct,
                    response);
        } else {
            // Perform logic for saving if not variant
            await this.productStockService.saveProductStock(data.locations, newProduct.id,
                user, response.errorProductStockNoVariant);

        }
        
        const product = (await this.findById(newProduct.id, productResponses.list.noPermission)).product;
        this.productWordsService.saveProductWords(product, user.userId);
        
        return this.formatReturn(response.success, 'product', product);
    }

    /**
     *  Map the product to append the variation JSON
     * 
     * @param product product 
     * @param variations varation JSON
     */
    mapProductVariation(product: any, variations: JSON) {
        product.variations = variations;
    }

    /**
     * Change product status to 'Deleted'
     * 
     * @param id Product id to delete
     * @param user Logged user extracted from the token
     */
    @Transactional()
    async delete(id: number, user: IUserReq, response: any) {
        const product = await this.productRepository
            .findOneOrFail(id, {
                where: { status: Not(Status.DELETED) },
                relations: ['business', 'category', 'productStocks',
                    'productVariations', 'productVariations.productStocks']
            })
            .catch(() => {
                throw new ForbiddenException(response.error);
            });

        await this.deleteEntityByStatus(product, user)
            .catch(() => {
                throw new InternalServerErrorException(response.error);
            });

        if (product.isVariant) {
            await this.ProductVariationService.deleteProductVariation(product.productVariations,
                user, response);
        } else {
            await this.productStockService
                .deleteProductStockByProduct(product.id, user,
                    response.errorProductStock);
        }

        await this.mapProductDetail(product);

        return this.formatReturn(response.success, 'product', product);
    }

    /**
     * Change product status to 'Disabled'
     * 
     * @param id Product id to delete
     * @param user Logged user extracted from the token
     */
    @Transactional()
    async disable(id: number, user: IUserReq, response: any) {
        const product = await this.findOneOrFail(id, {
            where: { status: Not(Status.DELETED) },
            relations: ['business', 'category',
                'productStocks', 'productVariations',
                'productVariations.productStocks']
        })
            .catch(() => {
                throw new ForbiddenException(productResponses.disable.noPermission);
            });

        await this.disableEntityByStatus(product, user)
            .catch(() => {
                throw new InternalServerErrorException(response.error);
            });

        if (product.isVariant) {
            await this.ProductVariationService.disableProductVariation(product.productVariations,
                user, response);
        }

        await this.mapProductDetail(product);

        return this.formatReturn(response.success, 'product', product);
    }

    /**
     * Update Product 
     * 
     * @param id product id to update
     * @param body new data to update the product
     * @param user logged user extracted from the token
     */
    @Transactional()
    async updateProduct(id: number, body: UpdateProductDto, user: IUserReq, response: any) {

        const product = await this.findOneOrFail(id, { where: { status: Not(Status.DELETED) } })
            .catch(() => {
                throw new NotAcceptableException(response.noPermission);
            });

        const productNoRefered = { ...product };

        await this.checkProductExistInBusinessByName(body.name, product.idBusiness, response.nameBeUnique, id);

        if (body.properties) {
            body.properties = await this.propertyCombosService.saveStaticProperties(body.properties, user,
                response.errorProperty);
        } else {
            body.properties = null;
        }

        const updatedProduct = await this.updateAndGetRelations(body, product, user,
            [
                'category', 'business',
                'productStocks', 'productVariations',
                'productVariations.productStocks'
            ])
            .catch(() => {
                throw new InternalServerErrorException(response.error);
            });

        if (body.images) {
            await this.productFileService.updateProductImgOrVariation(body.images, user,
                productResponses.creation.cantSaveImages, id);
        }

        // When the product is variant
        if (body.variations && body.isVariant) {

            if (productNoRefered.isVariant) {
                await this.variantToVariant(body.variations, user, updatedProduct, productResponses);
            } else {
                await this.noVariantToVariant(body.variations, user, updatedProduct, productResponses);
            }
        }

        // When the product is not a variant
        if (body.locations && !body.isVariant) {

            if (!productNoRefered.isVariant) {
                await this.noVariantToNoVariant(body.locations, user, updatedProduct, productResponses);
            } else {
                await this.variantToNoVariant(body.locations, user, updatedProduct, productResponses);
            }
        }

        const productToReturn = (await this.findById(id, productResponses.list.noPermission)).product;
        this.productWordsService.saveProductWords(productToReturn, user.userId);

        return this.formatReturn(response.success, 'product', productToReturn);
    }

    /**
     * Check if a product with name specified already exist on a business
     * 
     * @param name name of the product
     * @param idBusiness id of the company
     * @param response code of error
     * @param id id of the product used to validate that the name, 
     * if it exists, does not belong to the product to be updated, 
     * and thus avoid error
     */
    async checkProductExistInBusinessByName(name: string,
                                            idBusiness: number,
                                            response: any,
                                            id?: number) {

        let query = this.productRepository.createQueryBuilder('P')
            .andWhere('P.status <> :status', { status: Status.DELETED })
            .andWhere('P.idBusiness = :idBusiness', { idBusiness })
            .andWhere('LOWER(P.name) = :name', { name: name.toLowerCase() });

        if (id) {
            query = query.andWhere('P.id <> :id', { id });
        }

        if (await query.getOne()) {
            throw new NotAcceptableException(response);
        }

        return;
    }

    /**
     * Activate a product
     * @param idProduct product id to be activated
     * @param user logged user extracted from token
     */
    @Transactional()
    async activate(idProduct: number, user: IUserReq) {

        const product = await this.findOneOrFail(idProduct, {
            where: { status: Not(Status.DELETED) },
            relations: ['business', 'category', 'productStocks',
                'productVariations', 'productVariations.productStocks']
        })
            .catch(() => {
                throw new ForbiddenException(productResponses.activate.noPermission);
            });

        await this.activateEntityByStatus(product, user)
            .catch(() => {
                throw new InternalServerErrorException(productResponses.activate.error);
            });

        if (product.isVariant) {
            await this.ProductVariationService.enableProductVariation(product.productVariations,
                user, productResponses.disable);
        }

        return this.formatReturn(productResponses.activate.success, 'product',
            (await this.findById(idProduct, productResponses.list.noPermission)).product);
    }

    /**
     *  Update the stock in the location
     * @param id if the product is a variant, it is the id of the variation, if not the product
     * @param data locations to update
     * @param user logged user extracted from token
     */
    @Transactional()
    async updateStock(id: number, data: UpdateStockDto, user: IUserReq, response: any) {

        if (data.isVariant) {
            const productVariation = await this.ProductVariationService.findOneOrFail(id,
                {
                    relations: ['productStocks', 'product'],
                    where: { status: Not(Status.DELETED) }
                }).catch(() => {
                    throw new ForbiddenException(response.noPermission);
                });

            await this.updateStockLocations(data.locations, id, data.isVariant,
                        productVariation.productStocks, user, response.errorProductStock);
        } else {
            const product = await this.productRepository.findOneOrFail(id,
                { relations: ['productStocks'], where: { status: Not(Status.DELETED) } })
                .catch(() => {
                    throw new ForbiddenException(response.noPermission);
                });

            await this.updateStockLocations(data.locations, id, data.isVariant,
                        product.productStocks, user, response.errorProductStockNoVariant);
        }

        return this.formatReturn(response.success, 'product',
                        (await this.findById(id, productResponses.list.noPermission)).product);
    }

    /**
     * Update the stock in each location
     * @param locations Locations[] with new stock and price
     * @param id if the product is a variant, it is the id of the variation, if not the product
     * @param isVariant if the product is variant true otherwise false.
     * @param productStocks product stocks in database
     * @param user logged user extracted from token
     */
    async updateStockLocations(locations: any, id: number, isVariant: boolean, productStocks: any, user: IUserReq, response: any) {
        for (const location of locations) {
            const productStock: {
                idProductVariation?: number;
                idProduct?: number;
                idLocation: number;
                stock: number;
                price: number;
            } = {
                idLocation: location.id,
                stock: location.stock,
                price: location.price
            };

            productStock[isVariant ? 'idProductVariation' : 'idProduct'] = id;

            const locationDB = productStocks.find(element => {
                return +element.idLocation === +location.id;
            });

            await this.productStockService.update(productStock, locationDB, user)
                .catch(() => {
                    throw new InternalServerErrorException(response);
                });
        }
    }
}
