import { registerDecorator, ValidationArguments, ValidationOptions } from 'class-validator';

export function IsGreaterThan(property: number, validationOptions?: ValidationOptions) {
    return (object: object, propertyName: string) => {
        registerDecorator({
            name: 'IsGreaterThan',
            target: object.constructor,
            propertyName,
            constraints: [property],
            options: validationOptions,
            validator: {
                validate(value: number, args: ValidationArguments) {
                    return value > property;
                }
            }
        });

    };

}
