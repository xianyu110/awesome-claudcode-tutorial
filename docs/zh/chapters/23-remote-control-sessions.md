# 23. 远程控制与会话 (Remote Control & Sessions)

Claude Code 支持远程会话管理，让你可以在多设备间无缝切换工作。

## 🌐 远程控制基础

### 1. 什么是远程控制？

```
本地机器                      云端/远程机器
    │                              │
    ��  Claude Code CLI             │
    │  (Terminal)                  │
    │         │                    │
    │         │ SSH/远程协议        │
    │         ↓                    │
    │  ┌──────────────────┐        │
    │  │  Remote Session  │        │
    │  │  Manager         │        │
    │  └──────────────────┘        │
    │         │                    │
    │         ↓                    │
    │  在远程机器执行命令           │
    │  管理远程会话                 │
```

### 2. 会话类型

```
┌─────────────────────────────────────┐
│       Claude Code 会话类型           │
├─────────────────────────────────────┤
│                                     │
│  [1] 本地会话                        │
│      → 直接在本地运行                │
│      → 数据存储在本地                │
│                                     │
│  [2] SSH 远程会话                    │
│      → 通过 SSH 连接远程             │
│      → 在远程执行命令                │
│                                     │
│  [3] 云会话 (实验性)                 │
│      → 云端持久化                    │
│      → 多设备同步                    │
│                                     │
└─────────────────────────────────────┘
```

## 🔌 SSH 远程会话

### 1. 基础 SSH 远程使用

#### 连接到远程服务器

```bash
# SSH 连接并使用 Claude Code
ssh user@remote-server

# 在远程服务器上
cd /path/to/project
claude-code

# Claude Code 现在在远程服务器上运行
# 所有操作都在远程执行
```

#### 实战示例

```
本地机器:
你: 我需要查看远程服务器的日志

Claude:
→ 启动 SSH 连接
→ 在远程执行命令

[远程服务器]
→ tail -f /var/log/app.log

→ 输出流式传输回本地

✓ 实时查看远程日志
```

### 2. SSH 配置优化

#### SSH Config 设置

```bash
# ~/.ssh/config

Host production
    HostName prod.example.com
    User deploy
    IdentityFile ~/.ssh/prod_key
    ServerAliveInterval 60
    ServerAliveCountMax 3

Host staging
    HostName staging.example.com
    User deploy
    IdentityFile ~/.ssh/staging_key
```

#### 使用配置连接

```
你: 连接到 production 服务器

Claude:
→ 使用 production 配置
→ 建立 SSH 连接
→ 进入项目目录

✓ 已连接到 production
当前目录: /var/www/app
```

### 3. 远程命令执行

#### 批量远程操作

```
你: 在所有服务器上运行部署

Claude:
[服务器 1 - production]
→ SSH production
→ git pull
→ npm install
→ npm run build
→ pm2 restart all

[服务器 2 - staging]
→ SSH staging
→ git pull
→ npm install
→ npm run build
→ pm2 restart all

✓ 所有服务器部署完成
```

#### 并行远程执行

```
你: 同时在多个服务器上检查状态

Claude:
→ 启动多个并行连接

[Server 1] ✓ 服务运行正常
[Server 2] ✓ 服务运行正常
[Server 3] ⚠️ CPU 使用率 85%
[Server 4] ✓ 服务运行正常

汇总:
- 正常: 3 台
- 警告: 1 台
- 错误: 0 台
```

## ☁️ 云会话 (实验性)

### 1. 云会话概念

```
设备 A (办公室)              云端存储                设备 B (家中)
     │                        │                        │
     │   开始会话              │                        │
     │ ─────────────────────→ │                        │
     │                        │                        │
     │   保存上下文            │                        │
     │ ─────────────────────→ │                        │
     │                        │                        │
     │                        │    恢复会话            │
     │                        │ ←──────────────────── │
     │                        │                        │
     │                        │   同步上下文           │
     │                        │ ─────────────────────→ │
     │                        │                        │
     │                        │                        │
✓ 在设备 B 继续工作
```

### 2. 启用云会话

#### 配置设置

```json
{
  "cloudSync": {
    "enabled": true,
    "provider": "anthropic",
    "settings": {
      "autoSync": true,
      "syncInterval": 60,
      "includeHistory": true,
      "maxSessions": 10
    }
  }
}
```

#### 使用云会话

```
你: 启用云会话同步

Claude:
→ 初始化云同步
→ 加载会话历史
→ 设置自动同步

✓ 云会话已启��
会话 ID: cloud-session-abc123
同步状态: 活跃

[在另一台设备...]

你: 恢复会话 cloud-session-abc123

Claude:
→ 从云端恢复
→ 加载完整上下文
→ 继续工作

✓ 会话已恢复
上一个任务: 实现用户认证
进度: 60%
```

### 3. 会话管理

#### 列出所有会话

```
你: 显示所有云会话

Claude:
📋 云会话列表
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

会话 ID              设备              最后活跃
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
session-001      MacBook Pro       2分钟前
session-002      iMac              1小时前
session-003      Windows PC        昨天
session-004      Ubuntu Server     2天前

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

活跃会话: session-001
总使用时间: 3h 45m
```

#### 会话共享

```
你: 与团队共享会话

Claude:
→ 生成共享链接
→ 设置权限
→ 发送邀请

✓ 会话已共享
链接: https://code.claude.com/s/abc123
权限: 只读
访问者: alice@example.com, bob@example.com

[团队成员...]
Alice: 已加入会话
Bob: 已加入会话
```

## 🔄 会话恢复

### 1. 本地会话恢复

