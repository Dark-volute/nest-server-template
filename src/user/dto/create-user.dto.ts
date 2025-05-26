import {
  IsNotEmpty,
  IsNumber,
  IsString,
  ValidateBy,
  buildMessage,
} from 'class-validator';

// 自定义验证错误
// function IsNotEmpty2(validationOptions) {
//   return ValidateBy({
//       name: 'isNotEmpty2',
//       validator: {
//           validate: function (value, args) { return false; },
//           defaultMessage: buildMessage(function (eachPrefix) { return eachPrefix + '$property should not be empty'; }, validationOptions),
//       },
//   }, validationOptions);
// }

export class CreateUserDto {
  @IsNotEmpty({ message: '用户名不能为空' })
  username: string;
  @IsNotEmpty({ message: '密码不能为空' })
  password: string;

  nickname?: string;
}

export class UpdatePassword {
  @IsNotEmpty({ message: '旧密码不能为空' })
  password: string;
  @IsNotEmpty({ message: '新密码不能为空' })
  newPassword: string;
}
