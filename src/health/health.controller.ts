
import { Controller, Get, Logger } from '@nestjs/common';
import { HealthCheckService, HealthCheck, MemoryHealthIndicator } from '@nestjs/terminus';

@Controller('health')
export class HealthController {
  constructor(
    private health: HealthCheckService,
    private mem: MemoryHealthIndicator
  ) {}

  private memoryStats = () => {
    const memoryUsage = process.memoryUsage();
    return {
      rss: memoryUsage.rss,
      heapTotal: memoryUsage.heapTotal,
      heapUsed: memoryUsage.heapUsed,
      external: memoryUsage.external,
    };
  };

  @Get()
  @HealthCheck()
  check() {
    new Logger('HealthController').log(`Memory stats: ${JSON.stringify(this.memoryStats())}`);
    return this.health.check([
      () => this.mem.checkHeap('memory_heap', 150 * 1024 * 1024),
      () => this.mem.checkRSS('memory_rss', 150 * 1024 * 1024),
    ]);
  }
}
