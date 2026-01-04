import { IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class LoginDto {
  @IsString({})
  @IsEmail({}, { message: 'email sai' })
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  //   IsOptional: nếu mà người dùng gửi lên thì mới kiểm tra, còn không gửi thì không kiểm tra
  //   @IsOptional()
  password: string;
}
