import { Body, Controller, Get, Post, Req, Res, UseGuards } from '@nestjs/common';
import type { Request, Response } from 'express';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { AuthGuard } from '../../common/guards/auth.guard';
import { CsrfGuard } from '../../common/guards/csrf.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { AuthUser } from '../../common/types/auth-user.type';
import { clearRefreshCookie, getRefreshCookieName, setRefreshCookie } from '../../common/utils/refresh-cookie.util';
import { clearCsrfCookie, getCsrfCookieName, issueCsrfToken, readCookie, setCsrfCookie } from '../../common/utils/csrf.util';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(@Body() dto: RegisterDto) {
    return { data: await this.authService.register(dto) };
  }

  @Post('login')
  async login(@Body() dto: LoginDto, @Res({ passthrough: true }) response: Response) {
    const data = await this.authService.login(dto);
    const csrfToken = issueCsrfToken();
    setRefreshCookie(response, data.refreshToken);
    setCsrfCookie(response, csrfToken);
    return { data: { ...data, refreshToken: undefined, csrfToken } };
  }

  @Get('csrf-token')
  csrf(@Req() request: Request, @Res({ passthrough: true }) response: Response) {
    const token = readCookie(request, getCsrfCookieName()) || issueCsrfToken();
    setCsrfCookie(response, token);
    return { data: { csrfToken: token } };
  }

  @Get('me')
  @UseGuards(AuthGuard)
  me(@CurrentUser() user: AuthUser) {
    return { data: this.authService.me(user) };
  }

  @Post('refresh')
  @UseGuards(CsrfGuard)
  async refresh(@Req() request: Request, @Res({ passthrough: true }) response: Response) {
    const refreshToken = getCookieValue(request, getRefreshCookieName()) || '';
    const data = await this.authService.refresh(refreshToken);
    const csrfToken = readCookie(request, getCsrfCookieName()) || issueCsrfToken();
    setRefreshCookie(response, data.refreshToken);
    setCsrfCookie(response, csrfToken);
    return { data: { ...data, refreshToken: undefined, csrfToken } };
  }

  @Post('logout')
  @UseGuards(AuthGuard, CsrfGuard)
  async logout(@CurrentUser() user: AuthUser, @Res({ passthrough: true }) response: Response) {
    clearRefreshCookie(response);
    clearCsrfCookie(response);
    return { data: await this.authService.logout(user.sessionId) };
  }
}

function getCookieValue(request: Request, name: string) {
  return readCookie(request, name);
}
