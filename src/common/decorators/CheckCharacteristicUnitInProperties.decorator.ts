import { Injectable } from '@nestjs/common';
import { ValidationArguments, ValidatorConstraint, ValidatorConstraintInterface } from 'class-validator';
import _ = require('lodash');
import { CharacteristicsService } from '../services';

@ValidatorConstraint({ name: 'CheckCharacteristicUnitInProperties', async: true })
@Injectable()
export class CheckCharacteristicUnitInProperties implements ValidatorConstraintInterface {
    
    private customMessage: string;
    private characteristics: any[] = [];
    
    constructor(protected readonly characteristicService: CharacteristicsService) {}
    
    async validate(value: any, args: ValidationArguments) {

        const properties = value.properties || value;

        // check if any feature has a null value in the properties statics of the product
        const  anyCharacWithNullValue = this.validateNullValueAndPushCharacs(properties,
                                            !!value.properties);

        // if there is one, it stops the process
        if (anyCharacWithNullValue) {
            return false;
        }

        // save in an array of unique characteristics, then query in db and validate.
        const uniqueCharacs = _.uniqBy(this.characteristics, 'name');

        const characsDB = await this.characteristicService.findByArrayNames(uniqueCharacs.map(e => e.name));

        const anyCharacWithOutUnitRequired = uniqueCharacs.some(charac => {
            return characsDB.some(characDB => {
                return characDB.name === charac.name && !characDB.unitRequired && charac.unit;
            });
        });

        if (anyCharacWithOutUnitRequired) {
            this.customMessage = 'There is a characteristic that has unitRequired false and unit has a value, remember if unitRequired is false, unit must be null.';
        }

        return !anyCharacWithOutUnitRequired;
    }

    /**
     * Validates if any characteristic either in the static properties or in 
     * the properties of the variation header has a characteristic with null value
     * @param properties Array of properties to check
     * @param isVariant Flag indicating whether it comes from a variation or not
     */
    validateNullValueAndPushCharacs(properties: any, isVariant: boolean) {
        if (isVariant) {
            return this.checkWhenIsVariant(properties);
        }

        return this.checkProperties(properties);
    }

    /**
     * Validates the characteristics of static properties
     * @param properties Array of properties to check
     */
    checkProperties(properties: any) {
        let isComboCharacsUnique = true;

        const anyCharacWithNull = properties.some(property => {
            
            const uniqueAuxCharacs = _.uniqBy(property.characteristics, 'name');

            if (uniqueAuxCharacs.length !== property.characteristics.length) {
                isComboCharacsUnique = false;
                this.customMessage = 'In static properties, there is a repeated characteristic, remember that combos can only have different characteristics.';
                return !isComboCharacsUnique;
            }

            return property.characteristics.some(characteristic => {
                this.characteristics.push(characteristic);
                return !characteristic.value;
            });
        });

        if (anyCharacWithNull) {
            this.customMessage = 'In static properties, there is a characteristic with null value, remember value can not be null.';
        }

        return anyCharacWithNull;
    }

    /**
     * Validates the characteristics of the properties of the variations
     * @param properties Array of properties to check
     */
    checkWhenIsVariant(properties: any) {
        let isComboCharacsUnique = true;

        const anyCharacVariationWithNull = properties.some(property => {
            return property.characteristics.some(comboCharacs => {

                const uniqueAuxCharacs = _.uniqBy(comboCharacs, 'name');

                if (uniqueAuxCharacs.length !== comboCharacs.length) {
                    isComboCharacsUnique = false;
                    this.customMessage = 'In combos, there is a repeated characteristic, remember that combos can only have different characteristics.';
                    return !isComboCharacsUnique;
                }

                return comboCharacs.some(characteristic => {
                    this.characteristics.push(characteristic);
                    return !characteristic.value;
                });
            });
        });

        if (anyCharacVariationWithNull && isComboCharacsUnique) {
            this.customMessage = 'In variation properties, there is a characteristic with null value, remember value can not be null.';
        }

        return anyCharacVariationWithNull;
    }

    defaultMessage(args: ValidationArguments) {
        return this.customMessage;
    }
}
