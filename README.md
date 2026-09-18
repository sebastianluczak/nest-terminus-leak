= NestJS 12.x with Terminus 12.x leaks memory

This is the smallest reproducible repository showing the issue.

1. Start NestJS with `tsc -p tsconfig.build.json && npm run start:prod`
2. Observe logs in a console, fire another console
3. In new console, while app is running, exec `bash health_check.sh`
4. Observe logs as `heapUsed` grows

If you plug in grafana and prom-client, you'll see the issue more clearly, similar to this pattern:

```
|                             /^---  
|                       /^---/     ^ this repeats to infinity
|           __    /^---/
|          /  \__/
|   __/^--/
|--/
```

Result is predictable - heap exhaustion, app becomes unstable after some time.

The issue is suspected to be in:

```
    async getHttpService() {
        const { HttpService } = await loadPackage('@nestjs/axios');
        return new HttpService();
    }
```