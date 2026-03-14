# 24. 监控与可观测性 (Monitoring & Observability)

在生产环境中使用 Claude Code，需要完善的监控和可观测性来确保性能和可靠性。

## 🎯 可观测性三大支柱

```
                    ┌─────────────────┐
                    │  可观测性平台    │
                    └────────┬────────┘
                             │
        ┌────────────────────┼────────────────────┐
        │                    │                    │
        ↓                    ↓                    ↓
┌───────────┐         ┌───────────┐         ┌───────────┐
│  Metrics  │         │   Logs    │         │  Traces   │
│  指标     │         │   日志    │         │  链路追踪  │
└───────────┘         └───────────┘         └───────────┘
        │                    │                    │
        ↓                    ↓                    ↓
   [数值监控]          [事件记录]          [请求追踪]
   - CPU/内存          - 错误日志          - 调用链
   - 响应时间          - 审计日志          - 依赖关系
   - 成功率            - 调试日志          - 性能瓶颈
```

## 📊 指标监控 (Metrics)

### 1. OpenTelemetry 集成

#### 安装和配置

```bash
# 安装 OpenTelemetry
npm install @opentelemetry/api
npm install @opentelemetry/sdk-node
npm install @opentelemetry/exporter-metrics-otlp-grpc
```

#### 配置文件

```typescript
// telemetry.js
const { MeterProvider } = require('@opentelemetry/sdk-metrics');
const { OTLPGrpcMetricExporter } = require('@opentelemetry/exporter-metrics-otlp-grpc');

const metricExporter = new OTLPGrpcMetricExporter({
  url: process.env.OTEL_EXPORTER_OTLP_ENDPOINT || 'http://localhost:4317',
});

const meterProvider = new MeterProvider({
  exporter: metricExporter,
  interval: 10000, // 10 秒
});

meterProvider.start();

// 创建指标 meter
const meter = meterProvider.getMeter('claude-code-metrics');

module.exports = { meter };
```

### 2. Claude Code 专用指标

#### 命令执行指标

```typescript
const { meter } = require('./telemetry');

// 命令执行计数器
const commandCounter = meter.createCounter('claude.commands.total', {
  description: 'Total Claude Code commands executed',
});

// 命令执行时间
const commandDuration = meter.createHistogram('claude.commands.duration', {
  description: 'Claude Code command execution duration',
  unit: 'ms',
});

// 命令成功率
const commandSuccess = meter.createCounter('claude.commands.success', {
  description: 'Successful Claude Code commands',
});

// 使用示例
async function trackCommand(command, fn) {
  const startTime = Date.now();

  try {
    await fn();
    commandSuccess.add(1, { command });
    commandCounter.add(1, { command, status: 'success' });
  } catch (error) {
    commandCounter.add(1, { command, status: 'error' });
    throw error;
  } finally {
    const duration = Date.now() - startTime;
    commandDuration.record(duration, { command });
  }
}
```

#### 文件操作指标

```typescript
// 文件读取计数
const fileReadCounter = meter.createCounter('claude.files.read', {
  description: 'Total file reads',
});

// 文件写入计数
const fileWriteCounter = meter.createCounter('claude.files.write', {
  description: 'Total file writes',
});

// 文件大小分布
const fileSizeHistogram = meter.createHistogram('claude.files.size', {
  description: 'File size distribution',
  unit: 'bytes',
});

// 使用示例
function trackFileOperation(operation, filePath, size) {
  const ext = path.extname(filePath);

  if (operation === 'read') {
    fileReadCounter.add(1, { extension: ext });
  } else if (operation === 'write') {
    fileWriteCounter.add(1, { extension: ext });
    fileSizeHistogram.record(size, { extension: ext });
  }
}
```

#### Token 使用指标

```typescript
// Token 消耗计数
const tokenCounter = meter.createCounter('claude.tokens.total', {
  description: 'Total tokens consumed',
});

// Token 成本
const tokenCost = meter.createCounter('claude.tokens.cost', {
  description: 'Token cost in USD',
});

// 上下文长度
const contextLength = meter.createGauge('claude.context.length', {
  description: 'Current context length',
});

// 使用示例
function trackTokenUsage(inputTokens, outputTokens, model) {
  const totalPrice = calculatePrice(inputTokens, outputTokens, model);

  tokenCounter.add(inputTokens + outputTokens, {
    model,
    type: 'total'
  });

  tokenCounter.add(inputTokens, { model, type: 'input' });
  tokenCounter.add(outputTokens, { model, type: 'output' });

  tokenCost.add(totalPrice, { model });
}
```

