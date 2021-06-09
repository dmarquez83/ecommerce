import { ArgumentMetadata, BadRequestException, HttpStatus, Injectable, PipeTransform } from '@nestjs/common';
import { HttpException } from '@nestjs/common/exceptions/http.exception';
import { plainToClass } from 'class-transformer';
import { validate } from 'class-validator';

@Injectable()
export class ProductCrudValidation implements PipeTransform<any> {
    async transform(value: any, metadata: ArgumentMetadata) {
    
        if (!value) {
            throw new BadRequestException('No data submitted');
        }

        const { metatype } = metadata;
        if (!metatype || !this.toValidate(metatype)) {
            return value;
        }

        const object = plainToClass(metatype, value);

        if (object.isVariant) {

            if (object.locations) {
                throw new HttpException({
                    code: 3,
                    status: false,
                    message: 'property locations should not exist'
                }, HttpStatus.BAD_REQUEST);
            }

            if (!object.variations) {
                throw new HttpException({
                    code: 4,
                    status: false,
                    message: 'variations should not be empty'
                }, HttpStatus.BAD_REQUEST);
            }
        } else {

            if (!object.locations) {
                throw new HttpException({
                    code: 4,
                    status: false,
                    message: 'locations should not be empty'
                }, HttpStatus.BAD_REQUEST);
            }

            if (object.variations) {
                throw new HttpException({
                    code: 3,
                    status: false,
                    message: 'property variations should not exist'
                }, HttpStatus.BAD_REQUEST);
            }
        }

        return object;
    }

    private toValidate(metatype): boolean {
        const types = [String, Boolean, Number, Array, Object];
        return !types.find((type) => metatype === type);
    }
}
