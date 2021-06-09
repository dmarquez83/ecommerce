import { ArgumentMetadata, BadRequestException, HttpStatus, Injectable, PipeTransform } from '@nestjs/common';
import { HttpException } from '@nestjs/common/exceptions/http.exception';
import { plainToClass } from 'class-transformer';
import { validate } from 'class-validator';

@Injectable()
export class ValidationPipe implements PipeTransform<any> {
    async transform(value: any, metadata: ArgumentMetadata) {
    
        if (!value) {
            throw new BadRequestException('No data submitted');
        }

        const { metatype } = metadata;
        if (!metatype || !this.toValidate(metatype)) {
            return value;
        }
        const object = plainToClass(metatype, value);

        const errors = await validate(object,
            { whitelist: true, forbidNonWhitelisted: true});
        if (errors.length > 0) {
            throw new HttpException({
                code: this.buildError(errors).code,
                status: false,
                message: this.buildError(errors).result
            }, HttpStatus.BAD_REQUEST);
        }

        return object;
    }

    private buildError(errors) {
        let result = '';
        let code: number;
        errors.every((el) => {
            Object.entries(el.constraints).every((constraint) => {
                code = constraint[0] === 'whitelistValidation' ? 3 : 4;
                result = `${constraint[1]}`;
                return false;
            });
            return false;
        });
        return { result, code };
    }

    private toValidate(metatype): boolean {
        const types = [String, Boolean, Number, Array, Object];
        return !types.find((type) => metatype === type);
    }
}
