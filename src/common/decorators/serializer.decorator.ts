import { SerializerInterceptor } from '@/common/interceptor/serializer.interceptor';
import { UseInterceptors } from '@nestjs/common';

export const Serialize = (a: any) => {
    return UseInterceptors(new SerializerInterceptor(a))
}