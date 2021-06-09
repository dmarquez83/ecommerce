import { Column, Entity, Index, JoinColumn, ManyToOne } from 'typeorm';
import { Product, ProductVariation, User, File } from '.';

@Index('product_files_pkey', ['imgCode'], { unique: true })
@Entity('product_files', { schema: 'public' })
export class ProductFile {

    @Column('character varying', { primary: true, name: 'img_code', length: 50 })
    imgCode: string;
    
    @Column('smallint', { name: 'position', nullable: true })
    position: number | null;

    @Column('timestamp without time zone', {
        name: 'creation_date',
        default: () => 'CURRENT_TIMESTAMP',
        select: false
    })
    creationDate: Date;

    @ManyToOne(
        () => User,
        User => User.productFiles
    )
    @JoinColumn([{ name: 'creation_user', referencedColumnName: 'id' }])
    creationUser: User;

    @Column('int8', { name: 'id_product' })
    idProduct: number;

    @Column('int8', { name: 'id_product_variation' })
    idProductVariation: number;

    /**
     *  Product of this file
     */
    @ManyToOne(
        () => Product,
        product => product.productFiles
    )
    @JoinColumn([{ name: 'id_product', referencedColumnName: 'id' }])
    product: Product;

    /**
     *  Files associates
     */
    @ManyToOne(
        () => File,
        file => file.productFiles
    )
    @JoinColumn([{ name: 'img_code', referencedColumnName: 'name' }])
    files: File;

    /**
     *  Product variation of this file
     */
    @ManyToOne(
        () => ProductVariation,
        productVariation => productVariation.productFiles
    )
    @JoinColumn([{ name: 'id_product_variation', referencedColumnName: 'id' }])
    productVariation: ProductVariation;
}
