import { IsString, Length, MinLength } from 'class-validator';


export class VerifyResetCodeDto {
  @IsString()
  @Length(6, 6)
  resetCode: string;
}

export class ChangePasswordAfterResetDto {
  @IsString()
  password: string;

  @IsString()
  @MinLength(8)
  confirmPassword: string;
}