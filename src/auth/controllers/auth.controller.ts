/** @format */

import { Body, Controller, Get, Post, Request, UseGuards } from '@nestjs/common';
import { SkipThrottle, Throttle } from '@nestjs/throttler';
import { LoginDTO, RegisterDTO } from '../dtos/base-auth.dto';
import { JwtAuthGuard } from '../guards/jwt.guard';
import { AuthService } from '../providers/auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Throttle({ short: { limit: 3, ttl: 60000 } })
  @Post('register')
  register(@Body() registerDTO: RegisterDTO) {
    return this.authService.register(registerDTO);
  }

  @Throttle({ short: { limit: 5, ttl: 60000 } })
  @Post('login')
  login(@Body() loginDTO: LoginDTO) {
    return this.authService.login(loginDTO);
  }

  @SkipThrottle()
  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@Request() req) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-member-access
    return req.user;
  }
}
