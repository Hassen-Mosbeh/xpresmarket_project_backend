import { IsEmail, IsIn, IsString, IsStrongPassword} from "class-validator";


export class SignUp {
 
  @IsString()
  username?: string;

  @IsEmail()
  email: string;


  @IsString()
  @IsIn(['Buyer', 'Seller'])
  profile: string;


  @IsStrongPassword()
  password: string;

  @IsString()
  telephone: string;


}