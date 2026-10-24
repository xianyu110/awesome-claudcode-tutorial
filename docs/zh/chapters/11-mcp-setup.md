# 11. 安装 MCP Server

> 📷 **截图说明**：本章配图均为终端风格渲染图；标注「示意图」的表示本环境未真实登录 Anthropic，输出已按官方文档整理并打码。真实密钥不会出现在任何图片中。
MCP (Model Context Protocol) Server 让 Claude Code 能够连接外部工具和服务，大大扩展其能力。

## 🎯 什么是 MCP Server？

### 核心概念

```
Claude Code 核心
    ↓
MCP Protocol
    ↓
┌─────────┬─────────┬─────────┬─────────┐
│ Figma   │ GitHub  │ Slack   │ Database│  ← MCP Servers
│ Server  │ Server  │ Server  │ Server  │
└─────────┴─────────┴─────────┴─────────┘
```

### 为什么需要 MCP？

**没有 MCP：**
```
Claude Code 只能访问：
- 本地文件
- 终端命令
- 基本编程能力
```

**有 MCP：**
```
Claude Code 可以：
- 读取 Figma 设计
- 操作 GitHub 仓库
- 发送 Slack 消息
- 查询数据库
- 调用自定义 API
```

## 📦 流行的 MCP Servers

### 官方 MCP Servers

| Server | 功能 | 用途 |
|--------|------|------|
| **figma** | 读取 Figma 设计 | 设计稿转代码 |
| **github** | 管理 GitHub 仓库 | PR、Issue 管理 |
| **slack** | 发送 Slack 消息 | 通知和汇报 |
| **postgres** | 查询 PostgreSQL | 数据分析 |
| **filesystem** | 扩展文件操作 | 高级文件管理 |
| **brave-search** | 网页搜索 | 信息检索 |
| **puppeteer** | 浏览器自动化 | E2E 测试 |

### 社区 MCP Servers

