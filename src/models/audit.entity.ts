import { Column, Entity, Index, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';
import { User } from './';

@Index('idx_audits_changes', ['changes'], {})
@Index('idx_date', ['creationDate'], {})
@Index('idx_audits_key', ['primaryKey'], {})
@Index('idx_audits', ['tableName'], {})
@Entity('audits', { schema: 'system' })
export class Audit {

    // Table's name that has been modified
    @PrimaryColumn('character varying', { name: 'table_action', length: 50 })
    tableAction: string;
    
    // Action executed over a table that requires an audit
    @PrimaryColumn('character varying', { name: 'table_name', length: 50 })
    tableName: string;

    // Table's Identificator that has been modified
    @Column('jsonb', { name: 'primary_key' })
    primaryKey: object;

    // Executed changes, e.g: UPDATE, DELETE
    @Column('jsonb', { name: 'changes' })
    changes: object;
    
    // Creation Date and time od the audit
    @PrimaryColumn('timestamp without time zone', {
        name: 'creation_date',
        default: () => 'CURRENT_TIMESTAMP',
    })
    creationDate: Date;

    // Creation User
    @Column('int4', { name: 'creation_user' })
    creationUser: number;

    /**
     *  User of creation of the audit
     */
    @ManyToOne(
        () => User,
        user => user.audits,
    )
    @JoinColumn([{ name: 'creation_user', referencedColumnName: 'id' }])
    user: User;
}
