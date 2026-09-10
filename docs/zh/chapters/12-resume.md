# 12. 恢复历史会话 (Resume)

Resume 功能让你能够恢复之前的对话会话，继续未完成的工作。

## 🎯 什么是 Resume？

### 核心概念

```
会话 A (昨天)
你: "开始重构认证模块"
Claude: "好的，我建议..."
[会话结束]

会话 B (今天)
你: resume session-a
Claude: "欢迎回来！我们正在重构认证模块，
      已经完成了登录部分，接下来是注册..."
```

### 为什么需要 Resume？

**场景 1：工作被打断**
```
你正在实现一个复杂功能，
需要下班/开会/处理其他事情，
下次继续时不想从头开始。
```

**场景 2：多任务切换**
```
同时在多个项目上工作，
需要快速切换上下文。
```

**场景 3：会话意外结束**
```
网络断开、终端关闭等，
希望恢复之前的状态。
```

## 📋 会话历史

### 会话存储位置

```
~/.claude/
├── sessions/
│   ├── session-2024-03-15-001.json
│   ├── session-2024-03-15-002.json
│   ├── session-2024-03-16-001.json
│   └── session-2024-03-16-002.json
└── current-session.json
```

### 会话包含的内容

```json
{
  "sessionId": "session-2024-03-15-001",
  "startTime": "2024-03-15T09:00:00Z",
  "endTime": "2024-03-15T17:30:00Z",
  "workingDirectory": "/Users/user/projects/my-app",
  "messages": [
    {
      "role": "user",
      "content": "帮我重构认证模块",
      "timestamp": "2024-03-15T09:05:00Z"
    },
    {
      "role": "assistant",
      "content": "好的，我建议...",
      "timestamp": "2024-03-15T09:05:10Z"
    }
  ],
  "context": {
    "filesRead": ["src/auth/login.js"],
    "filesModified": ["src/auth/index.js"],
    "commandsRun": ["npm test"]
  },
  "snapshots": [
    {
      "id": "snapshot_001",
      "timestamp": "2024-03-15T10:00:00Z"
    }
  ]
}
```

## 💻 实战示例

### 示例 1: 基本恢复

```
[昨天的会话]
你: 开始重构用户认证系统

Claude: 好的，我建议分三步：
1. 首先重构登录模块
2. 然后重构注册模块
3. 最后添加密码重置

→ 开始第一步...
✓ 已重构登录模块

[会话结束]

[今天继续]
你: resume

Claude: 欢迎回来！
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📋 上次会话摘要：
会话 ID: session-2024-03-14-001
时间: 2024-03-14 14:30 - 18:00
工作目录: /Users/user/projects/my-app

上次任务：重构用户认证系统

已完成：
✓ 登录模块重构

待完成：
⏳ 注册模块重构
⏳ 密码重置功能

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

要继续吗？

你: 是的，继续

Claude: → 继续第二步：重构注册模块
```

### 示例 2: 指定会话恢复

```
你: 列出所有会话

Claude:
📚 会话历史
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

ID                    时间              项目        摘要
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
s-2024-03-15-001    今天 09:00     my-app     添加用户认证
s-2024-03-14-003    昨天 16:30     my-app     重构代码
s-2024-03-14-002    昨天 14:00     blog       添加博客功能
s-2024-03-14-001    昨天 09:00     my-app     修复 Bug

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

你: resume s-2024-03-14-002

Claude:
→ 恢复会话: blog 博客功能

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

项目：blog
任务：添加博客功能
进度：60%

已完成：
✓ 文章列表页面
✓ 文章详情页面
✓ Markdown 支持

待完成：
⏳ 评论功能
⏳ 搜索功能
⏳ 分类标签

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

继续开发？
```

### 示例 3: 跨会话上下文

```
[会话 A: 讨论架构]
你: 我们应该用 Redux 还是 Zustand？

Claude: 我建议 Zustand，因为：
1. 更轻量
2. 更简单的 API
3. 更好的 TypeScript 支持

[结束会话 A]

[会话 B: 开始实现]
你: resume previous

Claude: 上次我们讨论了状态管理，
      决定使用 Zustand。

现在开始实现吗？

你: 是的

Claude:
→ npm install zustand ✓
→ 创建 store/store.js ✓
→ 集成到应用 ✓
```

### 示例 4: 会话分支

```
[主会话]
你: 实现用户功能

Claude: 有两种实现方式：
A. 使用 JWT
B. 使用 Session

[保存会话为 checkpoint]

你: save checkpoint user-auth-jwt

Claude: ✓ 已保存检查点：user-auth-jwt

你: 先尝试方案 A (JWT)

Claude: [实现 JWT 方案...]

[尝试后发现不合适]
你: 回到检查点，尝试方案 B

Claude:
→ 恢复到 user-auth-jwt ✓
→ 现在实现方案 B (Session)
```

## 🎛️ Resume 命令

### 基本语法

```bash
# 恢复上一个会话
resume

# 恢复指定会话
resume <session-id>

# 恢复 N 个会话前的
resume -n 3

# 恢复特定日期的会话
resume --date 2024-03-14

# 恢复特定项目的会话
resume --project my-app

# 交互式选择
resume --interactive
```

