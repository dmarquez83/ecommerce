import bcrypt = require('bcrypt');
import {
    EntitySubscriberInterface,
    EventSubscriber,
    RemoveEvent,
    UpdateEvent,
} from 'typeorm';
import { getCustomRepository } from 'typeorm';
import { Audit } from '../../models';
import { AuditsService } from '../../modules/audits/audits.service';
import { Status } from '../enum/status.enum';

@EventSubscriber()
export class AuditSubscriber implements EntitySubscriberInterface {
    private readonly salt = process.env.PASSWORD_SALT;

    constructor() { }

    /**
     * Called after entity insertion.
     */
    afterUpdate(event: UpdateEvent<any>) {
        if (this.checkAudit(event)) {
            this.saveAudit(event);
        }
    }

    /**
     * Called after entity insertion.
     */
    afterRemove(event: RemoveEvent<any>) {
        this.saveAudit(event);
    }

    /**
     *  Validate if the audit can be performed
     * @param event Is an object that broadcaster sends to the entity 
     *      subscriber when entity is being updated in the database.
     * @returns "true" can be run, false otherwise.
     */
    checkAudit(event: UpdateEvent<any>): boolean {
        return event.metadata.name !== 'Audit' && event.updatedColumns.length > 0
            && event.queryRunner.data.userId;
    }

    /**
     * Save the audit when any entity is updated
     * @param event Is an object that broadcaster sends to the entity 
     *      subscriber when entity is being updated in the database.
     */
    saveAudit(event: UpdateEvent<any> | RemoveEvent<any>): void {
        const auditRepository = getCustomRepository(AuditsService);

        const data = {
            tableAction: event.entity.status ?
                event.entity.status === Status.DELETED ? 'DELETE' :
                    event.entity.status === Status.ENABLED ? 'UPDATE' : 'INACTIVE' : 'DELETE',
            tableName: event.metadata.tableName,
            tableId: this.generateJsonPrimaryKey(event),
            changes: this.generateJsonToSave(event),
        };

        const audit = new Audit();
        audit.tableAction = data.tableAction;
        audit.tableName = data.tableName;
        audit.primaryKey = data.tableId;
        audit.changes = data.changes;
        audit.creationUser = +event.queryRunner.data.userId;
        auditRepository.create(audit);
    }

    /**
     *  Generate the JSON's PK of the entity
     * @param event Is an object that broadcaster sends to the entity 
     *      subscriber when entity is being updated in the database.
     */
    generateJsonPrimaryKey(event: UpdateEvent<any> | RemoveEvent<any>): object {
        const auxPK = {};
        for (const pk of event.metadata.primaryColumns) {
            auxPK[pk.databaseName] = event.databaseEntity[pk.propertyName];
        }
        return auxPK;
    }

    /**
     * Generate the json to save in the audit entity.
     * @param event Is an object that broadcaster sends to the entity 
     *  subscriber when entity is being updated in the database.
     * @returns JSON with all data needed like 
     *  [{"before": "name_example", "field": "username", "after": "example_usrname"}].
     */
    generateJsonToSave(event: UpdateEvent<any> | RemoveEvent<any>): JSON[] {
        const auxJson = [];

        if (this.isUpdateEvent(event)) {

            event.updatedColumns.forEach((
                element: { databaseName: string; propertyPath: string; }) => {
                const changes = {
                    field: element.databaseName,
                    before: event.databaseEntity[`${element.propertyPath}`],
                    after: this.generateAfterField(event, element),
                };
                auxJson.push(changes);
                // tslint:disable-next-line: no-console
                console.log('***********************************************');
                // tslint:disable-next-line: no-console
                console.log(`MODIFIED REGISTER IN: ${event.metadata.name}
                        BY USER: ${event.queryRunner.data.userId}`);
                // tslint:disable-next-line: no-console
                console.log(`MODIFIED COLUMN: ${element.databaseName}`);
            });

            return auxJson;
        }

        const changes = {
            field: 'Deleted entity',
            before: event.databaseEntity,
            after: this.generateAfterField(event),
        };

        // tslint:disable-next-line: no-console
        console.log('***********************************************');
        // tslint:disable-next-line: no-console
        console.log(`MODIFIED REGISTER IN: ${event.metadata.name}
                 BY USER: ${event.queryRunner.data.userId}`);
        // tslint:disable-next-line: no-console
        console.log(`DELETED REGISTER: ${event.metadata.tableName}`);

        auxJson.push(changes);

        return auxJson;
    }

    /**
     * Generate After field or after values
     * @param event Is an object that broadcaster sends to the entity 
     *  subscriber when entity is being updated or deleted in the database.
     * @param element element updated columns
     */
    generateAfterField(event: UpdateEvent<any> | RemoveEvent<any>,
        element?: { databaseName: string; propertyPath: string; }): string {
        if (element?.databaseName === 'password') {
            return bcrypt.hashSync(event.entity[`${element.propertyPath}`], +this.salt);
        }
        return element ? event.entity[`${element.propertyPath}`] : event.entity;
    }

    /**
     * TypeGuard to handle event
     * @param event Is an object that broadcaster sends to the entity 
     *  subscriber when entity is being updated or deleted in the database.
     */
    isUpdateEvent(event: UpdateEvent<any> | RemoveEvent<any>): event is UpdateEvent<any> {
        return (event as UpdateEvent<any>).updatedColumns !== undefined;
    }

}
