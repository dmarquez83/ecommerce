import { ForbiddenException, Injectable, InternalServerErrorException, NotAcceptableException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { serviceProposalsNotifications } from 'src/common/notifications/serviceProposals.notifications';
import { EntityRepository, In, Repository } from 'typeorm';
import { Transactional } from 'typeorm-transactional-cls-hooked';
import { spStatus } from '../../common/enum/serviceProposalStatus.enum';
import { spResponses } from '../../common/responses/serviceProposals.responses';
import { BasicService } from '../../common/services';
import { ServiceProposal, User } from '../../models';
import { DevicesService } from '../devices/devices.service';
import { MessageDto } from '../messages/dto/message.dto';
import { TransportServicesService } from '../transportServices/transportServices.service';
import { IUserReq } from '../users/interfaces/userReq.interface';
import { CreateServiceProposalDTO } from './dto/createState.dto';
import { IServiceUser } from './interfaces/IServiceUser.interface';

@Injectable()
export class ServiceProposalsService extends BasicService<ServiceProposal> {

    private readonly responses = spResponses;
    private readonly relations: string[] = ['transportService', 'vehicle', 'driver'];

    constructor(
        @InjectRepository(ServiceProposal)
        serviceProposalsRepository: Repository<ServiceProposal>,
        private readonly tsService: TransportServicesService,
        private readonly _deviceService: DevicesService,
    ) { super(serviceProposalsRepository); }

    /**
     * Accept a proposal
     * @param idService service id
     * @param idDriver driver id
     * @param user logged user extracted from token
     */
    @Transactional()
    async accept(idService: number, idDriver: number, user: IUserReq) {
        const response = this.responses.accept;
        await this.tsService.setWaitingPickup(idService, user);

        const proposalAccepted = await this.getByServiceAndUser(idService,
            idDriver, ['driver']);
        
        const acceptedReponse =  await this.changeStatusAndRespond(idService, idDriver,
                spStatus.ACCEPTED, user, response);

        if (acceptedReponse.status && proposalAccepted?.driver) {
            this.sendNotification('accepted', [proposalAccepted.driver]);
        }

        return acceptedReponse;
    }

    /**
     * Cancel a proposal
     * @param idService service id
     * @param idDriver driver id
     * @param user logged user extracted from token
     */
    async cancel(idService: number, idDriver: number, user: IUserReq) {
        const response = this.responses.cancel;
        return await this.changeStatusAndRespond(idService, idDriver, spStatus.CANCELED, user, response);
    }

    /**
     * Create a service proposal
     * @param body data to create
     * @param user logged user extracted from token
     */
    async create(body: CreateServiceProposalDTO, user: IUserReq) {
        const response = this.responses.create;

        await this.checkServiceIsUsedAndFail({
            idService: body.idService,
            idUser: user.userId
        }, response.serviceBeUniqueByUser);

        await this.tsService.driverCanPropose(body.idService, response.deniedByService);

        const proposalSaved = await this.save(body, user, { status: spStatus.CREATED })
            .catch(() => {
                throw new InternalServerErrorException(response.error);
            });

        const newProposal = await this.getByServiceAndUser(proposalSaved.idService,
            user.userId, ['transportService',
            'transportService.creationUser',
            'vehicle', 'driver']);

        this.sendNotification('created', [newProposal.transportService.creationUser]);

        return this.formatReturn(response.success, 'serviceProposal', newProposal);
    }

    /**
     * Send Notifications to respective users
     * @param subject Reason for notification
     * @param users Users to send notification
     */
    sendNotification(subject: string, users: User[]) {

        const notification: MessageDto = {
            notification: serviceProposalsNotifications[subject]
        };

        for (const user of users) {
            this._deviceService.sendNotificationPush(notification, user.id);
        }
    }

    /**
     * Check if exist a proposal of this services by this user
     * @param data User and Service
     */
    async checkServiceIsUsedAndFail(data: IServiceUser, error: any) {
        const sp = await this.findOneWithOptions({
            where: { creationUser: data.idUser, idService: data.idService }
        });

        if (sp) {
            throw new NotAcceptableException(error);
        }
    }

    /**
     * Decline a service proposal
     * @param idService service id
     * @param idDriver driver id
     * @param user logged user extracted from token
     */
    async decline(idService: number, idDriver: number, user: IUserReq) {
        const response = this.responses.decline;

        const proposalDeclined = await this.getByServiceAndUser(idService,
            idDriver, ['driver']);
        
        const declineResponse = await this.changeStatusAndRespond(idService, idDriver,
            spStatus.DECLINED, user, response);

        if (declineResponse.status && proposalDeclined?.driver) {
            this.sendNotification('declined', [proposalDeclined.driver]);
        }

        return declineResponse;
        
    }

    /**
     * Find all serviceProposals
     */
    async findAll() {
        const response = this.responses.list;

        const serviceProposals = await this.find({ relations: this.relations })
            .catch(() => {
                throw new ForbiddenException(response.noPermission);
            });

        return this.formatReturn(response.success, 'serviceProposals', serviceProposals);
    }

    /**
     * Find a service proposal by service
     * @param idService service id
     * @param user logged user extracted from token
     */
    async findByService(idService: number) {
        const response = this.responses.list;

        const serviceProposal = await this.find(
            {
                where: { idService, status: In([spStatus.CREATED, spStatus.ACCEPTED]) },
                relations: ['vehicle', 'driver']
            });

        return this.formatReturn(response.success, 'serviceProposals', serviceProposal);
    }

    /**
     * Find a service proposal by service and driver
     * @param idService service id
     * @param idDriver driver id
     * @param user logged user extracted from token
     */
    async findByServiceAndDriver(idService: number, idDriver: number) {
        const response = this.responses.list;

        const serviceProposal = await this.findOneWithOptionsOrFail(
            {
                where: [{ idService, creationUser: idDriver }],
                relations: this.relations
            }).catch(() => {
                throw new ForbiddenException(response.noPermission);
            });

        return this.formatReturn(response.success, 'serviceProposal', serviceProposal);
    }

    /**
     * Find a service proposal pending by driver
     * @param user logged user extracted from token
     */
    async findPendingProposalsByDriver(user: IUserReq) {
        const response = this.responses.list;

        const serviceProposal = await this.find(
            {
                where: { status: spStatus.CREATED, creationUser: user.userId },
                relations: ['vehicle', 'driver']
            });

        return this.formatReturn(response.success, 'serviceProposals', serviceProposal);
    }

    /**
     * Get proposal by idService and creationUser to map in return response.
     * @param idService Service to which the proposal belongs 
     * @param idUser Id of the driver
     * @param relations Optional, string[] with relations
     */
    async getByServiceAndUser(idService: number, idUser: number, relations?: string[]):
        Promise<ServiceProposal> {
        const response = this.responses.list;

        return await this.findOneWithOptionsOrFail(
            {
                where: [{ idService, creationUser: idUser }],
                relations: relations || this.relations
            }).catch(() => {
                throw new ForbiddenException(response.noPermission);
            });
    }

    /**
     * Change status of proposal and respond 
     * with response structure
     * @param idService id of transport service that belongs to the proposal
     * @param idDriver driver id
     * @param status status to set
     * @param user Logged User
     * @param response response with message and code
     */
    private async changeStatusAndRespond(idService: number,
                                         idDriver: number,
                                         status: string,
                                         user: IUserReq,
                                         response: any): Promise<any> {

        const sp = await this.changeStatusOrFail(idService, idDriver, status, user, response);
        return this.formatReturn(response.success, 'serviceProposal', sp);
    }

    /**
     * Change status of proposal or fail
     * @param idService id of transport service that belongs to the proposal
     * @param idDriver driver id
     * @param status status to set
     * @param user Logged User
     * @param response response with message and code
     */
    private async changeStatusOrFail(idService: number,
                                     idDriver: number,
                                     status: string,
                                     user: IUserReq,
                                     response: any): Promise<ServiceProposal> {

        const sp = await this.findOneWithOptionsOrFail({
            where: { creationUser: idDriver, idService },
            relations: this.relations
        }).catch(() => {
            throw new ForbiddenException(response.noPermission);
        });

        await this.validateStatusChange(sp, status, response);

        return await this.updateEntity({ status }, sp, user)
            .catch(() => {
                throw new InternalServerErrorException(response.error);
            });
    }

    /**
     * Validate the change of status of the service proposal
     * @param sp service proposal
     * @param newStatus new status to update
     * @param response response with message and code
     */
    private async validateStatusChange(sp: ServiceProposal, newStatus: string, response: any) {
        if (newStatus === spStatus.CANCELED) {
            if (sp.status === spStatus.DECLINED) {
                throw new NotAcceptableException(response.deniedByProposalStatus);
            }
            await this.tsService.driverCanCancel(sp.idService, response.deniedByService);
        } else if (newStatus === spStatus.DECLINED && sp.status !== spStatus.CREATED) {
            throw new NotAcceptableException(response.deniedByProposalStatus);
        } else if (newStatus === spStatus.ACCEPTED && sp.status !== spStatus.CREATED) {
            throw new NotAcceptableException(response.deniedByProposalStatus);
        }
    }
}
