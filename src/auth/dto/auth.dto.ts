import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsNumber, MinLength } from "class-validator";
export class AuthPayLoadDto {
  @IsNotEmpty()
  @ApiProperty()
  @IsEmail()
  email: string;
  @IsNotEmpty()
  @MinLength(6)
  @ApiProperty()
  password: string;
}
export class forgetPasswordDto{
  @IsNotEmpty()
  @IsEmail()
  @ApiProperty()
  email: string;
}
export class ChangePasswordDto{
  @IsNotEmpty()
  @IsEmail()
  @ApiProperty()
  email: string;
  @IsNotEmpty()
  @MinLength(6)
  @ApiProperty()
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