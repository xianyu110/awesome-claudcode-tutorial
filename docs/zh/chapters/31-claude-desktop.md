# 31. Claude Desktop：图形界面里的 Claude Code

> 📌 **版本说明**：本章基于 Claude Desktop 官方文档（[Desktop quickstart](https://code.claude.com/docs/en/desktop-quickstart)、[Use Claude Code Desktop](https://code.claude.com/docs/en/desktop)）与 [MCP 官方文档](https://modelcontextprotocol.io/docs/develop/connect-local-servers) 整理，对照本机 Claude Desktop **1.34493.1**（macOS 26.3 / arm64）与 Claude Code CLI **2.1.310**。文中菜单名称已与 Claude.app 1.34493.1 内置界面文案（`en-US` / `zh-CN`）逐一核对：英文界面名称在前，括号内为简体中文界面显示的名称。Desktop 界面会随版本调整，实际以你看到的为准。

> 📷 **截图说明**：本章配图**都不是 Desktop 图形界面截图**。标注 **终端输出** 的是在本机终端里采集的真实命令输出（敏感值已用 `••` 替换）；标注 **示意图** 的是按官方文档整理的终端风格渲染图，仅用来概括界面要点。Desktop 真实界面截图将在后续补充。所有密钥均为占位符（`sk-xxxx`）。

Claude Desktop 的 **Code** 标签让你不打开终端也能使用 Claude Code：可视化 diff、并行会话、内置终端、连接器、计划任务等。它和 CLI 共用同一个引擎和配置，可以随时来回切换。

## 📥 一、安装与登录

### 1.1 下载安装

官方提供的安装包：

| 系统 | 安装包 |
|------|--------|
| macOS | Universal 构建（Intel 与 Apple Silicon 通用）`.dmg` |
| Windows | x64 安装包；ARM64 设备另有单独安装包 |
| Linux | beta，通过 apt 仓库或 `.deb` 安装（Ubuntu / Debian） |

下载地址见官方 [Desktop quickstart](https://code.claude.com/docs/en/desktop-quickstart)。**Desktop 内置 Claude Code，不需要单独安装 Node.js 或 CLI。**

![Claude Desktop 下载与系统选择](/images/screenshots/31-desktop-download.png)

*示意图：终端风格渲染，概括官方文档中的界面要点，不是 Desktop 真实界面截图*

### 1.2 确认已安装（macOS）

安装后可以在终端确认应用和版本：

```bash
ls -d /Applications/Claude.app
defaults read /Applications/Claude.app/Contents/Info CFBundleShortVersionString
```

![检查 Claude.app 是否安装及版本](/images/screenshots/31-desktop-installed.png)

*终端输出（Mac 真实采集，2026-10-24）*

### 1.3 登录并进入 Code 标签

打开 Claude，用 Anthropic 账号登录，然后点击侧边栏顶部的 **Code**（中文界面：**代码**）。

> ⚠️ Code 标签需要 **Pro、Max、Team 或 Enterprise** 订阅。

## 🚀 二、开始第一个会话

在 Code 标签中，输入框下方依次是：

- **环境**：`Local`（本地，本机）、`Cloud`（云端，Anthropic 云端）、`SSH`（远程机器）；Windows 上还可以选 WSL
- **项目文件夹**：选择 `Open folder…`（打开文件夹...）或最近的项目
- **模型** 和 **权限模式** 选择器

官方建议第一次选 Local、选一个熟悉的小项目，然后试一句：`Find a TODO comment and fix it`。

Claude 改完文件后，会出现类似 `+12 -1` 的改动指示，点击即可打开 diff 视图逐行审阅、评论，也可以输入 `/code-review` 让 Claude 自查。

其他常用操作：

- 在输入框输入 `@文件名` 引用文件
- 输入 `/`，或点 **+** → **Slash commands**（斜线命令），浏览命令和技能
- 按 `` Ctrl+` `` 打开内置终端

![Code 标签：开始第一个会话](/images/screenshots/31-code-tab-session.png)

*示意图：终端风格渲染，概括官方文档中的界面要点，不是 Desktop 真实界面截图*

## 🛡️ 三、权限模式

Desktop 的权限模式在输入框旁的模式选择器中切换，和 CLI 一一对应：

| Desktop 模式 | CLI 对应 | 说明 |
|--------------|----------|------|
| Manual（手动） | `default` | 编辑文件、运行命令前先询问 |
| Accept edits（接受编辑） | `acceptEdits` | 自动接受文件编辑 |
| Plan（计划） | `plan` | 只分析和出方案，不修改文件 |
| Auto（自动） | `auto` | 后台分类器拦截高风险操作 |
| Bypass permissions（绕过权限） | `bypassPermissions` | 需在 **Settings → Claude Code**（设置 → Claude Code）中开启 “Allow bypass permissions mode”（允许绕过权限模式）；只建议在沙箱/虚拟机中使用 |

注意：

- `dontAsk` 模式只在 CLI 中可用
- Desktop 里 **Shift+Tab 不会循环切换模式**，请用模式选择器

![Desktop 权限模式](/images/screenshots/31-permission-modes.png)

*示意图：终端风格渲染，概括官方文档中的界面要点，不是 Desktop 真实界面截图*

## 🔌 四、MCP、连接器与插件

### 4.1 claude_desktop_config.json 的位置

Desktop 本地 MCP 服务器配置在 `claude_desktop_config.json`：

| 系统 | 路径 |
|------|------|
| macOS | `~/Library/Application Support/Claude/claude_desktop_config.json` |
| Windows | `%APPDATA%\Claude\claude_desktop_config.json` |

也可以在 Claude 中打开 **Settings → Developer → Edit Config**（设置 → 开发者 → 编辑配置）直接编辑。

![claude_desktop_config.json 路径与权限](/images/screenshots/31-desktop-config-path.png)

*终端输出（Mac 真实采集 · 已打码）：只列出键名，不打印值*

### 4.2 查看现有内容（打码）

本机配置文件当前只有应用自身的偏好设置，尚未添加 `mcpServers`：

![claude_desktop_config.json 内容（值已打码）](/images/screenshots/31-desktop-config-redacted.png)

*终端输出（Mac 真实采集 · 已打码）*

同一目录下是 Electron 应用的缓存和存储文件，一般不需要手动修改：

![Claude 应用数据目录](/images/screenshots/31-desktop-appsupport.png)

*终端输出（Mac 真实采集，节选；Cookies 等文件内容未读取）。本机尚未安装任何桌面扩展。*

### 4.3 添加 MCP 服务器

在配置文件中加入 `mcpServers`（示例为占位符）：

```json
{
  "mcpServers": {
    "example": {
      "command": "npx",
      "args": ["-y", "@example/mcp-server"],
      "env": { "API_KEY": "sk-xxxx" }
    }
  }
}
```

要点（来自 MCP 官方文档）：

- 修改后需要**完全退出并重新启动** Claude Desktop
- 文件路径参数请使用**绝对路径**
- 不要把真实密钥提交到 Git 仓库

![在 claude_desktop_config.json 中添加 MCP](/images/screenshots/31-desktop-config-mcp.png)

*示意图：终端风格渲染，密钥为占位符 sk-xxxx*

### 4.4 Desktop 与 CLI 的 MCP 关系

- Desktop 会把 `claude_desktop_config.json` 中的 MCP 服务器加载到 **本地 Code 会话**；与 Claude Code 配置同名时，以 `claude_desktop_config.json` 为准
- **独立的 CLI 不会读取** `claude_desktop_config.json`。想在终端里使用同样的服务器，可以导入：

```bash
claude mcp add-from-claude-desktop            # 默认 local 作用域
claude mcp add-from-claude-desktop -s user    # 导入到用户作用域
```

该命令仅支持 macOS 与 WSL。

![claude mcp add-from-claude-desktop --help](/images/screenshots/31-mcp-import-help.png)

*终端输出（Claude Code 2.1.310 真实采集）；仅查看帮助，未实际导入*

### 4.5 连接器与插件

不想手写 JSON，可以用图形化方式：

- **连接器（Connectors）**：点输入框旁 **+** → **Add connectors**（添加连接器；旧版界面为 Connectors → Browse connectors / 浏览连接器）；在 **Settings > Connectors**（设置 > 连接器）中管理或断开
- **插件（Plugins）**：点 **+** → **Add plugins**（添加插件；旧版为 Plugins → Browse plugins / Manage plugins，即 浏览插件 / 管理插件），插件可以打包 skills、agents、hooks 和 MCP 服务器

![输入框旁的 + 菜单](/images/screenshots/31-connectors-plugins.png)

*示意图：终端风格渲染，概括官方文档中的界面要点，不是 Desktop 真实界面截图*

## 🖥️ 五、Computer Use（屏幕操作）

Desktop 中 Claude 可以打开应用、操作屏幕（研究预览）：

- 支持 **macOS 与 Windows**，需要 **Pro 或 Max** 订阅（Team / Enterprise 不可用）；macOS 需 14 及以上
- 开启：**Settings > This computer > System**（设置 > This computer > 系统；“This computer” 在中文界面中未翻译）→ 打开 **Enable computer use**（启用计算机使用）
- macOS 需授予 **Accessibility（辅助功能）** 和 **Screen Recording（屏幕录制）** 权限
- 每个应用首次被操作时会询问 **Allow for this session / Deny**
- 不同应用有不同权限等级：例如浏览器仅可查看，终端和 IDE 仅可点击

更多 Computer Use 用法见 [第 26 章](./26-computer-use.md)。

![开启 Computer Use](/images/screenshots/31-computer-use-settings.png)

*示意图：终端风格渲染，概括官方文档中的界面要点，不是 Desktop 真实界面截图*

## 🔄 六、CLI 与 Desktop 互相切换

### 6.1 CLI 参数在 Desktop 中的对应

| CLI | Desktop |
|-----|---------|
| `--model sonnet` | 行内模型选择器 |
| `--resume` / `--continue` | 在侧边栏点击会话，或输入 `/resume` |
| `--permission-mode` | 行内模式选择器 |
| `--dangerously-skip-permissions` | Bypass permissions（绕过权限）模式 |
| `--worktree` | 项目文件夹控件中打开 Worktree |
| `--print` / `--output-format` | 不可用（Desktop 仅交互） |

Desktop 暂不支持：`--print` 非交互输出、Agent teams、行内补全、Linux 上的 Computer Use。

![CLI 参数与 Desktop 对照](/images/screenshots/31-cli-vs-desktop.png)

*示意图：按官方文档整理的对照表*

### 6.2 从终端打开 Desktop

Claude Code 2.1.285 起，CLI 提供 `--desktop` 参数：

![claude --help 中的 --desktop](/images/screenshots/31-cli-desktop-flag.png)

*终端输出（Claude Code 2.1.310 真实采集）*

### 6.3 把 CLI 会话交给 Desktop

```bash
# 在 Desktop 中继续某个 CLI 会话
claude --desktop --resume <session-id>
```

或者在终端会话中输入 `/desktop`（macOS 与 x64 Windows；需要用 Claude 订阅登录，API Key、Bedrock、Agent Platform、Foundry 登录时不可用）。反过来，在 Desktop 中输入 `/resume` 也能选择 CLI 会话。

![把 CLI 会话交给 Desktop](/images/screenshots/31-desktop-resume.png)

*示意图：终端风格渲染，输出格式取自官方文档；本次未执行以免改动会话*

### 6.4 共享的配置

Desktop 与 CLI 共用：`CLAUDE.md`、`~/.claude.json`、`.mcp.json`、hooks、skills、`settings.json` 等。Desktop 中创建的 worktree 默认位于 `<项目根>/.claude/worktrees/`。

## ❓ 常见问题

**Q：没看到 Code 标签？**
确认账号为 Pro / Max / Team / Enterprise，并已更新到最新版 Desktop。

**Q：改了 claude_desktop_config.json 没生效？**
完全退出 Claude（不是只关窗口）后重新打开；检查 JSON 格式和绝对路径。

**Q：终端里看不到 Desktop 配的 MCP？**
CLI 不读 `claude_desktop_config.json`，用 `claude mcp add-from-claude-desktop` 导入。

## 📚 参考资料

- [Desktop quickstart](https://code.claude.com/docs/en/desktop-quickstart)
- [Use Claude Code Desktop](https://code.claude.com/docs/en/desktop)
- [Claude Code MCP](https://code.claude.com/docs/en/mcp)
- [Connect to local MCP servers](https://modelcontextprotocol.io/docs/develop/connect-local-servers)
- [Claude 帮助中心](https://support.claude.com)

---

上一章：[30. 新版速览：Claude Code 2.1.310](./30-whats-new-2-1-310.md) ｜ 返回 [目录](./index.md)
