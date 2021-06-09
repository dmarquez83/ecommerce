import { ForbiddenException, Injectable, InternalServerErrorException, NotAcceptableException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { IResponseStructureReturn } from '../../common/interfaces';
import { BasicService } from '../../common/services';
import { VehicleBrand } from '../../models';
import { FilesService } from '../files/files.service';
import { IUserReq } from '../users/interfaces/userReq.interface';
import { CreateVehicleBrandDto } from './dto/createVehicleBrand.dto';
import { UpdateVehicleBrandDto } from './dto/updateVehicleBrand.dto';

@Injectable()
export class VehicleBrandsService extends BasicService<VehicleBrand> {

    constructor(
        @InjectRepository(VehicleBrand)
        private readonly vehicleBrandRepository: Repository<VehicleBrand>,
        private readonly fileService: FilesService
    ) {
        super(vehicleBrandRepository);
    }

    /**
     * Create a new vehicle brand
     * @param data data to create a vehicle brand
     * @param user Logged user
     * @param response response with message and code
     */
    async create(data: CreateVehicleBrandDto, user: IUserReq, response: any):
                Promise<IResponseStructureReturn> {
        
        if (await this.findByName(data.name, response.error)) {
            throw new NotAcceptableException(response.nameBeUnique);
        }

        // check if the filename exist
        if (data.imgCode) {
            await this.existFile(data.imgCode);
        }

        const vehicleBrand = await this.save(data, user)
            .catch(() => {
                throw new InternalServerErrorException(response.error);
            });

        return this.formatReturn(response.success, 'vehicleBrand', vehicleBrand);
    }

    /**
     *  Update a vehicle brand
     * @param id id of the vehicle brand
     * @param data data to update
     * @param user Logged user
     * @param response response with message and code
     */
    async update(id: number, data: UpdateVehicleBrandDto, user: IUserReq, response: any):
            Promise<IResponseStructureReturn> {

        const vehicleBrand = await this.findOneOrFail(id)
            .catch(() => {
                throw new ForbiddenException(response.noPermission);
            });
        
        if ((vehicleBrand.name !== data.name) && await this.findByName(data.name, response.error)) {
            throw new NotAcceptableException(response.nameBeUnique);
        }

        // check if the filename exist
        if (data.imgCode) {
            await this.existFile(data.imgCode);
        }

        const vehicleBrandUpdated = await this.updateEntity(data, vehicleBrand, user)
            .catch(() => {
                throw new InternalServerErrorException(response.error);
            });
    
        return this.formatReturn(response.success, 'vehicleBrand', vehicleBrandUpdated);    
    }

    /**
     * Disable a vehicle brand
     * @param id id to disable
     * @param user Logged user
     * @param response Response with message and code
     */
    async disable(id: number, user: IUserReq, response: any) {
        const vehicleBrand = await this.findOneOrFail(id)
            .catch(() => {
                throw new ForbiddenException(response.noPermission);
            });

        const vehicleBrandDisabled = await this.disableEntityByStatus(vehicleBrand, user)
            .catch(() => {
                throw new InternalServerErrorException(response.error);
            });

        return this.formatReturn(response.success, 'vehicleBrand', vehicleBrandDisabled);    
        
    }

    /**
     *  Activate a vehicle brand
     * @param id Id to activate
     * @param user Logged User
     * @param response Response with message and code
     */
    async activate(id: number, user: IUserReq, response: any) {
        const vehicleBrand = await this.findOneOrFail(id)
            .catch(() => {
                throw new ForbiddenException(response.noPermission);
            });

        const vehicleBrandActivate = await this.activateEntityByStatus(vehicleBrand, user)
            .catch(() => {
                throw new InternalServerErrorException(response.error);
            });

        return this.formatReturn(response.success, 'vehicleBrand', vehicleBrandActivate);    
    }

    /**
     * Get all vehicle brands
     */
    async findAll(response: any) {
        const results = await this.find({ relations: ['imgCodeFile'] });

        for (const vehicleBrand of results) {
            await this.mapVehicleBrand(vehicleBrand);
        }

        return this.formatReturn(response, 'results', results);    
    }

    /**
     * Find entity by Id
     * @param id id to find
     * @param response Response with message and code
     */
    async findById(id: number, response: any) {
        const vehicleBrand = await this.findOneOrFail(id, { relations: ['imgCodeFile']})
            .catch(() => {
                throw new ForbiddenException(response.noPermission);
            });

        await this.mapVehicleBrand(vehicleBrand);

        return this.formatReturn(response.success, 'vehicleBrand', vehicleBrand);    
    }

    /**
     *  Map vehicleBrand object to return it
     * @param vehicleBrand VehicleBrand to modified
     */
    async mapVehicleBrand(vehicleBrand: VehicleBrand) {
        if (vehicleBrand.imgCodeFile) {
            vehicleBrand['image'] = vehicleBrand.imgCodeFile;
            delete vehicleBrand['imgCodeFile'];
        }
    }

    /**
     *  Check if the file exist 
     * @param filename filename to find
     */
    async existFile(filename: string): Promise<boolean> {
        return !!await this.fileService.findByNameOrFail(filename);
    }

    /**
     * Find a vehicle brand by name
     * @param name name to find
     * @param response response with message and code
     */
    async findByName(name: string, response: any): Promise<VehicleBrand> {
        return await this.findOneWithOptions({ where: { name }})
            .catch(() => {
                throw new ForbiddenException(response);
            }); 
    }

}
