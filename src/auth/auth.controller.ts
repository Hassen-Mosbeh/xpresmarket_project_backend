import {
  Body,
  Controller,
  Headers,
  Post,
  Put,
  Request,
  UseGuards,
} from '@nestjs/common';
import { CreateUserDto } from 'src/user/dto/dto/user.dto';
import { UserService } from 'src/user/user.service';
import { LoginDto } from './dto/auth.dto';
import { AuthService } from './auth.service';
import { RefreshJwtGuard } from './guards/refresh.guard';
import { JwtGuard } from './guards/jwt.guard';
import { ChangePasswordDto } from './dto/change-password.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import {
  ChangePasswordAfterResetDto,
  VerifyResetCodeDto,
} from './dto/reset-password.dto';

@Controller('api/v1/auth')
export class AuthController {
  constructor(
    private userService: UserService,
    private authService: AuthService,
  ) {}

  @Post('register')
  async registerUser(@Body() dto: CreateUserDto) {
    return await this.userService.create(dto);
  }

  @Post('login')
  async login(@Body() dto: LoginDto) {
    return await this.authService.login(dto);
  }

  @UseGuards(JwtGuard)
  @Post('logout')
  async logout(@Request() req) {
    const token = req.headers.authorization.split(' ')[1];
    await this.authService.invalidateToken(token);
    return { message: 'Logged out successfully' };
  }

  @UseGuards(JwtGuard)
  @Put('change-password')
  async changePassword(
    @Body() changePasswordDto: ChangePasswordDto,
    @Request() req,
  ) {
    return await this.authService.changePassword(
      req.user.id,
      changePasswordDto,
    );
  }

  @Post('forgot-password')
  async forgotPassword(@Body() dto: ForgotPasswordDto) {
    const result = await this.authService.forgotPassword(dto);
  
    // Only store session email if sessionId is returned (meaning user exists)
    if (result.sessionId) {
      await this.authService.storeSessionEmail(result.sessionId, dto.email);
    }
  
    return result;
  }
  

  @Post('verify-reset-code')
  async verifyResetCode(
    @Headers('x-reset-session') sessionId: string,
    @Body() dto: VerifyResetCodeDto,
  ) {
    const result = await this.authService.verifyResetCode(sessionId, dto);

    // Send back the verified session ID
    return { ...result, sessionId };
  }

  @Put('change-password-after-reset')
  async changePasswordAfterReset(
    @Headers('x-reset-session') sessionId: string,
    @Body() dto: ChangePasswordAfterResetDto,
  ) {
    return this.authService.changePasswordAfterReset(sessionId, dto);
  }

  @UseGuards(RefreshJwtGuard)
  @Post('refresh')
  async refreshToken(@Request() req) {
    console.log('refreshed');

    return await this.authService.refreshToken(req.user);
  }
}
