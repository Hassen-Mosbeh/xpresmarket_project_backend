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
import {ChangePasswordAfterResetDto, VerifyResetCodeDto} from './dto/reset-password.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';

const EXPIRE_TIME = 20 * 1000;

@Injectable()
export class AuthService {
  private redisClient = createClient({ url: 'redis://localhost:6379' });
  // private resetSessions = new Map<string, {
  //   email: string,
  //   resetCode: string,
  //   expiresAt: number
  // }>();

  constructor(
    private readonly userService: UserService,
    private jwtService: JwtService,
    private readonly mailerService: MailerService,
  ) {
    this.redisClient.connect();
  }

  private async initializeRedis() {
    this.redisClient.on('error', (err) =>
      console.error('Redis Client Error', err),
    );
    await this.redisClient.connect();
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
      },
      backendTokens: {
        accessToken: await this.jwtService.signAsync(payload, {
          //ACCESS TOKEN dispire in 4h
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
    // Find the user
    const user = await this.userService.findById(id);
    if (!user) {
      throw new NotFoundException('User not found...');
    }

    // Compare the old password with the password in DB
    const passwordMatch = await compare(dto.oldPassword, user.password);
    if (!passwordMatch) {
      throw new UnauthorizedException('Wrong credentials');
    }

    // Change user's password
    const newHashedPassword = await hash(dto.newPassword, 10);
    await this.userService.updatePassword(user.email, newHashedPassword);
  }

  async forgotPassword(dto: ForgotPasswordDto) {
    const user = await this.userService.findByEmail(dto.email);
  
    if (!user) {
      // Simply return a message without generating session or storing anything
      throw new NotFoundException('Email does not exist');
    }
  
    const sessionId = randomUUID(); // Only generate this if user exists
    const resetCode = randomInt(100000, 999999).toString();
  
    // Store reset session in Redis (including the user's email)
    await this.redisClient.setEx(
      `reset:${sessionId}`,
      900,
      JSON.stringify({
        email: user.email,
        code: resetCode,
        verified: false,
      }),
    );
  
    // Send reset code via email
    await this.mailerService.sendResetCode(dto.email, resetCode);
  
    return {
      message: 'Reset code has been sent',
      sessionId,
    };
  }
  

  async verifyResetCode(sessionId: string, dto: VerifyResetCodeDto) {
    // Retrieve session data from Redis
    const sessionData = await this.redisClient.get(`reset:${sessionId}`);
    
    if (!sessionData) throw new BadRequestException('Invalid session');
  
    // Parse the session data
    const { code, email } = JSON.parse(sessionData);
  
    // If session data does not contain an email, it's an error
    if (!email) throw new BadRequestException('Email is missing from session data');
  
    // Compare the reset code sent by the user with the one stored in the session
    if (dto.resetCode !== code) {
      throw new BadRequestException('Invalid reset code');
    }
  
    // If the code matches, update session data in Redis
    await this.redisClient.setEx(
      `reset:${sessionId}`,
      900,
      JSON.stringify({
        code, 
        verified: true, 
        email,
      }),
    );
  
    // Return sessionId and verification status
    return { verified: true, sessionId };
  }

  async changePasswordAfterReset(sessionId: string, dto: ChangePasswordAfterResetDto) {
    const sessionData = await this.redisClient.get(`reset:${sessionId}`);
    console.log("🔍 Session Data from Redis:", sessionData);
  
    if (!sessionData) throw new BadRequestException('Invalid or expired session');
  
    const { email, verified } = JSON.parse(sessionData);
    console.log("📧 Extracted email:", email);
    
    if (!email) {
      console.error("❌ Error: Email is undefined");
      throw new BadRequestException('Email is required');
    }
  
    if (!verified) throw new BadRequestException('Reset code not verified');
  
    if (dto.password !== dto.confirmPassword) {
      throw new BadRequestException('Passwords do not match');
    }
  
    const hashedPassword = await hash(dto.password, 10);
  
    // Find user by email
    const user = await this.userService.findByEmail(email);
    console.log("✅ User found:", user);
  
    if (!user) throw new BadRequestException('User not found');
  
    await this.userService.updatePassword(email, hashedPassword);
    await this.redisClient.del(`reset:${sessionId}`);
  
    return { message: 'Password changed successfully' };
  }
  

  
  // async verifyResetCode(email: string, resetCode: string) {
  //   const user = await this.userService.findByEmail(email);
  //   if (!user || user.resetCode !== resetCode) {
  //     throw new BadRequestException('Invalid reset code');
  //   }

  //   if (!user.resetCodeExpiresAt || new Date() > new Date(user.resetCodeExpiresAt)) {
  //     throw new BadRequestException('Reset code expired');
  //   }

  //   return { isValid: true };
  // }

  // async resetPassword(dto: ResetPasswordDto) {
  //   const { email, resetCode, newPassword } = dto;

  //   // Verify reset code first
  //   await this.verifyResetCode(email, resetCode);

  //   // Hash new password
  //   const hashedPassword = await hash(newPassword, 10);

  //   // Update password & remove reset code
  //   await this.userService.updatePassword(email, hashedPassword);

  //   return { message: 'Password reset successful' };
  // }

  async validateUser(dto: LoginDto) {
    const user = await this.userService.findByEmail(dto.email);
    if (user && (await compare(dto.password, user.password))) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password, ...result } = user;
      return result;
    }
    throw new UnauthorizedException();
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
    await this.redisClient.set(token, 'invalid'); // Store the token in Redis
  }

  async isTokenInvalid(token: string): Promise<boolean> {
    const result = await this.redisClient.get(token); // Check if the token is in Redis
    return result === 'invalid';
  }
}
