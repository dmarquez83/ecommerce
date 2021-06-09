import { registerDecorator, ValidationArguments, ValidationOptions } from 'class-validator';

export function IsMatch(property: string, validationOptions?: ValidationOptions) {
    return (object: object, propertyName: string) => {
        registerDecorator({
            name: 'IsMatch',
            target: object.constructor,
            propertyName,
            constraints: [property],
            options: validationOptions,
            validator: {
                validate(value: any, args: ValidationArguments) {
                    const relatedValue = args.object[property];
                    return  typeof value === 'string' &&
                           typeof relatedValue === 'string' &&
                           value === relatedValue;
                }
            }
        });
    };
}
