import {
    ArgumentMetadata,
    Injectable, PipeTransform
} from '@nestjs/common';

@Injectable()
export class TrimPipe implements PipeTransform {
    transform(value: any, metadata: ArgumentMetadata) {

        if (value && (metadata.type === 'body')) {
            Object.keys(value).forEach(e => { 
                if ( !(value[e] instanceof Array) && 
                    (isNaN(value[e]) || typeof(value[e]) === 'string') && 
                    typeof(value[e]) !== 'object') {

                    if(value[e].trim() === 'null'){
                        value[e] = null;
                    }else{
                        value[e] = value[e].trim();
                    }
                } 
            });
        }
        return value;
    }
}
