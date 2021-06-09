import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import _ = require('lodash');
import { Repository } from 'typeorm';
import { IResponseStructure, IVariations } from '../../common/interfaces';
import { ICharacteristic } from '../../common/interfaces/characteristic.interface';
import { BasicService } from '../../common/services/base.service';
import { Property, PropertyCombo } from '../../models';
import { PropertiesService } from '../properties/properties.service';
import { IUserReq } from '../users/interfaces/userReq.interface';

@Injectable()
export class PropertyCombosService extends BasicService<PropertyCombo> {

    constructor(
        @InjectRepository(PropertyCombo)
        private readonly propertyComboRepository: Repository<PropertyCombo>,
        private readonly propertiesService: PropertiesService,

    ) {
        super(propertyComboRepository);
    }

    /**
     *  Create a new PropertyCombo
     * @param data data to create a new combo
     * @param user logged user
     * @returns PropertyCombo created
     */
    async create(data: any, user: IUserReq): Promise<PropertyCombo> {
        data.characteristics = data.characteristics.map(e => {
            delete e.label;
            delete e.system;
            delete e.id;
            delete e.status;
            delete e.unitRequired;
            return e;
        });
        return await this.save(data, user);
    }

    /**
     * Get id of the combo by propertyId and characteristic json, return id, otherwise null.
     * 
     * @param idProperty id of the property
     * @param characteristics JSON characteristic
     * @returns id of the PropertyCombo
     */
    async getReferencePropCombo(idProperty: number, characteristics: ICharacteristic[]): Promise<number> {
        
        const idPropCombo = await this.query(
            `select get_property_combos(${idProperty}, '${JSON.stringify(characteristics)}') as id`);
        
        return idPropCombo.length > 0 ? +idPropCombo[0].id : null;
    }

    /**
     *  Find a property combo or create it with these characteristics and property and 
     *  returns the id.
     * @param data Data to find or create
     * @param user Logged user
     * @returns propertyCombo id
     */
    async findPropComboOrCreate(data: { idProperty: number,
                                characteristics: ICharacteristic[]}, 
                                user: IUserReq): Promise<number> {
        
        const propComboDBId = await this.getReferencePropCombo(data.idProperty, data.characteristics);

        if (propComboDBId) {
            return propComboDBId;
        }

        return (await this.create(data, user)).id;
    }

    /**
     * Get all propertyCombos by ids
     * 
     * @param ids PropertyCombos ids
     * @returns Array with propertyCombos
     */
    async getPropertyCombosByIds(ids: number[]): Promise<PropertyCombo[]> {
        const propCombos = await this.findByIds(ids);
        
        const properties = await this.propertiesService
                .findPropertiesByIds(_.map(propCombos, (item) => item.idProperty));
        
        for (const propCombo of propCombos) {

            const property = _.find(properties, ['id', propCombo.idProperty]);
            
            propCombo['property'] = property.name;
            propCombo['type'] = property.type;
        }

        return propCombos;
    }

    /**
     *  Save collection of the properties with respective characteristics
     * @param variations Collection of variation with the properties
     * @param user Logged user extratec from the auth token
     * @param response response code and message
     */
    async saveProperties(variations: any, user: IUserReq, response: IResponseStructure): Promise<void> {
        for (const item of variations.properties) {
            await this.checkToSaveAndGetReference(item, user)
                .catch(() => {
                    throw new InternalServerErrorException(response);
                });
        }
    }

    /**
     *  Save the static properties with respestive characteristics and get the references ids
     * @property Properties to save
     * @user logged user extracted from the auth token
     * @return Array with PropertyCombo ids
     */
    async saveStaticProperties(properties: any, user: IUserReq, response: IResponseStructure) {
        return await this.saveStaticPropertiesAndGetReference(properties, user)
            .catch(() => {
                throw new InternalServerErrorException(response);
            });
    }

    /**
     *  Save the statics properties and get the references ids array
     * 
     * @param properties Property to save
     * @param user Logged user
     * @returns Array of the properties ids
     */
    async saveStaticPropertiesAndGetReference(properties: any, user: IUserReq): Promise<number[]> {
        
        const auxPropComboRef = [];
        
        for (const property of properties) {
            
            const propComboId = await this.saveStaticProperty(property, user);
            
            if (propComboId) {
                auxPropComboRef.push(+propComboId);
            }
        }

        return auxPropComboRef;
    }

    /**
     *  Save the static property of the product and return the id.
     *  
     * @param data Property to save with its characteristics 
     * @param user Logged user
     * @returns PropertyCombo id
     */
    async saveStaticProperty(data: any, user: IUserReq): Promise<number> {
        
        const propertyCombo = await this.savePropertyCombo(data, user);

        return await this.findPropComboOrCreate(propertyCombo, user);
    }

    /**
     *  Save property combo and return it
     * @param data data to save combo
     * @param property property of the combo
     * @param user Logged user
     */
    async savePropertyCombo(data: any, user: IUserReq):
            Promise<{idProperty: number, characteristics: ICharacteristic[]}> {

        const property = await this.propertiesService.getOrCreateProperty(data, user);

        for (const item of data.characteristics) {

            if (item instanceof Array) {
                // Then save comboItem of the variations
               await this.savePropertyComboOfVariations(item, property, user);
            } else {
                // create static properties 
                await this.propertiesService.savePropertyCharacteristics(item, property, user);
            }
        }

        const propertyCombo: {
            characteristics: ICharacteristic[],
            idProperty: number
        } = {
            idProperty: property.id,
            characteristics: data.characteristics
        };

        return propertyCombo;
    }

    /**
     * Save the property combo of the variation
     * @param item Array of characteristics to save
     * @param property current property
     * @param user Logged user
     */
    async savePropertyComboOfVariations(item: any[], property: Property, user: IUserReq) {
        for (const comboItem of item) {
            await this.propertiesService.savePropertyCharacteristics(comboItem, property, user);
        }

        const propertyCombo: {
            characteristics: ICharacteristic[],
            idProperty: number
        } = {
            idProperty: property.id,
            characteristics: item
        };
        
        // create combos of the variations
        await this.create(propertyCombo, user);
    }

    /**
     *  Check if there is a property with this combination of name and type, then return it.
     *  Otherwise is created it. Also saves Property_Characteristics in the pivot table and in 
     *  property_combos saves the respective feature combos
     * @param data Data to check or save the property and characteristics JSON.
     * @param user Logged user.
     * @returns Property to use
     */
    async checkToSaveAndGetReference(data: any, user: IUserReq): Promise<void> {
        await this.savePropertyCombo(data, user);
    }

    /**
     *  Get array with propertyCombo ids
     * 
     * @param variations Variations of the product
     * @returns Array with PropertyCombo ids
     */
    async getArrayReferencePropCombo(variations: IVariations[]): Promise<number[]> {

        const auxVariationsArray: number[] = [];

        for (const variation of variations) {
            variation.type = variation.type || 'user-property';
            
            const data: {
                name: string;
                type: string;
            } = {
                name: variation.property,
                type: variation.type
            };

            const propertyDB = await this.propertiesService.getProperty(data);
            
            const idPropertyCombo = await this.getReferencePropCombo(propertyDB.id, variation.characteristics);

            if (idPropertyCombo) {
                auxVariationsArray.push(idPropertyCombo);
            }

        }

        return auxVariationsArray;
    }

}
