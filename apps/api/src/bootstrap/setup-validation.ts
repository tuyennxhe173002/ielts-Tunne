import { ValidationPipe, type INestApplication } from '@nestjs/common';

export function setupValidation(app: INestApplication) {
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
}
