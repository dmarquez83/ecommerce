import { Column, Entity, Index, JoinColumn, ManyToOne, UpdateDateColumn } from 'typeorm';
import { Lists, MeasurementUnit, User } from '.';

@Index('list_options_pkey', ['idList', 'value'], { unique: true })
@Entity('list_options', { schema: 'system' })
export class ListOptions {
    @Column('integer', { primary: true, name: 'id_list' })
    idList: number;

    @Column('character varying', { primary: true, name: 'value', length: 255 })
    value: string;

    @Column('integer', { name: 'id_measurement_unit' })
    idMeasurementUnit: number;

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

    @ManyToOne(() => User, (users) => users.listOptionsCreated)
    @JoinColumn([{ name: 'creation_user', referencedColumnName: 'id' }])
    creationUser: User;

    @ManyToOne(() => Lists, (lists) => lists.listOptions)
    @JoinColumn([{ name: 'id_list', referencedColumnName: 'id' }])
    list: Lists;

    @ManyToOne(
      () => MeasurementUnit,
      (measurementUnits) => measurementUnits.listOptions
    )
    @JoinColumn([{ name: 'id_measurement_unit', referencedColumnName: 'id' }])
    measurementUnit: MeasurementUnit;

    @ManyToOne(() => User, (users) => users.listOptionsModified)
    @JoinColumn([{ name: 'modification_user', referencedColumnName: 'id' }])
    modificationUser: User;
}
