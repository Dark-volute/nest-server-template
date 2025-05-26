import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePermissionDto } from './dto/create-permission.dto';
import { UpdatePermissionDto } from './dto/update-permission.dto';

@Injectable()
export class PermissionService {
  constructor(private prisma: PrismaService) {}

  async create(createPermissionDto: CreatePermissionDto) {
    return this.prisma.permission.create({
      data: createPermissionDto
    });
  }

  async findAll() {
    return this.prisma.permission.findMany();
  }

  async findOne(id: string) {
    const permission = await this.prisma.permission.findUnique({
      where: { id }
    });

    if (!permission) {
      throw new NotFoundException(`权限 ID ${id} 不存在`);
    }

    return permission;
  }

  async update(id: string, updatePermissionDto: UpdatePermissionDto) {
    return this.prisma.permission.update({
      where: { id },
      data: updatePermissionDto
    });
  }

  async remove(id: string) {
    await this.prisma.permission.delete({
      where: { id }
    });
  }

  async findByCode(code: string) {
    const permission = await this.prisma.permission.findUnique({
      where: { code }
    });

    if (!permission) {
      throw new NotFoundException(`权限代码 ${code} 不存在`);
    }

    return permission;
  }
} 