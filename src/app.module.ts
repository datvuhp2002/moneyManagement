import { MiddlewareConsumer, Module, RequestMethod, ValidationPipe } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { PrismaService } from './prisma.servcie';
import { APP_GUARD, APP_PIPE } from '@nestjs/core';
import { RolesGuard } from './auth/roles.guard';
import { ConfigModule } from '@nestjs/config';
import { AuthGuard } from './auth/auth.guard';

@Module({
  imports: [AuthModule, UserModule,ConfigModule.forRoot() ],
  controllers: [AppController],
  providers: [AppService,
    {
      provide: APP_GUARD,
      useClass: AuthGuard
    },
    {
      provide: APP_GUARD,
      useClass: RolesGuard
    },
    {
      provide:APP_PIPE,
      useClass: ValidationPipe,
    },
    PrismaService],
})
export class AppModule {

}
