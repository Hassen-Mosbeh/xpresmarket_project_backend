import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { LoginDto } from './dto/auth.dto';
import { UserService } from 'src/user/user.service';
import { compare, hash } from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { createClient } from 'redis';
import { ChangePasswordDto } from './dto/change-password.dto';
import { MailerService } from '../Services/mailer.service';
import { randomInt, randomUUID } from 'crypto';
import {
  ChangePasswordAfterResetDto,
  VerifyResetCodeDto,
} from './dto/reset-password.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';

const EXPIRE_TIME = 20 * 1000;

@Injectable()
export class AuthService {
  private redisClient = createClient({ url: 'redis://localhost:6379' });

  constructor(
    private readonly userService: UserService,
    private jwtService: JwtService,
    private readonly mailerService: MailerService,
  ) {
    this.redisClient.connect();
  }

  async storeSessionEmail(sessionId: string, email: string): Promise<void> {
    await this.redisClient.setEx(`session:${sessionId}:email`, 900, email);
  }

  async login(dto: LoginDto) {
    const user = await this.validateUser(dto);
    const payload = {
      id: user.id,
      email: user.email,
      profile: user.profile,
      company_adresse: user.company_adresse,
      sub: {
        id: user.id,
      },
    };

    return {
      user: {
        id: user.id,
        email: user.email,
        profile: user.profile,
        username: user.username,
         company_adresse: user.company_adresse,
      },
      backendTokens: {
        accessToken: await this.jwtService.signAsync(payload, {
          expiresIn: '4h',
          secret: process.env.jwtSecretKey,
        }),
        refreshToken: await this.jwtService.signAsync(payload, {
          expiresIn: '7d',
          secret: process.env.jwtRefreshTokenKey,
        }),
        expiresIn: new Date().setTime(new Date().getTime() + EXPIRE_TIME),
      },
    };
  }

  async changePassword(id: number, dto: ChangePasswordDto) {
    const user = await this.userService.findById(id);
    if (!user) {
      throw new NotFoundException('User not found...');
    }

    const passwordMatch = await compare(dto.oldPassword, user.password);
    if (!passwordMatch) {
      throw new UnauthorizedException('Wrong credentials');
    }

    const newHashedPassword = await hash(dto.newPassword, 10);
    await this.userService.updatePassword(user.email, newHashedPassword);
  }

  async forgotPassword(dto: ForgotPasswordDto) {
    const user = await this.userService.findByEmail(dto.email);
    if (!user) {
      throw new NotFoundException('Email does not exist');
    }

    const sessionId = randomUUID();
    const resetCode = randomInt(100000, 999999).toString();

    await this.redisClient.setEx(
      `reset:${sessionId}`,
      900,
      JSON.stringify({
        email: user.email,
        code: resetCode,
        verified: false,
      }),
    );

    await this.mailerService.sendResetCode(dto.email, resetCode);

    return {
      message: 'Reset code has been sent',
      sessionId,
    };
  }

  async verifyResetCode(sessionId: string, dto: VerifyResetCodeDto) {
    const sessionData = await this.redisClient.get(`reset:${sessionId}`);
    if (!sessionData) throw new BadRequestException('Invalid session');

    const { code, email } = JSON.parse(sessionData);
    if (!email) throw new BadRequestException('Email is missing from session data');
    if (dto.resetCode !== code) {
      throw new BadRequestException('Invalid reset code');
    }

    await this.redisClient.setEx(
      `reset:${sessionId}`,
      900,
      JSON.stringify({
        code,
        verified: true,
        email,
      }),
    );

    return { verified: true, sessionId };
  }

  async changePasswordAfterReset(
    sessionId: string,
    dto: ChangePasswordAfterResetDto,
  ) {
    const sessionData = await this.redisClient.get(`reset:${sessionId}`);
    if (!sessionData) throw new BadRequestException('Invalid or expired session');

    const { email, verified } = JSON.parse(sessionData);

    if (!email) throw new BadRequestException('Email is required');
    if (!verified) throw new BadRequestException('Reset code not verified');
    if (dto.password !== dto.confirmPassword) {
      throw new BadRequestException('Passwords do not match');
    }

    const hashedPassword = await hash(dto.password, 10);
    const user = await this.userService.findByEmail(email);
    if (!user) throw new BadRequestException('User not found');

    await this.userService.updatePassword(email, hashedPassword);
    await this.redisClient.del(`reset:${sessionId}`);

    return { message: 'Password changed successfully' };
  }

  // ✅ Méthode avec vérification du statut
  async validateUser(dto: LoginDto) {
    const user = await this.userService.findByEmail(dto.email);
    const passwordMatches = user && (await compare(dto.password, user.password));

    if (!user || !passwordMatches) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // ⚠️ Vérifie si l'utilisateur est désactivé
    if (user.status === 'inactive') {
      throw new UnauthorizedException('Your account has been deactivated');
    }

    // Optionnel : vérifier si l'utilisateur est supprimé
    if (user.status === 'deleted') {
      throw new UnauthorizedException('Your account has been deleted');
    }

    // Ne retourne pas le mot de passe
    const { password, ...result } = user;
    return result;
  }

  async refreshToken(user: any) {
    const payload = {
      email: user.email,
      sub: user.sub,
    };

    return {
      accessToken: await this.jwtService.signAsync(payload, {
        expiresIn: '7d',
        secret: process.env.jwtSecretKey,
      }),
      refreshToken: await this.jwtService.signAsync(payload, {
        expiresIn: '7d',
        secret: process.env.jwtRefreshTokenKey,
      }),
      expiresIn: new Date().setTime(new Date().getTime() + EXPIRE_TIME),
    };
  }

  async invalidateToken(token: string): Promise<void> {
    await this.redisClient.set(token, 'invalid');
  }

  async isTokenInvalid(token: string): Promise<boolean> {
    const result = await this.redisClient.get(token);
    return result === 'invalid';
  }
}
