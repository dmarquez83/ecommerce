import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { categoryPropertiesResponses } from '../../common/responses/categoryProperties.response';
import { BasicService } from '../../common/services/base.service';
import { CategoryProperty, Property } from '../../models';

@Injectable()
export class CategoryPropertiesService extends BasicService<CategoryProperty> {

    constructor(@InjectRepository(CategoryProperty)
        private readonly categoryPropertiesRepository: Repository<CategoryProperty>,
                @InjectRepository(Property)
        private readonly propertiesRepository: Repository<Property>,
        ) {
            super(categoryPropertiesRepository);
        }

    /**
     * Find properties by category id
     * @param idCategory Id of the category to find
     */
    async findByCategory(idCategory: number) {
        const response = categoryPropertiesResponses.list;
        const properties = await this.categoryPropertiesRepository.find(
            {
                where: [{idCategory, disabled: false}],
                relations: ['properties', 'properties.propertyCharacteristics', 'properties.propertyCharacteristics.characteristics']
            })
            .catch(() => {
                throw new InternalServerErrorException(response.error);
            });
        
        const res = [];

        properties.forEach(element => {
            const chars = [];
            
            element.properties.propertyCharacteristics.forEach(el => {
                if (!el.disabled && el.characteristics) {
                    el.characteristics['main'] = el.main;
                    chars.push(el.characteristics);
                }
            });

            const partialResponse = {
                id: element.properties.id,
                name: element.properties.name,
                type: element.properties.type,
                main: element.main,
                characteristics: chars
            };

            res.push(partialResponse);

        });

        return this.formatReturn(response.success, 'properties', res);
    }

    /**
     * Find properties of the product 
     * @param idProduct product id
     */
    async findByProduct(idProduct: number) {
        const response = categoryPropertiesResponses.list;
        const query = `
        select 	p.id p_id,
                p.name p_name,
                p."type" p_type,
                pp.required,
                c.id c_id,
                c.name c_name,
                c.label c_label,
                c.data_type c_data_type,
                c.unit_required c_unit_required,
                c.id_list c_id_list
        from "system".properties p 
            join "system".property_characteristics pc on pc.id_property = p.id 
            join "system"."characteristics" c on c.id = pc.id_characteristic 
            join get_properties_product(${idProduct}) pp on pp.id_property = p.id
        order by p.id ASC
        ;`;
    
        const rawData = await this.manager.query(query);

        return this.formatReturn(response.success, 'properties', this.formatProperties(rawData));
    }

    /**
     * Clean format of the properties
     * @param properties properties to format
     */
    formatProperties(properties: any) {

        let preProperty = -1;
        let actPoperty = -1;
        const propertiesArray = [];
        let charArray = [];
        let propertyObj;

        properties.forEach(element => {
            actPoperty = element.p_id;
            
            if (actPoperty !== preProperty) {
                if (preProperty !== -1) {
                    propertyObj.characteristics = [...charArray];
                    propertiesArray.push({...propertyObj});
                    charArray = [];
                }

                propertyObj = {
                    id:     element.p_id,
                    name:   element.p_name,
                    type:   element.p_type,
                    required: element.required,
                    characteristics: []
                };
            }

            const characteristic = {
                id:             element.c_id,
                name:           element.c_name,
                label:          element.c_label,
                dataType:       element.c_data_type,
                unitRequired:   element.c_unit_required,
                idList:         element.c_id_list,
            };
            charArray.push({...characteristic});
            preProperty = actPoperty;
        });

        if (actPoperty !== -1) {
            propertyObj.characteristics = [...charArray];
            propertiesArray.push({...propertyObj});
        }

        return propertiesArray;
    }
}
