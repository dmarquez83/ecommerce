import { registerDecorator, ValidationArguments, ValidationOptions, ValidatorConstraint, ValidatorConstraintInterface } from 'class-validator';
import _ = require('lodash');

@ValidatorConstraint({ name: 'MatchProperties', async: false })
export class MatchPropertiesConstraint implements ValidatorConstraintInterface {

    validate(value: any, args: ValidationArguments) {
        // Properties of variation or static of the producterties 
        const properties = value.properties || value;

        return this.checkPropertyRepeated(properties);
    }

    /**
     * Check if there is at least one property repeated by name
     * @param value properties to validate
     */
    checkPropertyRepeated(value: any) {
        return !value.some((element, index) => {
            return value.some( (e: any, i: number) => {
                return ((e.name.toUpperCase() === value[index].name.toUpperCase())
                    && i !== index) && (typeof e.type === 'string' || undefined);
            });
        });
    }

}

export function MatchProperties(validationOptions?: ValidationOptions) {
    return (object: object, propertyName: string) => {
        registerDecorator({
            name: 'MatchProperties',
            target: object.constructor,
            propertyName,
            options: validationOptions,
            validator: MatchPropertiesConstraint
        });
    };
}
