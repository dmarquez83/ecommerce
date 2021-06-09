import { ForbiddenException, Injectable, InternalServerErrorException, NotAcceptableException, UsePipes } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Not, Repository } from 'typeorm';
import { Transactional } from 'typeorm-transactional-cls-hooked';
import { Status } from '../../common/enum/status.enum';
import { IResponseStructureReturn } from '../../common/interfaces';
import { ValidationPipe } from '../../common/pipes/validation.pipe';
import { BasicService } from '../../common/services';
import { Vehicle } from '../../models';
import { IUserReq } from '../users/interfaces/userReq.interface';
import { VehicleFilesService } from '../vehicleFiles/vehicleFiles.service';
import { CreateVehicleDto } from './dto/createVehicle.dto';
import { UpdateVehicleDto } from './dto/updateVehicle.dto';

@UsePipes(new ValidationPipe())
@Injectable()
export class VehiclesService extends BasicService<Vehicle> {

    private relations = ['vehicleFiles', 'vehicleFiles.file', 'brand'];

    constructor(
        @InjectRepository(Vehicle)
        private readonly vehicleRepository: Repository<Vehicle>,
        private readonly vehicleFilesService: VehicleFilesService,
    ) {
        super(vehicleRepository);
    }

    /**
     * Map vehicle to return 
     * @param vehicle vehicle to map
     */
    async mapVehicleToReturn(vehicle: Vehicle) {
        delete vehicle['imgCode'];

        const images = [];

        (await this.orderBy(vehicle.vehicleFiles, ['position'], 'asc')).forEach(vehicleFile => {
            images.push(vehicleFile.file);
        });

        delete vehicle.vehicleFiles;

        vehicle['images'] = images;

        vehicle['profilePhoto'] = images[0];

    }

    /**
     * Create a new Vehicle
     * @param data data to create a Vehicle
     * @param user Logged user
     * @param response response with message and code
     */
    @Transactional()
    async create(data: CreateVehicleDto, user: IUserReq, response: any):
        Promise<IResponseStructureReturn> {

        if (await this.findByPlate(data.plate, response.error)) {
            throw new NotAcceptableException(response.plateBeUnique);
        }

        const vehicle = await this.save(data, user)
            .catch(() => {
                throw new InternalServerErrorException(response.error);
            });

        // check if the filename exist
        if (data.images) {
            await this.vehicleFilesService.saveVehicleFiles(data.images, user,
                                            response.cantSaveImages, Number(vehicle.id));
        }

        const newVehicle = await this.getById(Number(vehicle.id), response);

        return this.formatReturn(response.success, 'vehicle', newVehicle);
    }

    /**
     *  Update a Vehicle
     * @param id id of the Vehicle
     * @param data data to update
     * @param user Logged user
     * @param response response with message and code
     */
    @Transactional()
    async update(id: number, data: UpdateVehicleDto, user: IUserReq, response: any):
        Promise<IResponseStructureReturn> {

        const vehicle = await this.getById(id, response);

        if ((vehicle.plate !== data.plate) && await this.findByPlate(data.plate, response.error)) {
            throw new NotAcceptableException(response.plateBeUnique);
        }

        await this.updateEntity(data, vehicle, user)
            .catch(() => {
                throw new InternalServerErrorException(response.error);
            });

         // check if the filename exist
        if (data.images) {
            await this.vehicleFilesService.updateVehicleFiles(data.images, user,
                                            response.cantSaveImages, Number(vehicle.id));
        }

        const vehicleUpdated = await this.getById(Number(vehicle.id), response);

        return this.formatReturn(response.success, 'vehicle', vehicleUpdated);
    }

    /**
     * Disable a Vehicle
     * @param id id to disable
     * @param user Logged user
     * @param response Response with message and code
     */
    async disable(id: number, user: IUserReq, response: any) {
        const vehicle = await this.getById(id, response);

        const vehicleDisabled = await this.disableEntityByStatus(vehicle, user)
            .catch(() => {
                throw new InternalServerErrorException(response.error);
            });

        return this.formatReturn(response.success, 'vehicle', vehicleDisabled);
    }

    /**
     * Delete a Vehicle
     * @param id id to disable
     * @param user Logged user
     * @param response Response with message and code
     */
    async delete(id: number, user: IUserReq, response: any) {
        const vehicle = await this.getById(id, response);

        const vehicleDeleted = await this.deleteEntityByStatus(vehicle, user)
            .catch(() => {
                throw new InternalServerErrorException(response.error);
            });

        return this.formatReturn(response.success, 'vehicle', vehicleDeleted);
    }

    /**
     *  Activate a Vehicle
     * @param id Id to activate
     * @param user Logged User
     * @param response Response with message and code
     */
    async activate(id: number, user: IUserReq, response: any) {
        const vehicle = await this.getById(id, response);

        const vehicleActivate = await this.activateEntityByStatus(vehicle, user)
            .catch(() => {
                throw new InternalServerErrorException(response.error);
            });

        return this.formatReturn(response.success, 'vehicle', vehicleActivate);
    }

     /**
      * Get all vehicles of current user
      * @param response response to return with the structure
      * @param user Logged user
      */
    async findAll(response: any, user: IUserReq) {
        const results = await this.vehicleRepository.find({
            where: { status: Not(Status.DELETED), creationUser: user.userId },
            relations: this.relations
        });

        for (const vehicle of results) {
            await this.mapVehicleToReturn(vehicle);
        }

        return this.formatReturn(response, 'results', results);
    }

    /**
     * Find entity by Id
     * @param id id to find
     * @param response Response with message and code
     */
    async findById(id: number, response: any) {
        const vehicle = await this.getById(id, response);

        return this.formatReturn(response.success, 'vehicle', vehicle);    
    }

    /**
     * Get the vehicle with this id
     * @param id id to find
     * @param response Response with message and code
     */
    async getById(id: number, response: any) {

        const vehicle = await this.findOneOrFail(id, {
                where: { status: Not(Status.DELETED) },
                relations: this.relations 
            }).catch(() => {
                throw new ForbiddenException(response.noPermission);
            });

        await this.mapVehicleToReturn(vehicle);

        return vehicle;
    }

    /**
     * Find a Vehicle by plate
     * @param plate plate to find
     * @param response response with message and code
     */
    async findByPlate(plate: string, response: any): Promise<Vehicle> {
        return await this.findOneWithOptions({ where: { plate } })
            .catch(() => {
                throw new ForbiddenException(response);
            });
    }
}
