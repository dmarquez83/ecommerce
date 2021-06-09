import { registerDecorator, ValidationArguments, ValidationOptions, ValidatorConstraint, ValidatorConstraintInterface } from 'class-validator';
import _ = require('lodash');

@ValidatorConstraint({ name: 'PropertyComboDontMatch', async: false })
export class PropertyComboDontMatchConstraint implements ValidatorConstraintInterface {

    validate(value: any, args: ValidationArguments) {
        const properties = value.properties;
        const propertiesVariations = value.propertiesVariations;

        const comboCharacteristics = [];

        // get all characteristics in the property field to comparate later with the combos created.
        properties.forEach(property => {
            property.characteristics.forEach(combosChars => {
                comboCharacteristics.push(combosChars);
            });
        });
    
        // In case no match is found it returns false, otherwise true
        return !propertiesVariations.some(propVar => {
            return propVar.variation.some(variation => {
                
                // search for the combo in the combos array
               return !_.find(comboCharacteristics, (e) => {

                    // validate if characteristics combo is in the combos array
                    return _.isEqual(e, variation.characteristics);
                });
            });
        });
    }

    defaultMessage(args: ValidationArguments) {
        return 'In variations, there are one or more characteristic combos that do not match those specified in the properties attribute. These combos must match (no matter the order of the characteristics).';
    }

}

export function PropertyComboDontMatch(validationOptions?: ValidationOptions) {
    return (object: object, propertyName: string) => {
        registerDecorator({
            name: 'PropertyComboDontMatch',
            target: object.constructor,
            propertyName,
            options: validationOptions,
            validator: PropertyComboDontMatchConstraint
        });
    };
}
