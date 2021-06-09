import { ForbiddenException, Injectable, 
    InternalServerErrorException, NotAcceptableException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import _ = require('lodash');
import * as treeify from 'treeify-js';
import { IsNull, Raw, Repository } from 'typeorm';
import { Status } from '../../common/enum/status.enum';
import { IPaginationOptions } from '../../common/interfaces/paginateOptions.interface';
import { IResponseStructureReturn } from '../../common/interfaces/responsesReturn.interface';
import { categoryResponses } from '../../common/responses/categories.response';
import { BasicService } from '../../common/services/base.service';
import { Category, Product } from '../../models';
import { CategoryWordsService } from '../categoryWords/categoryWords.service';
import { TranslationsService } from '../translations/translations.service';
import { IUserReq } from '../users/interfaces/userReq.interface';
import { WordsService } from '../words/words.service';
import { CreateCategoryDto } from './dto/createCategory.dto';
import { UpdateCategoryDto } from './dto/updateCategory.dto';

@Injectable()
export class CategoriesService extends BasicService<Category> {
    
    constructor(
            @InjectRepository(Category)
            private readonly categoriesRepository: Repository<Category>,
            private readonly categoryWordsService: CategoryWordsService,
            private readonly wordsService: WordsService,
            private readonly translationService: TranslationsService) {
            super(categoriesRepository);
        }

    /**
     *  Activate Category and return it
     * 
     * @param id id of the category
     * @param user User who executes the action
     */
    async activate(id: number, user: IUserReq, response: any) {

        let category = await this.categoriesRepository.findOneOrFail(id, 
            { relations: ['parent', 'children']})
            .catch( () => {
                throw new ForbiddenException(response.noPermission);
            });
        
        category = await this.activateEntityByStatus(category, user);

        this.cleanCategory(category);

        return this.formatReturn(response.success, 'category', category);
    }

    /**
     *  Method to analyze all categories words
     */
    async analyzeCategoriesWords() {
        const categories = await this.categoriesRepository.find();

        for await (const category of categories) {
            await this.categoryWordsService.saveCategoryWords(category, 1);
        }
    }

    /**
     *  Check if the Category exist and returning it
     * 
     * @param data Data to check if exist, name and parentId
     * @param user Logged user
     * @returns Category with these options or undefined
     */
    async checkIfExist(data: CreateCategoryDto): Promise<Category | undefined> {
        
        return await this.findOneWithOptions({
            where: {
                name: Raw(alias => `${alias} ILIKE '${data.name}'`),
                idParent: data.idParent ||  IsNull(),
            }
        });

    }

    /**
     *  Create category 
     * 
     * @param data Data to create the new category
     * @param user 
     */
    async create(data: CreateCategoryDto, user: IUserReq, response: any):
                 Promise<IResponseStructureReturn> {
        const categoryDB = await this.checkIfExist(data);

        if (categoryDB) {
            throw new InternalServerErrorException(response.nameAndParentIdError);
        }
        
        if (data.idParent && !(await this.findParentId(data.idParent))) {
            throw new InternalServerErrorException(response.notFoundParent);
        }

        const category = await this.save(data, user)
            .catch( () => {
                throw new ForbiddenException(response.error);
            });

        this.cleanCategory(category);
        this.categoryWordsService.saveCategoryWords(category, user.userId);
        
        return this.formatReturn(response.success, 'category', category);
    }

    /**
     *  Disable Category and return it
     * 
     * @param id id of the category
     * @param user User who executes the action
     */
    async disable(id: number, user: IUserReq, response: any) {
        
        let category = await this.categoriesRepository.findOneOrFail(id, 
            { relations: ['parent', 'children']})
            .catch( () => {
                throw new ForbiddenException(response.noPermission);
            });

        category = await this.disableEntityByStatus(category, user);

        this.cleanCategory(category);

        return this.formatReturn(response.success, 'category', category);
    }

    /**
     * Find all active categories
     */
    async findAll(options: IPaginationOptions) {
        options.where = [{status: Status.ENABLED}]; 
        return await this.paginate(options);
    }

    /**
     * Find a category, with its parent and children by the id
     *  
     * @param idCategory Category id to be listed
     */
    async findById(idCategory: number, lang?: string) {
        const response = categoryResponses.list;

        let category = await this.categoriesRepository.findOneOrFail(idCategory, 
                {
                    where: [{status: Status.ENABLED}], 
                    relations: ['parent', 'children']
                }
            ).catch( () => {
                throw new ForbiddenException(response.noPermission);
            });

        if (lang && lang !== 'en') {
            // sentences to be translated
            const sentences = this.getCategoryNames(category);
            const translated = await this.translationService.getTranslations(sentences, lang);

            category = this.translateCategory(category, translated);
        }

        return this.formatReturn(response.success, 'category', category);
    }

    /**
     * Find all by type
     * 
     * @param type type to search
     */
    async findByType(type: string, lang: string ) {
        const response = categoryResponses.list;

        if (!type) { throw new NotAcceptableException(response.missingType); }

        let categories = await this.categoriesRepository.find(
            {where: [{status: Status.ENABLED, type}], relations: ['parent', 'children']});

        if (lang && lang !== 'en') {
            categories = await this.translateCategoriesAndOrder(categories, lang);
        }

        return this.formatReturn(response.success, 'categories', categories);
    }

    /**
     * Find a category path to the root
     * 
     * @param idCategory category id to find its tree
     */
    async findCategoryPath(idCategory: number, lang= 'en' ) {

        const query = `
            select id, name, type, description, id_parent as "idParent"
            from get_category_path(${idCategory}, '${lang}');
        `;
        const rawData = await this.manager.query(query);
        const tree = treeify.treeify(rawData, {
            parentId: 'idParent',
        });
        
        return tree;
    }

    /**
     *  Find parent category by id
     * 
     * @param idParent Id of the parent to find
     * @returns Category parent
     */
    async findParentId(idParent: number): Promise<Category> {
        const response = categoryResponses.list;
        
        return this.findOneWithOptionsOrFail(
            { where: [ {idParent} ] })
            .catch( () => {
                throw new ForbiddenException(response.noPermission);
            });
    }

    /**
     * Find all root categories by type
     * 
     * @param type type to search
     * @param lang language to translate
     */
    async findRootsByType(type: string, lang: string) {
        const response = categoryResponses.list;

        if (!type) { throw new NotAcceptableException(response.missingType); }

        let categories = await this.createQueryBuilder('C')
                .leftJoinAndSelect('C.children', 'children')
                .where('C.idParent is null')
                .andWhere('C.status = :status', {status: Status.ENABLED})
                .andWhere('C.type = :type', {type})
                .orderBy('C.name', 'ASC')
                .addOrderBy('children.name', 'ASC')
                .getMany();

        if (lang && lang !== 'en') {
            categories = await this.translateCategoriesAndOrder(categories, lang);
        }

        return this.formatReturn(response.success, 'categories', categories);
    }

    /**
     * Get all names of one category
     * 
     * @param Category category array 
     */
    getCategoryNames(category: Category): string[] {
        const categoryNames = [];

        categoryNames.push(category.name);

        if (category.children) {
            category.children.forEach((child) => {
                categoryNames.push(child.name);
            });
        }

        if (category.parent) {
            categoryNames.push(category.parent.name);
        }

        return categoryNames;
    }

    /**
     * Get categories name that will be translated
     * 
     * @param categories category array 
     */
    getNamesToTranslate(categories: Category[]): string[] {
        const namesToTranslate = [];

        categories.forEach((category) => {
            namesToTranslate.concat(this.getCategoryNames(category));
        });

        return _.uniq(namesToTranslate);
    }

    /**
     * Search categories by text
     * 
     * @param search text to search 
     * @param type category type 
     * @param lang language 
     */
    async searchByType(search: string, type: string, lang: string) {
        const response = categoryResponses.list;
        const words = await this.wordsService.getWords(search);
        const categories = [];

        lang = (lang && lang !== '') ? lang : 'en';

        const query = `
            SELECT *
            FROM search_categories(array['${words.join('\',\'')}'], '${type}', '${lang}'); 
        `;
        const data = await this.manager.query(query);

        for await (const category of data) {
            categories.push(await this.findCategoryPath(category.id, lang));
        }

        this.wordsService.saveWords(words, 1);
        return {...response.success, categories};
    }

    /**
     * Translate Categories
     * 
     * @param categories categories to be translated
     * @param lang language to get translation
     */
    async translateCategories(categories: any, lang: string): Promise<Category[]> {

        // sentences to be translated
        const sentences = this.getNamesToTranslate(categories);
        const translated = await this.translationService.getTranslations(sentences, lang);

        const translatedCategories = categories.map(element => {
            return this.translateCategory(element, translated);
        });

        return translatedCategories;
    }

    /**
     * Translate Categories and order array
     * 
     * @param categories categories to be translated
     * @param lang language to get translation
     */
    async translateCategoriesAndOrder(categories: any, lang: string): Promise<Category[]> {
        return _.orderBy(await this.translateCategories(categories, lang), ['name'], ['asc']);
    }

    /**
     * Translate specific category
     * 
     * @param category specific category to be translated
     * @param translations translation array, to search
     */
    translateCategory(category: Category, translations: any[]) {

        const texTranslated = translations.find((text) => {
            return text.enText.toLowerCase() === category.name.toLowerCase();
        });

        if (category['children']) {
            const children = category.children.map(child => {
                return this.translateCategory(child, translations);
            });

            category['children'] = _.orderBy(children, ['name'], ['asc']) ;
        }

        if (category['parent']) {
            category['parent'] = this.translateCategory(category.parent, translations);
        }

        if (texTranslated) {
            category['name'] = texTranslated.langText;
        }

        return category;
    }

    /**
     * Translate Category of every product
     * 
     * @param products products that need category translation
     * @param lang language to get translation
     */
    async translateProductCategories(products: Product[], lang: string): Promise<Product[]> {

        if (!lang || lang === 'en') {return products; }

        const categories = products.map((element) => element.category);
        const translated = await this.translateCategories(categories, lang);

        products.forEach((product) => {
            if (product['category']) {
                product['category'] = translated.find((element) => element.id === product.category.id);
            }
        });

        return products;
    }

    /**
     * Translate Category of a product
     * 
     * @param product product that need category translation
     * @param lang language to get translation
     */
    async translateProductCategory(product: Product, lang: string): Promise<Product> {

        if (!lang || lang === 'en') {
            return product;
        }

        const categories = [];
        if (product['category']) {
            categories.push(product['category']);
        }

        if (product['categoryPath']) {
            categories.push(product['categoryPath']);
        }

        const translated = await this.translateCategories(categories, lang);
        if (product['category']) {
            product['category'] = translated.find((element) => element.id === product.category.id);
        }

        if (product['categoryPath']) {
            product['categoryPath'] = translated.find((element) => element.id === product['categoryPath'].id);
        }

        return product;
    }

    /**
     *  Update category and return it
     * 
     * @param id Id of the category
     * @param data Data to update the category
     * @param user User who executes the action
     * @param response response return 
     */
    async update(id: number, data: UpdateCategoryDto,
                 user: IUserReq, response: any): Promise<IResponseStructureReturn> {
        const category = (await this.findById(id)).category;
        
        const categoryDB = await this.checkIfExist(data);
                    
        if (categoryDB && (+category.id !== +categoryDB.id)) {
            throw new NotAcceptableException(response.nameAndParentIdError);
        }

        if (data.idParent && !(await this.findParentId(data.idParent))) {
            throw new InternalServerErrorException(response.notFoundParent);
        }

        const categoryUpdated = await this.updateEntity(data, category, user).catch(() => {
            throw new InternalServerErrorException(response.nameAndParentIdError);
        });

        this.cleanCategory(categoryUpdated);
        this.categoryWordsService.saveCategoryWords(categoryUpdated, user.userId);

        return this.formatReturn(response.success, 'category', categoryUpdated);
    }

    /**
     *  Clean the entity to return it
     * @param category category to clean
     */
    private cleanCategory(category: Category) {
        delete category.status;

        if (category.idParent) {
            category.idParent = Number(category.idParent);
        }
    }
}
