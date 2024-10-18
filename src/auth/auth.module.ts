import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './auth.guard';
import { JwtModule } from '@nestjs/jwt';
// import { CacheModule } from '@nestjs/cache-manager';


@Module({
  imports:[
    JwtModule.register({
    global: true,
    secret: "XXXX",
    signOptions: {expiresIn: '1h'}
    }),
  ],
  providers: [
    AuthService,
    JwtAuthGuard
  ],
  exports:[JwtAuthGuard]
})
export class AuthModule {}
