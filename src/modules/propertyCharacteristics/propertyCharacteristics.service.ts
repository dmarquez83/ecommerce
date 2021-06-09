import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BasicService } from '../../common/services/base.service';
import { PropertyCharacteristic } from '../../models';
import { CreatePropertyCharacteristicDto } from '../products/dto/createPropertyCharacteristic.dto';
import { IUserReq } from '../users/interfaces/userReq.interface';

@Injectable()
export class PropertyCharacteristicsService extends BasicService<PropertyCharacteristic> {

    constructor(
        @InjectRepository(PropertyCharacteristic)
        private readonly PropertycharacteristicRepository: Repository<PropertyCharacteristic>,
    ) {
        super(PropertycharacteristicRepository);
    }

    /**
     * Save the PropertyCharacteristic
     * @param data PropertyCharacteristic data
     * @param user Logged user
     * @returns PropertyCharacteristic Created
     */
    async create(data: CreatePropertyCharacteristicDto, user: IUserReq) {
        return await this.save(data, user);
    }
}
