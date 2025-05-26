// import { PartialType } from '@nestjs/mapped-types';
// import { CreateRoleDto } from './create-role.dto';

// export class UpdateRoleDto extends PartialType(CreateRoleDto) {} 
import { IsNotEmpty, IsString, IsOptional, IsArray, IsUUID } from 'class-validator';

export class UpdateRoleDto {
  @IsNotEmpty({ message: '角色名称不能为空' })
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsArray()
  @IsUUID('4', { each: true })
  permissionIds?: string[];
} 