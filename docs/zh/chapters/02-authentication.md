# 02. 登录与授权

> 📌 **版本说明**：本章已更新至 Claude Code 2.1.310（2026-10-24），内容以[官方文档](https://code.claude.com/docs/en/overview)和[官方 CHANGELOG](https://github.com/anthropics/claude-code/blob/main/CHANGELOG.md) 为准。

> 📷 **截图说明**：本章配图均为终端风格渲染图；标注「示意图」的表示本环境未真实登录 Anthropic，输出已按官方文档整理并打码。真实密钥不会出现在任何图片中。
## 🔑 为什么需要授权？

Claude Code 需要授权才能：
- ✅ 访问 Claude API 的强大功能
- 🔒 保护你的账户安全
- 📊 跟踪使用情况（便于优化体验）

## 🤔 Claude Code 和大模型的关系

可以这样理解：**Claude Code 就像手机，大模型就像运营商**。

你的手机可以选电信、联通、移动，都能打电话上网。同理，Claude Code 是一个工具，你可以在里面使用各种大模型 —— 你只需要为大模型付费。

⚠️ **重要提示**：Claude 官方会直接封禁中国用户的账号，因此使用官方账号门槛很高。对于国内用户，推荐使用**中转 API 方案**（详见下方「中转方案配置」）。

## 🚀 首次登录流程

### 步骤 1: 启动 Claude Code

在你项目的根目录运行：

```bash
claude
```

### 步骤 2: 自动打开授权页面

首次运行时，Claude Code 会自动：
1. 在浏览器中打开授权页面
2. 显示一个授权链接（如果浏览器未自动打开）

### 步骤 3: 完成授权

在授权页面：
1. 使用你的 Anthropic 账户登录（如果没有会提示注册）
2. 点击"授权"按钮
3. 授权成功后，返回终端

### 步骤 4: 确认登录成功

终端会显示类似以下信息：

```
✓ Successfully authenticated

Welcome to Claude Code!

Type your message below to get started.
```

## 🔄 账户切换

如果你有多个 Claude 账户，可以切换：

```bash
claude auth login
```

这会重新启动授权流程。

## 📤 登出

要登出当前账户：

```bash
claude auth logout
```

## 🔍 查看当前账户

```bash
# 以 JSON 输出登录状态（已登录退出码为 0，未登录为 1）
claude auth status

# 人类可读格式
claude auth status --text
```

![claude auth status --text（邮箱已打码）](/images/screenshots/02-auth-status.png)

> 📷 真实输出（已打码，Claude Code 2.1.310）

![claude auth status JSON 示意](/images/screenshots/02-auth-status-json.png)

> 📷 真实输出（已打码，Claude Code 2.1.310）

在会话中也可以运行 `/status` 查看当前账户、Base URL 和凭据来源。

> 💡 旧版教程中的 `claude auth whoami` 不在当前官方 CLI 参考中，请改用 `claude auth status`。

### 为 CI/脚本生成长期令牌

```bash
claude setup-token
```
![claude setup-token 示意（令牌已打码）](/images/screenshots/02-setup-token.png)

> 📷 示意图：令牌显示为 sk-ant-oat01-••••••••


该命令会生成一个长期有效的 OAuth 令牌并打印到终端（不会保存），需要 Claude 订阅。

## 💡 订阅要求

### Claude 订阅

Claude Code 需要：
- **Claude Pro** 订阅（个人用户）
- **Claude Team** 订阅（团队用户）
- **Anthropic Console** API 密钥

### 云厂商提供商

你也可以通过云厂商使用 Claude 模型，用环境变量切换：

| 提供商 | 环境变量 |
|--------|----------|
| Amazon Bedrock | `CLAUDE_CODE_USE_BEDROCK=1` |
| Google Cloud's Agent Platform（原 Vertex AI） | `CLAUDE_CODE_USE_VERTEX=1` |
| Microsoft Foundry | `CLAUDE_CODE_USE_FOUNDRY=1` |

各家还需要配置对应的云账号凭据，详见官方文档：[Bedrock](https://code.claude.com/docs/en/amazon-bedrock)、[Agent Platform](https://code.claude.com/docs/en/google-vertex-ai)、[Foundry](https://code.claude.com/docs/en/microsoft-foundry)。会话中也可以运行 `/setup-bedrock`、`/setup-vertex` 进行引导配置。

> ⚠️ 旧版教程中的 `claude config set provider ...` 已不在当前官方文档中，请改用上面的环境变量。

### 中转方案配置（国内用户推荐）

由于 Claude 官方封禁中国账号，国内用户推荐使用中转 API。中转方案的效果与官方 API 一致，只是通过第三方代理转发请求。

**第一步：确认凭据类型**

| 变量 | 发送方式 | 何时使用 |
|------|----------|----------|
| `ANTHROPIC_AUTH_TOKEN` | `Authorization: Bearer <token>` 请求头 | 服务商说是 “Bearer token / Authorization 头”；**不确定时优先用它** |
| `ANTHROPIC_API_KEY` | `x-api-key` 请求头 | 服务商说是 “API key / x-api-key” |

如果请求返回 `401`，通常是变量用错了，换另一个试试。

**方式一：临时设置环境变量（当前终端有效）**

```bash
# Base URL 填服务商给的根地址，一般不要带 /v1（Claude Code 会自己请求 /v1/messages）
export ANTHROPIC_BASE_URL="https://your-relay-api.com"
export ANTHROPIC_AUTH_TOKEN="sk-xxxx"
```

PowerShell：

```powershell
$env:ANTHROPIC_BASE_URL = "https://your-relay-api.com"
$env:ANTHROPIC_AUTH_TOKEN = "sk-xxxx"
```

**方式二：写入 `~/.claude/settings.json`（推荐，长期生效）**

```json
{
  "env": {
    "ANTHROPIC_BASE_URL": "https://your-relay-api.com",
    "ANTHROPIC_AUTH_TOKEN": "sk-xxxx",
    "ANTHROPIC_MODEL": "claude-sonnet-5-5"
  }
}
```

![settings.json 中转配置（密钥占位符 sk-xxxx）](/images/screenshots/02-settings-env.png)

> 📷 真实输出（密钥已打码为 sk-••••••••，Claude Code 2.1.310 / momoai 中转）

![/status 确认 Base URL 已生效](/images/screenshots/02-status-relay.png)

> 📷 基于真实 auth status + settings 拼合（/status 交互界面未抓取）

- `sk-xxxx` 只是占位符，请替换为你自己的密钥，**不要把真实密钥提交到 Git 仓库**
- Windows 路径为 `%USERPROFILE%\.claude\settings.json`
- 不要把密钥写进项目的 `.claude/settings.json`（会被提交共享）；项目级私有配置请用 `.claude/settings.local.json` 并加入 `.gitignore`
- `ANTHROPIC_MODEL` 可选，填写中转服务实际支持的模型名；不填则使用默认模型
- 同一变量在 shell 和 settings 文件 `env` 中都设置时，以 settings 文件为准
- 配置后启动 `claude`，运行 `/status`，确认 `Anthropic base URL` 一行显示的是你的中转地址

> ⚠️ 旧版教程中的 `claude config set api_key ...` / `claude config set apiUrl ...` 已不在当前官方文档中，请改用上面的方式。
>
> ℹ️ 根据官方环境变量文档，自 v2.1.196 起，当 `ANTHROPIC_BASE_URL` 指向非 `api.anthropic.com` 的地址时，Remote Control 功能会被禁用。

> 💡 也可以使用 [cc-switch](./01-installation.md#-cc-switch一键配置工具) 图形化工具来配置，更加方便。

## 🌐 不同环境的授权

### Terminal CLI

授权信息存储在本地，无需重复登录。

### VS Code / Cursor

1. 安装扩展后首次使用会提示登录
2. 授权流程与 Terminal 相同
3. 与 Terminal 共享授权状态

### Desktop App

独立管理授权，需要单独登录。

### Web

直接在浏览器中使用你的 Claude 账户登录。

### JetBrains

与其他 IDE 扩展类似，首次使用时授权。

## ⚠️ 常见问题

### Q: 授权失败怎么办？

**A**: 尝试以下步骤：
1. 检查网络连接
2. 确认账户状态正常
3. 清除缓存：`claude auth logout` 后重新登录
4. 使用 VPN（如果网络受限）

### Q: 如何使用 API 密钥？

**A**: 设置环境变量：

```bash
export ANTHROPIC_API_KEY="your-api-key-here"
```

或写入 `~/.claude/settings.json` 的 `env` 字段（见上文「中转方案配置」）。

注意：设置了 `ANTHROPIC_API_KEY` 后，它会优先于你的 Claude 订阅登录（交互模式下首次会提示你确认）。想改回使用订阅，执行 `unset ANTHROPIC_API_KEY`。

### Q: 公司网络无法访问怎么办？

**A**:
1. 配置代理：设置环境变量 `HTTPS_PROXY=http://proxy.example.com:8080`（也支持 `HTTP_PROXY`）
2. 使用桌面应用或 Web 版本
3. 联系 IT 部门添加白名单

### Q: 多台设备需要分别授权吗？

**A**: 是的，每台设备需要单独授权，但可以使用同一账户。

## 🔒 安全提示

1. ✅ 不要分享你的授权令牌
2. ✅ 定期检查已授权的设备
3. ✅ 在公共设备上使用后记得登出
4. ✅ 保护好你的 API 密钥

## 📚 下一步

授权成功后，继续学习 [03. 第一个实战问题](./03-first-task.md)

## 🔗 相关资源

- [官方认证文档](https://code.claude.com/docs/zh-CN/authentication)
- [连接 LLM 网关 / 第三方 Base URL（英文）](https://code.claude.com/docs/en/llm-gateway-connect)
- [环境变量参考（英文）](https://code.claude.com/docs/en/env-vars)
- [Claude 订阅页面](https://claude.ai/plans)


---

> 💡 **API 推荐**：[https://tryallapi.com/](https://tryallapi.com/) - 一站式接入各种AI服务，注册即送0.2刀
