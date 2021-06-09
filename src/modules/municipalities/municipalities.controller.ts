import { Body, Controller, Delete, Get, Param, Post, Put, UseGuards, UsePipes } from '@nestjs/common';
import { UserDec } from '../../common/decorators/user.decorator';
import { JwtAuthGuard } from '../../common/guards/jwt.guard';
import { TrimPipe } from '../../common/pipes/trim.pipe';
import { ValidationPipe } from '../../common/pipes/validation.pipe';
import { municipalitiesResponse } from '../../common/responses/municipalities.responses';
import { IUserReq } from '../users/interfaces/userReq.interface';
import { CreateMunicipalityDto } from './dto/createMunicipality.dto';
import { UpdateMunicipalityDto } from './dto/updateMunicipality.dto';
import { MunicipalitiesService } from './municipalities.service';

@UsePipes(new TrimPipe(), new ValidationPipe())
@Controller('municipalities')
export class MunicipalitiesController {

    constructor(private readonly municipalityRepository: MunicipalitiesService) { }

    /**
     * Return all the municipalities
     */
    @Get()
    findAll() {
       return this.municipalityRepository.findAll();
    }

    /**
     *  Create new municipality
     * 
     * @param data Name and idState of the new municipality
     * @param user Logged user
     */
    @UseGuards(JwtAuthGuard)
    @Post()
    create(@Body() data: CreateMunicipalityDto, @UserDec() user: IUserReq) {
        return this.municipalityRepository.create(data, user, municipalitiesResponse.create);
    }

    /**
     * Fin a municipality by id
     * @param id id of the municipality to find
     *
     */
    @Get(':id')
    findById(@Param('id') id: number) {
        return this.municipalityRepository.finById(id, municipalitiesResponse.list);
    }

    /**
     * Update a municipality
     * 
     * @param id id of the municipality to Update
     * @param data Name and idState of the municipality
     * @param user Logged user
     */
    @UseGuards(JwtAuthGuard)
    @Put(':id')
    update(@Param('id') id: number, @Body() data: UpdateMunicipalityDto, @UserDec() user: IUserReq) {
        return this.municipalityRepository.update(id, data, user, municipalitiesResponse.update);
    }
    
    /**
     *  Disable a category
     * @param id if of the category to disabled
     */
    @UseGuards(JwtAuthGuard)
    @Delete(':id')
    disable(@Param('id') id: number, @UserDec() user: IUserReq) {
        return this.municipalityRepository.disable(id, user, municipalitiesResponse.disable);
    }

    /**
     *  Activate a category
     * 
     * @param id if of the category to activate
     */
    @UseGuards(JwtAuthGuard)
    @Put('activate/:id')
    activate(@Param('id') id: number, @UserDec() user: IUserReq) {
        return this.municipalityRepository.activate(id, user, municipalitiesResponse.enable);
    }
}
