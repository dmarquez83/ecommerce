import { ForbiddenException, Injectable, InternalServerErrorException, NotAcceptableException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityRepository, In, Not, Repository } from 'typeorm';
import { Status } from '../../common/enum/status.enum';
import { tsStatus } from '../../common/enum/transportServiceStatus.enum';
import { tsResponses } from '../../common/responses/transportServices.responses';
import { BasicService } from '../../common/services';
import { TransportService } from '../../models';
import { ServiceFilesService } from '../serviceFiles/serviceFiles.service';
import { IUserReq } from '../users/interfaces/userReq.interface';
import { CreateTransportServiceDto } from './dto/createTransportService.dto';
import { UpdateTransportServiceDto } from './dto/updateTransportService.dto';

@Injectable()
export class TransportServicesService extends BasicService<TransportService> {

    private relations = ['serviceFiles', 'serviceFiles.file'];

    constructor(
        @InjectRepository(TransportService)
        private readonly serviceRepository: Repository<TransportService>,
        private readonly serviceFilesService: ServiceFilesService
    ) {
        super(serviceRepository);
    }

    /**
     *  Cancel a service
     * @param id id of service to cancel
     * @param user Logged User
     * @param response response with message and code
     */
    async cancel(id: number, user: IUserReq, response: any) {
        return this.changeStatusAndRespond(id, tsStatus.CANCELED, user, response);
    }

    /**
     * Transport service to be completed
     * @param id id of service to set as completed
     * @param user Logged User
     * @param response response with message and code
     */
    async complete(id: number, user: IUserReq, response: any) {
        return this.changeStatusAndRespond(id, tsStatus.COMPLETED, user, response);
    }

    /**
     * Transport service to confirm its picked up
     * @param id id of service to confirm its Picked Up
     * @param user Logged User
     * @param response response with message and code
     */
    async confirmPickedUp(id: number, user: IUserReq, response: any) {
        return this.changeStatusAndRespond(id, tsStatus.cPICKED, user, response);
    }

    /**
     *  Create a new transport service
     * @param data data to create a transport service
     * @param user Logged user
     * @param response response with message and code
     */
    async create(data: CreateTransportServiceDto, user: IUserReq, response: any) {

        const transportService = await this.save(data, user, { status: tsStatus.CREATED })
            .catch(() => {
                throw new InternalServerErrorException(response.error);
            });

        // check if the filename exist
        if (data.images) {
            await this.serviceFilesService.saveServiceFiles(data.images, user,
                response.cantSaveImages, Number(transportService.id));
        }

        const newTransportService = await this.getById(transportService.id, response.noPermission);

        return this.formatReturn(response.success, 'transportService', newTransportService);
    }

    /**
     *  Delete a transport service
     * @param id id of transport service to delete
     * @param user Logged User
     * @param response response with message and code
     */
    async delete(id: number, user: IUserReq, response: any) {
        return this.changeStatusAndRespond(id, tsStatus.DELETED, user, response);
    }

    /**
     * Validate if the driver can cancel
     * @param id id of the service to verify
     * @param error specific error to throw if service cant be cancel
     */
    async driverCanCancel(id: number, error: {}): Promise<boolean> {
        const ts = await this.findOneWithOptions({
            where: {
                id, status: In([
                    tsStatus.DELIVERED,
                    tsStatus.PICKED,
                    tsStatus.cPICKED,
                    tsStatus.COMPLETED,
                ])
            }
        });

        if (ts) {
            throw new NotAcceptableException(error);
        }

        return true;
    }

    /**
     * Validate if the driver can create a service proposal
     * @param id id of the service to verify
     * @param error specific error to throw
     */
    async driverCanPropose(id: number, error: {}): Promise<boolean> {
        await this.findOneWithOptionsOrFail({
            where: { id, status: tsStatus.CREATED }
        }).catch(() => {
            throw new NotAcceptableException(error);
        });

        return true;
    }

