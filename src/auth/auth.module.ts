import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { PrismaService } from 'src/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { UserService } from 'src/user/user.service';
import { MailerService } from 'src/Services/mailer.service';

@Module({
  controllers: [AuthController],
  providers: [AuthService,UserService, PrismaService, JwtService,MailerService]
})
export class AuthModule {}
