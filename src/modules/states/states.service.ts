import { Injectable, InternalServerErrorException, NotAcceptableException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { getRepository, Not, Repository } from 'typeorm';
import { Status } from '../../common/enum/status.enum';
import { statesResponses } from '../../common/responses/states.responses';
import { BasicService } from '../../common/services/base.service';
import { State } from '../../models/state.entity';
import { IUserReq } from '../../modules/users/interfaces/userReq.interface';
import { CreateStateDto } from './dto/createState.dto';
import { UpdateStateDto } from './dto/updateState.dto';

@Injectable()
export class StatesService extends BasicService<State> {

    responses = statesResponses;

    constructor(
        @InjectRepository(State)
        private readonly stateRepository: Repository<State>
    ) { super(stateRepository); }
 
    /**
     * Find all States
     */
    async findAll() {
        const response = this.responses.list;
        const states =  await getRepository(State).createQueryBuilder('state')
            .where({'status': Status.ENABLED, 'mun.status': Status.ENABLED})
            .select(['state.id', 'state.name', 'mun.id', 'mun.name'])
            .leftJoin('state.municipalities', 'mun')
            .getMany();

        return this.formatReturn(response.success, 'states', states);
        
    }

    /**
     * Find a State by its Id
     * @param id State id
     */
    async findById(id: number) {
        const response = this.responses.list;

        const state = await this.stateRepository.findOneOrFail(id, {where: [{status: Status.ENABLED}], relations: ['municipalities']})
            .catch(() => {throw new ForbiddenException(response.noPermission); });

        return this.formatReturn(response.success, 'state', state);
    }

    /**
     * Disable a State
     * @param id state Id
     * @param user logged user extracted from token
     */
    async disable(id: number, user: IUserReq) {
        const response = this.responses.disable;

        const state = await this.stateRepository.findOneOrFail(id, {where: [{status: Status.ENABLED}], relations: ['municipalities']})
            .catch(() => {throw new ForbiddenException(response.noPermission); });
        
        await this.disableEntityByStatus(state, user)
            .catch(() => { throw new InternalServerErrorException(response.error); });

        return this.formatReturn(response.success, 'state', await this.cleanObjects(state));
    }

    /**
     * Enable a State
     * @param id state Id
     * @param user logged user extracted from token
     */
    async enable(id: number, user: IUserReq) {
        const response = this.responses.enable;

        const state = await this.stateRepository.findOneOrFail(id, {where: [{status: Status.DISABLED}], relations: ['municipalities']})
            .catch(() => {throw new ForbiddenException(response.noPermission); });

        await this.activateEntityByStatus(state, user)
            .catch(() => { throw new InternalServerErrorException(response.error); });

        return this.formatReturn(response.success, 'state', await this.cleanObjects(state));
    }

    /**
     * Create a State
     * @param body data to create
     * @param user logged user extracted from token
     */
    async create(body: CreateStateDto, user: IUserReq) {
        const response = this.responses.create;

        await this.checkNameExist(body.name, response.nameBeUnique);

        const savedState = await this.save(body, user)
            .catch(() => { throw new InternalServerErrorException(response.error); });

        return this.formatReturn(response.success, 'state', savedState);
    }

    /**
     * Update a State
     * @param id state Id
     * @param body data to update
     * @param user logged user extracted from token 
     */
    async update(id: number, body: UpdateStateDto, user: IUserReq) {
        const response = this.responses.update;

        const state = await this.stateRepository.findOneOrFail(id, {where: [{status: Status.ENABLED}]})
            .catch(() => { throw new ForbiddenException(response.noPermission); });

        if (body.name) { await this.checkNameExist(body.name, response.nameBeUnique, id); }

        const updatedState = await this.updateEntity(body, state, user)
            .catch(() => { throw new InternalServerErrorException(response.error); });

        return this.formatReturn(response.success, 'state', updatedState);

    }

    async checkNameExist(name: string, errorResponse: any, idState?: number): Promise<void> {
        const [, count] = idState ? 
        await this.stateRepository.findAndCount({where: [{name, id: Not(idState)}]}) :
        await this.stateRepository.findAndCount({where: [{name}]});

        if (count > 0) { throw new NotAcceptableException(errorResponse); }
    }
}
