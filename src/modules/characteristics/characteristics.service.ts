import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Raw, Repository } from 'typeorm';
import { BasicService } from '../../common/services/base.service';
import { Characteristics } from '../../models';
import { CreateCharacteristicDto } from '../../modules/products/dto/createCharacteristic.dto';
import { IUserReq } from '../users/interfaces/userReq.interface';

@Injectable()
export class CharacteristicsService extends BasicService<Characteristics> {

    constructor(
        @InjectRepository(Characteristics)
        private readonly characteristicRepository: Repository<Characteristics>,
    ) {
        super(characteristicRepository);
    }

    /**
     *  Check if the characteristic exist and returning, otherwise is created
     * 
     * @param data Data to find or save the characteristic
     * @param user Logged user
     * @returns The Characteristic created or find it.
     */
    async checkToSaveAndGetReference(data: any, user: IUserReq): Promise<Characteristics> {
        
        let characteristic = await this.findOneWithOptions({
            where: {
                name: Raw(alias => `${alias} ILIKE '${data.name}'`),
            }
        });

        if (!characteristic) {
            characteristic = await this.create(data, user);
        }

        return characteristic;
    }

    /**
     *  Get characteristic by name
     * @param name name to find
     */
    async findByName(name: string): Promise<Characteristics>  {
        return await this.findOneWithOptions({
            where: {
                name: Raw(alias => `${alias} ILIKE '${name}'`),
            }
        });
    }

    /**
     * Get characteristics by array names
     * @param names Array of names to find
     */
    async findByArrayNames(names: string[]): Promise<Characteristics[]>  {
        return await this.characteristicRepository.createQueryBuilder()
            .where('name ILIKE any(:names)', {names})
            .getMany();
    }

    /**
     *  Create new characteristic in database
     * 
     * @param data data to save the characteristic
     * @param user Logged user
     * @returns Characteristic created
     */
    async create(data: CreateCharacteristicDto, user: IUserReq): Promise<Characteristics> {
        return await this.save(data, user);
    }
}
