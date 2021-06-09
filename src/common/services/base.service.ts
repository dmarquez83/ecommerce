import { NotFoundException } from '@nestjs/common';
import _ = require('lodash');
import { paginate, Pagination } from 'nestjs-typeorm-paginate';
import { snakeCase } from 'snake-case';
import { EntityManager, FindOneOptions, ObjectLiteral, QueryRunner,
    RemoveOptions, Repository, SelectQueryBuilder } from 'typeorm';
import { getEntityManagerOrTransactionManager } from 'typeorm-transactional-cls-hooked';
import { ILogin } from '../../modules/auth/interfaces/ILogin.interface';
import { ILoginReturn } from '../../modules/auth/interfaces/ILoginReturn.interface';
import { IUserReq } from '../../modules/users/interfaces/userReq.interface';
import { Status } from '../enum/status.enum';
import { IExtraDataToSave } from '../interfaces';
import { ReqWithCookies } from '../interfaces/reqWithCookies.interface';
import { IResponseStructure } from '../interfaces/responses.interface';
import { IResponseStructureReturn } from '../interfaces/responsesReturn.interface';
import { IPaginationOptions } from './../interfaces/paginateOptions.interface';

export class BasicService<Entity extends ObjectLiteral> {

    set manager(manager: EntityManager) {
        this._manager = manager;
        this._connectionName = manager.connection.name;
    }

    // Always get the entityManager from the cls namespace if active, 
    // otherwise, use the original or getManager(connectionName)
    get manager(): EntityManager {
        return getEntityManagerOrTransactionManager(this._connectionName, this._manager);
    }
    private _connectionName = 'default';
    private defaultImages = ['default-avatar-01', 'default-avatar-02',
        'default-avatar-03', 'default-avatar-04',
        'default-avatar-05', 'default-avatar-06',
        'default-avatar-07', 'default-avatar-08',
        'default-avatar-09', 'default-avatar-10'];
    private _manager: EntityManager | undefined;

    constructor(
        private readonly repository: Repository<Entity>
    ) { }

    /**
     * Find one entity that matches with options
     * @param options Options to find
     */
    findOneWithOptions(options: FindOneOptions<Entity>): Promise<Entity | undefined> {
        return this.repository.findOne(options);
    }

    /**
     * Find one entity that matches with options
     * @param options Options to find
     */
    findOneWithOptionsOrFail(options: FindOneOptions<Entity>): Promise<Entity | undefined> {
        return this.repository.findOneOrFail(options);
    }

    /**
     * Finds first entity that matches given options.
     */
    async findOneOrFail(id: string | number | Date, options?: any): Promise<Entity> {
        if (!id) {
            throw new NotFoundException({
                status: false,
                message: 'The id cant be empty',
                code: '',
            });
        }
        return this.cleanObjects(await this.repository.findOneOrFail(id, options));
    }

    /**
     * Finds entities that match given options.
     * @param options Defines a special criteria to find specific entities.
     */
    async findWithOptionsOrFail(options: FindOneOptions<Entity>): Promise<Entity[]> | undefined {
        const result = await this.repository.find(options);

        if (result.length === 0) {
            throw new NotFoundException({
                status: false,
                message: 'No results to this query',
                code: '4',
            });
        }

        result.forEach(e => {
            this.cleanObjects(e);
        });

        return result;
    }

    /**
     * Saves a given entity in the database.
     * If entity does not exist in the database then inserts.
     * @param data: Data required to create the entity 
     * @param user User who executed the action
     * @param data Extra data to save
     * @returns the entity created
     */
    async save(data: any, user: IUserReq, extraData?: IExtraDataToSave) {
        data.creationUser = Number(user.userId);
        data.status = extraData?.status || Status.ENABLED;

        return this.cleanObjects(await this.repository.save(data, { 
            data: extraData ? { ...user, extraData } : user }));
    }