### 3. 自定义业务指标

```typescript
// Skill 执行统计
const skillExecution = meter.createCounter('claude.skills.executions', {
  description: 'Skill execution count',
});

// SubAgent 统计
const subagentCounter = meter.createCounter('claude.subagents.created', {
  description: 'Total SubAgents created',
});

// 代码审查发现的问题
const codeReviewIssues = meter.createCounter('claude.code_review.issues', {
  description: 'Issues found during code review',
});

// 使用示例
function trackSkillExecution(skillName, success, duration) {
  skillExecution.add(1, {
    skill: skillName,
    status: success ? 'success' : 'failure'
  });
}

function trackCodeReview(severity, category) {
  codeReviewIssues.add(1, {
    severity, // 'high', 'medium', 'low'
    category  // 'security', 'performance', 'style'
  });
}
```

## 📝 日志管理 (Logging)

### 1. 结构化日志

#### Winston 配置

```javascript
// logger.js
const winston = require('winston');

const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    // 控制台输出
    new winston.transports.Console({
      format: winston.format.simple()
    }),
    // 文件输出
    new winston.transports.File({
      filename: 'logs/error.log',
      level: 'error'
    }),
    new winston.transports.File({
      filename: 'logs/combined.log'
    })
  ]
});

module.exports = logger;
```

#### Claude Code 事件日志

```javascript
const logger = require('./logger');

// 记录命令执行
function logCommandExecution(command, result) {
  logger.info({
    event: 'command_execution',
    command: command.name,
    args: command.args,
    duration: result.duration,
    status: result.status,
    timestamp: new Date().toISOString()
  });
}

// 记录文件操作
function logFileOperation(operation, filePath, result) {
  logger.info({
    event: 'file_operation',
    operation, // 'read', 'write', 'delete'
    path: filePath,
    size: result.size,
    status: result.status,
    timestamp: new Date().toISOString()
  });
}

// 记录错误
function logError(error, context) {
  logger.error({
    event: 'error',
    message: error.message,
    stack: error.stack,
    context,
    timestamp: new Date().toISOString()
  });
}
```

### 2. 审计日志

```javascript
// audit-logger.js
const fs = require('fs');
const path = require('path');

class AuditLogger {
  constructor(logDir = 'logs/audit') {
    this.logDir = logDir;
    this.ensureLogDir();
  }

  ensureLogDir() {
    if (!fs.existsSync(this.logDir)) {
      fs.mkdirSync(this.logDir, { recursive: true });
    }
  }

  log(action, user, details) {
    const logEntry = {
      timestamp: new Date().toISOString(),
      action,
      user: user || 'system',
      details,
      sessionId: details.sessionId || 'N/A'
    };

    const logFile = path.join(
      this.logDir,
      `audit-${new Date().toISOString().split('T')[0]}.log`
    );

    fs.appendFileSync(logFile, JSON.stringify(logEntry) + '\n');
  }
}

module.exports = new AuditLogger();

// 使用示例
const auditLogger = require('./audit-logger');

// 审计文件访问
auditLogger.log('file_access', 'user@example.com', {
  filePath: '/path/to/secret.js',
  operation: 'read',
  sessionId: 'session-123'
});

// 审计权限变更
auditLogger.log('permission_change', 'admin@example.com', {
  targetUser: 'user@example.com',
  oldPermission: 'read',
  newPermission: 'write',
  sessionId: 'session-456'
});
```

## 🔍 链路追踪 (Tracing)

### 1. 分布���追踪配置

```typescript
// tracing.js
const { NodeTracerProvider } = require('@opentelemetry/sdk-trace-node');
const { Resource } = require('@opentelemetry/resources');
const { SemanticResourceAttributes } = require('@opentelemetry/semantic-conventions');
const { OTLPTraceExporter } = require('@opentelemetry/exporter-trace-otlp-grpc');
const { registerInstrumentations } = require('@opentelemetry/instrumentation');

const provider = new NodeTracerProvider({
  resource: new Resource({
    [SemanticResourceAttributes.SERVICE_NAME]: 'claude-code',
    [SemanticResourceAttributes.SERVICE_VERSION]: '1.0.0',
  }),
});

const exporter = new OTLPTraceExporter({
  url: process.env.OTEL_EXPORTER_OTLP_ENDPOINT || 'http://localhost:4317',
});

provider.addSpanProcessor(new SimpleSpanProcessor(exporter));
provider.register();

// 自动检测常见库
registerInstrumentations({
  instrumentations: [
    // 添加需要的检测库
  ],
});

module.exports = provider;
```