    /**
     * Find all active services by the creator user. Active services are those
     * who have their status as Created, Delivered, Picked Up, Waiting for Pickup
     * or Picked Up Confirmed
     * @param user Logged User
     * @param response response with message and code
     */
    async findActiveServicesByUser(user: IUserReq, response: any) {
        const ts = await this.find({
            where: {
                creationUser: user.userId,
                status: In([
                    tsStatus.CREATED,
                    tsStatus.DELIVERED,
                    tsStatus.PICKED,
                    tsStatus.WAITING,
                    tsStatus.cPICKED
                ])
            }
        }).catch(() => {
            throw new InternalServerErrorException(response.error);
        });

        return this.formatReturn(response.success, 'transportServices', ts);
    }

    /**
     * find all the services that a driver has active
     * @param user Logged User (driver)
     * @param response response with message and code
     */
    async findActiveServicesByDriver(user: IUserReq, response: any) {
        const statuses = [
            tsStatus.DELIVERED, tsStatus.PICKED,
            tsStatus.WAITING, tsStatus.cPICKED
        ];

        const ts = await this.serviceRepository.createQueryBuilder('ts')
            .where('ts.creationUser <> :driver', { driver: user.userId })
            .andWhere('ts.status = any(:status)', { status: statuses })
            .andWhere(`ts.id IN (  
                                            select id_service
                                            from transport.service_proposals
                                            where creation_user = ${user.userId}
                                                and status = 'Accepted'
                                        )`)
            .getMany();

        return this.formatReturn(response.success, 'transportServices', ts);
    }

    /**
     *  Find all service
     * @param id Id to find
     * @param response response with message and code
     */
    async findAll(response: any) {
        const transportServices = await this.getAll()
            .catch(() => {
                throw new ForbiddenException(response.error);
            });

        for await (const transportService of transportServices) {
            await this.mapServicesToReturn(transportService);
        }

        return this.formatReturn(response.success, 'results', transportServices);
    }

    /**
     * find all the services to which a driver can send a proposal
     * @param user Logged User (driver)
     * @param response response with message and code
     */
    async findAvailableServicesByDriver(user: IUserReq, response: any) {
        const ts = await this.serviceRepository.createQueryBuilder('ts')
            .where('ts.creationUser <> :driver', { driver: user.userId })
            .andWhere('ts.status = :status', { status: tsStatus.CREATED })
            .andWhere(`ts.id NOT IN (  
                                            select id_service
                                            from transport.service_proposals
                                            where creation_user = ${user.userId}
                                        )`)
            .getMany();

        return this.formatReturn(response.success, 'transportServices', ts);
    }

    /**
     *  Find a service by id
     * @param id Id to find
     * @param response response with message and code
     */
    async findById(id: number, response: any) {
        const transportService = await this.getById(id, response.noPermission);
        return this.formatReturn(response.success, 'transportService', transportService);
    }

    /**
     * Find all service history by the creator user. Active services are those
     * who have their status as Canceled, Completed
     * @param user Logged User
     * @param response response with message and code
     */
    async findHistoricalServicesByUser(user: IUserReq, response: any) {
        const ts = await this.find({
            where: {
                creationUser: user.userId,
                status: In([
                    tsStatus.CANCELED,
                    tsStatus.COMPLETED
                ])
            }
        }).catch(() => {
            throw new InternalServerErrorException(response.error);
        });

        return this.formatReturn(response.success, 'transportServices', ts);
    }

    /**
     *  Get a transport service by id
     * @param id Id to find
     * @param response response with message and code
     */
    async getById(id: number, response: any, relations?: string[]) {
        const transportService = await this.findOneOrFail(id, {
            where: { status: Not(Status.DELETED) },
            relations: this.relations
        }).catch(() => {
            throw new ForbiddenException(response);
        });

        await this.mapServicesToReturn(transportService);

        return transportService;
    }

    /**
     * Transport service to set as delivered
     * @param id id of service to set as delivered
     * @param user Logged User
     * @param response response with message and code
     */
    async setDelivered(id: number, user: IUserReq, response: any) {
        return this.changeStatusAndRespond(id, tsStatus.DELIVERED, user, response);
    }

    /**
     * Set transport service as Picked Up
     * @param id id of service to set as Picked Up
     * @param user Logged User
     * @param response response with message and code
     */
    async setPickedUp(id: number, user: IUserReq, response: any) {
        return this.changeStatusAndRespond(id, tsStatus.PICKED, user, response);
    }