     /**
      * Saves a given entity in the database.
      * If entity does not exist in the database then inserts and get the relations.
      * @param data Data to save 
      * @param user Logged user
      * @param relations Relations to find
      * @param status status to set
      * @returns the entity created with the relations
      */
    async saveAndGetRelations(data: any, user: IUserReq,
                              relations: string[], status ?: string): Promise<Entity> {

        data.creationUser = +user.userId;

        data.status = status ? status : Status.ENABLED;

        const savedEntity = await this.repository.save(data, { data: user });

        return this.cleanObjects(await this.repository.findOne(savedEntity.id, { relations }));
    }

    /**
     * Find all matches entities
     * @param conditions conditions to find
     */
    async find(conditions: any) {
        return await this.repository.find(conditions);
    }

    /**
     * Find all entities
     */
    async getAll() {
        return await this.repository.find();
    }

    /**
     * Finds entities by ids.
     * Optionally find options can be applied.
     */
    async findByIds(ids: any[], options?: any) {
        if (options) {
            return await this.repository.findByIds(ids, options);
        }
        return await this.repository.findByIds(ids);
    }

    /**
     *  Response cookies or headers with data
     * @param req Request to map the cookies or headers
     * @param data Data of logged user
     */
    async responseCookiesOrHeaders(req: ReqWithCookies, data: ILogin): Promise<ILoginReturn> {

        if (req.get('referer')?.includes('mobile')) {
            return data;
        }

        req._cookies = [];

        const tokenCookies = {
            name: 'token',
            val: data.token
        };

        const refreshTokenCookies = {
            name: 'refreshToken',
            val: data.refreshToken
        };
        
        req._cookies.push(tokenCookies, refreshTokenCookies);

        delete data.token;
        delete data.refreshToken;

        return data;
    }

    /**
     *  Paginate a array.
     * @param options Options to paginate
     * @param query Array of result, results of a .query () or a simple array.
     */
    protected getPaginatedItems(options: IPaginationOptions,
                                query: any[]) {

        if (+options.page <= 0) {
            options.page = 1;
        }

        const offset = (+options.page - 1) * +options.limit;
        const items = _.drop(query, offset).slice(0, +options.limit);

        return {
            items,
            itemCount: items.length,
            totalItems: query.length,
            totalPages: Math.ceil(query.length / +options.limit),
            pageCount: Math.ceil(items.length / +options.limit),
            next: '',
            last: ''
        };
    }

    /**
     * Delete unwanted properties for the entities
     * @param options Options to paginate
     * @param query Query without executing, just to paginate
     */
    protected async cleanResultPagination(options: IPaginationOptions,
                                          query: SelectQueryBuilder<Entity>): Promise<Pagination<Entity>> {
        const tempResult = await paginate<Entity>(query, options);

        (tempResult).items.map(e => {
            return this.cleanObjects(e);
        });

        return tempResult;
    }

    /**
     * Delete unwanted properties for the entity
     */
    protected async cleanObjects(data: Entity): Promise<Entity> {
        delete data.creationDate;
        delete data.creationUser;
        delete data.modificationDate;
        delete data.modificationUser;
        return data;
    }

    /**
     * Creates a new query builder that can be used to build a sql query.
     * @param alias Alias of the table to select 
     * @param queryRunner Instance of 
     */
    protected createQueryBuilder(alias?: string, queryRunner?: QueryRunner): SelectQueryBuilder<Entity> {
        if (queryRunner) {
            return this.repository.createQueryBuilder(alias, queryRunner);
        }

        if (alias) {
            return this.repository.createQueryBuilder(alias);
        }

        return this.repository.createQueryBuilder();

    }

    /**
     *  Execute a raw SQL query and returns a raw database results. 
     * @param query Query to execute.
     */
    protected query(query: string, parameters?: any[]): Promise<any> {
        if (parameters) {
            return this.repository.query(query, parameters);
        }
        return this.repository.query(query);
    }

    /**
     * Finds first entity that matches given options with this id
     */
    protected async findOne(id: string | number | Date, options?: any): Promise<Entity> | undefined {
        if (!id) {
            throw new NotFoundException({
                status: false,
                message: 'The id cant be empty',
                code: '',
            });
        }
        return this.cleanObjects(await this.repository.findOne(id, options));
    }

