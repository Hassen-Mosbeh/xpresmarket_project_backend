import { IsString, IsOptional, IsEmail, IsInt, IsIn } from 'class-validator';


export enum ProfileType {
  Buyer = 'Buyer',
  Seller = 'Seller',
}

export class CreateUserDto {

  @IsOptional()
  @IsString()
  username?: string;

  @IsEmail()
  email: string;

  @IsOptional()
  @IsString()
  adresse?: string; 

  @IsString()
  @IsIn(['Buyer', 'Seller'])
  profile: ProfileType;

  @IsString()
  password: string;

  @IsString()
  telephone: string;

  @IsOptional()
  @IsString()
  company_name?: string; 

  @IsOptional()
  @IsString()
  company_adresse?: string; 

  @IsOptional()
  @IsString()
  company_tel?: string;
}

export class UpdateUserDto{
  @IsOptional()
  @IsInt()
  id?: number;

  @IsOptional()
  @IsString()
  username?: string;
  
  @IsOptional()
  @IsString()
  telephone?: string;

  @IsOptional()
  @IsString()
  company_email?: string;

  @IsOptional()
  @IsString()
  company_name?: string; 

  @IsOptional()
  @IsString()
  company_adresse?: string; 

  @IsOptional()
  @IsString()
  company_tel?: string; 
}
