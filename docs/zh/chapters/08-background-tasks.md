# 08. 后台任务管理 (Background Tasks)


> 📷 **截图说明**：本章配图含终端风格图。标注「真实输出」的来自本机 Claude Code 2.1.310（已打码）；标注「示意图」的未能非交互复现。GUI（VS Code/JetBrains/Desktop）待补。

后台任务让你能够启动长时间运行的操作，然后在完成时检查结果，而不阻塞你的工作流。

## 🎯 什么是后台任务？

### 核心概念

```
前台任务（默认）：
你: 运行测试
→ [等待测试完成...]
→ [5分钟后]
✓ 测试完成

后台任务：
你: 运行测试（后台）
→ [立即返回]
Task started: task_001
[你可以继续工作...]

[稍后]
你: 检查任务状态
✓ task_001 完成！
```

## 🚀 启动后台任务

![后台任务启动示意](/images/screenshots/08-background.png)

> 📷 示意图

![/tasks 示意](/images/screenshots/08-tasks.png)

> 📷 示意图

### 自动后台执行

Claude Code 会自动判断哪些任务应该后台运行：

```bash
# 长时间运行的命令会自动后台化
npm test
npm run build
npm install
```

### 显式后台请求

```
你: 在后台运行这个任务

Claude:
→ 启动后台任务
Task ID: task_001
```

## 📋 查看后台任务

```
你: 显示所有后台任务

Claude:
📋 后台任务列表
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Task ID    命令              状态    运行时间
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
task_001   npm test         运行中   2m 15s
task_002   npm run build    完成    5m 30s
task_003   python train.py  运行中   12m 45s

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

## 💻 实战场景

### 场景 1: 并行测试和构建

```
你: 同时运行测试和构建

Claude:
→ npm test & [task_001]
→ npm run build & [task_002]

✓ 已启动 2 个后台任务

[你可以继续其他工作...]

你: 检查任务状态

Claude:
task_001 (npm test): ✅ 完成 (5m 15s)
task_002 (npm run build): ✅ 完成 (5m 30s)

✓ 所有任务完成！
```

### 场景 2: 长时间训练

```
你: 启动模型训练，需要几小时

Claude:
→ python train.py & [task_ml_001]

✓ 训练已在后台启动
日志文件: logs/training.log

[训练在后台运行...]

[2小时后...]

你: 训练完成了吗？

Claude:
task_ml_001: ✅ 完成
运行时间: 2h 15m 30s

查看结果：
→ 显示训练日志
→ 评估模型性能
```

### 场景 3: 批量操作

```
你: 安装所有微服务的依赖

Claude:
发现 5 个微服务

→ cd service-user && npm install & [task_001]
→ cd service-order && npm install & [task_002]
→ cd service-payment && npm install & [task_003]
→ cd service-notif && npm install & [task_004]
→ cd service-frontend && npm install & [task_005]

✓ 已并行启动 5 个安装任务

[10分钟后...]

你: 检查安装状态

Claude:
task_001: ✅ 完成
task_002: ✅ 完成
task_003: ✅ 完成
task_004: 🔄 85%
task_005: ✅ 完成
```

## 🎛️ 任务管理

### 获取任务输出

```
你: 显示 task_001 的输出

Claude:
→ 获取 task_001 的完整输出...

Test Suites: 1 passed, 1 total
Tests: 3 passed, 3 total
✅ 所有测试通过！
```

### 停止任务

```
你: 停止 task_003

Claude:
→ 发送终止信号到 task_003
✓ task_003 已停止
```

### 等待任务完成

```
你: 等待 task_001 完成

Claude:
⏳ 等待 task_001 完成...

[2分钟后...]

✓ task_001 完成！
结果：3 个测试通过
```

## 📊 任务日志

### 日志位置

```
~/.claude/tasks/
├── task_001.log
├── task_002.log
└── task_003.log
```

### 查看日志

```
你: 显示 task_001 的日志

Claude:
→ tail -n 50 ~/.claude/tasks/task_001.log

[2024-03-15 14:25:00] Task started
[2024-03-15 14:25:01] Running: npm test
[2024-03-15 14:30:15] Test complete
[2024-03-15 14:30:15] ✓ All tests passed
```


## 🔁 /loop 长时间运行任务

### 什么是 /loop？

`/loop` 让 Claude Code 在本地长时间运行一个任务，最多支持 **3 天**无人值守。

```
你: /loop 每 10 分钟检查构建状态，失败时自动修复

Claude:
→ 设置循环任务
→ 每 10 分钟自动执行
→ 检查构建 → 失败则分析修复 → 重新构建

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🔁 循环任务已启动
任务：检查构建状态
间隔：10 分钟
最长运行：3 天
状态：🔄 运行中
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

### /loop 使用示例

```bash
# 持续监控测试
/loop 每 5 分钟运行测试，失败时自动修复

# 持续监控部署
/loop 每分钟检查部署是否完成

# 持续检查错误日志
/loop 每 15 分钟检查错误日志，发现新错误时报告
```

## ⏰ /schedule 云端定时任务

### 什么是 /schedule？

`/schedule` 让你在云端设置定时任务，Claude 会在指定时间自动执行。

```
你: /schedule 每天早上 9 点检查依赖更新

Claude:
→ 创建定时任务
→ 每天 09:00 在云端自动执行
→ 检查 npm audit
→ 如果有更新，生成报告
```

### /schedule 使用示例

```bash
# 每天凌晨运行安全扫描
/schedule 每天 02:00 运行 npm audit 并报告漏洞

# 每周一早上生成周报
/schedule 每周一 09:00 总结上周的 git commit 统计
```

## 📊 后台任务类型对比

| 类型 | 运行位置 | 最长时间 | 适用场景 | 命令 |
|------|----------|----------|----------|------|
| Background Shell | 本地 | 当前会话 | 等待长时间命令 | 自动后台化 |
| /loop | 本地 | 3 天 | 持续监控和修复 | `/loop [间隔] [任务]` |
| /schedule | 云端 | 不限 | 定时执行 | `/schedule [时间] [任务]` |

## 🎯 最佳实践

### ✅ DO - 应该做的

1. **长时间任务使用后台模式**
   ```
   构建大型项目 → 后台
   运行完整测试 → 后台
   数据库迁移 → 后台
   ```

2. **监控任务状态**
   ```
   定期检查后台任务
   ```

3. **保存重要日志**
   ```
   将重要任务的日志保存到项目
   ```

4. **使用并行处理**
   ```
   独立任务可以并行运行
   ```

### ❌ DON'T - 避免做的

1. ❌ 启动太多并行任务
   ```
   限制并行数量，避免资源耗尽
   ```

2. ❌ 忘记检查结果
   ```
   任务完成后检查输出
   ```

3. ❌ 不监控失败的任务
   ```
   设置失败通知
   ```

## 📚 下一步

了解后台任务后，继续学习 [09. 版本回滚 (Rewind)](./09-rewind.md)

## 🔗 相关资源

- [后台任务文档](https://code.claude.com/docs/zh-CN/background-tasks)
- [进程管理](https://code.claude.com/docs/zh-CN/workflows#process-management)


---

> 💡 **API 推荐**：[https://tryallapi.com/](https://tryallapi.com/) - 一站式接入各种AI服务，注册即送0.2刀
