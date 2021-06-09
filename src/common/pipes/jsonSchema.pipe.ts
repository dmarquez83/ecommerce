import {
    ArgumentMetadata,
    Injectable, PipeTransform
} from '@nestjs/common';

var Ajv = require('ajv');
const ajv = new Ajv({ allErrors: true });

@Injectable()
export class JsonSchema implements PipeTransform {
    transform(value: any, metadata: ArgumentMetadata) {

       /**
        * Example of a scheme to validate the json 
        */
        const schema = {
            properties: {
                foo: { type: 'string' },
                bar: { type: 'number', maximum: 3 }
            }
        };

        const validate = ajv.compile(schema);

        /**
         *  Use Example
         */
        test({ foo: 'abc', bar: 2 });
        test({ foo: 2, bar: 4 });

        function test(data) {
            const valid = validate(data);
            if (valid) { console.log('Valid!'); } else { console.log('Invalid: ' + ajv.errorsText(validate.errors)); }
        }

        return value;
    }
}