更多社区驱动的服务器：[MCP Server List](https://github.com/modelcontextprotocol/servers)

## 🚀 安装 MCP Server

### 前置要求

```bash
# Claude Code 必须是最新版本
claude --version
# 如果版本过旧，更新：
claude update
# npm 安装用户：
npm install -g @anthropic-ai/claude-code@latest
# Homebrew 用户：
brew upgrade claude-code
```

### ✅ 官方推荐：用 `claude mcp add` 添加

> 📌 **版本说明**：本章已更新至 Claude Code 2.1.310（2026-10-24），内容以[官方文档](https://code.claude.com/docs/en/overview)和[官方 CHANGELOG](https://github.com/anthropics/claude-code/blob/main/CHANGELOG.md) 为准。

```bash
# 远程 HTTP 服务器（官方示例）
claude mcp add --transport http notion https://mcp.notion.com/mcp

# 本地 stdio 服务器：-- 之后是启动服务器的命令（官方示例）
claude mcp add --env AIRTABLE_API_KEY=YOUR_KEY --transport stdio airtable \
  -- npx -y airtable-mcp-server

# 从 JSON 添加
claude mcp add-json <name> '<json>'

# 管理
claude mcp list
claude mcp get notion
claude mcp remove notion
```

![claude mcp add（HTTP）示意](/images/screenshots/11-mcp-add.png)

> 📷 示意图

![claude mcp add（stdio + 环境变量，密钥打码）](/images/screenshots/11-mcp-add-stdio.png)

> 📷 示意图：密钥已打码为 sk-xxxx

![claude mcp list / get 示意](/images/screenshots/11-mcp-list.png)

> 📷 示意图

会话中运行 `/mcp` 可以查看状态、登录 OAuth；`/mcp reconnect all`（v2.1.284 起）可重连所有服务器。

**作用域（`--scope`）：**

| 作用域 | 生效范围 | 是否与团队共享 | 存储位置 |
|--------|----------|----------------|----------|
| `local`（默认） | 仅当前项目 | 否 | `~/.claude.json` |
| `project` | 仅当前项目 | 是，提交到版本库 | 项目根目录 `.mcp.json` |
| `user` | 你的所有项目 | 否 | `~/.claude.json` |

> ⚠️ 下文中的 `@modelcontextprotocol/server-figma` 等包名、`claude mcp install`、`claude config set mcp...` 写法未在官方文档中核实，请以各 MCP 服务器自己的说明和上面的 `claude mcp add` 为准。

### 方式一：使用 NPX（推荐）

```bash
# 安装 Figma MCP Server
npx -y @modelcontextprotocol/server-figma

# 安装 GitHub MCP Server
npx -y @modelcontextprotocol/server-github

# 安装 Puppeteer MCP Server
npx -y @modelcontextprotocol/server-puppeteer
```

### 方式二：全局安装

```bash
# 全局安装服务器
npm install -g @modelcontextprotocol/server-figma
npm install -g @modelcontextprotocol/server-github

# 在 Claude Code 中配置（用 claude mcp add，-- 后面是启动命令）
claude mcp add --transport stdio figma -- mcp-server-figma
claude mcp add --transport stdio github -- mcp-server-github
```

### 方式三：项目级别安装

```bash
# 在项目中安装
cd your-project
npm install --save-dev @modelcontextprotocol/server-figma

# 配置项目
# 写入项目根目录的 .mcp.json，可提交给团队共享
claude mcp add --scope project --transport stdio figma -- npx @modelcontextprotocol/server-figma
```

## ⚙️ 配置 MCP Server

### 配置文件位置

```
~/.claude.json      # local / user 作用域的 MCP 服务器
<项目根目录>/.mcp.json  # project 作用域（可提交到 Git 与团队共享）
```

> 下面的 JSON 结构（`mcpServers` 字段）可直接写进项目根目录的 `.mcp.json`；旧版教程中的 `~/.claude/mcp-servers.json` 路径不在当前官方文档中。

### 基础配置示例

```json
// <项目根目录>/.mcp.json
{
  "mcpServers": {
    "figma": {
      "command": "npx",
      "args": [
        "-y",
        "@modelcontextprotocol/server-figma"
      ],
      "env": {
        "FIGMA_ACCESS_TOKEN": "your-token-here"
      }
    },
    "github": {
      "command": "npx",
      "args": [
        "-y",
        "@modelcontextprotocol/server-github"
      ],
      "env": {
        "GITHUB_TOKEN": "ghp_xxxxxxxxxxxx"
      }
    },
    "postgres": {
      "command": "npx",
      "args": [
        "-y",
        "@modelcontextprotocol/server-postgres"
      ],
      "env": {
        "POSTGRES_CONNECTION_STRING": "postgresql://user:pass@localhost/db"
      }
    }
  }
}
```

## 💻 实战示例

### 示例 1: Figma MCP Server

#### 步骤 1: 获取 Figma Token

1. 登录 [Figma](https://figma.com)
2. 进入 Settings → Account → Personal Access Tokens
3. 创建新 Token
4. 复制 Token

#### 步骤 2: 安装和配置

```bash
# 配置 Figma Server（命令以 Figma 官方 MCP 文档为准）
claude mcp add --transport stdio --env FIGMA_ACCESS_TOKEN=your-token-here figma \
  -- npx -y @modelcontextprotocol/server-figma
```

或手动配置：

```json
{
  "mcpServers": {
    "figma": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-figma"],
      "env": {
        "FIGMA_ACCESS_TOKEN": "figd_your-token-here"
      }
    }
  }
}
```

#### 步骤 3: 使用 Figma MCP

```
你: 读取这个 Figma 文件
   https://www.figma.com/file/abc123/My-Design

Claude:
→ 连接到 Figma MCP
→ 读取文件信息

📨 Figma 文件信息：
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

文件名：My Design
页面数：5
框架数：23
组件数：12

页面列表：
1. Desktop Home (8 frames)
2. Mobile Home (6 frames)
3. Components (3 components)
4. Icons (45 icons)
5. Illustrations (12 assets)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

需要我实现哪个页面？

你: 实现 Desktop Home 页面

Claude:
→ 读取 Desktop Home 页面详情
→ 分析布局和组件
→ 生成 React 代码

✓ 已创建 src/pages/Home.jsx
✓ 已创建 src/pages/Home.module.css
```

### 示例 2: GitHub MCP Server

#### 步骤 1: 获取 GitHub Token

1. 访问 GitHub Settings → Developer settings → Personal access tokens
2. Generate new token (classic)
3. 选择所需权限：
   - repo (完整仓库访问)
   - pull requests (PR 管理)
   - issues (Issue 管理)
4. 生成并复制 Token

#### 步骤 2: 配置 GitHub MCP

```json
{
  "mcpServers": {
    "github": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-github"],
      "env": {
        "GITHUB_TOKEN": "ghp_your-token-here"
      }
    }
  }
}
```

#### 步骤 3: 使用 GitHub MCP

```
你: 列出我的 Pull Requests

Claude:
→ 查询 GitHub API

📋 Pull Requests
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Repository: your-org/your-project

#142 - Fix authentication bug
- Status: Open
- Author: @john
- Created: 2 hours ago
- Reviews: 1 approved, 0 changes

#141 - Add new feature
- Status: Open
- Author: @jane
- Created: 1 day ago
- Reviews: 0

#140 - Refactor code
- Status: Merged
- Author: @bob
- Created: 3 days ago

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

需要我帮你审查哪个 PR？

你: 审查 PR #142

Claude:
→ 获取 PR 详情
→ 查看代码更改
→ 分析代码质量

📊 PR 审查报告
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

总体评分：⭐⭐⭐⭐☆ (4/5)

优点：
✓ 修复逻辑正确
✓ 添加了单元测试
✓ 代码清晰易读

建议：
⚠️ 建议添加错误处理
⚠️ 可以优化性能（缓存 token）

需要我添加评论吗？

你: 是的，添加这些评论

Claude:
→ 在 PR #142 添加评论
✓ 已添加 2 条评论
```

### 示例 3: Slack MCP Server

#### 步骤 1: 创建 Slack App

1. 访问 [Slack API](https://api.slack.com/apps)
2. Create New App → From scratch
3. 设置 OAuth Scopes：
   - chat:write (发送消息)
   - channels:read (读取频道)
4. Install to Workspace
5. 复制 Bot Token

#### 步骤 2: 配置 Slack MCP

```json
{
  "mcpServers": {
    "slack": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-slack"],
      "env": {
        "SLACK_BOT_TOKEN": "xoxb-your-token-here"
      }
    }
  }
}
```

#### 步骤 3: 使用 Slack MCP

```
你: 部署完成后发送通知到 #deployments 频道

Claude:
→ [部署应用...]
→ npm run build ✓
→ npm run deploy ✓

→ 发送 Slack 通知
✓ 已发送到 #deployments

消息内容：
"✅ 部署成功！

项目: my-app
版本: v2.3.0
时间: 2024-03-15 14:30
作者: @claude"
```

### 示例 4: PostgreSQL MCP Server

#### 步骤 1: 配置数据库连接

```json
{
  "mcpServers": {
    "postgres": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-postgres"],
      "env": {
        "POSTGRES_CONNECTION_STRING": "postgresql://user:password@localhost:5432/mydb"
      }
    }
  }
}
```

#### 步骤 2: 使用 PostgreSQL MCP

```
你: 分析用户数据

Claude:
→ 连接到数据库
→ 执行分析查询

📊 用户数据分析
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

查询：SELECT COUNT(*), created_at::date FROM users
                      GROUP BY created_at::date
                      ORDER BY date DESC
                      LIMIT 7

结果：
最近 7 天用户注册趋势：
- 2024-03-15: 156 人
- 2024-03-14: 142 人
- 2024-03-13: 189 人
- 2024-03-12: 134 人
- 2024-03-11: 167 人
- 2024-03-10: 198 人
- 2024-03-09: 145 人

总计：1,131 人
平均：162 人/天
增长：+9.9% (vs 上周)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

需要更详细的分析吗？
```

## 🎛️ MCP Server 管理

### 列出已安装的 Servers

```bash
claude mcp list
```

```
已安装的 MCP Servers：
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

✓ figma      - Figma 设计工具
✓ github     - GitHub 集成
✓ slack      - Slack 通知
✓ postgres   - PostgreSQL 数据库

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

### 卸载 MCP Server

```bash
claude mcp uninstall figma
```

### 更新 MCP Server

```bash
# 更新所有服务器
claude mcp update

# 更新特定服务器
claude mcp update figma
```

### 测试 MCP Server 连接

```bash
claude mcp test figma
```

```
测试 Figma MCP Server...
✓ 连接成功
✓ 认证通过
✓ API 可用
```

## 🔒 安全最佳实践

### Token 管理

1. **不要在配置文件中硬编码 Token**
   ```bash
   # 使用环境变量
   export FIGMA_ACCESS_TOKEN="figd_xxx"
   export GITHUB_TOKEN="ghp_xxx"
   ```

2. **使用 .env 文件**
   ```bash
   # .env
   FIGMA_ACCESS_TOKEN=figd_xxx
   GITHUB_TOKEN=ghp_xxx

   # .mcp.json（项目根目录）
   {
     "env": {
       "FIGMA_ACCESS_TOKEN": "${FIGMA_ACCESS_TOKEN}"
     }
   }
   ```

3. **限制 Token 权限**
   ```
   只授予必要的最小权限
   ```

4. **定期轮换 Token**
   ```
   每 90 天更新一次 Token
   ```

### 访问控制

```json
// <项目根目录>/.mcp.json
{
  "mcpServers": {
    "github": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-github"],
      "allowedRepos": [
        "your-org/*",
        "your-org/your-project"
      ],
      "deniedActions": [
        "delete",
        "force-push"
      ]
    }
  }
}
```

## 🛠️ 调试 MCP Server

### 查看日志

```bash
# 查看 MCP Server 日志
claude mcp logs figma

# 实时查看日志
claude mcp logs figma --follow
```

### 测试连接

```bash
# 测试特定服务器
claude mcp test --server figma

# 测试所有服务器
claude mcp test --all
```

### 常见问题

**问题：连接超时**
```
解决：
1. 检查网络连接
2. 验证 Token 是否正确
3. 查看 MCP Server 日志
```

**问题：权限错误**
```
解决：
1. 确认 Token 权限足够
2. 检查资源访问权限
3. 更新 Token Scope
```

**问题：命令未找到**
```
解决：
1. 确认 NPX 已安装
2. 清理 NPM 缓存
3. 重新安装服务器
```

## 🎓 自定义 MCP Server

### 创建自己的 MCP Server

```bash
# 创建项目
mkdir my-mcp-server
cd my-mcp-server
npm init -y

# 安装 SDK
npm install @modelcontextprotocol/sdk
```

```typescript
// src/index.ts
import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';

const server = new Server({
  name: 'my-mcp-server',
  version: '1.0.0',
});

// 添加工具
server.setRequestHandler(ListToolsRequest, async () => ({
  tools: [
    {
      name: 'my_custom_tool',
      description: 'My custom tool',
      inputSchema: {
        type: 'object',
        properties: {
          param1: {
            type: 'string',
            description: 'First parameter',
          },
        },
        required: ['param1'],
      },
    },
  ],
}));

// 处理工具调用
server.setRequestHandler(CallToolRequest, async (request) => {
  if (request.params.name === 'my_custom_tool') {
    // 实现你的逻辑
    return {
      content: [{
        type: 'text',
        text: `Result: ${request.params.arguments.param1}`,
      }],
    };
  }
});

// 启动服务器
const transport = new StdioServerTransport();
await server.connect(transport);
```

## 📚 下一步

了解 MCP Server 后，继续学习 [12. 恢复历史会话 (Resume)](./12-resume.md)

## 🔗 相关资源

- [MCP 官方文档](https://modelcontextprotocol.io)
- [MCP Server 仓库](https://github.com/modelcontextprotocol/servers)
- [MCP SDK 文档](https://github.com/modelcontextprotocol/sdk)


---

> 💡 **API 推荐**：[https://tryallapi.com/](https://tryallapi.com/) - 一站式接入各种AI服务，注册即送0.2刀
