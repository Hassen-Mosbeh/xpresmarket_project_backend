import { IsString, IsOptional, IsEmail, IsIn } from 'class-validator';


export enum ProfileType {
  Buyer = 'Buyer',
  Seller = 'Seller',
  Admin= 'Admin',
}

// Définition de l'énumération Status
export enum Status {
  active = 'active',
  inactive = 'inactive',
  deleted = 'deleted',
}

export class CreateUserDto {
  @IsOptional()
  @IsString()
  username?: string;

  @IsEmail()
  email: string;


  @IsString()
  @IsIn(['Buyer', 'Seller','Admin'])
  profile: string;

  @IsOptional()
  @IsString()
  picture?:string;

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

  // Validation du statut avec l'énumération
  @IsOptional()
  @IsIn([Status.active, Status.inactive, Status.deleted])  // Utilisation de l'énumération pour la validation
  status?: Status;  // Utilisation de l'énumération ici aussi
}

export class UpdateUserDto {
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

  // Validation du statut avec l'énumération
  @IsOptional()
  @IsIn([Status.active, Status.inactive, Status.deleted])  // Utilisation de l'énumération pour la validation
  status?: Status;  // Utilisation de l'énumération ici aussi
}
