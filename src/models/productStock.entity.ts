import {
    Column,
    Entity,
    Index,
    JoinColumn,
    ManyToOne,
    PrimaryGeneratedColumn,
    UpdateDateColumn
} from 'typeorm';
import { Location, Product, ProductVariation, User } from '.';

@Index('product_stocks_pkey', ['id'], { unique: true })
@Index('product_stocks_idx', ['idLocation', 'idProduct'], { unique: true })
@Index('variation_stocks_idx', ['idLocation', 'idProductVariation'], {
    unique: true
})
@Index(
    'product_stocks_id_product_id_product_variation_id_location_key',
    ['idLocation', 'idProduct', 'idProductVariation'],
    { unique: true }
)
@Entity('product_stocks', { schema: 'public' })
export class ProductStock {
    @PrimaryGeneratedColumn({ type: 'bigint', name: 'id' })
    id: number;

    @Column('bigint', {
        name: 'id_product_variation',
        nullable: true,
        unique: true
    })
    idProductVariation: number | null;

    @Column('bigint', { name: 'id_location', unique: true })
    idLocation: number;

    @Column('integer', { name: 'stock' })
    stock: number;

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
        users => users.productStockModifiedBy
    )
    @JoinColumn([{ name: 'modification_user', referencedColumnName: 'id' }])
    modificationUser: User;

    @Column('character varying', { name: 'status', length: 100 })
    status: string;

    @Column('bigint', { name: 'id_product', nullable: true, unique: true })
    idProduct: number | null;

    @Column('numeric', { name: 'price', precision: 24, scale: 10 })
    price: number;

    @ManyToOne(
        () => User,
        users => users.productStock
    )
    @JoinColumn([{ name: 'creation_user', referencedColumnName: 'id' }])
    creationUser: User;

    @ManyToOne(
        () => Product,
        products => products.productStocks
    )
    @JoinColumn([{ name: 'id_product', referencedColumnName: 'id' }])
    product: Product;

    @ManyToOne(
        () => ProductVariation,
        productVariations => productVariations.productStocks
    )
    @JoinColumn([{ name: 'id_product_variation', referencedColumnName: 'id' }])
    productVariation: ProductVariation;

    @ManyToOne(
        () => Location,
        location => location.productStock
    )
    @JoinColumn([{ name: 'id_location', referencedColumnName: 'id' }])
    location: Location;
}
