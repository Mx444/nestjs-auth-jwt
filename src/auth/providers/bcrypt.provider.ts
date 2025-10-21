import { Injectable } from '@nestjs/common';
import { hash, compare } from 'bcrypt';
import { CompareBcryptDTO, HashBcryptDTO } from '../dtos/bcrypt.dto';

@Injectable()
export class BcryptProvider {
  private readonly saltRounds = 12;

  async hashPassword(bcryptDto: HashBcryptDTO): Promise<string> {
    return await hash(bcryptDto.password, this.saltRounds);
  }

  async comparePasswords(bcryptDto: CompareBcryptDTO): Promise<boolean> {
    return await compare(bcryptDto.password, bcryptDto.hashedPassword);
  }
}
