import {
  Body,
  Controller,
  Post,
  UseGuards,
  UsePipes,
  ValidationPipe,
  Get,
  Req,
  SetMetadata
} from '@nestjs/common';
import { LoginUserDto, RegisterUserDto } from './dto/registerUserDto.dto';
import { AuthService } from './auth.service';
import { User } from '@prisma/client';
import { ApiTags } from '@nestjs/swagger';
import { Public } from './decorator/auth.decorator';
import { AuthGuard } from '@nestjs/passport';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { Request } from 'express';
@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}
  @Post('register')
  @Public()
  register(@Body() body: RegisterUserDto): Promise<User> {
    return this.authService.register(body);
  }
  @UseGuards(AuthGuard('local'))
  @Public()
  @Post('login')
  async login(@Req() req:Request) {
    return await this.authService.login(req.user);
  }
  @Post('refresh_token')
  @Public()
  refreshToken(@Body() { refresh_token }): Promise<any> {
    return this.authService.refreshToken(refresh_token);
  }
}