### 2. Claude Code 追踪

```typescript
const { trace } = require('@opentelemetry/api');

// 追踪命令执行
async function tracedCommand(command, args) {
  const tracer = trace.getTracer('claude-code');
  const span = tracer.startSpan('command_execution', {
    attributes: {
      'command.name': command,
      'command.args': JSON.stringify(args)
    }
  });

  try {
    const result = await executeCommand(command, args);
    span.setStatus({ code: SpanStatusCode.OK });
    return result;
  } catch (error) {
    span.recordException(error);
    span.setStatus({ code: SpanStatusCode.ERROR, message: error.message });
    throw error;
  } finally {
    span.end();
  }
}

// 追踪文件操作
function tracedFileRead(filePath) {
  const tracer = trace.getTracer('claude-code');
  const span = tracer.startSpan('file_read', {
    attributes: {
      'file.path': filePath
    }
  });

  try {
    const content = fs.readFileSync(filePath, 'utf-8');
    span.setAttribute('file.size', content.length);
    return content;
  } catch (error) {
    span.recordException(error);
    throw error;
  } finally {
    span.end();
  }
}
```

### 3. 跨服务追踪

```typescript
// 追踪 SubAgent 创建
async function createSubAgent(name, task) {
  const tracer = trace.getTracer('claude-code');
  const span = tracer.startSpan('subagent_creation', {
    attributes: {
      'subagent.name': name,
      'task.type': task.type
    }
  });

  try {
    // 传递 trace context 到 SubAgent
    const carrier = {};
    propagator.inject(trace.setSpan(context.active(), span), carrier);

    const subagent = await spawnSubAgent(name, task, carrier);
    span.setAttribute('subagent.id', subagent.id);

    return subagent;
  } catch (error) {
    span.recordException(error);
    throw error;
  } finally {
    span.end();
  }
}
```

## 📈 监控仪表板

### 1. Grafana 仪表板

```json
{
  "dashboard": {
    "title": "Claude Code Monitoring",
    "panels": [
      {
        "title": "Commands Per Minute",
        "targets": [
          {
            "expr": "rate(claude_commands_total[1m])"
          }
        ]
      },
      {
        "title": "Average Response Time",
        "targets": [
          {
            "expr": "histogram_quantile(0.95, claude_commands_duration_bucket)"
          }
        ]
      },
      {
        "title": "Token Consumption",
        "targets": [
          {
            "expr": "sum(rate(claude_tokens_total[5m])) by (model)"
          }
        ]
      },
      {
        "title": "Error Rate",
        "targets": [
          {
            "expr": "rate(claude_commands_total{status=\"error\"}[5m]) / rate(claude_commands_total[5m])"
          }
        ]
      }
    ]
  }
}
```

### 2. 关键指标

```typescript
// 监控关键指标
const metrics = {
  // 性能指标
  performance: {
    avgResponseTime: 'claude.commands.duration.avg',
    p95ResponseTime: 'claude.commands.duration.p95',
    p99ResponseTime: 'claude.commands.duration.p99',
    throughput: 'rate(claude.commands.total[1m])'
  },

  // 可靠性指标
  reliability: {
    successRate: 'claude.commands.success / claude.commands.total',
    errorRate: 'rate(claude.errors[5m])',
    availability: 'up{job=\"claude-code\"}'
  },

  // 资源使用
  resources: {
    memoryUsage: 'process_resident_memory_bytes{job=\"claude-code\"}',
    cpuUsage: 'rate(process_cpu_seconds_total[1m]){job=\"claude-code\"}',
    fileHandles: 'process_open_fds{job=\"claude-code\"}'
  },

  // 业务指标
  business: {
    dailyActiveUsers: 'count_distinct(user) over 1d',
    topCommands: 'topk(10, sum(claude_commands_total) by (command))',
    skillUsage: 'sum(claude_skills_executions) by (skill)'
  }
};
```

## 🚨 告警配置

### 1. Prometheus 告警规则

```yaml
# alerts.yml
groups:
  - name: claude_code_alerts
    interval: 30s
    rules:
      # 高错误率告警
      - alert: HighErrorRate
        expr: |
          rate(claude_commands_total{status="error"}[5m])
          / rate(claude_commands_total[5m]) > 0.05
        for: 5m
        labels:
          severity: warning
        annotations:
          summary: "Claude Code error rate is high"
          description: "Error rate is {{ $value | humanizePercentage }}"

      # 响应时间告警
      - alert: SlowResponseTime
        expr: |
          histogram_quantile(0.95, claude_commands_duration_bucket) > 5000
        for: 5m
        labels:
          severity: warning
        annotations:
          summary: "Claude Code response time is slow"
          description: "P95 response time is {{ $value }}ms"

      # Token 使用异常
      - alert: HighTokenUsage
        expr: |
          rate(claude_tokens_total[1h]) > 10000
        for: 10m
        labels:
          severity: info
        annotations:
          summary: "High token usage detected"
          description: "Consuming {{ $value }} tokens/hour"
```

