# 29. 高级命令与反模式

本章涵盖 Claude Code 的高级命令用法和常见反模式，帮助你避开陷阱、提升效率。

## 🎯 章节概览

```
第一部分：高级命令
  - /btw 侧链对话
  - /compact 上下文压缩
  - /clear 清空会话
  - /rewind 回滚机制
  - Slash Commands（.claude/commands/）
  - 非交互模式（-p）和 --allowedTools

第二部分：六个常见反模式
  - 反模式 1: 一个会话什么都塞
  - 反模式 2: 反复纠正越改越偏
  - 反模式 3: 看着像对就接受了
  - 反模式 4: 过度微操
  - 反模式 5: 需求模糊
  - 反模式 6: 不写 CLAUDE.md
```

## 💬 /btw 侧链对话

### 什么是 /btw？

`/btw`（By The Way）让你在不污染主上下文的情况下，问一个旁支问题。

```
主对话：
你: "帮我重构认证模块"
Claude: [开始重构...]

你突然想到：
你: /btw JWT 和 Session 的区别是什么？
Claude: "JWT 是无状态的令牌...",
简要回答后自动回到主对话。

→ 主对话的上下文不受影响
→ 认证重构任务不会被打断
```

### 为什么需要 /btw？

```
没有 /btw：
你: "帮我重构认证模块"
你: "对了，JWT 和 Session 什么区别？"
→ 这个问题进入了主上下文
→ 占用了宝贵的上下文空间
→ 可能干扰重构任务

有 /btw：
你: "帮我重构认证模块"
你: /btw JWT 和 Session 什么区别？
→ 在独立的侧链中回答
→ 主上下文保持干净
→ 重构任务不受干扰
```

### 使用时机

| 场景 | 用 /btw？ | 原因 |
|------|-----------|------|
| 与当前任务无关的问题 | ✅ | 不污染主上下文 |
| 快速查阅某个概念 | ✅ | 轻量级交互 |
| 与当前任务相关的疑问 | ❌ | 直接问，需要上下文 |
| 需要详细讨论的问题 | ❌ | /btw 是轻量的，不适合长对话 |

## 📦 /compact 上下文压缩

### 什么是 /compact？

`/compact` 将当前对话的上下文压缩，保留关键信息，释放上下文空间。

```
上下文快满时：
你: /compact

Claude:
→ 分析当前对话
→ 提取关键信息
→ 压缩上下文
→ 释放空间

✅ 上下文已压缩
保留的关键信息：
- 任务：重构认证模块
- 已完成：JWT 实现完成
- 待完成：Session 管理和刷新令牌
```

### /compact vs /clear

| 命令 | 作用 | 保留信息 |
|------|------|----------|
| `/compact` | 压缩上下文 | 保留摘要和关键决策 |
| `/clear` | 清空上下文 | 完全清除，从头开始 |

### 何时使用 /compact

```
✅ 适合使用 /compact 的时机：
- 对话变得很长，上下文接近限制
- 已完成一个大任务，开始下一个
- Claude 开始"遗忘"之前的对话内容

❌ 不适合的时机：
- 对话还很短
- 正在进行需要完整上下文的任务
```

## 🧹 /clear 清空会话

### 何时使用 /clear？

```
✅ 应该使用 /clear 的时机：
1. 任务完全完成后，开始全新任务
2. 上下文严重污染，Claude 频繁犯错
3. 切换到完全不同的项目或模块

❌ 不要使用 /clear 的时机：
1. 还在同一个任务的进行中
2. 只是想换个话题（用 /btw 代替）
3. Claude 偶尔犯一次错（纠正即可）
```

## ⏪ /rewind 回滚机制

### 什么是 /rewind？

`/rewind` 让你回退到之前的某个对话状态，撤销之后的操作。

```
对话过程：
[状态 1] 你: "创建用户组件"
[状态 2] Claude: [创建组件]
[状态 3] 你: "添加表单验证"
[状态 4] Claude: [添加验证]
[状态 5] 你: "现在改成列表组件"  ← 不对，应该新建
[状态 6] Claude: [修改成了列表]  ← 糟糕

你: /rewind 5
→ 回退到状态 5
→ 状态 6 的修改被撤销
→ 你可以重新描述需求
```

💡 更详细的内容参见 [09. 版本回滚 (Rewind)](./09-rewind.md)

## 📝 Slash Commands（.claude/commands/）

### 什么是 Slash Commands？

Slash Commands 是存放在 `.claude/commands/` 目录下的 Markdown 文件，每个文件就是一个自定义命令。

