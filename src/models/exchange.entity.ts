import {
    Column,
    Entity,
    Index,
    JoinColumn,
    ManyToOne,
    PrimaryGeneratedColumn,
    UpdateDateColumn
  } from 'typeorm';
import { Category } from './';
import { User } from './';
  
@Index('exchanges_pkey', ['id'], { unique: true })
@Index('exchanges_id_user_name_key', ['idUser', 'name'], { unique: true })
@Entity('exchanges', { schema: 'public' })
export class Exchange {
    @PrimaryGeneratedColumn({ type: 'integer', name: 'id' })
    id: number;
  
    @Column('bigint', { name: 'id_user', unique: true })
    idUser: number;

    @Column('bigint', { name: 'id_category' })
    idCategory: number;
  
    @Column('character varying', { name: 'name', unique: true, length: 255 })
    name: string;
  
    @Column('character varying', { name: 'status', length: 100, select: false})
    status: string;
  
    @Column('text', { name: 'description' })
    description: string;
  
    @Column('jsonb', { name: 'properties', nullable: true })
    properties: object | null;
  
    @Column('jsonb', { name: 'images', nullable: true })
    images: object | null;
  
    @Column('boolean', { name: 'is_new' })
    isNew: boolean;
  
    @Column('timestamp without time zone', {
      name: 'creation_date',
      default: () => 'CURRENT_TIMESTAMP'
    })
    creationDate: Date;
  
    @UpdateDateColumn({
      type: 'timestamp without time zone',
      name: 'modification_date',
      nullable: true
    })
    modificationDate: Date | null;
  
    @ManyToOne(
      () => User,
      users => users.exchangesCreated
    )
    @JoinColumn([{ name: 'creation_user', referencedColumnName: 'id' }])
    creationUser: User;
  
    @ManyToOne(
      () => Category,
      categories => categories.exchange
    )
    @JoinColumn([{ name: 'id_category', referencedColumnName: 'id' }])
    category: Category;
  
    @ManyToOne(
      () => User,
      users => users.userExchange
    )
    @JoinColumn([{ name: 'id_user', referencedColumnName: 'id' }])
    exchangeUser: User;
  
    @ManyToOne(
      () => User,
      users => users.exchangesModifiedBy
    )
    @JoinColumn([{ name: 'modification_user', referencedColumnName: 'id' }])
    modificationUser: User;
  }
