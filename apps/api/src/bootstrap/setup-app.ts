import type { INestApplication } from '@nestjs/common';
import { setupCors } from './setup-cors';
import { setupValidation } from './setup-validation';
import { setupSecurity } from './setup-security';

export function setupApp(app: INestApplication) {
  app.setGlobalPrefix('api/v1');
  setupValidation(app);
  setupSecurity(app);
  setupCors(app);
}
