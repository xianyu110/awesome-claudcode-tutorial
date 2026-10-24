# 30. 新版速览：Claude Code 2.1.310

> 📌 **版本说明**：本章基于 Claude Code **2.1.310**（npm `latest`，2026-10-24 发布）整理，只收录能在[官方文档](https://code.claude.com/docs/en/overview)和[官方 CHANGELOG](https://github.com/anthropics/claude-code/blob/main/CHANGELOG.md) 中查到的内容。如果你是从旧版教程（Opus 4.6 / Sonnet 4.6 时代）过来的，建议先读这一章。

## 🔢 查看与升级版本

```bash
# 查看当前版本
claude --version

# 升级（原生安装）
claude update

# npm 安装
npm install -g @anthropic-ai/claude-code@latest

# 检查安装和自动更新状态
claude doctor
```

> 💡 想要更稳定的版本，可以切到 `stable` 通道（通常比最新版晚约一周），详见 [01. 安装 Claude Code](./01-installation.md)。

## 🧠 模型：5.5 系列成为默认

在 Anthropic API 上，模型别名现在解析为（来源：[Model configuration](https://code.claude.com/docs/en/model-config)）：

| 别名 | 当前对应模型 | 说明 |
|------|--------------|------|
| `opus` | Opus 5.5 | 复杂推理任务 |
| `sonnet` | Sonnet 5.5 | 日常编码 |
| `haiku` | Haiku 5.5 | 简单、快速任务 |
| `fable` | Fable 5.1 | 最难、最长的任务（需要相应权限） |
| `best` | 可用时等同 `fable`，否则等同 `opus` | — |
| `opusplan` | 规划时用 `opus`，执行时用 `sonnet` | — |

- Pro、Max、Team、Enterprise 以及 Anthropic API 的默认模型为 **Opus 5.5**
- Bedrock、Agent Platform 等其他提供商上，`sonnet` / `haiku` 别名可能解析到更早的版本
- Opus 5.5、Sonnet 5.5、Haiku 5.5 的默认 effort 为 `medium`

切换模型：

```bash
claude --model opus
# 或在会话中
/model
```

### 新模型 ID 与价格（来自官方 CHANGELOG）

| 模型 | 模型 ID | 加入版本 | 上下文 | 价格（每百万 tokens，输入/输出） |
|------|---------|----------|--------|------|
| Opus 5.5 | `claude-opus-5-5` | 2.1.280 | 1M | $4 / $20，缓存读取 $0.20 |
| Sonnet 5.5 | `claude-sonnet-5-5` | 2.1.284 | 1M | $2 / $10，缓存读取 $0.10（2.1.296 起由 $0.20 调整） |
| Haiku 5.5 | `claude-haiku-5-5` | 2.1.293 | 1M | $0.10 / $0.50（超过 100K 的提示为 $0.50 / $2.50） |
| Fable 5.1 | `claude-fable-5-1` | 2.1.257 | 1M | $10 / $50，缓存读取 $0.25 |

> ⚠️ 以上价格摘自 Claude Code CHANGELOG（Claude Code 用它计算 `/usage` 中的费用），本次更新未能打开 Anthropic 官方定价页核对；订阅用户按套餐额度计费。实际价格请以 [Anthropic 官方定价页](https://platform.claude.com/docs/en/about-claude/pricing) 为准。

## 🔐 权限模式的变化

| 变化 | 版本 |
|------|------|
| 交互式终端和 VS Code 会话**默认以 auto 模式启动**（所有套餐和提供商） | v2.1.283 起 |
| `claude -p` 和 Agent SDK 运行默认使用 Manual（`default`）模式 | v2.1.302 起 |
| `--permission-mode manual` 可作为 `default` 的别名 | 当前版本 |
| `--enable-auto-mode` 参数已移除，改用 `--permission-mode auto` | v2.1.111 |
| 新增 `/auto-mode-setup`：根据项目和近期会话起草 `autoMode.environment` 配置 | 当前版本 |

`Shift+Tab` 的循环顺序：**auto → default（Manual）→ acceptEdits → plan → auto**。完整 6 种模式见 [04. 三种模式详解](./04-modes.md)。

## 🗑️ 已移除或变化的命令

| 旧写法 | 现在 | 来源 |
|--------|------|------|
| `/agents` 交互式向导 | v2.1.198 起只打印提示：直接让 Claude 创建子代理，或编辑 `.claude/agents/`、`~/.claude/agents/` | [Commands](https://code.claude.com/docs/en/commands) |
| `/vim` | 已移除（v2.1.92），改用 `/config` → Editor mode | [Commands](https://code.claude.com/docs/en/commands) |
| `/ultraplan` | 已移除（v2.1.222）；可改用普通规划模式（`/plan`） | [CHANGELOG](https://github.com/anthropics/claude-code/blob/main/CHANGELOG.md) |
| `/cost`、`/stats` | 现在都是 `/usage` 的别名 | [Commands](https://code.claude.com/docs/en/commands) |
| `/bashes` | `/tasks` 的别名 | [Commands](https://code.claude.com/docs/en/commands) |
| TaskOutput 工具 | 已移除（v2.1.277），Claude 改用 Read 读取后台任务输出文件 | [CHANGELOG](https://github.com/anthropics/claude-code/blob/main/CHANGELOG.md) |
| `ANTHROPIC_SMALL_FAST_MODEL` 环境变量 | 已弃用 | [Env vars](https://code.claude.com/docs/en/env-vars) |

## ✨ 值得关注的命令

| 命令 | 作用 |
|------|------|
| `/usage` | 查看会话费用、套餐用量和活动统计 |
| `/recap` | 生成当前会话的一句话摘要 |
| `/tasks` | 查看和管理当前会话的后台任务（包括已完成的子代理） |
| `/skills` | 列出可用的 Skills |
| `/skill-doctor` | 查看每个 Skill 占用的上下文和使用频率，找出可以关掉的 Skill |
| `/effort` | 设置 effort 等级（`low` 到 `xhigh`、`max` 或 `auto`） |
| `/fast` | 开关 fast mode |
| `/security-review` | 分析当前分支相对默认分支的改动中的安全问题 |
| `/fewer-permission-prompts` | 扫描历史记录中常见的只读 Bash / MCP 调用，为项目 `.claude/settings.json` 生成白名单 |
| `/team-onboarding` | 根据你过去 30 天的使用记录生成团队上手指南 |
| `/advisor` | 开关 advisor 工具（关键时刻咨询第二个模型） |
| `/workflows` | 查看、暂停、恢复工作流运行 |
| `/branch`、`/fork` | 分叉当前对话 / 复制为后台会话 |
| `/mcp reconnect all` | 重连所有 MCP 服务器（v2.1.284 起） |

## 🖥️ 值得关注的 CLI 用法

```bash
# 登录状态（JSON；加 --text 为可读格式）
claude auth status

# 为 CI/脚本生成长期 OAuth 令牌（需要订阅）
claude setup-token

# 后台运行一个会话，立即返回
claude --bg "修复 lint 错误"

# 打开 agent view，管理并行的后台会话
claude agents

# 在隔离的 git worktree 中启动
claude -w feature-auth

# 指定 effort 等级
claude --effort high

# 非交互运行 ultrareview
claude ultrareview
```

## 🌐 第三方 / 中转 Base URL 快速配置

在 `~/.claude/settings.json` 中加入（`sk-xxxx` 为占位符，请替换成你自己的密钥，切勿提交到 Git）：

```json
{
  "env": {
    "ANTHROPIC_BASE_URL": "https://your-relay-api.com",
    "ANTHROPIC_AUTH_TOKEN": "sk-xxxx",
    "ANTHROPIC_MODEL": "claude-sonnet-5-5"
  }
}
```

- `ANTHROPIC_AUTH_TOKEN` 以 `Authorization: Bearer` 头发送；服务商要求 `x-api-key` 时改用 `ANTHROPIC_API_KEY`
- `ANTHROPIC_MODEL` 请填写中转服务实际支持的模型名
- 启动后运行 `/status` 确认 Base URL 已生效
- 详细说明见 [02. 登录与授权](./02-authentication.md)

## 📚 下一步

回到 [01. 安装 Claude Code](./01-installation.md) 按新版流程重新检查你的环境。

## 🔗 相关资源

- [官方 CHANGELOG](https://github.com/anthropics/claude-code/blob/main/CHANGELOG.md)
- [CLI 参考](https://code.claude.com/docs/en/cli-reference)
- [命令参考](https://code.claude.com/docs/en/commands)
- [权限模式](https://code.claude.com/docs/en/permission-modes)
- [模型配置](https://code.claude.com/docs/en/model-config)
- [连接 LLM 网关](https://code.claude.com/docs/en/llm-gateway-connect)

---

> 💡 **API 推荐**：[https://tryallapi.com/](https://tryallapi.com/) - 一站式接入各种AI服务，注册即送0.2刀
