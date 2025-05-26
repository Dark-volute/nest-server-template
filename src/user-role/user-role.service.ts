import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class UserRoleService {
  constructor(private prisma: PrismaService) {}

  async assignRoleToUser(userId: string, roleId: string) {
    // 检查用户和角色是否存在
    const [user, role] = await Promise.all([
      this.prisma.user.findUnique({ where: { id: userId } }),
      this.prisma.role.findUnique({ where: { id: roleId } })
    ]);

    if (!user) {
      throw new NotFoundException(`用户 ID ${userId} 不存在`);
    }
    if (!role) {
      throw new NotFoundException(`角色 ID ${roleId} 不存在`);
    }

    return this.prisma.userRole.create({
      data: {
        userId,
        roleId
      },
      include: {
        user: true,
        role: true
      }
    });
  }

  async removeRoleFromUser(userId: string, roleId: string) {
    const userRole = await this.prisma.userRole.findFirst({
      where: {
        userId,
        roleId
      }
    });

    if (!userRole) {
      throw new NotFoundException('用户角色关联不存在');
    }

    await this.prisma.userRole.delete({
      where: { id: userRole.id }
    });
  }

  async getUserRoles(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: {
        userRoles: {
          include: {
            role: {
              include: {
                permissions: {
                  include: {
                    permission: true
                  }
                }
              }
            }
          }
        }
      }
    });

    if (!user) {
      throw new NotFoundException(`用户 ID ${userId} 不存在`);
    }

    return user.userRoles.map(ur => ur.role);
  }

  async getRoleUsers(roleId: string) {
    const role = await this.prisma.role.findUnique({
      where: { id: roleId },
      include: {
        userRoles: {
          include: {
            user: true
          }
        }
      }
    });

    if (!role) {
      throw new NotFoundException(`角色 ID ${roleId} 不存在`);
    }

    return role.userRoles.map(ur => ur.user);
  }
} 