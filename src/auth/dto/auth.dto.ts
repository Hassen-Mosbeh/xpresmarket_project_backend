import { IsEmail, IsOptional, IsString } from 'class-validator';
import { PrimaryGeneratedColumn } from 'typeorm';

export class LoginDto {
  @IsOptional()
  @PrimaryGeneratedColumn()
  id: number;

  @IsString()
  @IsEmail()
  email: string;

  @IsString()
  password: string;
}