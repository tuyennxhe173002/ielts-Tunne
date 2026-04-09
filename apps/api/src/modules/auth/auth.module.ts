import { Global, Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { AdminGuard } from '../../common/guards/admin.guard';
import { ApprovedUserGuard } from '../../common/guards/approved-user.guard';
import { AuthGuard } from '../../common/guards/auth.guard';
import { CsrfGuard } from '../../common/guards/csrf.guard';

@Global()
@Module({
  imports: [JwtModule.register({})],
  controllers: [AuthController],
  providers: [AuthService, AuthGuard, AdminGuard, ApprovedUserGuard, CsrfGuard],
  exports: [AuthService, AuthGuard, AdminGuard, ApprovedUserGuard, CsrfGuard, JwtModule],
})
export class AuthModule {}
