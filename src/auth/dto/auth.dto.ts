import { IsEmail, IsNotEmpty, IsNumber, MinLength } from "class-validator";
export class AuthPayLoadDto {
  @IsNotEmpty()
  @IsEmail()
  email: string;
  @IsNotEmpty()
  @MinLength(6)
  password: string;
}
export class forgetPasswordDto{
  @IsNotEmpty()
  @IsEmail()
  email: string;
}
export class ChangePasswordDto{
  @IsNotEmpty()
  @IsEmail()
  email: string;
  @IsNotEmpty()
  @MinLength(6)
  password: string;
}
export class payloadDto{
  @IsNotEmpty()
  @IsNumber()
  id:number
  @IsNotEmpty()
  @IsEmail()
  email:string
  @IsNotEmpty()
  roleName:string
}