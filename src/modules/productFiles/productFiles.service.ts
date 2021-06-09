import { Inject, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BasicService } from '../../common/services';
import { File, ProductFile, Product } from '../../models';
import { FilesService } from '../files/files.service';
import { IUserReq } from '../users/interfaces/userReq.interface';
import { CreateProductFileDto } from './dto/createProductFile.dto';
import { UpdateProductFileDto } from './dto/updateProductFile.dto';
import _ = require('lodash');
import { filesResponses } from '../../common/responses/files.response';

@Injectable()
export class ProductFilesService extends BasicService<ProductFile> {

    constructor(
        @InjectRepository(ProductFile)
        private readonly productFileRepository: Repository<ProductFile>,
        @Inject('FilesService') private readonly filesService: FilesService,
    ) {
        super(productFileRepository);
    }

    /**
     * Create products files
     * @param data Products File
     * @param user Logged user
     * @param response response to return structure
     */
    async create(data: CreateProductFileDto, user: IUserReq, response: any) {

        const imgCodeUnique = _.uniq(data.imgCode);

        const filesDB = await this.filesService.findByArrayNamesOrFail(imgCodeUnique);

        if (imgCodeUnique.length !== filesDB.length) {
            throw new NotFoundException(filesResponses.list.notFound);
        }

        for (const [index, imgCode] of imgCodeUnique.entries()) {
            const productFile: {
                imgCode: string;
                idProduct?: number,
                idProductVariation?: number
                position: number;
            } = {
                imgCode,
                position: index
            };

            if (data.idProduct) {
                productFile.idProduct = data.idProduct;
            }

            if (data.idProductVariation) {
                delete productFile.idProduct;
                productFile.idProductVariation = data.idProductVariation;
            }
            
            await this.save(productFile, user)
                .catch(() => {
                    throw new InternalServerErrorException(response);
                });
        }

    }

    /**
     *  Find all files of this product or variation
     * @param id IdProduct or IdVariation
     * @param isVariant Product is variant or not
     */
    async findAllProductOrVariationFiles(id: number, isVariant: boolean) {

        if (isVariant) {
            return this.find({ where: { idProductVariation: id} });
        }

        return this.find({ where: { idProduct: id} });
    }

    /**
     * Update all files of the product
     * @param data Data to create a file group
     * @param user Logged user
     * @param response response to return structure
     */
    async update(data: UpdateProductFileDto, user: IUserReq, response: any) {

        const productFiles = await this.findAllProductOrVariationFiles(data.idProduct 
                                    || data.idProductVariation, !!data.idProductVariation);
    
        // check producFiles to delete
        const productFilesToDelete = productFiles.filter(item => {
            return !data.imgCode.some(e => e === item.imgCode);
        });

        await this.deleteEntity(productFilesToDelete);

        await this.create(data, user, response);
        
    }

    /**
     *  Save all images of the product or variation
     * @param images Array of img name
     * @param idProduct id of product
     * @param user Logged user
     * @param response response to return structure
     * @param idProductVariation id of the productVariation
     */
    async saveProductImgOrVariation(images: string[], user: IUserReq, response: any,
                                    idProduct: number, idProductVariation?: number): Promise<void> {
        const productFile: {
            imgCode: string[],
            idProduct: number
            idProductVariation?: number;
        } = {
            imgCode: images,
            idProduct
        };

        if (idProductVariation) {
            delete productFile.idProduct;
            productFile.idProductVariation = idProductVariation;
        }
        
        await this.create(productFile, user, response);
    }

    /**
     *  Update all images of the product or variation
     * @param images Array of img name
     * @param idProduct id of product
     * @param user Logged user
     * @param response response to return structure
     * @param idProductVariation id of the productVariation
     */
    async updateProductImgOrVariation(images: string[], user: IUserReq, response: any,
                                      idProduct: number, idProductVariation?: number): Promise<void> {
        const productFile: {
            imgCode: string[],
            idProduct: number
            idProductVariation?: number;
        } = {
            imgCode: images,
            idProduct
        };

        if (idProductVariation) {
            delete productFile.idProduct;
            productFile.idProductVariation = idProductVariation;
        }
        
        await this.update(productFile, user, response);
    }

    async mapProductsImages(products: Product[]): Promise<Product[]> {

        for (const product of products) {
            this.mapProductImages(product);
        }

        return products;
    }

    async mapProductImages(product: Product): Promise<Product>{
        const images = await this.mapProductFiles(product.productFiles);
            
        product['images'] = images;
        
        product['profilePhoto'] = images[0];
        delete product['productFiles'];

        return product;
    }

    /**
     * Get files array of this product
     * @param productFiles ProductFiles array
     */
    async mapProductFiles(productFiles: ProductFile[]): Promise<File[]> {
        const images = await this.orderBy(productFiles, ['position'], 'asc');

        return images.map(element => element.files);
    }
}
