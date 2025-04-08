import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthController } from 'src/auth/auth.controller';
import { AuthService } from 'src/auth/auth.service';
import { JwtGuard } from 'src/auth/guards/jwt.guard';

@Module({
  imports: [
    JwtModule.register({
      secret: process.env.jwtSecretKey, // Same key as in JwtGuard
      signOptions: { expiresIn: '15m' }, // Optional: Token expiration
    }),
  ],
  providers: [AuthService, JwtGuard],
  controllers: [AuthController],
})
export class AuthModule {}