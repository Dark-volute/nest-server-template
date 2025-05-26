import { Injectable, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AppService {
  constructor(private configService: ConfigService) {
  }

  getHello(): string {
    const port = this.configService.get('PORT');
    const dbHost = this.configService.get('DB_HOST');
    return `Hello World! Running on port ${port}, connected to database at ${dbHost}`;
  }
}
