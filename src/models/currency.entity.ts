import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from './';

@Index('currencies_code_key', ['code'], { unique: true })
@Index('currencies_pkey', ['id'], { unique: true })
@Index('currencies_name_key', ['name'], { unique: true })
@Entity('currencies', { schema: 'financial' })
export class Currency {
  @PrimaryGeneratedColumn({ type: 'integer', name: 'id' })
  id: number;

  @Column('character varying', { name: 'code', unique: true, length: 10 })
  code: string;

  @Column('character varying', { name: 'name', unique: true, length: 255 })
  name: string;

  @Column('numeric', { name: 'value', precision: 24, scale: 10 })
  value: number;

  @Column('numeric', {
    name: 'vix',
    precision: 24,
    scale: 10,
    default: () => '0.00000000000',
  })
  vix: number;

  @Column('boolean', { name: 'is_volatile', default: () => 'false' })
  isVolatile: boolean;

  @Column('character varying', { name: 'status', length: 100})
  status: string;

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

  @ManyToOne(() => User, (users) => users.currenciesCreated)
  @JoinColumn([{ name: 'creation_user', referencedColumnName: 'id' }])
  creationUser: User;

  @ManyToOne(() => User, (users) => users.currenciesModified)
  @JoinColumn([{ name: 'modification_user', referencedColumnName: 'id' }])
  modificationUser: User;

}
