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
import { Product, ProductFile, ProductStock, User } from './';

@Index('product_variations_pkey', ['id'], { unique: true })
@Index(
    'product_variations_id_product_variations_key',
    ['idProduct', 'variations'],
    { unique: true }
)
@Index('idx_product_variations', ['variations'], {})
@Entity('product_variations', { schema: 'public' })

export class ProductVariation {
    @PrimaryGeneratedColumn({ type: 'bigint', name: 'id' })
    id: number;

    @Column('bigint', { name: 'id_product' })
    idProduct: string;

    @Column('jsonb', { name: 'variations' })
    variations: object;

    @Column('character varying', { name: 'sku', nullable: true, length: 50 })
    sku: string | null;

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

    @Column('character varying', { name: 'status', length: 100 })
    status: string;

    @ManyToOne(
        () => User,
        users => users.productVariations
    )
    @JoinColumn([{ name: 'creation_user', referencedColumnName: 'id' }])
    creationUser: User;

    @OneToMany(
        () => ProductStock,
        productStock => productStock.productVariation
    )
    productStocks: ProductStock[];

    @ManyToOne(
        () => Product,
        products => products.productVariations
    )
    @JoinColumn([{ name: 'id_product', referencedColumnName: 'id' }])
    product: Product;

    /**
     *  Files of this variation
     */
    @OneToMany(
        () => ProductFile,
        productFile => productFile.productVariation
    )
    productFiles: ProductFile[];
}
