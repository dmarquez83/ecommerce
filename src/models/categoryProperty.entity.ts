import {
    Column,
    Entity,
    Index,
    JoinColumn,
    ManyToOne,
    UpdateDateColumn
  } from 'typeorm';
import { Category, Property } from '.';
import { User } from '.';
@Index('category_properties_pkey', ['idCategory', 'idProperty'], {
  unique: true,
})
@Entity('category_properties', { schema: 'system' })
export class CategoryProperty {

    @Column('integer', { primary: true, name: 'id_category' })
    idCategory: number;

    @Column('integer', { primary: true, name: 'id_property' })
    idProperty: number;

    @Column('boolean', { name: 'main', default: () => 'false' })
    main: boolean;

    @Column('boolean', { name: 'disabled', default: () => 'false' })
    disabled: boolean;
  
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
      users => users.categoryPropertiesCreated
    )
    @JoinColumn([{ name: 'creation_user', referencedColumnName: 'id' }])
    creationUser: User;
  
    @ManyToOne(
      () => Category,
      categories => categories.categoryProperties
    )
    @JoinColumn([{ name: 'id_category', referencedColumnName: 'id' }])
    category: Category;

    @ManyToOne(
      () => Property, 
      property => property.categoryProperties
    )
    @JoinColumn([{ name: 'id_property', referencedColumnName: 'id' }])
    properties: Property;
  
    @ManyToOne(
      () => User,
      users => users.categoryPropertiesModifiedBy
    )
    @JoinColumn([{ name: 'modification_user', referencedColumnName: 'id' }])
    modificationUser: User;
  }
