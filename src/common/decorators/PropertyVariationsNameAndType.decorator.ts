import { registerDecorator, ValidationArguments, ValidationOptions, ValidatorConstraint, ValidatorConstraintInterface } from 'class-validator';
import _ = require('lodash');

@ValidatorConstraint({ name: 'ProductVariationNameAndType', async: false })
export class PropertyVariationConstraint implements ValidatorConstraintInterface {

    validate(value: any, args: ValidationArguments) {
        const properties = value.properties;
        const propertiesVariations = value.propertiesVariations;

        const nameAndTypeMatch = !propertiesVariations.some(propVar => {
            return propVar.variation.some(variation => {
                
                // Validate the property name and type is correctly formed
                return !properties.some(e => {
                    return (e.name === variation.property) && (e.type === variation.type);
                });
            });
        });

        return nameAndTypeMatch;
    }

    defaultMessage(args: ValidationArguments) {
      return 'In the variations, there is a property that does not match those provided in the properties, that is, it has a different name or type. Please check accents and upper or lower case.';
    }

}

export function ProductVariationNameAndType(validationOptions?: ValidationOptions) {
    return (object: object, propertyName: string) => {
        registerDecorator({
            name: 'ProductVariationNameAndType',
            target: object.constructor,
            propertyName,
            options: validationOptions,
            validator: PropertyVariationConstraint
        });
    };
}
