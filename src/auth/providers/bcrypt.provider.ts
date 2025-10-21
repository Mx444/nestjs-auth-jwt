import { Injectable } from '@nestjs/common';
import { hash, compare } from 'bcrypt';
import { BcryptDTO } from 'src/auth/dtos/bcrypt.dto';

@Injectable()
export class BcryptProvider {
  async hashPassword(bcryptDto: BcryptDTO): Promise<string> {
    const saltRounds = 10;
    return await hash(bcryptDto.password, saltRounds);
  }

  async comparePasswords(bcryptDto: BcryptDTO): Promise<boolean> {
    return await compare(bcryptDto.password, bcryptDto.hashedPassword);
  }
}
