import { ConfigService } from '@nestjs/config';
const configService = new ConfigService();
export const jwtConstants = {
  secret: configService.get<string>('SECRET_ACCESS_TOKEN'),
  expIn: configService.get<string>('EXP_IN_ACCESS_TOKEN'),
};
