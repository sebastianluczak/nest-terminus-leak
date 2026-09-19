# NestJS 12.x with Terminus 12.x leaks(?) memory

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

To observe in real time, start Prometheus:

```
docker run \
 --name prometheus \
  -p 9090:9090 \
  -v $(pwd)/prometheus.yml:/etc/prometheus/prometheus.yml \
  --rm \
  --network=host \
  prom/prometheus
```

Then, start Grafana.

```
docker run \
  --name grafana \
  -p 3001:3000 --rm --network=host \
  grafana/grafana
```

Go to http://localhost:3000/login

Credentials are: admin/admin

Add proper source for your Prometheus - it's localhost:9090.

Add dashboard 11956 to grafana via import.

Fire `bash health_check.sh`. Observe heap in Grafana for at least 30 minutes, you should notice the pattern.

---

The issue is suspected to be in:

```
    async getHttpService() {
        const { HttpService } = await loadPackage('@nestjs/axios');
        return new HttpService();
    }
```

But I don't know yet.