### 交互式选择

```
你: resume -i

Claude:
🔄 选择要恢复的会话
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

1. [今天 09:00] my-app - 添加用户认证
2. [昨天 16:30] my-app - 重构代码
3. [昨天 14:00] blog - 添加博客功能
4. [昨天 09:00] my-app - 修复 Bug

选择编号 (1-4) 或 q 取消: 2

→ 恢复会话 2...
✓ 已恢复
```

## 📊 会话管理

### 查看会话列表

```bash
claude sessions list
```

```
📚 会话列表
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

最近 10 个会话：

ID              时间          项目    消息数    状态
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
s-001        今天 09:00    my-app    45      进行中
s-002        今天 07:30    docs      12      完成
s-003        昨天 18:00    my-app    67      完成
s-004        昨天 14:00    blog      34      完成
s-005        昨天 09:00    test      8       完成

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

### 搜索会话

```bash
# 按项目搜索
claude sessions search --project my-app

# 按关键词搜索
claude sessions search --keyword "认证"

# 按日期范围搜索
claude sessions search --from 2024-03-10 --to 2024-03-15
```

### 删除会话

```bash
# 删除特定会话
claude sessions delete s-002

# 删除所有已完成的会话
claude sessions cleanup --status completed

# 删除 7 天前的会话
claude sessions cleanup --older-than 7d
```

### 导出会话

```bash
# 导出为 JSON
claude sessions export s-001 --format json --output session.json

# 导出为 Markdown
claude sessions export s-001 --format markdown --output session.md

# 导出所有会话
claude sessions export-all --output sessions-archive.zip
```

## 🎯 最佳实践

### ✅ DO - 应该做的

1. **定期保存检查点**
   ```
   完成重要功能后保存检查点
   ```

2. **使用描述性名称**
   ```
   save checkpoint "user-auth-jwt"
   而不是 save checkpoint "checkpoint-1"
   ```

3. **定期清理旧会话**
   ```
   每周清理一次，节省空间
   ```

4. **导出重要会话**
   ```
   导出为 Markdown 便于文档化
   ```

### ❌ DON'T - 避免做的

1. ❌ 恢复错误的会话
   ```
   恢复前先查看会话摘要
   ```

2. ❌ 不清理会话
   ```
   导致会话列表过长
   ```

3. ❌ 依赖会话存储重要数据
   ```
   会话可能被清理，重要代码应提交到 Git
   ```

## 🛠️ 高级功能

### 会话标签

```
你: 保存当前会话，标签为"重要功能"

Claude:
→ 保存会话：user-authentication
→ 标签：重要功能, 安全, JWT
✓ 已保存

[稍后搜索]
你: 搜索带"重要功能"标签的会话

Claude:
找到 3 个匹配的会话：
1. user-authentication (今天)
2. payment-integration (昨天)
3. admin-dashboard (3 天前)
```

### 会话共享

```bash
# 导出会话
claude sessions export s-001 --output share.json

# 分享给团队成员
# 队友可以导入
claude sessions import share.json
```

### 会话合并

```
你: 合并最近 3 个会话

Claude:
→ 分析会话关系...
→ 合并相似上下文...
→ 生成统一摘要...

✓ 已合并为单一会话
包含 156 条消息，覆盖 3 天工作
```

### 会话对比

```
你: 对比会话 A 和会话 B

Claude:
📊 会话对比
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

会话 A vs 会话 B

项目：
A: my-app
B: my-app

主题：
A: 用户认证 (JWT)
B: 用户认证 (Session)

代码差异：
A: 使用 jsonwebtoken
B: 使用 express-session

性能：
A: 更快（无状态）
B: 稍慢（服务器存储）

安全：
A: Token 可能被盗
B: 更安全（可撤销）

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

## ⚙️ 配置选项

### 会话保留策略

```json
// ~/.claude/config.json
{
  "sessions": {
    "maxSessions": 100,
    "maxAge": "30d",
    "maxSize": "1GB",
    "autoCleanup": true,
    "cleanupInterval": "7d"
  }
}
```

### 会话加密

```json
{
  "sessions": {
    "encryption": {
      "enabled": true,
      "algorithm": "aes-256-gcm",
      "key": "your-encryption-key"
    }
  }
}
```

## 🚨 注意事项

### 会话限制

1. **大小限制**
   ```
   单个会话最大 100MB
   ```

2. **不包括的内容**
   ```
   - 大型二进制文件
   - node_modules/
   - .git/
   ```

3. **隐私注意**
   ```
   会话可能包含敏感信息
   注意保护会话文件
   ```

## 📚 下一步

了解 Resume 后，继续学习 [13. 使用 MCP 工具还原设计稿](./13-mcp-design.md)

## 🔗 相关资源

- [会话管理文档](https://code.claude.com/docs/zh-CN/sessions)
- [Resume 功能指南](https://code.claude.com/docs/zh-CN/resume)


---

> 💡 **API 推荐**：[https://tryallapi.com/](https://tryallapi.com/) - 一站式接入各种AI服务，注册即送0.2刀
