import { Injectable, InternalServerErrorException, NotAcceptableException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as lodash from 'lodash';
import { Not, Repository } from 'typeorm';
import { Transactional } from 'typeorm-transactional-cls-hooked';
import { Status } from '../../common/enum/status.enum';
import { listsResponses } from '../../common/responses/lists.response';
import { BasicService } from '../../common/services/base.service';
import { Lists } from '../../models';
import { IUserReq } from '../../modules/users/interfaces/userReq.interface';
import { ListOptionsService } from '../listOptions/listOptions.service';
import { MeasurementUnitsService } from '../measurementUnits/measurementUnits.service';
import { CreateListDto } from './dto/createLists.dto';
import { UpdateListDto } from './dto/updateLists.dto';
import { IListOptions } from './interfaces/options.interface';

@Injectable()
export class ListsService extends BasicService<Lists> {

    responses = listsResponses;

    constructor(@InjectRepository(Lists)
        private readonly listsRepository: Repository<Lists>,
                private readonly listOptionsService: ListOptionsService,
                private readonly measurementUnitsService: MeasurementUnitsService) {
            super(listsRepository);

    }

    /**
     * Find all lists with its options
     */
    async findAll() {
        const response = this.responses.list;
        const res = [];

        const lists = await this.listsRepository.find({
            relations: ['listOptions'],
            where: [{ status: Status.ENABLED }]
        });

        if (lists) {
            lists.forEach(element => {
                res.push(this.formatListOptions(element));
            });
        }

        return this.formatReturn(response.success, 'lists', res);
    }

    /**
     * Find a List by its id
     * @param id list id
     */
    async findById(id: number) {
        const response = this.responses.list;

        const list = await this.listsRepository.findOne(id, {
            relations: ['listOptions'],
            where: [{ status: Status.ENABLED }]
        });

        return list ? this.formatReturn(response.success, 'list', this.formatListOptions(list)) : {};
    }

    /**
     * Find Lists by category specified with its id
     * @param idCategory category id
     */
    async findByCateogory(idCategory: number) {
        const response = this.responses.list;

        const query = `
        SELECT  id, name, measure, editable,
                array_agg(cast(value as varchar(255))) AS options
        FROM (
            SELECT  DISTINCT l.id, 
                    l.name, 
                    l.measure, 
                    l.editable, 
                    lo.value
            FROM "system".categories c
                JOIN "system".category_properties cp on cp.id_category = c.id
                JOIN "system".property_characteristics  pc on pc.id_property = cp.id_property 
                JOIN "system"."characteristics" ch on ch.id = pc.id_characteristic 
                JOIN "system".lists l on l.id = ch.id_list 
                JOIN "system".list_options lo on lo.id_list = l.id
            WHERE c.id = ${idCategory} and l.status = '${Status.ENABLED}'
        ) list
        GROUP BY (id, name, measure, editable)
        ORDER BY ("name")`;

        const data = await this.manager.query(query); 
        
        return this.formatReturn(response.success, 'lists', data);
    }
 
    /**
     * Rename ListOptions to 'options' and form an array with its field value
     * 
     * If the list object has already the listOptions object as 'options', 
     * the field value is selected and returned as 'options'
     *  
     * @param list Lists object to format listOptions to 'options'
     */
    formatListOptions(list: Lists) {
        // List object has is listOptions object as usual
        if (list.listOptions) {
            const options = [];

            list.listOptions.filter(element => {
                if (!element.disabled) {
                    options.push(element.value); 
                }
                
            });
    
            list['options'] = options;
            delete list.listOptions;
    
            return list;
        }

        // List object have 'options' array instead of listOptions
        const options = [...list['options']];
        const op = [];

        delete list['options'];
        options.filter((option) =>  {
            if (!option['disbaled']) {
                op.push(option.value); 
            }
        });

        list['options'] = op;

        return list;
        
    }

    /**
     *  Get Lists with option by product id
     * 
     * @param idProduct Id of the product
     */
    async findByProduct(idProduct: number) {
        const response = this.responses.list;

        const data = await this.query(`
            SELECT id, name, measure, editable,
                    array_agg(cast(value AS varchar(255))) AS options
            FROM (
                SELECT distinct l.id, 
                        l.name, 
                        l.measure, 
                        l.editable,
                        unnest(array[	
                                    CASE 
                                        WHEN c.data_type = 'Select' then obj_char->>'value'
                                        ELSE obj_char->>'unit'
                                    END, 
                                    lo.value]) as value
                FROM property_combos pc, jsonb_array_elements(pc.characteristics) obj_char
                    JOIN system."characteristics" c ON  c.name = obj_char->>'name'
                    JOIN system.lists l on l.id = c.id_list
                    JOIN system.list_options lo ON lo.id_list = l.id
                WHERE  pc.id IN (
                    
                        SELECT distinct cast(obj AS bigint)
                        FROM product_variations pv, jsonb_array_elements_text(pv.variations) obj
                        WHERE id_product = ${ idProduct }

                        UNION 

                        SELECT distinct cast(obj AS bigint)
                        FROM products p, jsonb_array_elements_text(p.properties) obj
                        WHERE id = ${ idProduct }
                    )
            ) AS lists
            GROUP BY id, name, measure, editable`);

        return this.formatReturn(response.success, 'lists', data);
        
    }

    /**
     * Create a List
     * 
     * @param body data to create a new list
     * @param user logged user extracted from token
     */
    @Transactional()
    async create(body: CreateListDto, user: IUserReq) {
        const response = this.responses.create;
        
        // Checks before creating the list 
        await this.checkNameExist(body.name, response.nameBeUnique);

        if (body.measure) { 
            this.checkMeasurementUnitsNotEmpty(body.options, response.idMeasureUnitMustBeSent);
            
            await this.checkMeasurementUnitsExist(body.options, response.idMeasureUnitMustExist);
        } 

        this.checkValueBeUnique(body.options, response.valuesBeUnique);

        const savedList = await this.save(body, user)
            .catch((e) => { throw new InternalServerErrorException({...response.error, e}); });

        await this.listOptionsService.createFromLists(savedList.id, body.options, user)
            .catch((e) => { throw new InternalServerErrorException({...response.error, e, segundo: true}); });

        return this.formatReturn(response.success, 'List', this.formatListOptions(savedList));
    }

    /**
     * Update a List
     * 
     * @param id List Id
     * @param body data to update the list
     * @param user logged user extracted from token
     */
    @Transactional()
    async update(id: number, body: UpdateListDto, user: IUserReq) {
        const response = this.responses.update;
        
        const list = await this.listsRepository.findOneOrFail(id , {
            where: [{ status: Status.ENABLED }],
            relations: ['listOptions']
        }).catch(() => { throw new NotAcceptableException(response.attrMustExist); });

        // Checks before updating the list
        if (body.name) { await this.checkNameExist(body.name, response.nameBeUnique, id); }

        if (body.options) {
            // Every value in options must be unique
            this.checkValueBeUnique(body.options, response.valuesBeUnique);

            // When measure is true, every idMeasurementUnit must exist
            if (body.measure) { 
                this.checkMeasurementUnitsNotEmpty(body.options, response.idMeasureUnitMustBeSent); 

                await this.checkMeasurementUnitsExist(body.options, response.error);
            }

            // Array to compare the list options from database with options provided by the user
            const listOptions = [];

            list.listOptions.forEach(option => {
                delete option.idList;
                if (!option.disabled) {
                    delete option.disabled;
                    const op = {
                        value: option.value,
                        idMeasurementUnit: option.idMeasurementUnit
                    };
                    listOptions.push(op);

                }
            });

            // Options no received, so they're going to be disabled
            const notPresentOptions = lodash.differenceWith(listOptions, body.options, lodash.isEqual);
            notPresentOptions.forEach((option) => {
                option['disabled'] = true;
                option['idList'] = list.id;
            });

            // Options not present before (new options), so they're created
            const newOptions = lodash.differenceWith(body.options, listOptions, lodash.isEqual);
            newOptions.forEach((option) => {
                option['disabled'] = false;
                option['idList'] = list.id;              
            });

            const allOptions = notPresentOptions.concat(newOptions);

            await this.listOptionsService.createFromLists(list.id, allOptions, user)
            .catch(() => { throw new InternalServerErrorException(response.error); });

        }

        // ListOptions already saved, so they're deleted
        delete list.listOptions;

        const updatedList = await this.updateAndGetRelations(body, list, user, ['listOptions'])
            .catch((e) => { throw new InternalServerErrorException({...response.error, e}); });

        return this.formatReturn(response.success, 'list', this.formatListOptions(updatedList));

    }

    /**
     * Enable a List
     * 
     * @param id List Id
     * @param user logged user extracted from token
     */
    async enable(id: number, user: IUserReq) {
        const response = this.responses.enable;

        const list = await this.listsRepository.findOneOrFail(id, { 
            where: [{ status: Status.ENABLED }],
            relations: ['listOptions'] 
        }).catch(() => { throw new NotAcceptableException(response.attrMustExist); });

        list.status = Status.DISABLED;

        await this.listsRepository.save(list, {data: user})
            .catch(() => { throw new InternalServerErrorException(response.error); });

        return this.formatReturn(response.success, 'list', this.formatListOptions(list));
    }

    /**
     * Disable a List
     * 
     * @param id List Id
     * @param user logged user extracted from token
     */
    async disable(id: number, user: IUserReq) {
        const response = this.responses.disable;

        const list = await this.listsRepository.findOneOrFail(id, { 
            where: [{ status: Status.DISABLED }],
            relations: ['listOptions'] 
        }).catch(() => { throw new NotAcceptableException(response.attrMustExist); });

        list.status = Status.ENABLED;

        await this.listsRepository.save(list, {data: user})
            .catch(() => { throw new InternalServerErrorException(response.error); });

        return this.formatReturn(response.success, 'list', this.formatListOptions(list));
    }

    /**
     * Check if the List name exist
     * 
     * @param name nsmr to check
     * @param errorResponse response in case name already exist
     * @param id List Id 
     */
    async checkNameExist(name: string, errorResponse: any, id?: number) {
        const [, count] = id ? 
            await this.listsRepository.findAndCount({ where: [{ id: Not(id), name }] }) : 
            await this.listsRepository.findAndCount({ where: [{ name }] });

        if (count > 0) { throw new NotAcceptableException(errorResponse); }

        return;
    }

    /**
     * Check if all idMeasurementUnit of options are not empty
     * 
     * @param options options array
     * @param errorResponse response in case idMeasurementUnit of a option is null or empty
     */
    checkMeasurementUnitsNotEmpty(options: IListOptions[], errorResponse: any) {

        options.forEach((option) => {
            if (!option.idMeasurementUnit) { throw new NotAcceptableException(errorResponse); }
        });

        return;
    }

    async checkMeasurementUnitsExist(options: IListOptions[], errorResponse: any) {

        const idMeasurements = [];

        options.forEach((option) => {
            idMeasurements.push(option.idMeasurementUnit);
        });

        const noDuplicateIds = lodash.uniq(idMeasurements);

        const mus = await this.measurementUnitsService.findByIds(idMeasurements);
        
        if (noDuplicateIds.length !== mus.length) {
            throw new NotAcceptableException(errorResponse);
        }

        return mus;
    }

    /**
     * Check over the options array if a value is duplicated
     * 
     * @param options options array
     * @param errorResponse response in case a value is duplicated
     */
    checkValueBeUnique(options: IListOptions[], errorResponse: any) {
        const values = options.map((option) => option.value);

        const valuesSet = new Set(values);
        const valuesUnique = [...valuesSet];

        if (values.length !== valuesUnique.length) { throw new NotAcceptableException(errorResponse); }
    }
}
