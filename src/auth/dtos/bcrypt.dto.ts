import { IsOptional, IsString } from 'class-validator';

export class BcryptDTO {
  @IsString()
  password: string;

  @IsString()
  @IsOptional()
  hashedPassword: string;
}
