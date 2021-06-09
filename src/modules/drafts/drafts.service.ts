import { ForbiddenException, Injectable,
    InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { IResponseStructureReturn } from '../../common/interfaces';
import { BasicService } from '../../common/services';
import { Draft } from '../../models';
import { IUserReq } from '../users/interfaces/userReq.interface';
import { CreateDraftDto } from './dto/createDraft.dto';
import { UpdateDraftDto } from './dto/updateDraft.dto';

@Injectable()
export class DraftsService extends BasicService<Draft> {

    constructor(@InjectRepository(Draft)
    private readonly draftRepository: Repository<Draft>) {
        super(draftRepository);
    }

    /**
     * Create Draft 
     * @param data Data to save the user
     * @param user Logged user
     * @param response Response with the structure to return
     */
    async create(data: CreateDraftDto, user: IUserReq, response: any):
        Promise<IResponseStructureReturn> {

        data.id = await this.generateDraftId();

        const draft = await this.save(data, user)
            .catch(() => {
                throw new InternalServerErrorException(response.error);
            });

        return this.formatReturn(response.success, 'draft', draft);

    }

    /**
     * Delete a draft
     * @param id String unique Draft
     * @param response Response with the structure to return
     */
    async delete(id: string, user: IUserReq, response: any): Promise<IResponseStructureReturn> {
        const draft = await this.findOneOrFail(id)
            .catch(() => {
                throw new ForbiddenException(response.noPermission);
            });

        await this.deleteEntity(draft, { data: user});

        return response.success;
    }

    /**
     * Get draft by id
     * @param id draft id
     * @param response Response with the structure to return
     */
    async getById(id: string, response: any): Promise<IResponseStructureReturn> {
        const results =  await this.findOneOrFail(id)
        .catch(() => {
            throw new ForbiddenException(response.noPermission);
        });

        return this.formatReturn(response.success, 'drafts', results);
    }

    /**
     * Get all draft by user
     * @param idUser User to filter
     * @param response Response with the structure to return
     */
    async getByUser(idUser: number, response: any): Promise<IResponseStructureReturn> {
        const results = await this.createQueryBuilder('d')
            .where('d.creationUser = :idUser', { idUser })
            .getMany();

        return this.formatReturn(response.success, 'drafts', results);
    }

    /**
     * Update Draft
     * @param id String unique draft
     * @param data Data to save user
     * @param user Logged user
     * @param response Response with the structure to return
     */
    async update(id: string, data: UpdateDraftDto, user: IUserReq, response: any):
        Promise<IResponseStructureReturn> {
        const draft = await this.findOneOrFail(id)
            .catch(() => {
                throw new ForbiddenException(response.noPermission);
            });

        const draftUpdate = await this.updateEntity(data, draft, user)
            .catch(() => {
                throw new InternalServerErrorException(response.error);
            });

        return this.formatReturn(response.success, 'draft', draftUpdate);
    }

    /**
     * Generate id o model draft
     */
    private async generateDraftId() {
        const id = this.generateRandomCodeByLength(500);

        const draft = await this.createQueryBuilder('d')
            .where('id = :id', { id })
            .getOne();

        return draft ? this.generateDraftId() : id;
    }
}
