# 01. 安装 Claude Code

> 📌 **版本说明**：本章已更新至 Claude Code 2.1.310（2026-10-24），内容以[官方文档](https://code.claude.com/docs/en/overview)和[官方 CHANGELOG](https://github.com/anthropics/claude-code/blob/main/CHANGELOG.md) 为准。

> 📷 **截图说明**：本章配图均为终端风格渲染图；标注「示意图」的表示本环境未真实登录 Anthropic，输出已按官方文档整理并打码。真实密钥不会出现在任何图片中。
## 📥 什么是 Claude Code？

Claude Code 是一个由 AI 驱动的编码助手，它可以：
- 🔍 读取和理解你的整个代码库
- ✏️ 编辑文件并运行命令
- 🤖 跨多个文件和工具协作完成任务
- 🎯 在终端、IDE、桌面应用和浏览器中使用

## 🖥️ 支持的平台

Claude Code 支持多种开发环境：

| 环境 | 说明 | 推荐指数 |
|------|------|----------|
| **Terminal CLI** | 功能完整的命令行界面 | ⭐⭐⭐⭐⭐ |
| **VS Code** | 编辑器内联差异、@-提及 | ⭐⭐⭐⭐⭐ |
| **Cursor** | AI 原生编辑器集成 | ⭐⭐⭐⭐⭐ |
| **Desktop App** | 独立桌面应用 | ⭐⭐⭐⭐ |
| **Web** | 浏览器中运行，无需安装 | ⭐⭐⭐⭐ |
| **JetBrains** | IntelliJ IDEA、PyCharm 等 | ⭐⭐⭐⭐ |

## 🧰 系统要求

根据[官方安装文档](https://code.claude.com/docs/en/setup)：

| 项目 | 要求 |
|------|------|
| 操作系统 | macOS 13.0+、Windows 10 1809+ / Windows Server 2019+、Ubuntu 20.04+、Debian 10+、Alpine Linux 3.19+ |
| 硬件 | 4 GB 以上内存，x64 或 ARM64 处理器 |
| Shell | Bash、Zsh、PowerShell 或 CMD |
| 网络 | 需要联网，且需位于 [Anthropic 支持的国家/地区](https://www.anthropic.com/supported-countries) |

## 📦 安装方法

> 💡 **新手必读**：使用下面推荐的 curl（Mac）或 PowerShell（Windows）一键安装方式，**不需要提前安装 Node.js**。之前很多教程让你先装 Node.js，很多人就卡在这一步了。现在 Claude Code 提供了更简单的一键安装方式，跳过了这个坑。
>
> ⚠️ **注意**（2025 年 12 月更新）：Claude Code 增加了地区检测，需要科学上网才能执行安装命令。请在命令行中配置好代理后再执行。

### 方法一：原生安装（推荐）

#### macOS、Linux、WSL

```bash
curl -fsSL https://claude.ai/install.sh | bash
```

#### Windows PowerShell

```powershell
irm https://claude.ai/install.ps1 | iex
```

#### Windows CMD

```cmd
curl -fsSL https://claude.ai/install.cmd -o install.cmd && install.cmd && del install.cmd
```

**注意**: 原生 Windows 上 [Git for Windows](https://git-scm.com/downloads/win) 现在是**可选**的（推荐安装）：装了它，Claude Code 用 Git Bash 运行 Bash 工具；没装，则改用 PowerShell 工具执行命令。WSL 环境不需要 Git for Windows。

> 💡 原生安装会在后台**自动更新**；Homebrew、WinGet 以及 apt/dnf/apk 安装默认不会自动更新，需要手动升级。

### 方法二：Homebrew（macOS）

```bash
# stable 通道（通常比最新版晚约一周，跳过有严重回归的版本）
brew install --cask claude-code

# latest 通道（新版本发布即可获得）
brew install --cask claude-code@latest

# 升级（Homebrew 不会自动更新）
brew upgrade claude-code        # 或 brew upgrade claude-code@latest
```

![Homebrew 安装 / 升级 Claude Code](/images/screenshots/01-brew-install.png)

> 📷 示意图（macOS）

### 方法三：WinGet（Windows）

```powershell
winget install Anthropic.ClaudeCode

# 升级（WinGet 不会自动更新）
winget upgrade Anthropic.ClaudeCode
```

### 方法四：npm 全局安装

npm 包需要 **Node.js 22 或更高版本**（安装后实际运行的是原生二进制文件）：

```bash
npm install -g @anthropic-ai/claude-code

# 升级到最新版（不要用 npm update -g，它可能不会升到最新版）
npm install -g @anthropic-ai/claude-code@latest
```

![npm 全局安装 Claude Code](/images/screenshots/01-npm-install.png)

> 📷 示意图；版本号为真实 npm latest 2.1.310

> ⚠️ 不要使用 `sudo npm install -g`，可能导致权限问题和安全风险。

### 方法五：Linux 包管理器

官方还提供 apt（Debian/Ubuntu）、dnf 和 apk（Alpine）软件源，需要先导入 Anthropic 的签名密钥。步骤较长，请直接参考[官方文档：Install with Linux package managers](https://code.claude.com/docs/en/setup#install-with-linux-package-managers)。

## 🔄 更新与版本管理

```bash
# 手动更新到最新版本
claude update

# 安装/切换到指定通道或版本（原生安装）
claude install stable
claude install latest
```

![claude update 示意](/images/screenshots/01-update.png)

> 📷 真实输出（已打码，Claude Code 2.1.310）

![claude install stable / latest 示意](/images/screenshots/01-install-stable.png)

> 📷 示意图：stable 通常比 latest 晚约一周

原生安装默认跟随 `latest` 通道。想要更稳的版本，可以在 `/config` → **Auto-update channel** 中切换，或写入 `~/.claude/settings.json`：

```json
{
  "autoUpdatesChannel": "stable"
}
```

> 💡 新发布的模型可能需要比 stable 通道更新的 Claude Code 版本，如需立即使用新模型请切回 `latest`。

安装指定版本（以官方文档示例中的 2.1.89 为例）：

```bash
curl -fsSL https://claude.ai/install.sh | bash -s 2.1.89
```

## ✅ 验证安装

安装完成后，在终端中运行：

```bash
claude --version
```
![claude --version 输出（2.1.310）](/images/screenshots/01-version.png)

> 📷 真实输出（已打码，Claude Code 2.1.310）

![claude doctor 诊断示意](/images/screenshots/01-doctor.png)

> 📷 真实输出（已打码，Claude Code 2.1.310）

> 📷 示意图


如果显示版本号（例如 `2.1.310 (Claude Code)`），说明安装成功！还可以运行 `claude doctor` 检查安装和自动更新状态。

## 🚀 首次启动

在任意项目目录中运行：

```bash
claude
```

首次使用时，系统会提示你登录授权。

## 🔧 VS Code 扩展安装

1. 打开 VS Code 扩展视图（`Cmd+Shift+X` / `Ctrl+Shift+X`）
2. 搜索 "Claude Code"
3. 点击安装
4. 安装后打开命令面板（`Cmd+Shift+P` / `Ctrl+Shift+P`）
5. 输入 "Claude Code"，选择"在新标签页中打开"

## 📱 JetBrains 插件安装

1. 打开你的 JetBrains IDE（IntelliJ IDEA、PyCharm、WebStorm 等）
2. 进入 `File` → `Settings` → `Plugins`
3. 搜索 "Claude Code"
4. 安装并重启 IDE

## 🌐 Web 版使用

无需安装，直接在浏览器中访问：

👉 **[claude.ai/code](https://claude.ai/code)**


## 💰 付费方案

Claude Code 需要订阅才能使用，提供以下方案：

| 方案 | 价格 | 适用场景 | 特点 |
|------|------|----------|------|
| **Claude Pro** | $20/月 | 个人开发者 | 基础用量，适合日常开发 |
| **Claude Max 5x** | $100/月 | 重度使用者 | 5 倍用量，大型项目 |
| **Claude Max 20x** | $200/月 | 专业团队/企业 | 20 倍用量，团队协作 |

💡 **提示**: Max 方案提供更多使用量，适合频繁使用 Claude Code 的开发者。不同方案的用量限制可能会随时间调整，请参考官方定价页面获取最新信息。

## 🏢 企业 API 认证

除了个人账户登录，企业用户还可以通过 Anthropic Console 进行认证：

```bash
# 使用 Console API Key 认证
claude auth login --console
```

**适用场景：**
- 企业已有 Anthropic API 账户
- 需要通过 API Key 管理访问权限
- 使用企业付费方案
- 在 CI/CD 环境中自动化使用

## 🖥️ 五种使用环境对比

| 环境 | 安装方式 | 功能完整度 | 适合场景 |
|------|----------|------------|----------|
| **Terminal CLI** | `curl` / `brew` / `winget` / `npm` | ⭐⭐⭐⭐⭐ 全功能 | 开发者日常使用 |
| **VS Code** | 扩展市场安装 | ⭐⭐⭐⭐⭐ 全功能 | 编辑器内开发 |
| **Desktop App** | claude.ai/download | ⭐⭐⭐⭐ | 独立使用 |
| **Web** | claude.ai/code | ⭐⭐⭐⭐ | 无需安装 |
| **JetBrains** | 插件市场安装 | ⭐⭐⭐⭐ | Java/Kotlin 开发 |

## ⚠️ 常见问题

### Q: Windows 上推荐使用什么环境？

**A**: 推荐使用 **WSL (Windows Subsystem for Linux)**，因为它提供最佳的原生兼容性。

### Q: 安装后找不到命令？

**A**: 确保已将 Claude Code 添加到系统 PATH。重启终端或检查安装路径，然后运行 `claude doctor` 排查。

### Q: 需要付费吗？

**A**: Claude Code 需要 Claude 订阅或 Anthropic Console 账户。Terminal CLI 和 VS Code 也支持第三方提供商。

## 📚 下一步

安装完成后，继续学习 [02. 登录与授权](./02-authentication.md)

## 🔗 相关资源

- [官方安装文档](https://code.claude.com/docs/zh-CN/quickstart)
- [官方 Setup 文档（英文，最全）](https://code.claude.com/docs/en/setup)
- [B站视频教程](https://www.bilibili.com/video/BV1KzYQzWEPx/)


---

> 💡 **API 推荐**：[https://tryallapi.com/](https://tryallapi.com/) - 一站式接入各种AI服务，注册即送0.2刀
