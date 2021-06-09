import { Body, Controller, Delete, Get, Headers, Param, Post, Put, Query, UseGuards, UsePipes } from '@nestjs/common';
import { Roles } from '../../common/decorators/roles.decorator';
import { UserDec } from '../../common/decorators/user.decorator';
import { ProductPermission } from '../../common/enum/productPermission.enum';
import { JwtAuthGuard } from '../../common/guards/jwt.guard';
import { ProductCrudValidation } from '../../common/pipes/productCrudValidation.pipe';
import { ValidationPipe } from '../../common/pipes/validation.pipe';
import { productResponses } from '../../common/responses/product.response';
import { IUserReq } from '../users/interfaces/userReq.interface';
import { CreateProductDto } from './dto/createProduct.dto';
import { UpdateProductDto } from './dto/updateProduct.dto';
import { UpdateStockDto } from './dto/updateStock.dto';
import { ProductsRolesGuard } from './guards/productRoles.guard';
import { ProductsService } from './products.service';

@Controller('products')
export class ProductsController {

    constructor(
        private readonly productsService: ProductsService
    ) {}

    /**
     * Find a product by the id specified
     * 
     * @param id product id to find
     * @param lang language to translate
     */
    @UseGuards(JwtAuthGuard, ProductsRolesGuard)
    @Roles(ProductPermission.LIST)
    @Get(':id')
    async findById(@Param('id') id: number, @Headers('language') lang: string) {
        return await this.productsService.findById(id, productResponses.list.success, lang);
    }

    /**
     * Find products related to a specific category
     * 
     * @param idCategory Category Id to filter products
     * @param limit Item per page.
     * @param page Page you wish to consult.
     * @param order Order "ASC" | "DESC"
     * @param orderBy Field to order 
     */
    @UseGuards(JwtAuthGuard)
    @Get('category/:id')
    findByCategory(@Param('id') idCategory: number, 
                   @Query('page') page: number,
                   @Query('limit') limit: number,
                   @Query('order') order: 'ASC' | 'DESC',
                   @Query('orderBy') orderBy: string) {
        return this.productsService.findByCategory(idCategory, {page, limit, order, orderBy},
                                                    productResponses.list);
    }

    /**
     * Find products by business
     * 
     * @param idBusiness business id
     * @param lang language to translate
     * @param limit Item per page.
     * @param page Page you wish to consult.
     * @param order Order "ASC" | "DESC"
     * @param orderBy Field to order
     * @param user logged user extracted from the token
     */
    @UseGuards(JwtAuthGuard, ProductsRolesGuard)
    @Roles(ProductPermission.LIST)
    @Get('business/:id')
    findByBusiness( @Param('id') idBusiness: number,
                    @Headers('language') lang: string,
                    @Query('page') page: number,
                    @Query('limit') limit: number,
                    @Query('order') order: 'ASC' | 'DESC',
                    @Query('orderBy') orderBy: string) {
        return this.productsService.findByBusiness(idBusiness, lang,
                    {page, limit, order, orderBy}, productResponses.list.success);
    }

    /**
     * Find products by enterpris
     * 
     * @param idLocation Location id
     * @param limit Item per page.
     * @param page Page you wish to consult.
     * @param order Order "ASC" | "DESC"
     * @param orderBy Field to order
     * @param user logged user extracted from the token
     */
    @UseGuards(JwtAuthGuard)
    @Get('location/:id')
    findByLocation( @Param('id') idLocation: number, 
                    @Headers('language') lang: string,
                    @Query('page') page: number,
                    @Query('limit') limit: number,
                    @Query('order') order: 'ASC' | 'DESC',
                    @Query('orderBy') orderBy: string) {
        return this.productsService.findByLocation(idLocation, lang, {page, limit, order, orderBy},
                    productResponses.list.success);
    }

    /**
     * Create a new product
     * 
     * @param data parameters required to create a new product
     * @param user user logged extracted from the token
     */
    @UsePipes(new ValidationPipe())
    @UsePipes(new ProductCrudValidation())
    @UseGuards(JwtAuthGuard, ProductsRolesGuard)
    @Roles(ProductPermission.CREATE)
    @Post()
    create(@Body() data: CreateProductDto, @UserDec() user: IUserReq) {
        return this.productsService.create(data, user, productResponses.creation);  
    }

    /**
     * Change product status to 'Deleted'
     * 
     * @param productId product id to delete
     * @param user logged user extracted from the token
     */
    @UseGuards(JwtAuthGuard, ProductsRolesGuard)
    @Roles(ProductPermission.DELETE)
    @Delete(':id')
    delete(@Param('id') productId: number, @UserDec() user: IUserReq) {
        return this.productsService.delete(productId, user, productResponses.delete);
    }

    /**
     * Change product status to 'Disable'
     * 
     * @param productId product id to Disable
     * @param user logged user extracted from the token
     */
    @UseGuards(JwtAuthGuard, ProductsRolesGuard)
    @Roles(ProductPermission.DISABLE)
    @Put('/:id/disable')
    disable(@Param('id') productId: number, @UserDec() user: IUserReq) {
        return this.productsService.disable(productId, user, productResponses.disable);
    }

    /**
     * Update a product
     * 
     * @param productId product id to update
     * @param body update data
     * @param user logged user extracted from token
     */
    @UsePipes(new ValidationPipe())
    @UseGuards(JwtAuthGuard, ProductsRolesGuard)
    @Roles(ProductPermission.MODIFY)
    @Put(':id')
    update(@Param('id') productId: number, @Body() body: UpdateProductDto, @UserDec() user: IUserReq) {
        return this.productsService.updateProduct(productId, body, user,  productResponses.modification);
    }

    /**
     * Activate a product
     * @param id product id to be activated
     * @param user logged user extracted from token
     */
    @UsePipes(new ValidationPipe())
    @UseGuards(JwtAuthGuard, ProductsRolesGuard)
    @Roles(ProductPermission.ENABLE)
    @Put('/:id/activate')
    activate(@Param('id') id: number, @UserDec() user: IUserReq) {
        return this.productsService.activate(id, user);
    }

    /**
     *  Update stock product
     * @param id id Of product to update
     * @param data Data to update
     * @param user Logged user
     */
    @UsePipes(new ValidationPipe())
    @UseGuards(JwtAuthGuard, ProductsRolesGuard)
    @Roles(ProductPermission.STOCK)
    @Put(':id/stock')
    updateStock(@Param('id') id: number, @Body() data: UpdateStockDto, @UserDec() user: IUserReq) {
        return this.productsService.updateStock(id, data, user, productResponses.modification);
    }
}
