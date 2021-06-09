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
import { RolePermissions, User } from './';
  
@Index('permissions_code_key', ['code'], { unique: true })
@Index('permissions_pkey', ['id'], { unique: true })
@Index('permissions_name_key', ['name', 'type'], { unique: true })
@Entity('permissions', { schema: 'system' })
export class Permissions {
    @PrimaryGeneratedColumn({ type: 'integer', name: 'id' })
    id: number;
  
    @Column('character varying', { name: 'code', unique: true, length: 10 })
    code: string;
  
    @Column('character varying', { name: 'name', unique: true, length: 255 })
    name: string;
  
    @Column('character varying', { name: 'status', length: 100 })
    status: string;
  
    @Column('character varying', { name: 'type', unique: true, length: 50 })
    type: string;
  
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
      users => users.permissionsCreated
    )
    @JoinColumn([{ name: 'creation_user', referencedColumnName: 'id' }])
    creationUser: User;
  
    @ManyToOne(
      () => User,
      users => users.permissionsModified
    )
    @JoinColumn([{ name: 'modification_user', referencedColumnName: 'id' }])
    modificationUser: User;
  
    @OneToMany(
      () => RolePermissions,
      rolePermissions => rolePermissions.permission
    )
    rolePermissions: RolePermissions[];
  }
