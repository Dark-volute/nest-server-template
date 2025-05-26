import {
    ArgumentMetadata,
    Injectable,
    PipeTransform,
    BadRequestException,
  } from '@nestjs/common';
  import { validate } from 'class-validator';
  import { plainToClass } from 'class-transformer';
  
  @Injectable()
  export class ValidationPipe implements PipeTransform {
    async transform(value: any, { metatype }: ArgumentMetadata) {
      if (!metatype || !this.toValidate(metatype)) {
        // 如果没有传入验证规则，则不验证，直接返回数据
        return value;
      }
  
      if (Array.isArray(value)) {
        for (const item of value) {
          const object = plainToClass(metatype, item);
          const errors = await validate(object);
  
          if (errors.length > 0) {
            const msg = errors[0].constraints ? Object.values(errors[0].constraints)[0] : 'Validation failed';
            throw new BadRequestException(`${msg}`);
          }
        }
      }
  
      // 将对象转换为 Class 来验证
      const object = plainToClass(metatype, value);
  
      const errors = await validate(object);
      if (errors.length > 0) {
        const msg = errors[0].constraints ? Object.values(errors[0].constraints)[0] : 'Validation failed';
        throw new BadRequestException(`${msg}`);
      }
      return value;
    }
  
    private toValidate(metatype: any): boolean {
      const types: any[] = [String, Boolean, Number, Array, Object];
      return !types.includes(metatype);
    }
  }
  