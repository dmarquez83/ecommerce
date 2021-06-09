import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BasicService } from '../../common/services/base.service';
import { ListOptions } from '../../models/listOption.entity';
import { IListOptions } from '../lists/interfaces/options.interface';
import { IUserReq } from '../users/interfaces/userReq.interface';

@Injectable()
export class ListOptionsService extends BasicService<ListOptions> {

    constructor(@InjectRepository(ListOptions)
        private readonly listOptionsRepository: Repository<ListOptions>) {
            super(listOptionsRepository);
        }
    
    /**
     * Create List Options when creating a new List
     * 
     * @param options Array containing options to create
     * @param user logged user extracted from token
     */
    async createFromLists(idList: number, options: IListOptions[], user: IUserReq) {
        
        options = options.map((option) => {
            option.idList = idList;
            option['creationUser'] = user.userId;
            return option;
        });

        return await this.save(options, user);
    }
}
