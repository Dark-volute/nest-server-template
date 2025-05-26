import { IsNotEmpty, IsString, IsOptional, IsBoolean } from 'class-validator';

export class CreatePermissionDto {
  @IsNotEmpty({ message: '权限名称不能为空' })
  @IsString()
  name: string;

  @IsNotEmpty({ message: '权限代码不能为空' })
  @IsString()
  code: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
} 