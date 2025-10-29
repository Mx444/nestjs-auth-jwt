/** @format */

import { IsEmail, IsNotEmpty, IsString, IsStrongPassword } from 'class-validator';

class BaseAuthDTO {
  @IsString()
  @IsEmail()
  @IsNotEmpty()
  email: string;
}

export class RegisterDTO extends BaseAuthDTO {
  @IsNotEmpty()
  @IsString()
  @IsStrongPassword()
  password: string;
}

export class LoginDTO extends BaseAuthDTO {
  @IsNotEmpty()
  @IsString()
  password: string;
}
