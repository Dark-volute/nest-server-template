import { Controller, Post, Delete, Get, Param, Body } from '@nestjs/common';
import { UserRoleService } from './user-role.service';

@Controller('user-roles')
export class UserRoleController {
  constructor(private readonly userRoleService: UserRoleService) {}

  @Post()
  async assignRoleToUser(
    @Body('userId') userId: string,
    @Body('roleId') roleId: string,
  ) {
    return this.userRoleService.assignRoleToUser(userId, roleId);
  }

  @Delete(':userId/:roleId')
  async removeRoleFromUser(
    @Param('userId') userId: string,
    @Param('roleId') roleId: string,
  ) {
    return this.userRoleService.removeRoleFromUser(userId, roleId);
  }

  @Get('user/:userId')
  async getUserRoles(@Param('userId') userId: string) {
    return this.userRoleService.getUserRoles(userId);
  }

  @Get('role/:roleId')
  async getRoleUsers(@Param('roleId') roleId: string) {
    return this.userRoleService.getRoleUsers(roleId);
  }
} 