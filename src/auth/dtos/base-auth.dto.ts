import { IsEmail, IsString, IsStrongPassword } from 'class-validator';

class BaseAuthDTO {
  @IsString()
  @IsEmail()
  email: string;
}

export class RegisterDTO extends BaseAuthDTO {
  @IsString()
  @IsStrongPassword()
  password: string;
}

export class LoginDTO extends BaseAuthDTO {
  @IsString()
  password: string;
}
