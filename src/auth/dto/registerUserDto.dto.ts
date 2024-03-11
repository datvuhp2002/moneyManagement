import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, MinLength, IsOptional } from 'class-validator';
export class RegisterUserDto {
  @IsNotEmpty()
  @ApiProperty()
  username: string;
  @IsNotEmpty()
  @IsEmail()
  @ApiProperty()
  email: string;
  @IsNotEmpty()
  @MinLength(6)
  @ApiProperty()
  password: string;
}
export class LoginUserDto {
  @IsNotEmpty()
  @IsEmail()
  @ApiProperty()
  email: string;
  @IsNotEmpty()
  @ApiProperty()
  @MinLength(6)
  password: string;
}
