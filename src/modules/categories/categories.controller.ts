import { Body, Controller, Delete, Get, Headers, Param, Post, Put, Query, UseGuards, UsePipes } from '@nestjs/common';
import { UserDec } from '../../common/decorators/user.decorator';
import { JwtAuthGuard } from '../../common/guards/jwt.guard';
import { TrimPipe } from '../../common/pipes/trim.pipe';
import { ValidationPipe } from '../../common/pipes/validation.pipe';
import { categoryResponses } from '../../common/responses/categories.response';
import { IUserReq } from '../users/interfaces/userReq.interface';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/createCategory.dto';
import { TypeDto } from './dto/type.dto';

@UsePipes(new TrimPipe(), new ValidationPipe())
@Controller('categories')
export class CategoriesController {

    constructor(private readonly categoriesService: CategoriesService) {}

    /**
     *  Activate a category
     * 
     * @param id if of the category to activate
     */
    @UseGuards(JwtAuthGuard)
    @Put('activate/:id')
    activate(@Param('id') id: number, @UserDec() user: IUserReq) {
        return this.categoriesService.activate(id, user, categoryResponses.activate);
    }

    /**
     * Create a Category
     */
    @UseGuards(JwtAuthGuard)
    @Post()
    create(@Body() data: CreateCategoryDto, @UserDec() user: IUserReq) {
        return this.categoriesService.create(data, user, categoryResponses.creation);
    }

    /**
     *  Disable a category
     * @param id if of the category to disabled
     */
    @UseGuards(JwtAuthGuard)
    @Delete(':id')
    disable(@Param('id') id: number, @UserDec() user: IUserReq) {
        return this.categoriesService.disable(id, user, categoryResponses.disable);
    }

    /**
     * Responsible for listing categories.
     * @param page Page you wish to consult.
     * @param limit Item per page.
     * @param order Order "ASC" | "DESC"
     * @param orderBy Field to order
     */
    @Get()
    findAll(@Query('limit') limit: number, 
            @Query('page') page: number, 
            @Query('order') order: 'ASC' | 'DESC', 
            @Query('orderBy') orderBy: string) {
       return this.categoriesService.findAll({page, limit, order, orderBy});
    }

    /**
     * Find a category by its id
     * 
     * @param id Category id to be listed
     */
    @Get(':id')
    findById(@Param('id') id: number, @Headers('language') lang: string) {
        return this.categoriesService.findById(id, lang);
    }

    /**
     * Find all categories by type
     * 
     * @param typeObject type to search.
     */
    @UsePipes(new ValidationPipe())
    @Get('type/:type')
    findByType(@Param() typeObject: TypeDto,  @Headers('language') lang: string) {      
        return this.categoriesService.findByType(typeObject.type, lang);
    }

    /**
     * Find all categories by type
     * 
     * @param typeObject type to search.
     */
    @UsePipes(new ValidationPipe())
    @Get('search/:type')
    search( @Param('type') type: string, 
            @Query('search') search: string, 
            @Headers('language') lang: string) {      
        return this.categoriesService.searchByType(search, type, lang);
    }


    /**
     * Find all parent categories with its children
     * 
     * @param typeObject type to search.
     */
    @UsePipes(new ValidationPipe())
    @Get('roots/:type')
    findRoots(@Param() typeObject: TypeDto, @Headers('language') lang: string) {      
        return this.categoriesService.findRootsByType(typeObject.type, lang);
    }

    /**
     * Update a Category
     */
    @UseGuards(JwtAuthGuard)
    @Put(':id')
    update(@Param('id') id: number, @Body() data: CreateCategoryDto, @UserDec() user: IUserReq) {
        return this.categoriesService.update(id, data, user, categoryResponses.modification);
    }
}
