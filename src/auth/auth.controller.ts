import {
  Body,
  Controller,
  Post,
  UseGuards,
  UsePipes,
  ValidationPipe,
  Get,
  Req,
  SetMetadata,
  Put,
} from '@nestjs/common';
import { LoginUserDto, RegisterUserDto } from './dto/registerUserDto.dto';
import { AuthService } from './auth.service';
import { User } from '@prisma/client';
import { ApiBody, ApiTags } from '@nestjs/swagger';
import { Public } from './decorator/auth.decorator';
import { AuthGuard } from '@nestjs/passport';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { Request } from 'express';
import {
  AuthPayLoadDto,
  ChangePasswordDto,
  forgetPasswordDto,
} from './dto/auth.dto';
import { getUser } from 'src/user/decorator/user.decorator';
import { LocalAuthGuard } from './guards/local.guard';
@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}
  @Public()
  @Post('forgetPassword')
  async forgetPassword(@Body() data: forgetPasswordDto): Promise<boolean> {
    return await this.authService.forgetPassword(data);
  }
  @Post('register')
  @Public()
  register(@Body() body: RegisterUserDto): Promise<User> {
    return this.authService.register(body);
  }
  @UseGuards(LocalAuthGuard)
  @ApiBody({ type: AuthPayLoadDto })
  @Public()
  @Post('login')
  async login(@getUser() user) {
    return await this.authService.login(user);
  }
  @Post('refresh_token')
  @Public()
  async refreshToken(@Body() { refresh_token }): Promise<any> {
    return await this.authService.refreshToken(refresh_token);
  }
  @Public()
  @Put('changePassword')
  async changePassword(@Body() data: ChangePasswordDto) {
    return await this.authService.changePassword(data);
  }
}
