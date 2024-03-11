import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
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
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
  await app.listen(8080);
}
bootstrap();
