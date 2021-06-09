import { Body, Controller, Delete, Get, Param,
    Post, Put, UseGuards, UsePipes } from '@nestjs/common';
import { UserDec } from '../../common/decorators';
import { JwtAuthGuard } from '../../common/guards/jwt.guard';
import { TrimPipe } from '../../common/pipes/trim.pipe';
import { ValidationPipe } from '../../common/pipes/validation.pipe';
import { draftsResponses } from '../../common/responses/drafts.responses';
import { IUserReq } from '../users/interfaces/userReq.interface';
import { DraftsService } from './drafts.service';
import { CreateDraftDto } from './dto/createDraft.dto';

@UseGuards(JwtAuthGuard)
@UsePipes(new ValidationPipe())
@UsePipes(new TrimPipe())
@Controller('drafts')
export class DraftsController {
    constructor(private readonly draftService: DraftsService) {}
    
    /**
     * Create a Draft
     * @param body data to create
     * @param user logged user extracted from token
     */
    @Post()
    create(@Body() body: CreateDraftDto, @UserDec() user: IUserReq) {
        return this.draftService.create(body, user, draftsResponses.create);
    }
    
    /**
     * Update a Draft
     * @param id string unique of the draft
     * @param body data to update
     * @param user logged user extracted from token
     */
    @Put('/:id')
    update(@Param('id') id: string, @Body() body: CreateDraftDto, @UserDec() user: IUserReq) {
        return this.draftService.update(id, body, user, draftsResponses.update);
    }

    /**
     * Delete a Draft
     * @param id string unique of the draft
     * @param user logged user extracted from token
     */
    @Delete('/:id')
    delete(@Param('id') id: string, @UserDec() user: IUserReq) {
        return this.draftService.delete(id, user, draftsResponses.delete);
    }

    /**
     * Get Drafts by user
     * @param idUser us
     * @param user logged user extracted from token
     */
    @Get('/user')
    getByUser(@UserDec() user: IUserReq) {
        return this.draftService.getByUser(user.userId, draftsResponses.list);
    }

    /**
     * Get Draft by Id
     * @param id draft id
     */
    @Get('/:id')
    getById(@Param('id') id: string) {
        return this.draftService.getById(id, draftsResponses.list);
    }
}
