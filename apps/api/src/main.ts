import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { setupApp } from './bootstrap/setup-app';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { rawBody: true });
  setupApp(app);
  await app.listen(process.env.PORT ? Number(process.env.PORT) : 4000);
}

void bootstrap();
