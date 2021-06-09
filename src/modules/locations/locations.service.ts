import {
    ForbiddenException, Injectable,
    InternalServerErrorException,
    NotAcceptableException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Not, Repository } from 'typeorm';
import { Status } from '../../common/enum/status.enum';
import { IPaginationOptions } from '../../common/interfaces/paginateOptions.interface';
import { IResponseStructure } from '../../common/interfaces/responses.interface';
import { BasicService } from '../../common/services/base.service';
import { Location } from '../../models/location.entity';
import { ProductStocksService } from '../productStocks/productStocks.service';
import { IUserReq } from '../users/interfaces/userReq.interface';
import { CreateLocationDto } from './dto/createLocation.dto';
import { UpdateLocationDto } from './dto/updateLocation.dto';
import { ILocationCreated } from './interfaces/locationCreated.interface';
import { ILocationShow } from './interfaces/locationShow.interface';
import { ILocationUpdated } from './interfaces/locationUpdated.interface';

@Injectable()
export class LocationsService extends BasicService<Location> {
    constructor(
        @InjectRepository(Location)
        private readonly locationRepository: Repository<Location>,
        private readonly productStockService: ProductStocksService
    ) {
        super(locationRepository);
    }

    /**
     *  Show the location details
     * @param id id of the location
     * @param user User executing the action
     * @param response json with responses used in the function
     */
    async show(id: number, response: any): Promise<ILocationShow> {
        const location = await this.getById(id, response.noPermission);

        return this.formatReturn(response.success, 'location', location);
    }

    /**
     *  List the locations by business
     * @param idBusiness id of the business
     * @param response json with responses used in the function
     * @param options Options to paginate
     */
    async byBusiness(   idBusiness: number,
                        response: any, options: IPaginationOptions) {

        const query = this.locationRepository.createQueryBuilder('L')
            .select(['L.id', 'L.description', 'L.postalCode', 'L.status'])
            .addSelect(['L.idBusiness', 'L.idMunicipality'])
            .addSelect(['M.id', 'M.name', 'M.idState'])
            .innerJoin('L.business', 'E', 'L.idBusiness = E.id')
            .innerJoin('L.municipality', 'M', 'L.idMunicipality = M.id')
            .where('E.id = :idBusiness', { idBusiness })
            .andWhere('L.status <> :status', { status: Status.DELETED });

        if (!options['orderBy']) {
            options['orderBy'] = 'idMunicipality';
            options['order'] = 'ASC';
        }
        
        return this.formatReturn(response.success, 'result', await this.paginate(options, query));
    }

    /**
     *  Check if the company already has a location in that municipality
     * @param idBusiness id of the business to check municipality
     * @param idMunicipality id of the municipality
     * @param response error response
     * @param id id of the location you want to verify the municipality
     */
    async checkLocationsInMunicipality( idBusiness: number, 
                                        idMunicipality: number,
                                        response: IResponseStructure,
                                        id ?: number) {

        let query = this.locationRepository.createQueryBuilder('L')
                    .andWhere('L.idBusiness = :idBusiness', {idBusiness})
                    .andWhere('L.idMunicipality = :idMunicipality', {idMunicipality})
                    .andWhere('L.status <> :status', {status: Status.DELETED});

        if ( id ) {
            query = query.andWhere('L.id <> :id', {id});
        }

        if (await query.getOne()) {
            throw new NotAcceptableException(response);
        }
    }

    /**
     * Create a Location
     * 
     * @param data params to create the location
     * @param user the user who is creating the location
     * @param response json with responses used in the function
     */
    async create(data: CreateLocationDto, user: IUserReq, response: any): Promise<ILocationCreated> {

        await this.checkLocationsInMunicipality(+data.idBusiness, 
                                                +data.idMunicipality,
                                                response.municipalityBeUnique);

        const location = await this.saveAndGetRelations(data, user,
            ['municipality', 'business'])
            .catch(() => {
                throw new InternalServerErrorException(response.error);
            });

        return this.formatReturn(response.success, 'location', location);
    }

    /**
     *  Get location by id
     * @param id location identifier
     * @param response response to be sent in case of error 
     */
    async getById(id: number, response: IResponseStructure): Promise<any> {
        return await this.findOneOrFail(id,
            { 
                where: { status: Not(Status.DELETED) },
                relations: ['business', 'municipality'] 
            })
            .catch(() => {
                throw new ForbiddenException(response);
            });
    }

    /**
     *  Update the location
     * @param id Location to update
     * @param data Data to update
     * @param user User executing the action
     * @param response json with responses used in the function
     */
    async update(id: number, data: UpdateLocationDto, user: IUserReq, 
                 response: any): Promise<ILocationUpdated> {
        const location = await this.findOneOrFail(id)
                    .catch(() => {
                        throw new ForbiddenException(response.noPermission);
                    });

        if (data.idMunicipality && +data.idMunicipality !== +location.idMunicipality) {
            await this.checkLocationsInMunicipality(	+location.idBusiness, 
                                                        +data.idMunicipality,
                                                        response.municipalityBeUnique,
                                                        id);
        }

        const locationUpdated = await this.updateEntity(data, location, user)
            .catch(() => {
                throw new InternalServerErrorException(response.error);
            });

        return this.formatReturn(response.success, 'location', locationUpdated);
    }

    /**
     *  Disable the location
     * @param id id of the Location to disable
     * @param user User executing the action
     * @param response json with responses used in the function
     */
    async disable(id: number, user: IUserReq, response: any): Promise<ILocationUpdated> {
        const location = await this.getById(id, response.noPermission);
        const locationUpdated = await this.disableEntityByStatus(location, user)
            .catch( () => {
                throw new InternalServerErrorException(response.error);
            });

        await this.productStockService
                .disableProductStocksByLocation(location.id, user, response.producStockError);
        
        return this.formatReturn(response.success, 'location', locationUpdated);
    }

    /**
     *  Delete the location
     * @param id id of the Location to delete
     * @param user User executing the action
     * @param response json with responses used in the function
     */
    async delete(id: number, user: IUserReq, response: any): Promise<ILocationUpdated> {
        const location = await this.getById(id, response.noPermission);

        const locationDeleted = await this.deleteEntityByStatus(location, user)
            .catch( () => {
                throw new InternalServerErrorException(response.error);
            });

        await this.productStockService
                .deleteProductStocksByLocation(location.id, user, response.producStockError);
        
        return this.formatReturn(response.success, 'location', locationDeleted);

    }

    /**
     *  Activate the location
     * @param id id of the location to activate
     * @param user User executing the action
     * @param response json with responses used in the function
     */
    async activate(id: number, user: IUserReq, response: any): Promise<ILocationUpdated> {
        const location = await this.getById(id, response.noPermission);
        const locationUpdated = await this.activateEntityByStatus(location, user)
            .catch( () => {
                throw new InternalServerErrorException(response.error);
            });

        await this.productStockService
            .enableProductStocksByLocation(location.id, user, response.error);

        return this.formatReturn(response.success, 'location', locationUpdated);
    }

    /**
     * Get locations by an array of ids
     * @param ids array of locations id
     */
    async getByIdArray(ids: any[]): Promise<Location[]> {
        return await this.locationRepository.find({
            where: { status: Not(Status.DELETED), id: In(ids)}
        });
    }
}
