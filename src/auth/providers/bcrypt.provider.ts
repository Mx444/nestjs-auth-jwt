import { Injectable } from '@nestjs/common';
import { hash, compare } from 'bcrypt';
import { CompareBcryptDTO, HashBcryptDTO } from 'src/auth/dtos/bcrypt.dto';

@Injectable()
export class BcryptProvider {
  async hashPassword(bcryptDto: HashBcryptDTO): Promise<string> {
    const saltRounds = 10;
    return await hash(bcryptDto.password, saltRounds);
  }

  async comparePasswords(bcryptDto: CompareBcryptDTO): Promise<boolean> {
    return await compare(bcryptDto.password, bcryptDto.hashedPassword);
  }
}
