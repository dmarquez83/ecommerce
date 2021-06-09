import { ForbiddenException, Injectable, InternalServerErrorException, NotAcceptableException, 
    NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Status } from '../../common/enum/status.enum';
import { IResponseStructureReturn } from '../../common/interfaces/responsesReturn.interface';
import { statesResponses } from '../../common/responses/states.responses';
import { BasicService } from '../../common/services/base.service';
import { Municipality } from '../../models/municipality.entity';
import { StatesService } from '../states/states.service';
import { IUserReq } from '../users/interfaces/userReq.interface';
import { CreateMunicipalityDto } from './dto/createMunicipality.dto';
import { UpdateMunicipalityDto } from './dto/updateMunicipality.dto';

@Injectable()
export class MunicipalitiesService extends BasicService<Municipality> {
    constructor(
        @InjectRepository(Municipality)
        private readonly municipalityRepository: Repository<Municipality>,
        private readonly stateService: StatesService,
    ) {
        super(municipalityRepository);
    }

    /**
     * Return all the municipalities
     */
    findAll() {
        return this.municipalityRepository.find({select: ['id', 'name', 'idState'],
            where: {status: Status.ENABLED}});
    }

    /**
     * Find a municipality by id
     * @param id id of the municipality to find
     * @param response response with standard
     * @returns Promise with the structure response and municipality
     */
    async finById(id: number, response: any):
                Promise<IResponseStructureReturn> {
        const municipality = await this.findOneOrFail(id)
            .catch(() => {
                throw new ForbiddenException(response.error);
            });

        return this.formatReturn(response.success, 'municipality', municipality); 
    }

    /**
     * Create a municipality
     * @param data name and idState
     * @param user Logged user
     * @param response response with standard
     */
    async create(data: CreateMunicipalityDto, user: IUserReq, response: any):
                Promise<IResponseStructureReturn> {

        if (await this.existInState(data.name, data.idState)) {
            throw new NotAcceptableException(response.nameBeUniqueInMunicipality); 
        }

        const municipality = await this.save(data, user)
            .catch(() => {
                throw new InternalServerErrorException(response.error);
            });

        return this.formatReturn(response.success, 'municipality', municipality); 
    }

    /**
     * Check if the name of the municipality is available in that state 
     * @param name Name of the municipality
     * @param idState id of the state
     */
    async existInState(name: string, idState: number): Promise<Municipality> {
        const state = await this.stateService.findOneOrFail(idState,
            { relations: ['municipalities'] })
            .catch(() => {
                throw new NotAcceptableException(statesResponses.list.attrMustExist); 
            });
        let municipality: Municipality;
        if (state) {
            state.municipalities.some(e => {
                if (e.name.toUpperCase() === name.toUpperCase()) {
                    municipality = e;
                }
                return e.name.toUpperCase() === name.toUpperCase();
            });
            return municipality;
        }
    }

    /**
     * Update a municipality
     * @param id id of the municipality
     * @param data data to update
     * @param user Logged user
     * @param response response message
     * @returns Promise with the structure response and updated municipality
     */
    async update(id: number, data: UpdateMunicipalityDto, user: IUserReq, response: any):
                    Promise<IResponseStructureReturn> {
        const municipality = await this.findOneOrFail(id)
            .catch(() => {
                throw new ForbiddenException(response.notFound); 
            });
        const municipalityDB = await this.existInState(data.name, municipality.idState);

        if (municipalityDB && (+municipalityDB.id !== +id)) {
            throw new NotFoundException(response.nameBeUnique); 
        }

        const municipalityUpdated = await this.updateEntity(data, municipality, user)
            .catch(() => {
                throw new InternalServerErrorException(response.error);
            });
        
        return this.formatReturn(response.success, 'municipality', municipalityUpdated); 
    }

    /**
     *  Disable Municipality and return it
     * 
     * @param id id of the municipality
     * @param user User who executes the action
     */
    async disable(id: number, user: IUserReq, response: any) {
        
        let municipality = await this.findOneOrFail(id) 
            .catch( () => {
                throw new ForbiddenException(response.notFound);
            });

        municipality = await this.disableEntityByStatus(municipality, user)
            .catch( () => {
                throw new InternalServerErrorException(response.error);
            });

        return this.formatReturn(response.success, 'municipality', municipality);
    }

    /**
     *  Activate Municipality and return it
     * 
     * @param id id of the category
     * @param user User who executes the action
     */
    async activate(id: number, user: IUserReq, response: any) {

        let municipality = await this.findOneOrFail(id)
        .catch( () => {
                throw new ForbiddenException(response.notFound);
            });
        
        municipality = await this.activateEntityByStatus(municipality, user)
            .catch( () => {
                throw new InternalServerErrorException(response.error);
            });

        return this.formatReturn(response.success, 'municipality', municipality);
    }
}
