import { ForbiddenException, Injectable,
    InternalServerErrorException, NotAcceptableException, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import bcrypt = require('bcrypt');
import { Not, Repository } from 'typeorm';
import { Transactional } from 'typeorm-transactional-cls-hooked';
import { Provider } from '../../common/enum/provider.enum';
import { Status } from '../../common/enum/status.enum';
import { IResponseStructureReturn } from '../../common/interfaces';
import { businessResponses } from '../../common/responses/business.response';
import { userResponses } from '../../common/responses/users.response';
import { BasicService } from '../../common/services/base.service';
import { User } from '../../models';
import { BusinessesService } from '../businesses/businesses.service';
import { FilesService } from '../files/files.service';
import { TokenService } from '../token/token.service';
import { UserRolesService } from '../userRoles/userRoles.service';
import { WalletService } from '../wallet/wallet.service';
import { ChangePasswordDto } from './dto/changePassword.dto';
import { CreateUserDto } from './dto/createUser.dto';
import { EmailUsernameExistDto } from './dto/existUser.dto';
import { UserUniqueFieldsDto } from './dto/unique.dto';
import { UpdateUserDto } from './dto/updateUser.dto';
import { IUserReq } from './interfaces/userReq.interface';

@Injectable()
export class UsersService extends BasicService<User> {

    private readonly salt = this.configService.get('PASSWORD_SALT') as number;

    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
        private readonly configService: ConfigService,
        private readonly userRolesService: UserRolesService,
        private readonly walletService: WalletService,
        private readonly businessesService: BusinessesService,
        private readonly filesService: FilesService,
        private readonly tokenService: TokenService
    ) {
        super(userRepository);
    }

    /**
     *  Responsible for verifying and changing the password
     * @param data Old password and new password with confirmation
     * @param user User executing the action
     */
    async changePassword(data: ChangePasswordDto, user: IUserReq, response: any) {

        const userDB = await this.findOneOrFail(user.userId,
            {
                select: ['id', 'idBuyerLevel', 'username', 'status', 'telephone', 'address',
                    'firstName', 'lastName', 'mail', 'identityDocument',
                    'password', 'provider', 'idMunicipality'],
                where: { status: Not(Status.DELETED) }
            })
            .catch(() => {
                throw new InternalServerErrorException(response.error);
            });

        // compare the olds password
        if (!bcrypt.compareSync(data.oldPassword, userDB.password)) {
            throw new NotAcceptableException(response.previousInvalid);
        }

        // the new password can't be the current password
        if (bcrypt.compareSync(data.password, userDB.password)) {
            throw new NotAcceptableException(response.equalToPrevious);
        }

        return this.updateEntity(
            { password: bcrypt.hashSync(data.password, +this.salt) }, userDB, user)
            .then(() => {
                return response.success;
            })
            .catch(() => {
                throw new InternalServerErrorException(response.error);
            });
    }

    /**
     *  Clean the user response
     * @param data User to clean
     */
    cleanUserResponse(data: any) {
        data.idWallet = +data.idWallet;
        data.id = +data.id;

        if (data.idMunicipality) {
            data.idMunicipality = +data.idMunicipality;
        }

        if (data.idBuyerLevel) {
            data.idBuyerLevel = +data.idBuyerLevel;
        }

        if (!data.municipality) {
            delete data.municipality;
        }

        this.setDefaultColumnForImages(data.image);
    }

    /**
     * Responsible for creating the user
     * @param data Parameters required for user creation 
     */
    @Transactional()
    async create(data: CreateUserDto, response: any): Promise<any> {

        if (!data.username) {
            data.username = await this.generateUsername(data.mail);
        }

        this.validateEqualUserEmail(data, response.usernameNotValid);

        await this.validateUniqueFields(data, response);

        if (!data.provider) {
            data.provider = Provider.PYNPON;
        }

        if (!data.password) {
            data.password = this.generateRandomCodeByLength(20);
        }

        if (data.imgCode) {
            await this.filesService.findByNameOrFail(data.imgCode);
        } else {
            data.imgCode = this.getRandomAvatar();
        }

        data.password = bcrypt.hashSync(data.password, +this.salt);

        return this.save({ ...data }, { userId: null, username: '' }).then(async (userAct) => {

            // Assign the seller role to the user
            await this.userRolesService.setSellerRole(userAct);

            const wallet = await this.walletService.createWallet(userAct.id);
            userAct.idWallet = wallet.id;
            const user = await this.saveAndGetRelations(userAct,
                { userId: null, username: '' }, ['municipality'])
                .catch(() => {
                    throw new InternalServerErrorException(response.error);
                });

            this.cleanUserResponse(user);

            const business = {
                name: `${user.firstName} ${user.lastName}`,
                description: `Personal business of ${user.firstName} ${user.lastName}`,
                personal: true,
                idWallet: null,
                legalRepresentative: null,
                imgCode: null,
            };

            const userReq = {
                username: user.username,
                userId: user.id
            };

            await this.businessesService.create(business, userReq, businessResponses.creation);
            const tokenDB = await this.tokenService.generateTokens(user);
            return { ...response.success, user, ...tokenDB };
        }).catch(() => {
            throw new InternalServerErrorException(response.error);
        });
    }

    /**
     * Disable a user, change the status to 'Disabled'
     * @param id Id of the user to disable
     * @param response response with the structure to return
     * @param user Logged user
     */
    async disable(id: number, response: any, user: IUserReq) {

        return await this.getUserByIdWithRelations(id, response.error)
            .then(async (res) => {
                const disabledUser = await this.disableEntityByStatus(res, user);

                // SPECIFIC REQUIREMENT: return complete object with its relations

                return await this.findById(disabledUser.id, userResponses.disable);
            }).catch(() => {
                throw new InternalServerErrorException(response.error);
            });
    }

    /**
     * Check if exist a user with this username or email
     * @param data username or email to check.
     */
    async emailOrUsernameExist(data: EmailUsernameExistDto, id?: number): Promise<User> {
        const query = this.createQueryBuilder();

        if (id) {
            query.where('id <> :id', { id });
        }

        return await query.andWhere('(mail = :mail OR username = :username) AND status <> :status',
            { mail: data.mail, username: data.username, status: Status.DELETED }).getOne();
    }

    /**
     * Enable a user, change the status to 'Activate'
     * @param id Id of the user to enable
     * @param response response with the structure to return
     * @param user Logged user
     */
    async enable(id: number, response: any, user: IUserReq) {

        return await this.getUserByIdWithRelations(id, response.error)
            .then(async (res) => {
                const enableUser = await this.activateEntityByStatus(res, user);

                // SPECIFIC REQUIREMENT: return complete object with its relations
                return await this.findById(enableUser.id, userResponses.enable);
            }).catch(() => {
                throw new InternalServerErrorException(response.error);
            });
    }

    /**
     *  Find all Users
     *  @return Promise with all users.
     */
    async findAll(): Promise<User[]> {
        return this.createQueryBuilder()
            .where('status <> :status', { status: Status.DELETED })
            .getMany();
    }

    /**
     * Find User by id
     * 
     * @param id User id.
     */
    async findById(id: number, response: any): Promise<IResponseStructureReturn> {
        const user = await this.getUserByIdWithRelations(id, response.noPermission);

        this.cleanUserResponse(user);

        return this.formatReturn(response.success, 'user', user);
    }

    /**
     *  Change status to 'Deleted'
     * @param id Id of user to delete
     * @param response Response with structure to return
     * @param user logged User
     */
    async findByIdAndDelete(id: number, response: any, user: IUserReq) {

        return await this.getUserByIdWithRelations(id, response.error)
            .then(async (res) => {
                const deletedUser = await this.deleteEntityByStatus(res, user);

                // SPECIFIC REQUIREMENT: return complete object with its relations
                const userDB = await this.findOneOrFail(deletedUser.id, {
                    relations: ['municipality', 'image']
                });

                this.cleanUserResponse(userDB);

                return this.formatReturn(response.success, 'user', userDB);

            }).catch(() => {
                throw new InternalServerErrorException(response.error);
            });
    }

    /**
     * Find User by id
     * 
     * @param id User id.
     */
    async findByMail(mail: string, response: any): Promise<IResponseStructureReturn> {
        await this.userRepository.findOneOrFail({ where: { mail, status: Not(Status.DELETED) } })
            .catch(() => {
                throw new NotFoundException(response.notFound);
            });

        return response.success;
    }

    /**
     * Find a user by username or mail
     * @param usernameOrEmail Username or email
     */
    async findByUsernameOrEmail(usernameOrEmail: string): Promise<User> {
        // Fields are selected here, because the password is needed here to login
        // and it is excluded in the user entity (select: false)
        return await this.userRepository.findOne(
            {
                select: ['id', 'idBuyerLevel', 'username', 'status', 'telephone', 'address',
                    'firstName', 'lastName', 'mail', 'identityDocument',
                    'password', 'provider', 'idMunicipality'],
                where: [{ username: usernameOrEmail, status: Not(Status.DELETED) },
                { mail: usernameOrEmail, status: Not(Status.DELETED) }],
                relations: ['municipality']
            });
    }

    /**
     * This function is responsible for generating a random username that does 
     * not exist, you are given 5 opportunities. If in 5 opportunities it does 
     * not find a username that does not exist, the email is returned
     * @param mail mail to return 
     */
    async generateUsername(mail: string): Promise<string> {
        let username = '';
        let i = 0;
        let userCount = 0;

        do {
            username = 'user-' + this.generateRandomCodeByLength(45);

            userCount = await this.userRepository.createQueryBuilder('u')
                .andWhere('u.status <> :status', { status: Status.DELETED })
                .andWhere('u.username iLIKE :username', { username })
                .getCount();
            i = i + 1;
        } while (userCount === 1 && i < 5);

        // In case 5 repetitions are made and a username that does not exist is generated, mail is sent
        return userCount === 1 ? mail : username;
    }

    /**
     * Get user by id without relations
     * @param id id to find
     * @param response Response in case of error with the structure
     */
    async getUserByIdWithoutRelations(id: number, response: any) {
        return await this.findOneOrFail(id,
            {
                where: `User.status <> '${Status.DELETED}'`
            })
            .catch(() => {
                throw new ForbiddenException(response);
            });
    }

    /**
     * Get user by id with relations
     * @param id id to find
     * @param response Response in case of error with the structure
     */
    async getUserByIdWithRelations(id: number, response: any) {
        return await this.findOneOrFail(id,
            {
                where: `User.status <> '${Status.DELETED}'`,
                relations: ['municipality', 'image']
            })
            .catch(() => {
                throw new ForbiddenException(response);
            });
    }

    /**
     * Check if exist a user with this identityDocument
     * @param data Identity document
     */
    async identityDocExist(data: CreateUserDto): Promise<User> {
        return await this.userRepository.findOne({
            status: Not(Status.DELETED),
            identityDocument: data.identityDocument
        });
    }

    /**
     * Responsible for updated user
     * @param id User id
     * @param data Parameters to updated.
     * @returns Updated User.
     */
    async update(data: UpdateUserDto, userReq: IUserReq, response: any) {

        if (data.imgCode) {
            await this.filesService.findByNameOrFail(data.imgCode);
        } else {
            data.imgCode = this.getRandomAvatar();
        }

        const user = await this.getUserByIdWithoutRelations(userReq.userId, response.noPermission);

        if ((data.mail && user.mail !== data.mail) ||
            (data.username && user.username !== data.username) ||
            (data.identityDocument && user.identityDocument !== data.identityDocument)) {
            await this.validateUniqueFields(data, response, user.id);
        }

        if (data.username && user.username !== data.username) {
            this.validateEqualUserEmail({
                username: data.username,
                mail: data.mail || user.mail
            },
                response.usernameNotValid);
        }

        const userUpdated = await this.updateAndGetRelations(data, user, userReq, ['image'])
            .catch(() => {
                throw new InternalServerErrorException(response.error);
            });

        delete userUpdated.password;

        this.cleanUserResponse(userUpdated);

        return this.formatReturn(response.success, 'user', userUpdated);
    }

    /**
     *  Check if the username has a '@', then it must be the same email
     * @param data Parameter to create or update the user
     */
    validateEqualUserEmail(data: { username: string, mail: string }, completeResponse: any): void {
        if (data.username.includes('@') && data.username !== data.mail) {
            throw new NotAcceptableException(completeResponse);
        }
    }

    /**
     * function responsible for the validation of the fields that have to be unique in users
     * @param data unique fields for users
     * @param response response in case of error 
     */
    async validateUniqueFields(data: UserUniqueFieldsDto, response: any, id?: number) {
        let query = this.userRepository.createQueryBuilder('u');

        if (id) {
            query = query.andWhere('u.id <> :id', { id });
        }

        if (data.identityDocument) {
            query = query.andWhere('(u.identityDocument iLIKE :doc', { doc: data.identityDocument })
                .andWhere('u.status <> :status', { status: Status.DELETED })
                .orWhere('u.mail iLIKE :mail', { mail: data.mail })
                .orWhere('u.username iLIKE :username)', { username: data.username });
        } else {
            query = query.andWhere('(u.mail iLIKE :mail', { mail: data.mail })
                .andWhere('u.status <> :status', { status: Status.DELETED })
                .orWhere('u.username iLIKE :username)', { username: data.username });
        }

        const user = await query.getOne();

        if (!user) {
            return;
        }

        if (data.username.toLowerCase() === user.username.toLocaleLowerCase()) {
            throw new NotAcceptableException(response.usernameExists);
        }

        if (data.mail.toLowerCase() === user.mail.toLocaleLowerCase()) {
            throw new NotAcceptableException(response.mailExists);
        }

        throw new NotAcceptableException(response.documentExists);
    }
}