    /**
     * Update and get register with relations
     * @param data Data to update
     * @param entity Entity to update
     * @param user Logged user
     * @param relations Array of relations
     */
    protected async updateAndGetRelations(data: any, entity: Entity, user: IUserReq, relations: string[]) {

        data.modificationUser = user.userId;
        this.repository.merge(entity, data);
        const updatedEntity = await this.repository.save(entity, { data: user });

        return await this.cleanObjects(await this.repository.findOne(updatedEntity.id, { relations }));
    }

    /**
     * Activate the entity by field status 
     * @param entity Entity to update
     * @param user User who executed the action
     */
    protected async activateEntityByStatus(entity: Entity | Entity[], user: IUserReq): Promise<any> {
        return this.updateEntity({ status: Status.ENABLED }, entity, user);
    }

    /**
     * Activate the entity
     * @param entity Entity to update
     * @param user User who executed the action
     */
    protected async activateEntity(entity: Entity | Entity[], user: IUserReq): Promise<any> {
        return this.updateEntity({ disabled: false }, entity, user);
    }

    /**
     *  Disabled the entity
     * @param entity 
     * @param user 
     */
    protected async disableEntity(entity: Entity | Entity[], user: IUserReq): Promise<any> {
        return this.updateEntity({ disabled: true }, entity, user);
    }

    /*
     *  Disabled the entity by field 'status'
     * @param entity Entity to update
     * @param user User who executed the action
     */
    protected async disableEntityByStatus(entity: Entity | Entity[], user: IUserReq): Promise<any> {
        return this.updateEntity({ status: Status.DISABLED }, entity, user);
    }

    /*
     *  Delete the entity by field 'status'
     * @param entity Entity to update
     * @param user User who executed the action
     */
    protected async deleteEntityByStatus(entity: Entity | Entity[], user: IUserReq): Promise<any> {
        return this.updateEntity({ status: Status.DELETED }, entity, user);
    }

    /**
     *  Update the entity in the database
     * @param data Data to update the entity
     * @param entity Entity to update
     * @param user User who executed the action
     * @returns Promise with the updated entity
     */
    protected async updateEntity(data: any, entity: Entity | Entity[], user: IUserReq): Promise<any> {
        data.modificationUser = user.userId;
        data.modificationDate = new Date();
        if (entity instanceof Array) {

            for (const deepEntity of entity) {
                this.repository.merge(deepEntity, data);
            }

            const entities = await this.repository.save(entity, { data: user });

            entities.forEach(element => {
                this.cleanObjects(element);
            });

            return entities;
        }

        this.repository.merge(entity, data);

        return this.cleanObjects(await this.repository.save(entity, { data: user }));
    }

    /**
     * Format the returned objects, so that they meet the standards
     * @param response base 
     * @param aditionalKey additional key to be added to the answer
     * @param object object to be added to the response
     * @returns standardized response
     */
    protected formatReturn(response: IResponseStructure, aditionalKey: string,
                           object: any): IResponseStructureReturn {
        const returnResponse = { ...response };

        if (!object) {
            object = [];
        }

        if (object['modificationDate']) {
            delete object['modificationDate'];
        }

        returnResponse[aditionalKey] = object;

        return returnResponse;
    }

    /**
     * Upsert, only works with postgres.
     * 
     * @param obj Object to upsert
     * @param primary_key Primary key to upsert
     * @param opts Keys to exclude from upsert. This is useful if a non-nullable field 
     * is required in case the row does not already exist but you do not 
     * want to overwrite this field if it already exists.
     */
    protected async upsert<T>(obj: T, primary_keys: string,
                              opts?: {
            add_upsert?: string,
            do_not_upsert?: string[]
        }
    ): Promise<T> {
        const keys: string[] = _.difference(_.keys(obj), opts ? opts.do_not_upsert : []);
        const setter_string =
            keys.map(k => `${snakeCase(k)} = :${k}`);

        if (opts && opts.add_upsert) {
            setter_string.push(opts.add_upsert);
        }

        const qb = this.repository.createQueryBuilder()
            .insert()
            .values(obj)
            .onConflict(`(${primary_keys}) DO UPDATE SET ${setter_string}`);

        keys.forEach(k => {
            qb.setParameter(k, Array.isArray((obj as any)[k]) ? JSON.stringify((obj as any)[k]) :
                (obj as any)[k]);
        });

        return (await qb.returning('*').execute()).generatedMaps[0] as T;
    }

