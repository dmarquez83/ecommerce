import { Body, Controller, Delete, Get, Param, Post, Put, Query, Req, UseGuards, UsePipes } from '@nestjs/common';
import { Roles } from '../../common/decorators/roles.decorator';
import { UserDec } from '../../common/decorators/user.decorator';
import { BusinessPermission } from '../../common/enum/businessPermission.enum';
import { TeammatePermission } from '../../common/enum/teammatePermission.enum';
import { JwtAuthGuard } from '../../common/guards/jwt.guard';
import { TrimPipe } from '../../common/pipes/trim.pipe';
import { ValidationPipe } from '../../common/pipes/validation.pipe';
import { businessResponses } from '../../common/responses/business.response';
import { teammatesResponses } from '../../common/responses/teammates.response';
import { IUserReq } from '../users/interfaces/userReq.interface';
import { BusinessesService } from './businesses.service';
import { AssignRoleDto } from './dto/assignRoleBusiness.dto';
import { CreateBusinessDto } from './dto/createBusiness.dto';
import { InviteTeammateDTO } from './dto/inviteTeammate.dto';
import { UpdateBusinessDto } from './dto/updateBusiness.dto';
import { BusinessRolesGuard } from './guard/businessRoles.guard';

@UseGuards(JwtAuthGuard, BusinessRolesGuard)
@UsePipes(new TrimPipe())
@Controller('businesses')
export class BusinessesController {

    constructor(
        private readonly businessRepository: BusinessesService
    ) { }

    /**
     * Responsible for listing companies.
     */
    @Get()
    // this function doesn't need permission, because you don't
    // need permission to list the businesses that you have
    async index(@UserDec() user: IUserReq) {
        return await this.businessRepository.index(user, businessResponses.list);
    }

    /**
     * Delete Business
     * 
     * @param id: id of business to be deleted 
     */
    @Roles(BusinessPermission.DELETE)
    @Delete(':id')
    async delete(@Param('id') id: number, @UserDec() user: IUserReq) {
        return await this.businessRepository.delete(id, user, businessResponses.delete);
    }
    
    /**
     * Disable a business
     * 
     * @param id: business id that is going to be disabled  
     */
    // @Roles(BusinessPermission.DISABLE)
    @Put(':id/disable')
    async disable(@Param('id') id: number, @UserDec() user) {
        return await this.businessRepository.disable(id, user, businessResponses.disable);
    }

    /**
     * Enable a business
     * 
     * @param id: business id that is going to be enabled  
     */
    @Roles(BusinessPermission.ENABLE)
    @Put(':id/activate')
    async activate(@Param('id') id: number, @UserDec() user: IUserReq) {
        return await this.businessRepository.activate(id, user, businessResponses.activate);
    }
    
    /**
     * Finds a business with id specified
     * @param id: id of the business to find 
     */
    @Roles(BusinessPermission.LIST)
    @Get(':id')
    async find(@Param('id') id: number) {
        return await this.businessRepository.findById(id, businessResponses.list);
    }

    /**
     * Updates an business
     * @param id Business id that is going to be updated.
     * @param bodyBusiness Object with the data to update the use
     */
    @UsePipes(new ValidationPipe())
    @Roles(BusinessPermission.MODIFY)
    @Put(':id')
    update(@Param('id') id: number, @Body() bodyBusiness: UpdateBusinessDto, @Req() req) {
        return this.businessRepository.update(id, bodyBusiness, req.user, businessResponses.modification);
    }

    /**
     * Creates a new business
     * @param bodyBusiness: business data required to create 
     */
    @UsePipes(new ValidationPipe())
    @Roles(BusinessPermission.CREATE)
    @Post()
    create(@Body() bodyBusiness: CreateBusinessDto, @Req() req) {
        return this.businessRepository.create(bodyBusiness, req.user, businessResponses.creation);
    }

    /**
     *  Assign role to user in the business
     * @param data Business, user, and rol to assign.
     */
    @UsePipes(new ValidationPipe())
    @Roles(TeammatePermission.MODIFY)
    @Put(':id/teammates/:idUser')
    assignRoles(@Param('id') idBusiness: number, @Param('idUser') idUser: number, @Body() data: AssignRoleDto, @UserDec() user: IUserReq) {
        return this.businessRepository.assignRol(idBusiness, idUser, data, user, teammatesResponses.modification);
    }

    /**
     *  Assign role to user in the business
     * @param data Business, user, and rol to assign.
     */
    @UsePipes(new ValidationPipe())
    @Roles(TeammatePermission.INVITE)
    @Post(':id/teammates/')
    inviteTeammate(@Param('id') idBusiness: number, @Body() data: InviteTeammateDTO, @UserDec() user: IUserReq) {
        return this.businessRepository.inviteTeammate(idBusiness, data, user, teammatesResponses.invitation);
    }

    /**
     * Find users with active roles in business with id specified
     * 
     * @param idBusiness business id to consult active user roles
     */
    @Roles(TeammatePermission.LIST)
    @Get(':id/teammates')
    findTeammates(
            @Param('id') idBusiness: number, 
            @Query('page') page: number,
            @Query('limit') limit: number,
            @Query('order') order: 'ASC' | 'DESC',
            @Query('orderBy') orderBy: string) {
        return this.businessRepository.findTeammates(idBusiness, {page, limit, order, orderBy}, teammatesResponses.list);
    }

    /**
     * Find roles and permissions of the specified user in the business specified
     * @param idBusiness business id to be consulted
     * @param idUser user id to be consulted
     */
    @Roles(TeammatePermission.LIST)
    @Get(':id/teammates/:idUser/roles')
    findTeammateByBusinessAndId(@Param('id') idBusiness: number, @Param('idUser') idUser: number) {
        return this.businessRepository.findTeammateByBusinessAndId(idBusiness, idUser, teammatesResponses.list);
    }

    /**
     *  Delete all role of the user
     * @param id Id of the business
     * @param idUser Id of user to delete roles
     * @param user Logged user
     */
    @Roles(TeammatePermission.DISABLE)
    @Delete(':id/teammates/:idUser')
    deletePermission(@Param('id') id: number, @Param('idUser') idUser: number, @UserDec() user: IUserReq) {
        return this.businessRepository.disablePermission(id, idUser, user, teammatesResponses.disable);
    }
}
