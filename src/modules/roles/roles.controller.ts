import { Controller, Get, Param, UsePipes } from '@nestjs/common';
import { TrimPipe } from '../../common/pipes/trim.pipe';
import { RolesService } from './roles.service';

@UsePipes(new TrimPipe())
@Controller('roles')
export class RolesController {

    constructor(private readonly rolesService: RolesService) {}

    /**
     * Find All Shipping Companies
     */
    @Get('type/:type')
    findAll(@Param('type') type: string) {
        return this.rolesService.findByType(type);
    }
}
