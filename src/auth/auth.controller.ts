import { Controller, Post, Body, UsePipes, ClassSerializerInterceptor, UseInterceptors, UseGuards, Req } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { ValidationPipe } from '@/common/pipe/validation.pipe';
import { UserEntity } from '@/user/entities/user.entity';
import { Serialize } from '@/common/decorators/serializer.decorator';
import { AuthGuard } from '@nestjs/passport';

@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UsePipes(ValidationPipe)
  @Post('login')
  async login(@Body() body: CreateUserDto) {
    const { username, password } = body;
    return await this.authService.login(username, password);
  }

  @UsePipes(ValidationPipe)
  @Serialize(UserEntity)
  @Post('signup')
  async signup(@Body() body: CreateUserDto) {
    const { username, password } = body;
    const user = await this.authService.signup(username, password);
    return user
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('test')
  async test(@Body() body: CreateUserDto, @Req() req) {
    return req.user
  }

}
