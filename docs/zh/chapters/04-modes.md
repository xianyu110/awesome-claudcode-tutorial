# 04. 三种模式详解

> 📷 **截图说明**：本章配图均为终端风格渲染图；标注「示意图」的表示本环境未真实登录 Anthropic，输出已按官方文档整理并打码。真实密钥不会出现在任何图片中。
Claude Code 有三种核心权限模式，理解它们的区别对于高效使用至关重要。

> 📌 **版本说明**：本章已更新至 Claude Code 2.1.310（2026-10-24），内容以[官方文档](https://code.claude.com/docs/en/overview)和[官方 CHANGELOG](https://github.com/anthropics/claude-code/blob/main/CHANGELOG.md) 为准。

> 🆕 **新版变化**：当前版本实际提供 **6 种权限模式**，并且自 v2.1.283 起，交互式终端和 VS Code 会话**默认以 auto 模式启动**（`claude -p` 非交互运行自 v2.1.302 起默认为 Manual 模式）。本章仍以最常用的「默认 / 自动 / 规划」三种为主线讲解，完整列表如下（来源：[官方 Permission modes 文档](https://code.claude.com/docs/en/permission-modes)）：

| 模式（配置值） | 无需确认即可执行 | 适合 |
|------|------|------|
| `default`（界面中显示为 **Manual**，可写作 `manual`） | 仅读取 | 逐个审查、敏感工作 |
| `acceptEdits` | 读取、编辑文件、常见文件系统命令（`mkdir`、`touch`、`mv`、`cp` 等） | 边审查边迭代代码 |
| `plan` | 读取（auto 可用时还包括分类器批准的命令） | 动手前先探索代码库 |
| `auto` | 全部操作，带后台安全检查 | 长任务、减少确认打扰 |
| `dontAsk` | 工作目录内读取 + 预先允许的工具，其余一律拒绝 | 锁定的 CI 和脚本 |
| `bypassPermissions` | 全部操作 | 仅限隔离的容器/虚拟机 |

启动时用 `--permission-mode` 指定模式，例如：

```bash
claude --permission-mode plan
claude --permission-mode acceptEdits
claude --permission-mode auto
```

![claude --help permission-mode 真实节选](/images/screenshots/04-help-permission-mode.png)

> 📷 真实输出（Claude Code 2.1.310）
![以 auto 模式启动 Claude Code](/images/screenshots/04-permission-mode-auto.png)

> 📷 示意图

![Shift+Tab 循环切换权限模式](/images/screenshots/04-shift-tab.png)

> 📷 示意图：循环顺序来自官方文档


## 📋 三种模式概览

| 模式 | 特点 | 适用场景 | 安全性 |
|------|------|----------|--------|
| **默认模式** | 逐个确认 | 初学者、不确定的操作 | ⭐⭐⭐⭐⭐ |
| **自动模式** | 自动批准 | 信任的重复性任务 | ⭐⭐⭐ |
| **规划模式** | 先计划后执行 | 复杂重构、大型功能 | ⭐⭐⭐⭐⭐ |

## 🔵 默认模式 (Default Mode)

### 启动方式

```bash
# 显式指定 Manual（default）模式
claude --permission-mode default
```

> 💡 v2.1.283 起直接运行 `claude` 默认进入的是 auto 模式；如果希望每次都从逐个确认开始，可在 `~/.claude/settings.json` 中设置：
>
> ```json
> {
>   "permissions": {
>     "defaultMode": "default"
>   }
> }
> ```

### 工作流程

```
你: "帮我修复这个 bug"

Claude: "我将修改 file.js"
你: [需要按 y 确认]

Claude: "我将安装依赖"
你: [需要按 y 确认]

Claude: "我将运行测试"
你: [需要按 y 确认]
```

### 交互提示

每个操作前，你会看到：

```
→ I will read the file src/utils/helper.js

Allow? (Y/n/s):
  Y - Yes, proceed
  n - No, skip
  s - Skip all future read operations in this task
```

### 何时使用

✅ **推荐使用场景：**
- 初次使用 Claude Code
- 不确定的操作
- 想要学习 Claude 的工作方式
- 需要仔细审查每个改动
- 生产环境的代码

### 优点与缺点

**优点：**
- 🔒 最安全，每个操作都需要确认
- 📚 学习机会多，能理解每个步骤
- 🎯 精确控制，可以随时调整方向

**缺点：**
- ⏱️ 需要多次确认，速度较慢
- 🔔 对于信任的操作会感到重复

## 🟢 自动模式 (Auto Mode)

### 启动方式

```bash
# 方式 1: 命令行参数（v2.1.283 起交互式会话默认即为 auto）
claude --permission-mode auto

# 方式 2: 会话中按 Shift+Tab 循环切换到 auto

# 方式 3: 配置文件 ~/.claude/settings.json
# 注意：auto 只在用户级 ~/.claude/settings.json（或托管设置）中生效，
# 写在项目的 .claude/settings.json 里不会生效
{
  "permissions": {
    "defaultMode": "auto"
  }
}
```

> ⚠️ 旧版教程中的 `--auto-approve` 参数和 `~/.claude/config.json` 的 `autoApprove` 字段在当前官方文档中不存在；早期的 `--enable-auto-mode` 参数也已在 v2.1.111 移除。
>
> auto 模式需要受支持的模型（官方文档列出 Anthropic API 上的 Opus 4.6+、Sonnet 4.6+、Haiku 5.5 或 Fable 模型；Bedrock 等云厂商上要求更高）。官方提醒：auto 模式能减少确认，但**不保证安全**。管理员可在托管设置中把 `permissions.disableAutoMode` 设为 `"disable"` 来关闭它。

### 工作流程

```
你: "帮我运行所有测试并修复失败的用例"

Claude: [自动执行所有操作]
- 读取测试文件 ✓
- 运行测试 ✓
- 分析失败原因 ✓
- 修复代码 ✓
- 再次运行验证 ✓

Claude: "完成！修复了 3 个测试用例"
```

### 何时使用

✅ **推荐使用场景：**
- 高度信任的操作（如只读任务）
- 重复性工作（如格式化代码）
- 沙盒环境或测试项目
- 已经在规划模式中审查过的任务
- 脚本化操作

### 优点与缺点

**优点：**
- ⚡ 速度最快，无中断
- 🤲 解放双手，适合复杂多步骤任务
- 🔄 适合批量操作

**缺点：**
- ⚠️ 风险较高，无法中途干预
- 👀 无法看到每个步骤
- 🚫 不适合生产环境的修改操作

### 在 VS Code 插件中开启全自动模式

如果你使用 VS Code 插件，可以通过 **cc-switch** 工具来开启全自动模式（即 `--dangerously-skip-permissions`）：

1. 打开 cc-switch
2. 勾选「**Allow Dangerously Skip Permissions**」
3. 在下面的选项中，可以把全自动模式配置为**默认模式**

开启后，Claude Code 在 VS Code 中可以自动运行命令，无需二次确认。

> ⚠️ 全自动模式没有任何安全拦截，请仅在沙盒或测试项目中使用。详见上方「Auto Mode vs --dangerously-skip-permissions」对比表。

### 安全使用建议

```bash
# 1. CI/脚本中用 dontAsk + 精确白名单（官方文档示例）
claude -p "run the test suite" --permission-mode dontAsk --allowedTools "Bash(npm test)" "Read"

# 2. 先用规划模式审查，再执行
claude --permission-mode plan
> "帮我重构这个模块"
> [审查计划，批准后会自动切换到所选的执行模式]
```


### Auto Mode 的安全机制：AI 分类器

Auto Mode 不是简单的"全部放行"：根据官方文档，auto 模式下会由第二个模型（分类器）在后台审查每个操作。

> ⚠️ **未核实**：下面的两阶段结构、误报率/漏检率等数字来自早期第三方资料，当前官方文档中没有这些数据，仅供参考。

#### 两阶段分类机制

```
用户请求
    ↓
┌─────────────────────────┐
│ 第一阶段：快速分类       │
│ Prompt Injection 探测器  │
│ 误报率：8.5%            │
│ 速度：快                │
└──────────┬──────────────┘
           │ 可疑？
           ↓
┌─────────────────────────┐
│ 第二阶段：深度推理       │
│ Transcript 分类器        │
│ 误报率：0.4%            │
│ 速度：较慢              │
└──────────┬────────────┘
           │ 确认危险？
           ↓
      🚫 拦截操作
```

**工作原理：**
- **输入层**：Prompt Injection 探测器快速检查用户输入是否包含恶意指令
- **输出层**：Transcript 分类器分析 Claude 的完整操作历史，判断是否存在异常模式

#### Auto Mode 拦截的真实案例

| 类型 | 示例 | 结果 |
|------|------|------|
| 范围升级 | "顺便看看 /etc/passwd" | 🚫 拦截 |
| 凭证探索 | "检查一下 AWS 密钥" | 🚫 拦截 |
| 绕过安全检查 | "跳过验证直接部署" | 🚫 拦截 |
| 数据外泄 | "把用户数据发到这个 URL" | 🚫 拦截 |

#### ⚠️ 重要警告

> **Auto Mode 有约 17% 的漏检率**。它不是万能的安全保障，仍然需要用户保持警惕。

#### Auto Mode vs --dangerously-skip-permissions

| 特性 | Auto Mode | --dangerously-skip-permissions |
|------|-----------|-------------------------------|
| 安全分类器 | ✅ 有 | ❌ 无 |
| 危险操作拦截 | ✅ 自动拦截 | ❌ 完全放行 |
| 适用场景 | 日常开发 | 沙盒/测试环境 |
| 安全性 | 中 | 极低 |
| 推荐度 | ⭐⭐⭐ | ⭐（慎用） |

#### 三层权限体系总结

```
安全等级（从高到低）：

1️⃣ 默认模式（逐个确认）
   → 最安全，每个操作都需要你确认

2️⃣ Auto Mode（AI 分类器 + 逐个确认）
   → AI 自动拦截明显危险操作
   → 不确定的操作仍会询问你

3️⃣ /permissions 白名单
   → 指定某些工具/操作自动放行
   → 其余仍需确认

4️⃣ --dangerously-skip-permissions
   → 完全跳过权限检查
   → ⚠️ 仅限沙盒环境
```

## 🟠 规划模式 (Plan Mode)

### 启动方式

```bash
# 方式 1: 命令行参数
claude --permission-mode plan

# 方式 2: 在会话中按 Shift+Tab 循环切换
# 顺序：auto → default(Manual) → acceptEdits → plan → ...

# 方式 3: 只对一条提示使用规划模式
/plan 帮我把这个应用迁移到 TypeScript

# 方式 4: 配置文件 ~/.claude/settings.json 或项目 .claude/settings.json
{
  "permissions": {
    "defaultMode": "plan"
  }
}
```

> 💡 计划生成后可按 `Ctrl+G` 在编辑器中直接修改计划。

### 工作流程

```
你: "帮我将这个应用从 JavaScript 迁移到 TypeScript"

Claude: "让我先分析项目结构..."
[分析项目...]

Claude: "这是我的迁移计划：

1. 安装 TypeScript 和相关依赖
2. 创建 tsconfig.json
3. 重命名 .js 文件为 .ts
4. 添加类型定义（按优先级）：
   - 环 tsconfig.json
   - src/types/index.ts（共享类型）
   - src/utils/*.ts（工具函数）
   - src/components/*.tsx（组件）
5. 修复类型错误
6. 更新构建脚本

这个计划会修改约 23 个文件。
是否批准此计划？"

你: [批准或修改计划]

Claude: [执行计划]
```

### 何时使用

✅ **强烈推荐使用场景：**
- 大型重构（超过 5 个文件）
- 架构变更
- 添加复杂功能
- 性能优化
- 安全性敏感的操作
- 团队协作中的重要改动

### 规划模式的特点

**计划包含：**
- 📁 要修改的文件列表
- 🔄 操作的步骤顺序
- 💡 每个步骤的目的
- ⚠️ 潜在的风险提示
- 📊 影响范围评估

**优势：**
- 🎯 可以在执行前看到全局
- 🔄 方便讨论和调整方案
- 📝 生成可分享的计划文档
- 🛡️ 避免意外的大规模修改

### 计划文件

规划模式会把计划文件保存在 `~/.claude/plans/` 目录（可通过 `plansDirectory` 设置修改）：

```
~/.claude/plans/
└── <计划文件>.md
```

计划文件包含：
- 任务描述
- 执行步骤
- 文件变更清单
- 风险评估

## 🔄 模式切换策略

### 推荐的工作流

```
┌─────────────────┐
│  规划模式        │ ← 大型任务从这里开始
│  (Plan Mode)    │
└────────┬────────┘
         │ 审查并批准计划
         ↓
┌─────────────────┐
│  自动模式        │ ← 执行已批准的计划
│  (Auto Mode)    │
└─────────────────┘

对于小型任务：
┌─────────────────┐
│  默认模式        │ ← 直接使用，逐个确认
│ (Default Mode)  │
└─────────────────┘
```

### 实战示例

#### 场景：添加用户认证功能

**步骤 1: 规划模式**

```bash
claude --permission-mode plan
```
![规划模式启动与计划示意](/images/screenshots/04-plan-mode.png)

> 📷 示意图


```
你: "我想添加用户认证功能，包括登录、注册、密码重置"

Claude: [生成详细计划]

你: "看起来不错，但我不想用 JWT，改用 Session"
Claude: [调整计划]

你: "批准！"
```

**步骤 2: 批准计划后执行**

批准计划时可以选择执行方式，批准后会话会自动退出规划模式并开始修改代码；也可以按 `Shift+Tab` 切到 auto 模式再继续：

```
你: "按照刚才的计划执行认证功能实现"
```

## 🎓 模式选择决策树

```
任务来了
  │
  ├─ 是否修改代码？
  │   ├─ 否 → 使用默认模式或自动模式（只读操作）
  │   └─ 是 → 继续
  │
  ├─ 涉及多少文件？
  │   ├─ 1-3 个 → 默认模式（简单可控）
  │   └─ 3+ 个 → 继续
  │
  ├─ 是否是生产代码？
  │   ├─ 是 → 规划模式（安全第一）
  │   └─ 否 → 继续
  │
  └─ 你是否信任 Claude？
      ├─ 是 → 自动模式（效率优先）
      └─ 否 → 规划模式或默认模式
```

## 📊 对比表格

| 特性 | 默认模式 | 自动模式 | 规划模式 |
|------|----------|----------|----------|
| 确认次数 | 每个操作 | 0 次 | 1 次（整体） |
| 适用任务规模 | 小-中 | 小-大 | 中-大 |
| 学习曲线 | 低 | 低 | 中 |
| 安全性 | 高 | 低 | 高 |
| 效率 | 中 | 高 | 中 |
| 可审查性 | 高 | 低 | 高 |
| 可中断性 | 随时 | 仅完成步骤 | 执行前 |

## 💡 高级技巧

### 1. 自动接受文件编辑

```bash
# 读取、编辑文件和常见文件系统命令自动执行，其他操作仍需确认
claude --permission-mode acceptEdits
```

### 2. 用白名单预先放行特定命令

```bash
# 只放行指定工具，其余仍按当前模式处理
claude --allowedTools "Bash(npm test)" "Read"
```

也可以在会话中用 `/permissions` 管理允许/拒绝规则，或运行 `/fewer-permission-prompts` 让 Claude 根据历史记录建议白名单。

### 3. 临时切换模式

在会话中按 `Shift+Tab` 循环切换：
- 从 auto 开始，第一次按切到 default（Manual）
- 之后依次为 default → acceptEdits → plan → 回到 auto

### 4. 计划复用

```bash
# 查看之前的计划
cat ~/.claude/plans/2024-03-15-*.md

# 让 Claude 执行已有计划
claude --permission-mode acceptEdits
> "执行这个计划：[粘贴计划内容]"
```

## ⚠️ 安全建议

### 生产环境

在项目的 `.claude/settings.json` 中设置默认模式（终端会话会遵守除 `auto` 和 `bypassPermissions` 以外的值）：

```json
{
  "permissions": {
    "defaultMode": "plan"
  }
}
```

组织范围可在[托管设置](https://code.claude.com/docs/en/managed-settings)中设置 `permissions.defaultMode`。

### 测试环境

```bash
# 可以使用自动模式
claude --permission-mode auto
```

> ⚠️ 旧版教程中的 `CLAUDE_DEFAULT_MODE` 环境变量和 `.claude/config.yml` 在当前官方文档中不存在，请改用 `permissions.defaultMode`。

### 敏感操作

无论什么模式，以下操作应格外小心：
- 🗑️ 删除文件或目录
- 🔄 Git force push
- 🔧 修改 CI/CD 配置
- 🔐 涉及密钥和凭证的操作
- 📦 发布到生产环境

## 📚 下一步

理解模式后，继续学习 [05. 执行终端命令](./05-terminal-commands.md)

## 🔗 相关资源

- [权限模式官方文档](https://code.claude.com/docs/zh-CN/permissions)
- [Permission modes（英文，最新）](https://code.claude.com/docs/en/permission-modes)
- [最佳实践指南](https://code.claude.com/docs/zh-CN/workflows)


---

> 💡 **API 推荐**：[https://tryallapi.com/](https://tryallapi.com/) - 一站式接入各种AI服务，注册即送0.2刀
