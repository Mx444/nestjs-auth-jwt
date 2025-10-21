import { IsString } from 'class-validator';

export class HashBcryptDTO {
  @IsString()
  password: string;
}

export class CompareBcryptDTO extends HashBcryptDTO {
  @IsString()
  hashedPassword: string;
}