#### 查看历史会话

```
你: 显示所有历史会话

Claude:
📋 本地会话历史
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

时间              项目              任务
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
今天 14:30      web-app           实现 API
今天 11:15      web-app           修复 bug
昨天 16:45      backend           数据库迁移
昨天 09:20      docs              更新文档

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

#### 恢复特定会话

```
你: 恢复昨天 16:45 的会话

Claude:
→ 加载会话数据
→ 恢复文件上下文
→ 恢复对话历史
→ 恢复任务状态

✓ 会话已恢复
项目: backend
任务: 数据库迁移
进度: 已完成迁移脚本，待测试
```

### 2. 会话检查点

#### 创建检查点

```
你: 在这个关键点创建检查点

Claude:
→ 保存当前状态
→ 记录文件快照
→ 保存上下文

✓ 检查点已创建
名称: checkpoint-api-complete
时间: 2024-03-15 14:30:45
包含:
- 12 个修改的文件
- 完整对话历史
- 任务进度记录
```

#### 恢复到检查点

```
你: 恢复到 checkpoint-api-complete

Claude:
→ 恢复文件状态
→ 恢复对话历史
→ 恢复任务上下文

⚠️ 警告: 将丢失当前未保存的更改
是否继续? [y/N]: y

✓ 已恢复到检查点
```

## 🌍 多设备协作

### 1. 设备间切换

```
工作流程:

[设备 A - 办公室]
你: 开始实现新功能
Claude: ✓ 开始工作...

[下班]

[设备 B - 家里]
你: 继续实现新功能
Claude:
→ 从云端恢复
→ 加载完整上下文
→ 显示当前进度

当前任务: 实现用户认证
完成: 60%
下一步: 实现 OAuth 流程
```

### 2. 实时协作

#### 共享编程会话

```
你: 启动协作会话

Claude:
→ 创建共享会话
→ 生成邀请码

✓ 协作会话已创建
邀请码: ABC-123-XYZ
链接: https://code.claude.com/collab/ABC-123-XYZ

[团队成员加入...]

Alice: 已加入
Bob: 已加入

[实时协作]
Alice: 我来处理前端部分
Bob: 我来实现后端 API
你: 我来写测试

Claude:
→ 协调任务分配
→ 合并代码变更
→ 解决冲突
```

### 3. 代码审查会话

```
你: 创建代码审查会话

Claude:
→ 加载 PR 变更
→ 设置审查模式
→ 生成审查报告

📋 PR #123: Add user authentication
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

[邀请团队成员...]

Alice: 已加入 - 关注安全方面
Bob: 已加入 - 关注性能方面

[讨论...]

Alice: 这里的密码验证应该使用 bcrypt
Bob: 同意，而且应该���加速率限制
你: 好的，我来修改

Claude:
→ 记录反馈
→ 创建修复任务
→ 更新 PR
```

## 🔒 安全性

### 1. 远程连接安全

```bash
# 使用 SSH 密钥认证
ssh-keygen -t ed25519 -C "claude-code@remote"

# 复制公钥到远程
ssh-copy-id user@remote-server

# 使用密钥而非密码
# 更安全且可自动化
```

### 2. 会话加密

```
云会话加密:
- 传输中: TLS 1.3
- 存储时: AES-256
- 端到端加密: 可选
```

### 3. 访问控制

```json
{
  "sessionSharing": {
    "requireApproval": true,
    "allowedUsers": [
      "alice@example.com",
      "bob@example.com"
    ],
    "permissions": {
      "readOnly": false,
      "allowTerminal": true,
      "allowFileAccess": true
    }
  }
}
```

## 📊 会话分析

### 1. 使用统计

```
你: 显示会话统计

Claude:
📊 会话使用统计
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

时间范围: 最近 7 天

总会话数: 45
总时长: 12h 30m
平均时长: 16m/会话

最常用功能:
- 代码审查: 35%
- Bug 修复: 25%
- 新功能开发: 20%
- 文档编写: 10%
- 其他: 10%

设备分布:
- MacBook Pro: 60%
- iMac: 25%
- Windows: 15%

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

### 2. 性能指标

```
你: 分析会话性能

Claude:
⚡ 性能指标
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

平均响应时间: 1.2s
最快响应: 0.3s
最慢响应: 5.8s

命令执行成功率: 98.5%
失败命令:
- npm install (网络问题): 10 次
- docker build (超时): 3 次

建议:
- 使用 npm 镜像加速
- 增加 docker build 超时时间

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

## 🎯 最佳实践

### ✅ DO - 应该做的

1. **定期备份重要会话**
   ```bash
   # 导出会话数据
   claude-code session export --id session-001
   ```

2. **使用检查点**
   ```
   在关键点创建检查点
   便于快速回滚
   ```

3. **保护远程连接**
   ```bash
   # 使用 SSH 密钥
   # 启用防火墙
   # 限制访问 IP
   ```

4. **监控会话活动**
   ```
   定期检查活跃会话
   识别异常活动
   ```

### ❌ DON'T - 避免做的

1. ❌ 在公���网络传输敏感数据
2. ❌ 共享会话链接到公共渠道
3. ❌ 不更新会话权限
4. ❌ 忽略会话过期时间

## 📚 下一步

了解远程控制后，继续学习 [24. 监控与可观测性](./24-monitoring-observability.md)

## 🔗 相关资源

- [远程控制指南](https://code.claude.com/docs/zh-CN/remote-control)
- [会话管理](https://code.claude.com/docs/zh-CN/sessions)
- [云同步](https://code.claude.com/docs/zh-CN/cloud-sync)
