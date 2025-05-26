import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';

@Injectable()
export class RoleService {
  constructor(private prisma: PrismaService) {}

  async create(createRoleDto: CreateRoleDto) {
    const { permissionIds, ...roleData } = createRoleDto;
    
    return this.prisma.role.create({
      data: {
        ...roleData,
        permissions: {
          create: permissionIds?.map(permissionId => ({
            permission: {
              connect: { id: permissionId }
            }
          }))
        }
      },
      include: {
        permissions: {
          include: {
            permission: true
          }
        }
      }
    });
  }

  async findAll() {
    return this.prisma.role.findMany({
      include: {
        permissions: {
          include: {
            permission: true
          }
        }
      }
    });
  }

  async findOne(id: string) {
    const role = await this.prisma.role.findUnique({
      where: { id },
      include: {
        permissions: {
          include: {
            permission: true
          }
        }
      }
    });

    if (!role) {
      throw new NotFoundException(`角色 ID ${id} 不存在`);
    }

    return role;
  }

  async update(id: string, updateRoleDto: UpdateRoleDto) {
    const { permissionIds, ...roleData } = updateRoleDto;

    // 先删除现有的权限关联
    if (permissionIds) {
      await this.prisma.rolePermission.deleteMany({
        where: { roleId: id }
      });
    }

    return this.prisma.role.update({
      where: { id },
      data: {
        ...roleData,
        permissions: permissionIds ? {
          create: permissionIds.map(permissionId => ({
            permission: {
              connect: { id: permissionId }
            }
          }))
        } : undefined
      },
      include: {
        permissions: {
          include: {
            permission: true
          }
        }
      }
    });
  }

  async remove(id: string) {
    await this.prisma.role.delete({
      where: { id }
    });
  }
} 