import { Module } from '@nestjs/common';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { HealthModule } from './health/health.module.js';
import { PrometheusController } from './prometheus.controller.js';
import { PrometheusService } from './prometheus.service.js';

@Module({
  imports: [HealthModule],
  controllers: [AppController, PrometheusController],
  providers: [AppService, PrometheusService],
})
export class AppModule {}