```
项目结构：
.claude/
└── commands/
    ├── review.md        # /project:review
    ├── deploy.md        # /project:deploy
    └── test-fix.md      # /project:test-fix
```

### 创建自定义命令

```markdown
<!-- .claude/commands/review.md -->
审查当前分支的所有变更，重点关注：
1. 安全漏洞
2. 性能问题
3. 代码风格
输出结构化的审查报告。
```

使用：

```
你: /project:review

Claude:
→ 读取 review.md 的指令
→ 执行代码审查
→ 输出报告
```

### Slash Commands vs Skills

| 特性 | Slash Commands | Skills |
|------|---------------|--------|
| 存储位置 | `.claude/commands/` | `.claude/skills/` |
| 复杂度 | 简单（单个 Markdown） | 复杂（多文件结构） |
| 参数支持 | 无结构化参数 | 支持结构化参数 |
| 条件逻辑 | 纯文本指令 | 可包含条件逻辑 |
| 适用场景 | 快速自定义命令 | 复杂工作流 |
| 创建速度 | 快（一个文件） | 慢（需要多个文件） |

### 选择指南

```
用 Slash Commands：
→ 简单的、一次性的指令
→ 不需要参数的命令
→ 快速创建和使用

用 Skills：
→ 复杂的多步骤工作流
→ 需要参数化
→ 需要条件逻辑和错误处理
→ 需要复用和分享
```

### 内联 Bash 脚本预计算

Slash Commands 支持 Bash 脚本预计算，让你在命令中嵌入动态数据：

```markdown
<!-- .claude/commands/pr-status.md -->
当前 PR 的状态：
```bash
gh pr view --json title,state,additions,deletions,reviewDecision
```

请根据以上信息分析 PR 进展，并给出下一步建议。
```

```
你: /project:pr-status

Claude:
→ 先执行 Bash 命令获取 PR 数据
→ 然后根据数据进行分析
→ 输出建议

当前 PR #123 状态：
- 标题: "添加用户认证"
- 状态: Open
- 新增: +256 行
- 删除: -42 行
- 审查决定: Approved

建议：可以合并了...
```

## 🔧 非交互模式（-p）和 --allowedTools

### -p 非交互模式

```bash
# 基本用法：管道输入
echo "解释这段代码" | claude -p

# 从文件读取
claude -p "审查这个文件" < src/utils/helper.ts

# 输出到文件
claude -p "生成 README" > README.md

# 结合管道
cat src/**/*.ts | claude -p "找出所有 TODO 注释"
```

### --allowedTools 限制工具

```bash
# 只允许读取文件
claude -p "分析代码结构" --allowedTools "Read,Glob,Grep"

# 只允许运行特定命令
claude -p "运行测试" --allowedTools "Bash(npm test)"

# CI/CD 中的安全用法
claude -p "检查代码规范" \
  --allowedTools "Read,Glob,Grep,Bash(npm run lint)"
```

### -p 模式在 CI/CD 中的应用

```yaml
# GitHub Actions 示例
name: AI Code Review
on: [pull_request]

jobs:
  review:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: AI Review
        run: |
          claude -p "审查这个 PR 的代码变更" \
            --allowedTools "Read,Glob,Grep" \
            < <(gh pr diff ${{ github.event.pull_request.number }})
```

---

## ⚠️ 六个常见反模式

了解这些反模式，可以帮助你避开大多数 Claude Code 用户会踩的坑。

### 反模式 1：一个会话什么都塞

```
❌ 错误做法：
同一个会话中：
"帮我修 bug" → "帮我写测试" → "帮我做部署" →
"帮我设计数据库" → "帮我写文档" → "帮我..."

问题：
- 上下文被各种无关信息污染
- Claude 容易混淆不同任务的上下文
- 后面的任务质量越来越差

✅ 正确做法：
每个会话专注一个任务
修 bug → 新会话 → 写测试 → 新会话 → 做部署
```

### 反模式 2：反复纠正越改越偏

```
❌ 错误做法：
你: "把按钮改成红色"
Claude: [改了]
你: "不对，应该更深一点"
Claude: [改了]
你: "还是不对，暗红色"
Claude: [改了]
你: "算了，还是蓝色吧"
→ 改了 4 次，每次都在前一次的基础上改
→ 代码可能被改得面目全非

✅ 正确做法：
你: "把按钮改成 #1a56db 这个蓝色"
→ 一次性给出精确的需求

或者：
你: /rewind 3  ← 回到最初的状态
你: "按钮颜色用 brand-primary 这个 CSS 变量"
```

