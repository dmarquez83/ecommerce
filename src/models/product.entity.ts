import {
    Column,
    Entity,
    Index,
    JoinColumn,
    ManyToOne,
    OneToMany,
    PrimaryGeneratedColumn,
    UpdateDateColumn
} from 'typeorm';
import { Business, Category,
    ProductFile, ProductStock, ProductVariation, User } from './';

@Index('products_pkey', ['id'], { unique: true })
@Index('products_id_business_name_key', ['idBusiness', 'name'], {
    unique: true
})
@Index('idx_product_property', ['properties'], {})
@Index('idx_product_images', ['properties'], {})
@Entity('products', { schema: 'public' })
export class Product {

    @PrimaryGeneratedColumn({ type: 'bigint', name: 'id' })
    id: number;

    @Column('bigint', { name: 'id_business', unique: true })
    idBusiness: number;

    @Column('bigint', { name: 'id_category', unique: true })
    idCategory: number;

    @Column('character varying', { name: 'name', unique: true, length: 255 })
    name: string;

    @Column('character varying', { name: 'status', length: 100 })
    status: string;

    @Column('text', { name: 'description' })
    description: string;

    @Column('character varying', { name: 'sku', nullable: true, length: 50 })
    sku: string | null;

    @Column('jsonb', { name: 'properties', nullable: true })
    properties: object | null;

    @Column('jsonb', { name: 'tags', nullable: true })
    tags: object | null;

    @Column('numeric', { name: 'length_value', precision: 24, scale: 10 })
    lengthValue: number;

    @Column('integer', { name: 'length_unit' })
    lengthUnit: number;

    @Column('numeric', { name: 'width_value', precision: 24, scale: 10 })
    widthValue: number;

    @Column('integer', { name: 'width_unit' })
    widthUnit: number;

    @Column('numeric', { name: 'weight_value', precision: 24, scale: 10 })
    weightValue: string;

    @Column('integer', { name: 'weight_unit' })
    weightUnit: number;

    @Column({ nullable: true, insert: false, update: false, select: false })
    stock: number;

    @Column({ nullable: true, insert: false, update: false, select: false })
    quantityVariations: number;

    @Column('boolean', { name: 'is_new' })
    isNew: boolean;

    @Column('boolean', { name: 'is_variant', default: () => 'false' })
    isVariant: boolean;

    @Column('character varying', {
        name: 'brand',
        length: 255,
        default: () => '\'\''
    })
    brand: string;

    @Column('timestamp without time zone', {
        name: 'creation_date',
        default: () => 'CURRENT_TIMESTAMP',
        select: false
    })
    creationDate: Date;

    @UpdateDateColumn({
        type: 'timestamp without time zone',
        name: 'modification_date',
        nullable: true,
        select: false
    })
    modificationDate: Date | null;

    @ManyToOne(
        () => User,
        users => users.createdProducts
    )
    @JoinColumn([{ name: 'creation_user', referencedColumnName: 'id' }])
    creationUser: User;

    @ManyToOne(
        () => Category,
        categories => categories.product
    )
    @JoinColumn([{ name: 'id_category', referencedColumnName: 'id' }])
    category: Category;

    @ManyToOne(
        () => Business,
        business => business.products
    )
    @JoinColumn([{ name: 'id_business', referencedColumnName: 'id' }])
    business: Business;

    @ManyToOne(
        () => User,
        users => users.modifiedProducts
    )
    @JoinColumn([{ name: 'modification_user', referencedColumnName: 'id' }])
    modificationUser: User;

    /**
     *  Stock of this product
     */
    @OneToMany(
        () => ProductStock,
        productStock => productStock.product
    )
    productStocks: ProductStock[];

    @OneToMany(
        () => ProductVariation,
        productVariations => productVariations.product
    )
    productVariations: ProductVariation[];

    /**
     *  Files of the current product
     */
    @OneToMany(
        () => ProductFile,
        productFile => productFile.product
    )
    productFiles: ProductFile[];

}
