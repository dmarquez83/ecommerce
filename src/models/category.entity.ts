import {
    Column,
    Entity,
    Index,
    JoinColumn,
    ManyToOne,
    OneToMany,
    PrimaryGeneratedColumn
} from 'typeorm';
import { CategoryProperty, Exchange, Offer, Product, User } from './';

@Index('category_pkey', ['id'], { unique: true })
@Index('category_name_key', ['name'], { unique: true })
@Entity('categories', { schema: 'system' })
export class Category {
    @PrimaryGeneratedColumn({ type: 'integer', name: 'id' })
    id: number;

    @Column('character varying', { name: 'name', unique: true, length: 255 })
    name: string;

    @Column('character varying', { name: 'status', length: 100, select: false })
    status: string;

    @Column('int8', { name: 'id_parent' })
    idParent: number;

    @Column('character varying', {
        name: 'type',
        length: 50,
        default: () => 'Products'
    })
    type: string;

    @Column('text', { name: 'description', nullable: true })
    description: string | null;

    @Column('timestamp without time zone', {
        name: 'creation_date',
        default: () => 'CURRENT_TIMESTAMP',
        select: false
    })
    creationDate: Date;

    @Column('timestamp without time zone', {
        name: 'modification_date',
        nullable: true,
        select: false
    })
    modificationDate: Date | null;

    @ManyToOne(
        () => User,
        user => user.createdCategories
    )
    @JoinColumn([{ name: 'creation_user', referencedColumnName: 'id' }])
    creationUser: User;

    @ManyToOne(
        () => Category,
        category => category.children
    )
    @JoinColumn([{ name: 'id_parent', referencedColumnName: 'id' }])
    parent: Category;

    @OneToMany(
        () => Category,
        category => category.parent
    )
    children: Category[];

    @OneToMany(
        () => Product,
        product => product.category
    )
    product: Product[];

    @OneToMany(
        () => Offer,
        offers => offers.category
    )
    offer: Offer[];

    @OneToMany(
        () => Exchange,
        exchanges => exchanges.category
    )
    exchange: Exchange[];

    @OneToMany(
        () => CategoryProperty,
        CategoryProperty => CategoryProperty.category
    )
    categoryProperties: CategoryProperty[];

    @ManyToOne(
        () => User,
        user => user.modificationUser
    )
    @JoinColumn([{ name: 'modification_user', referencedColumnName: 'id' }])
    modificationUser: User;

}
