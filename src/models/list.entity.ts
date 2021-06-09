import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Characteristics, ListOptions, User } from '.';

@Index('lists_pkey', ['id'], { unique: true })
@Index('lists_name_key', ['name'], { unique: true })
@Entity('lists', { schema: 'system' })
export class Lists {
    @PrimaryGeneratedColumn({ type: 'integer', name: 'id' })
    id: number;

    @Column('character varying', { name: 'name', unique: true, length: 255 })
    name: string;

    @Column('boolean', { name: 'measure', default: () => 'false' })
    measure: boolean;

    @Column('boolean', { name: 'editable', default: () => 'true' })
    editable: boolean;

    @Column('character varying', { name: 'status', length: 100, select: false })
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

    @OneToMany(() => Characteristics, (characteristics) => characteristics.list)
    characteristics: Characteristics[];

    @OneToMany(() => ListOptions, (listOptions) => listOptions.list)
    listOptions: ListOptions[];

    @ManyToOne(() => User, (users) => users.listsCreated)
    @JoinColumn([{ name: 'creation_user', referencedColumnName: 'id' }])
    creationUser: User;

    @ManyToOne(() => User, (users) => users.listsModified)
    @JoinColumn([{ name: 'modification_user', referencedColumnName: 'id' }])
    modificationUser: User;
}
