import { IsEmail, IsNotEmpty } from "class-validator";
export class AuthPayLoadDto {
  @IsNotEmpty()
  @IsEmail()
  email: string;
  @IsNotEmpty()
  password: string;
}