### 2. 自定义告警

```typescript
// alerting.js
class AlertManager {
  constructor(webhookUrl) {
    this.webhookUrl = webhookUrl;
  }

  async sendAlert(alert) {
    const message = {
      title: alert.title,
      severity: alert.severity,
      message: alert.message,
      timestamp: new Date().toISOString(),
      metadata: alert.metadata
    };

    await fetch(this.webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(message)
    });
  }

  async checkMetrics(metrics) {
    // 检查错误率
    if (metrics.errorRate > 0.05) {
      await this.sendAlert({
        title: 'High Error Rate',
        severity: 'warning',
        message: `Error rate is ${metrics.errorRate}`,
        metadata: { errorRate: metrics.errorRate }
      });
    }

    // 检查响应时间
    if (metrics.p95ResponseTime > 5000) {
      await this.sendAlert({
        title: 'Slow Response Time',
        severity: 'warning',
        message: `P95 response time is ${metrics.p95ResponseTime}ms`,
        metadata: { responseTime: metrics.p95ResponseTime }
      });
    }
  }
}
```

## 📊 性能分析

### 1. Profiling 集成

```typescript
// profiling.js
const inspector = require('inspector');
const fs = require('fs');

class Profiler {
  constructor() {
    this.session = new inspector.Session();
    this.session.connect();
  }

  startProfiling() {
    this.session.post('Profiler.enable');
    this.session.post('Profiler.start');
  }

  stopProfiling(filename) {
    this.session.post('Profiler.stop', (err, profile) => {
      if (!err) {
        fs.writeFileSync(filename, JSON.stringify(profile));
      }
    });
  }
}

// 使用示例
const profiler = new Profiler();

// 开始性能分析
profiler.startProfiling();

// ... 运行一段时间 ...

// 停止并保存
profiler.stopProfiling('profile-' + Date.now() + '.cpuprofile');
```

### 2. 性能瓶颈识别

```typescript
// 性能监控
class PerformanceMonitor {
  constructor() {
    this.metrics = new Map();
  }

  startOperation(name) {
    this.metrics.set(name, {
      startTime: Date.now(),
      startMemory: process.memoryUsage()
    });
  }

  endOperation(name) {
    const metric = this.metrics.get(name);
    if (!metric) return;

    const duration = Date.now() - metric.startTime;
    const memoryDelta = process.memoryUsage().heapUsed - metric.startMemory.heapUsed;

    console.log(`[Performance] ${name}:`);
    console.log(`  Duration: ${duration}ms`);
    console.log(`  Memory Delta: ${(memoryDelta / 1024 / 1024).toFixed(2)} MB`);

    this.metrics.delete(name);

    return { duration, memoryDelta };
  }
}
```

## 🎯 最佳实践

### ✅ DO - 应该做的

1. **采样合理**
   ```typescript
   // 不需要追踪所有请求
   if (Math.random() < 0.1) { // 10% 采样
     // 追踪这个请求
   }
   ```

2. **使用合适的日志级别**
   ```
   ERROR: 错误和异常
   WARN: 警告信息
   INFO: 重要事件
   DEBUG: 调试信息
   ```

3. **保护敏感信息**
   ```typescript
   // 不要记录敏感数据
   logger.info({
     command: sanitize(command), // 移除密码、token 等
     timestamp: Date.now()
   });
   ```

4. **定期审查指标**
   ```
   每周审查关键指标
   识别趋势和异常
   ```

### ❌ DON'T - 避免做的

1. ❌ 记录过多日志
2. ❌ 在生产环境启用 DEBUG 级别
3. ❌ ���踪每个请求（采样）
4. ❌ 忽略告警

## 📚 下一步

了解监控后，继续学习 [25. CI/CD 集成](./25-ci-cd-integration.md)

## 🔗 相关资源

- [OpenTelemetry 文档](https://opentelemetry.io/docs/)
- [Prometheus 最佳实践](https://prometheus.io/docs/practices/)
- [Grafana 仪表板](https://grafana.com/docs/grafana/latest/dashboards/)