    /**
     *  GroupBy array method
     */
    protected groupBy = (array: any[], key: string) => {
        return array.reduce((result, currentValue) => {
            // If an array already present for key, push it to the array. Else create an array
            // and push the object
            (result[currentValue[key]] = result[currentValue[key]] || []).push(
                currentValue
            );
            // Return the current iteration `result` value, this will be taken as next 
            // iteration `result` value and accumulate
            return result;
        }, {}); // empty object is the initial value for result object
    };

    /**
     *  Check if two arrays are equals
     * @param a 
     * @param b 
     */
    protected arrayEquals(a: [], b: []) {
        return a.length === b.length && a.every((value, index) => value === b[index]);
    }

    /**
     *  Generate a random string
     * @param length length of the string to generate
     */
    protected generateRandomCodeByLength(length: number) {
        let result = '';

        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

        for (let i = 0; i < length; i++) {
            result += characters.charAt(Math.floor(Math.random() * characters.length));
        }

        return result;
    }

    /**
     * Revome the entity
     * @param entities entities o entity to remove
     * @param options options to remove
     */
    protected async deleteEntity(entities: Entity | Entity[], options?: RemoveOptions) {
        if (options) {

            if (entities instanceof Array) {
                return await this.repository.remove(entities, options);
            }

            return await this.repository.remove(entities, options);
        }

        if (entities instanceof Array) {
            return await this.repository.remove(entities, options);
        }

        return await this.repository.remove(entities, options);
    }

    /**
     * Order array by key
     * @param data Array to order
     * @param key Key to order
     * @param order 'asc' | 'desc'
     */
    protected async orderBy(data: any[], key: any[] | Function | object[] | string[], order: 'asc' | 'desc') {
        return _.orderBy(data, key, [order]);
    }

    /**
     * Randomly get the image for the avatar
     * 
     * @param imagesAssigned array of images assigned
     */
    protected getRandomAvatar(imagesAssigned?: string[]): string {
        const avatars = [...this.defaultImages];

        if (imagesAssigned && imagesAssigned.length < avatars.length) {
            imagesAssigned.forEach((image) => {
                _.remove(avatars, (avatar) => avatar === image);
            });
        }

        return avatars[Math.ceil(Math.random() * 100) % avatars.length];
    }

    /**
     * set the default field of the image objects
     * 
     * @param image image object
     */
    protected setDefaultColumnForImages(image: {}) {
        const avatars = [...this.defaultImages];

        if (image) {
            if (avatars.find(element => element === image['name'])) {
                image['default'] = true;
            } else {
                image['default'] = false;
            }
        }
    }

    /**
     *  Paginate the query results by params
     * @param options Options to paginate
     * @param query Query without executing, just to paginate
     */
    protected async paginate(options: IPaginationOptions,
                             query?: SelectQueryBuilder<Entity> | any[]): Promise<Pagination<Entity>> {
        options.page = options.page || 0;
        options.limit = options.limit || 10;
        options.limit = options.limit > 100 ? 100 : options.limit;

        if (query instanceof SelectQueryBuilder) {

            if (options.where) {
                query.where(options.where);
            }

            if (options.orderBy) {
                query.orderBy(`${query.expressionMap.mainAlias.name}.${options.orderBy}`,
                    options.order);
            }
            return await this.cleanResultPagination(options, query);
        }

        if (query instanceof Array) {

            if (options.where) {
                const auxWhere = {};

                options.where.forEach((e) => {
                    auxWhere[Object.keys(e)[0]] = Object.values(e)[0];
                });

                query = _.filter(query, auxWhere);
            }

            if (options.orderBy) {
                query = _.orderBy(query, [options.orderBy],
                    [(options.order && options.order === 'DESC') ? 'desc' : 'asc']);
            }

            return this.getPaginatedItems(options, query);
        }

        const queryBuilder = this.repository.createQueryBuilder('T');
        queryBuilder.where(options.where);
        queryBuilder.orderBy(options.orderBy, options.order);

        return await this.cleanResultPagination(options, queryBuilder);
    }
}