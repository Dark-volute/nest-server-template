import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { plainToInstance } from 'class-transformer';


@Injectable()
export class SerializerInterceptor implements NestInterceptor {
  constructor(private readonly userDto: any) {}
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(map(data => {
        return plainToInstance(this.userDto, data)
    }));
  }
}