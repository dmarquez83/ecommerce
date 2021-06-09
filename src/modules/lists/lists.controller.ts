import { Body, Controller, Delete, Get, Param, Post, Put, UseGuards, UsePipes } from '@nestjs/common';
import { UserDec } from '../../common/decorators/user.decorator';
import { JwtAuthGuard } from '../../common/guards/jwt.guard';
import { TrimPipe } from '../../common/pipes/trim.pipe';
import { ValidationPipe } from '../../common/pipes/validation.pipe';
import { IUserReq } from '../../modules/users/interfaces/userReq.interface';
import { CreateListDto } from './dto/createLists.dto';
import { UpdateListDto } from './dto/updateLists.dto';
import { ListsService } from './lists.service';

@UsePipes(TrimPipe)
@UsePipes(ValidationPipe)
@Controller('lists')
export class ListsController {

    constructor(private readonly listsService: ListsService) {}
    /**
     * Find all lists with its listOptions values
     */
    @Get()
    findAll() {
        return this.listsService.findAll();
    }

    /**
     * Find a list with specified id
     * @param id list id
     */
    @Get(':id')
    findById(@Param('id') id: number) {
        return  this.listsService.findById(id);
    }

    /**
     * Find Lists by category specified by its id
     * @param idCategory category ID
     */
    @Get('category/:idCategory')
    findByCategory(@Param('idCategory') idCategory: number) {
        return this.listsService.findByCateogory(idCategory);
    }

    /**
     * Find Lists by category specified by its id
     * @param idCategory category ID
     */
    @Get('product/:idProduct')
    findByProduct(@Param('idProduct') idProduct: number) {
        return this.listsService.findByProduct(idProduct);
    }

    /**
     * Create a List
     * 
     * @param body data to create a new list
     * @param user logged user extracted from token
     */
    @UseGuards(JwtAuthGuard)
    @Post()
    create(@Body() body: CreateListDto, @UserDec() user: IUserReq) {
        return this.listsService.create(body, user);
    }

    /**
     * Update a List
     * 
     * @param id List Id
     * @param body data to update the list
     * @param user logged user extracted from token
     */
    @UseGuards(JwtAuthGuard)
    @Put(':id')
    update(@Param('id') id: number, @Body() body: UpdateListDto, @UserDec() user: IUserReq) {
        return this.listsService.update(id, body, user);
    }

    /**
     * Disable a List
     * 
     * @param id List Id
     * @param user logged user extracted from token
     */
    @UseGuards(JwtAuthGuard)
    @Delete(':id')
    disable(@Param('id') id: number, @UserDec() user: IUserReq) {
        return this.listsService.disable(id, user);
    }

    /**
     * Enable a List
     * 
     * @param id List Id
     * @param user logged user extracted from token
     */
    @UseGuards(JwtAuthGuard)
    @Put('activate/:id')
    enable(@Param('id') id: number, @UserDec() user: IUserReq) {
        return this.listsService.enable(id, user);
    }
}
