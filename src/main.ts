import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { join } from 'path';
import { NestExpressApplication } from '@nestjs/platform-express';
async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.enableCors();
  const config = new DocumentBuilder()
    .setTitle('MoneyManagement')
    .setDescription('List Api')
    .setVersion('1.0')
    .addTag('Auth')
    .addTag('Users')
    .addTag("Category")
    .addTag("Category-group")
    .addTag("Currency")
    .addTag("Monthly-budget")
    .addTag("Transaction")
    .addTag("Wallet")
    .addTag("Role")
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
  app.enableCors()
  app.useStaticAssets(join(__dirname, '../../uploads'))
  await app.listen(8080);
}
bootstrap();
