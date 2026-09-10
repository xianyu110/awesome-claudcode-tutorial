# 02. 登录与授权

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
claude auth whoami
```

这会显示当前登录的账户信息。

## 💡 订阅要求

### Claude 订阅

Claude Code 需要：
- **Claude Pro** 订阅（个人用户）
- **Claude Team** 订阅（团队用户）
- **Anthropic Console** API 密钥

### 第三方提供商（仅 Terminal CLI 和 VS Code）

你也可以使用第三方提供商：
- Azure OpenAI
- Google Cloud Vertex AI
- AWS Bedrock

设置方法：

```bash
claude config set provider <provider-name>
```

### 中转方案配置（国内用户推荐）

由于 Claude 官方封禁中国账号，国内用户推荐使用中转 API。中转方案的效果与官方 API 一致，只是通过第三方代理转发请求。

**配置方法：**

```bash
# 方式一：设置环境变量
export ANTHROPIC_BASE_URL="https://your-relay-api.com/v1"
export ANTHROPIC_API_KEY="your-api-key"

# 方式二：通过 claude config 设置
claude config set api_key your-api-key
claude config set apiUrl https://your-relay-api.com
```

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

或在配置文件中设置：

```bash
claude config set api_key your-api-key-here
```

### Q: 公司网络无法访问怎么办？

**A**:
1. 配置代理：`claude config set proxy http://proxy.example.com:8080`
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
- [Claude 订阅页面](https://claude.ai/plans)


---

> 💡 **API 推荐**：[https://tryallapi.com/](https://tryallapi.com/) - 一站式接入各种AI服务，注册即送0.2刀
