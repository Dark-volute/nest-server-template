import { Injectable, BadRequestException } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import argon2 from 'argon2';
import { PrismaService } from '@/prisma/prisma.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private prisma: PrismaService,
  ) {}

  async validateUser(username: string): Promise<any> {
    const user = await this.prisma.user.findUnique({
      where: {
        username
      }
    });
    if (!user) throw new BadRequestException('用户不存在');
  }

  async login(username, password) {
    const user = await this.prisma.user.findUnique({
      where: {
        username
      }
    });
    if (!user) {
      throw new BadRequestException('用户不存在');
    }

    if (await argon2.verify(user.password, password)) {
    } else {
      throw new BadRequestException('密码错误');
    }

    const payload = { username: user.username, sub: user.id };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async signup(username, password) {
    const res = await this.prisma.user.findUnique({
      where: {
        username
      }
    })
    if (res) {
      throw new BadRequestException('用户已存在')
    }

    const user = this.prisma.user.create({
      data: {
        username,
        password: await argon2.hash(password),
        nickname: username
      }
    })
    return user
  }

}
