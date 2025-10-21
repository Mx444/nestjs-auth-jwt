/* eslint-disable @typescript-eslint/require-await */
import { ConflictException, Injectable } from '@nestjs/common';
import { LoginDTO, RegisterDTO } from '../dtos/base-auth.dto';

import { BcryptProvider } from './bcrypt.provider';
import { UserRepository } from '../repositories/user.repository';

@Injectable()
export class AuthService {
  constructor(
    private readonly bcryptProvider: BcryptProvider,
    private readonly userRepository: UserRepository,
  ) {}

  //#region REGISTER
  public async register(registerDTO: RegisterDTO) {
    try {
      const userExists = await this.checkIfUserExists(registerDTO.email);
      if (userExists) throw new ConflictException('User already exists');
    } catch (error) {
      console.error(error);
    }
  }

  private async checkIfUserExists(email: string) {
    const user = await this.userRepository.findOne({ where: { email } });
    return !!user;
  }

  //#endregion REGISTER

  //#region LOGIN
  public async login(loginDTO: LoginDTO) {
    console.log('Login method called with:', loginDTO);
  }
  //#endregion LOGIN
}