### 反模式 3：看着像对就接受了

```
❌ 错误做法：
Claude: "我修改了 auth.js，添加了密码验证"
你: [看了一眼代码，大概像对的]
"好的，看起来没问题"
→ 实际上可能有边界情况没有处理
→ 安全漏洞可能被忽略

✅ 正确做法：
1. 让 Claude 解释修改
   "解释一下你改了什么，为什么这样改"
2. 主动测试
   "运行测试看看有没有失败"
3. 检查边界情况
   "空输入、超长输入、特殊字符都处理了吗？"
```

### 反模式 4：过度微操

```
❌ 错误做法：
你: "创建一个 UserController 类"
Claude: [创建]
你: "添加一个 getUser 方法"
Claude: [添加]
你: "方法参数加个 id"
Claude: [修改]
你: "返回类型用 UserDTO"
Claude: [修改]
你: "加上 @GetMapping 注解"
Claude: [修改]

→ 像操作木偶一样控制 Claude
→ 浪费了大量交互轮次
→ Claude 的能力没有发挥出来

✅ 正确做法：
你: "创建一个 UserController，包含 CRUD 接口：
GET /api/users/:id → 返回 UserDTO
POST /api/users → 创建用户
PUT /api/users/:id → 更新用户
DELETE /api/users/:id → 删除用户
使用 Spring Boot 风格"

→ 一次性给出完整需求
→ Claude 可以自主完成
→ 你只审查最终结果
```

### 反模式 5：需求模糊

```
❌ 错误做法：
你: "优化一下性能"
你: "改一下样式"
你: "让它更好用"

→ Claude 不知道你要优化什么
→ 结果可能完全不符合预期
→ 反复返工浪费时间

✅ 正确做法：
你: "优化用户列表页面的加载性能，
目标从 3 秒降到 1 秒以内。
主要瓶颈是 API 请求太多，
考虑合并请求或使用缓存。"

→ 清晰的问题描述
→ 具体的目标
→ 建议的方向
```

### 反模式 6：不写 CLAUDE.md

```
❌ 没有写 CLAUDE.md 的后果：
会话 1: "这是一个 React 项目..."
会话 2: "这是一个 React 项目..."
会话 3: "这是一个 React 项目..."
→ 每次都要重复解释项目信息
→ Claude 对项目的理解不一致
→ 团队成员各自为政

✅ 写了 CLAUDE.md 后：
会话 1: Claude 自动读取 CLAUDE.md → 立即理解项目
会话 2: Claude 自动读取 CLAUDE.md → 立即理解项目
会话 3: Claude 自动读取 CLAUDE.md → 立即理解项目
→ 零重复解释
→ 一致的项目理解
→ 团队规范统一
```

💡 更详细的内容参见 [15. 项目记忆文件 (CLAUDE.md)](./15-claude-md.md)

## 📊 反模式速查表

| 反模式 | 核心问题 | 正确做法 |
|--------|----------|----------|
| 一个会话什么都塞 | 上下文污染 | 每个会话一个任务 |
| 反复纠正越改越偏 | 需求不精确 | 一次性给出精确需求 |
| 看着像对就接受 | 缺乏验证 | 主动测试和审查 |
| 过度微操 | 没有发挥 AI 自主性 | 给方向而非步骤 |
| 需求模糊 | Claude 猜测意图 | 描述清晰、目标具体 |
| 不写 CLAUDE.md | 重复劳动 | 写好项目记忆 |

## 🎓 最佳实践总结

### 高效对话的黄金法则

```
1. 一个会话一个目标
   → 专注 = 质量

2. 需求一次说清楚
   → 精确 = 少改

3. 给方向不给步骤
   → 信任 = 效率

4. 结果一定要验证
   → 审查 = 安全

5. 善用侧链和压缩
   → 工具 = 流畅
```

## 📚 下一步

恭喜你完成了所有章节的学习！回顾完整目录请查看 [章节索引](./index.md)

## 🔗 相关资源

- [Claude Code 命令参考](https://code.claude.com/docs/zh-CN/commands)
- [非交互模式文档](https://code.claude.com/docs/zh-CN/pipeline)
- [最佳实践指南](https://code.claude.com/docs/zh-CN/best-practices)


---

> 💡 **API 推荐**：[https://tryallapi.com/](https://tryallapi.com/) - 一站式接入各种AI服务，注册即送0.2刀
