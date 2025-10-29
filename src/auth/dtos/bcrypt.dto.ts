/** @format */

import { IsString } from 'class-validator';

export class HashBcryptDTO {
  @IsString()
  plainText: string;
}

export class CompareBcryptDTO extends HashBcryptDTO {
  @IsString()
  hashedPlainText: string;
}
