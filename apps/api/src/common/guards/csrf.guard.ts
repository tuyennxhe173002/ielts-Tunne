import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common';
import { validateCsrf } from '../utils/csrf.util';

@Injectable()
export class CsrfGuard implements CanActivate {
  canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();
    if (['GET', 'HEAD', 'OPTIONS'].includes(request.method)) return true;
    if (!validateCsrf(request)) throw new ForbiddenException('Invalid CSRF token');
    return true;
  }
}
