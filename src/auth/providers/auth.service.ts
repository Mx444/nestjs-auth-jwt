import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { LoginDTO, RegisterDTO } from '../dtos/base-auth.dto';

import { BcryptProvider } from './bcrypt.provider';
import { UserRepository } from '../repositories/user.repository';
import { JwtService } from '@nestjs/jwt/dist/jwt.service';
import { User } from '../entities/user.entity';

@Injectable()
export class AuthService {
  constructor(
    private readonly bcryptProvider: BcryptProvider,
    private readonly userRepository: UserRepository,
    private readonly jwtService: JwtService,
  ) {}

  //#region REGISTER
  public async register(
    registerDTO: RegisterDTO,
  ): Promise<{ message: string }> {
    await this.ensureUserDoesNotExist(registerDTO.email);
    const hashedPassword = await this.hashPassword(registerDTO.password);
    await this.createAndSaveUser(registerDTO, hashedPassword);
    return this.buildSuccessResponse();
  }

  //#region helpers REGISTER
  private async ensureUserDoesNotExist(email: string): Promise<void> {
    const userExists = await this.checkIfUserExists(email);
    if (userExists) throw new ConflictException('Check your credentials');
  }

  private async checkIfUserExists(email: string): Promise<boolean> {
    const user = await this.userRepository.findOne({ where: { email } });
    return !!user;
  }

  private async hashPassword(password: string): Promise<string> {
    return this.bcryptProvider.hashPassword({ password });
  }

  private async createAndSaveUser(
    registerDTO: RegisterDTO,
    hashedPassword: string,
  ): Promise<void> {
    const newUser = this.userRepository.create({
      ...registerDTO,
      password: hashedPassword,
    });
    await this.userRepository.save(newUser);
  }

  private buildSuccessResponse(): { message: string } {
    return { message: 'User registered successfully' };
  }
  //#endregion helpers REGISTER
  //#endregion REGISTER

  //#region LOGIN
  public async login(loginDTO: LoginDTO): Promise<{ token: string }> {
    const user = await this.validateUser(loginDTO);
    return this.buildAuthResponse(user);
  }

  //#region helpers LOGIN
  private async validateUser(loginDTO: LoginDTO) {
    const user = await this.findUserByEmail(loginDTO.email);
    this.ensureUserExistsForLogin(user);
    if (!user) throw new Error('Checking user existence failed');
    await this.verifyPassword(loginDTO.password, user.password);

    return user;
  }

  private async findUserByEmail(email: string) {
    return this.userRepository.findOne({ where: { email } });
  }

  private ensureUserExistsForLogin(user: any): void {
    if (!user) throw new UnauthorizedException('Invalid credentials');
  }

  private async verifyPassword(
    plainPassword: string,
    hashedPassword: string,
  ): Promise<void> {
    const isPasswordValid = await this.bcryptProvider.comparePasswords({
      password: plainPassword,
      hashedPassword,
    });

    if (!isPasswordValid)
      throw new UnauthorizedException('Invalid credentials');
  }

  private buildAuthResponse(user: User): { token: string } {
    const accessToken = this.generateAccessToken(user);
    return { token: accessToken };
  }

  private generateAccessToken(user: User): string {
    const payload = { sub: user.id, email: user.email };
    return this.jwtService.sign(payload);
  }
  //#endregion helpers LOGIN
  //#endregion LOGIN
}
