import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { PrismaService } from 'src/prisma.servcie';
import { PrismaClient } from '@prisma/client';
import { ConfigService } from '@nestjs/config';
import { WalletService } from 'src/wallet/wallet.service';

@Module({
  controllers: [UserController],
  providers: [UserService, PrismaService, ConfigService,WalletService],
})
export class UserModule {}
