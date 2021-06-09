import { ForbiddenException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Raw, Repository } from 'typeorm';
import { ICharacteristic } from '../../common/interfaces/characteristic.interface';
import { productResponses } from '../../common/responses/product.response';
import { BasicService, CharacteristicsService, PropertyCharacteristicsService } from '../../common/services';
import { Property } from '../../models';
import { CreatePropertyDto } from '../products/dto/createProperty.dto';
import { IUserReq } from '../users/interfaces/userReq.interface';

@Injectable()
export class PropertiesService extends BasicService<Property> {

    constructor(
        @InjectRepository(Property)
        private readonly propertyRepository: Repository<Property>,
        private readonly characteristicService: CharacteristicsService,
        private readonly propertyCharacteristicService: PropertyCharacteristicsService,
    ) {
        super(propertyRepository);
    }

    /**
     *  Get properties by Array of id
     * @param ids Ids array
     * @param response Response with structure to return
     */
    async findPropertiesByIds(ids: number[]) {
        const properties = await this.findByIds(ids);

        if (!properties) {
            throw new ForbiddenException(productResponses.creation.errorProductPropCombo);
        }

        return properties;
    }

    /**
     *  Get or create a property whit these keys
     * @param data data to find o create property
     * @param user Logged user
     */
    async getOrCreateProperty(data: any, user: IUserReq): Promise<Property> {
        data.type = data.type || 'user-property';
        
        let property = await this.getProperty(data);

        if (!property) {
            property = await this.create(data, user);
        }

        return property;
    }

    /**
     * Save the Characteristic if dont exist and save the relation PropertyCharacteristic
     * 
     * @param comboItem Characteristic to save
     * @param property Property record
     * @param user Logged user
     */
    async savePropertyCharacteristics(comboItem: ICharacteristic, 
                                      property: any, user: IUserReq): Promise<void> {
        comboItem.label = comboItem.label || comboItem.name;
        comboItem.system = !!property.type;

        const characteristic = await this.characteristicService
                                            .checkToSaveAndGetReference(comboItem, user);
        
        const propertyCharacteristic: {
            idProperty: number;
            idCharacteristic: number;
        } = {
            idProperty: property.id,
            idCharacteristic: characteristic.id,
        };

        await this.propertyCharacteristicService.create(propertyCharacteristic, user);
    }

    /**
     *  Create a new property record
     * 
     * @param data Data to created a record
     * @param user Logged User
     * @returns Property created
     */
    async create(data: CreatePropertyDto, user: IUserReq): Promise<Property> {
        return await this.save(data, user);
    }

    /**
     *  Get Property by name and type
     * @param data 
     */

    /**
     *  Get property by name and type and returns it
     * 
     * @param data Name and type to find
     * @returns Propety or null
     */
    async getProperty(data: any): Promise<Property | undefined> {
        return await this.findOneWithOptions({
            where: {
                name: Raw(alias => `${alias} ILIKE '${data.name}'`),
                type: Raw(alias => `${alias} ILIKE '${data.type}'`),
            }
        });
    }
}
