import { Body, Controller, Get, Post, Req, Res, UseGuards } from '@nestjs/common';
import type { Request, Response } from 'express';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { AuthGuard } from './auth.guard';
import { CurrentUser } from './current-user.decorator';
import { AuthUser } from './types/auth-user.type';
import { clearRefreshCookie, getRefreshCookieName, setRefreshCookie } from './refresh-cookie.util';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  register(@Body() dto: RegisterDto) {
    return { data: this.authService.register(dto) };
  }

  @Post('login')
  async login(@Body() dto: LoginDto, @Res({ passthrough: true }) response: Response) {
    const data = await this.authService.login(dto);
    setRefreshCookie(response, data.refreshToken);
    return { data: { ...data, refreshToken: undefined } };
  }

  @Get('me')
  @UseGuards(AuthGuard)
  me(@CurrentUser() user: AuthUser) {
    return { data: this.authService.me(user) };
  }

  @Post('refresh')
  async refresh(@Req() request: Request, @Res({ passthrough: true }) response: Response) {
    const refreshToken = getCookieValue(request, getRefreshCookieName()) || '';
    const data = await this.authService.refresh(refreshToken);
    setRefreshCookie(response, data.refreshToken);
    return { data: { ...data, refreshToken: undefined } };
  }

  @Post('logout')
  @UseGuards(AuthGuard)
  async logout(@CurrentUser() user: AuthUser, @Res({ passthrough: true }) response: Response) {
    clearRefreshCookie(response);
    return { data: await this.authService.logout(user.sessionId) };
  }
}

function getCookieValue(request: Request, name: string) {
  const header = request.headers.cookie || '';
  return header
    .split(';')
    .map((part: string) => part.trim())
    .find((part: string) => part.startsWith(`${name}=`))
    ?.slice(name.length + 1);
}