    /**
     * Set transport service as Waiting for Pickup
     * @param id id of service to set as Waiting for Pickup
     * @param user Logged User
     * @param response response with message and code
     */
    async setWaitingPickup(id: number, user: IUserReq) {
        const response = tsResponses.waitingPickUp;
        return this.changeStatusOrFail(id, tsStatus.WAITING, user, response);
    }

    /**
     *  Update service 
     * @param id id of the transport service to update
     * @param data Data to update a service
     * @param user Logged user
     * @param response response with message and code
     */
    async update(id: number, data: UpdateTransportServiceDto, user: IUserReq, response: any) {

        const transportService = await this.findOneOrFail(id, response.noPermission);

        const transportServiceUpdated = await this.updateAndGetRelations(data, transportService, user, ['weightUnitEntity'])
            .catch(() => {
                throw new InternalServerErrorException(response.error);
            });

        // check if the filename exist
        if (data.images) {
            await this.serviceFilesService.updateServiceFiles(data.images, user,
                response.cantSaveImages, Number(transportServiceUpdated.id));
        }

        const UpdatedtransportService = await this.getById(transportServiceUpdated.id,
            response.noPermission);

        return this.formatReturn(response.success, 'transportService', UpdatedtransportService);
    }

    /**
     * Change status of Transport service and respond 
     * with response structure
     * @param id id of transport service to change status
     * @param status status to set
     * @param user Logged User
     * @param response response with message and code
     */
    private async changeStatusAndRespond(id: number,
                                         status: string,
                                         user: IUserReq,
                                         response: any) {
        await this.changeStatusOrFail(id, status, user, response);
        const ts = await this.getById(id, response.noPermission);

        return this.formatReturn(response.success, 'transportService', ts);
    }

    /**
     * Change status of Transport service or fail
     * @param id id of transport service to change status
     * @param status status to set
     * @param user Logged User
     * @param response response with message and code
     */
    private async changeStatusOrFail(id: number,
                                     status: string,
                                     user: IUserReq,
                                     response: any): Promise<TransportService> {
        const ts = await this.findOneOrFail(id, response.noPermission);

        await this.validateStatusChange(ts, status, response);

        return await this.updateEntity({status}, ts, user)
            .catch(() => {
                throw new InternalServerErrorException(response.error);
            });
    }

    /**
     *  Map transport Service to return it
     * @param transportService 
     */
    private async mapServicesToReturn(transportService: any) {
        transportService.id = Number(transportService.id);
        transportService.weight = parseFloat(transportService.weight);
        transportService.distance = Number(transportService.distance);
        transportService.duration = Number(transportService.duration);

        delete transportService['imgCode'];

        const images = [];

        (await this.orderBy(transportService.serviceFiles, ['position'], 'asc'))
            .forEach(transportService => {
                images.push(transportService.file);
            });

        delete transportService.serviceFiles;

        transportService['images'] = images;
    }

    /**
     * Validate status changed
     * @param ts Transport service entity
     * @param newStatus New status
     * @param response Response with the structure to return
     */
    private async validateStatusChange(ts: any, newStatus: string, response: any) {

        if (newStatus === tsStatus.CANCELED && ts.status !== tsStatus.CREATED && ts.status !== tsStatus.WAITING) {
            throw new NotAcceptableException(response.deniedByStatus);

        } else if (newStatus === tsStatus.WAITING && ts.status !== tsStatus.CREATED) {
            throw new NotAcceptableException(response.deniedByStatus);
            
        } else if (newStatus === tsStatus.PICKED && ts.status !== tsStatus.WAITING) {
            throw new NotAcceptableException(response.deniedByStatus);

        } else if (newStatus === tsStatus.cPICKED && ts.status !== tsStatus.PICKED) {
            throw new NotAcceptableException(response.deniedByStatus);

        } else if (newStatus === tsStatus.DELIVERED && ts.status !== tsStatus.cPICKED) {
            throw new NotAcceptableException(response.deniedByStatus);

        } else if (newStatus === tsStatus.COMPLETED && ts.status !== tsStatus.DELIVERED) {
            throw new NotAcceptableException(response.deniedByStatus);
        }
    }
}
