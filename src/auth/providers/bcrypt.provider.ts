/** @format */

import { Injectable } from '@nestjs/common';
import { compare, hash } from 'bcrypt';
import { CompareBcryptDTO, HashBcryptDTO } from '../dtos/bcrypt.dto';

@Injectable()
export class BcryptProvider {
  private readonly saltRounds = 12;
  async hash(bcryptDto: HashBcryptDTO): Promise<string> {
    return await hash(bcryptDto.plainText, this.saltRounds);
  }

  async compare(bcryptDto: CompareBcryptDTO): Promise<boolean> {
    return await compare(bcryptDto.plainText, bcryptDto.hashedPlainText);
  }
}
