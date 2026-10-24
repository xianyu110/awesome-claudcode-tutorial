# 28. 多 Agent 协作

多 Agent 协作是 Claude Code 最强大的能力之一，让你同时运行多个 Agent 并行处理任务，大幅提升开发效率。

## 🎯 为什么需要多 Agent 协作？

### 从单 Agent 到多 Agent

```
单 Agent 工作方式：
你 → Claude → 做任务 A → 做任务 B → 做任务 C
时间：线性增长

多 Agent 工作方式：
你 → Claude → Agent 1（任务 A）
              → Agent 2（任务 B）
              → Agent 3（任务 C）
时间：并行，大幅缩短
```

### Anthropic 内部团队的用法

Boris（Claude Code 的产品负责人）的日常：
```
同时运行：
- 5 个本地 SubAgent（处理不同模块）
- 5-10 个云端 Agent（运行测试、构建、部署）
→ 一个人干一个团队的活
```

## 📁 基础设施：Git Worktrees

### 什么是 Git Worktree？

Git Worktree 允许你从同一个仓库创建多个工作目录，每个目录可以同时签出不同的分支。

```
传统方式（一个目录）：
my-project/  ← 只能在 main 分支
→ 要切换分支就要 stash 或 commit

Worktree 方式（多个目录）：
my-project/           ← main 分支
my-project-feature-a/  ← feature-a 分支
my-project-feature-b/  ← feature-b 分支
→ 同时在不同分支工作，互不干扰
```

### 使用 claude --worktree

```bash
# Claude Code 可以自动创建和管理 worktree
claude --worktree

# Claude 会：
# 1. 在 .claude/worktrees/ 下创建新的 worktree
# 2. 基于当前 HEAD 创建新分支
# 3. 将工作目录切换到新的 worktree
# 4. 完成后可以选择保留或删除
```

也可以直接指定 worktree 名称（官方示例）：`claude -w feature-auth`，worktree 会创建在 `<repo>/.claude/worktrees/<name>`。

### Worktree 与多 Agent 的关系

```
Worktree 是多 Agent 并行的基础设施：

Agent 1 ← worktree-1/（feature-a 分支）
Agent 2 ← worktree-2/（feature-b 分支）
Agent 3 ← worktree-3/（bugfix 分支）

每个 Agent 在独立的 worktree 中工作
→ 不会互相冲突
→ 完成后合并分支即可
```

## 🖥️ Tmux 集成

### 什么是 Tmux？

Tmux 是终端复用器，让你在一个终端窗口中运行多个终端会话。

```
Tmux 窗口布局：
┌─────────────┬─────────────┐
│  Agent 1    │  Agent 2    │
│  (Pane 1)   │  (Pane 2)   │
├─────────────┼──────────┤
│  Agent 3    │  Agent 4    │
│  (Pane 3)   │  (Pane 4)   │
└─────────────┴──────────┘

每个 Pane 运行一个独立的 Claude 会话
Ctrl+B + 方向键 切换 Pane
```

### Claude Code 与 Tmux 的配合

```
1. 创建 Tmux Session
   $ tmux new -s work

2. 在不同 Pane 中启动 Claude
   Pane 1: cd worktree-1 && claude
   Pane 2: cd worktree-2 && claude
   Pane 3: cd worktree-3 && claude

3. 在不同 Pane 中分配任务
   Pane 1: "重构认证模块"
   Pane 2: "添加支付功能"
   Pane 3: "修复搜索 bug"

4. 切换 Pane 查看进度
   Ctrl+B ← / →
```

## 🤝 Agent Teams

### 什么是 Agent Teams？

Agent Teams 是多个 Claude Code 会话互相通信和协调的工作模式。

```
Agent Teams vs 单个 SubAgent：

单个 SubAgent：
主 Agent → SubAgent → 返回结果
一对一关系

Agent Teams：
Writer Agent ←→ Reviewer Agent ←→ Tester Agent
多对多关系，互相通信协调
```

### Writer/Reviewer 模式

```
场景：开发一个新功能

Writer Agent（写代码）:
→ 编写功能代码
→ 发送给 Reviewer

Reviewer Agent（审代码）:
→ 审查代码质量
→ 提出修改建议
→ 发回给 Writer

Writer Agent:
→ 根据建议修改
→ 再次发送给 Reviewer

Reviewer Agent:
→ 确认通过
→ 发送给 Tester

Tester Agent（测代码）:
→ 编写测试用例
→ 运行测试
→ 如果失败，反馈给 Writer

→ 循环直到所有测试通过
```

### 测试驱动模式（TDD）

```
Tester Agent:
→ 先写测试用例（测试先行）

Writer Agent:
→ 实现代码让测试通过

Reviewer Agent:
→ 审查实现质量

Tester Agent:
→ 运行所有测试确认通过

→ 代码质量更高，因为有测试保障
```

## 🎯 Coordinator Mode

### 四阶段协调

Coordinator Mode 是 Claude Code 的高级协调模式，将复杂任务分为四个阶段：

```
┌─────────────┐
│  Research   │ ← 调研和理解问题
│  （调研阶段）│
└──────┬──────┘
       ↓
┌─────────────┐
│ Synthesis   │ ← 综合分析，设计方案
│  （综合阶段）│
└──────┬──────┘
       ↓
┌─────────────┐
│Implementation│ ← 执行实现
│  （实现阶段）│
└──────┬──────┘
       ↓
┌─────────────┐
│Verification │ ← 验证结果
│  （验证阶段）│
└─────────────┘
```

### 各阶段详解

#### 第一阶段：Research（调研）

```
Claude 自动执行：
→ 搜索相关代码和文档
→ 理解现有架构
→ 识别依赖关系
→ 分析可能的方案

输出：调研报告
```

#### 第二阶段：Synthesis（综合）

```
Claude 基于调研结果：
→ 设计实现方案
→ 评估各方案的优劣
→ 选择最优方案
→ 制定详细计划

输出：实现计划
```

#### 第三阶段：Implementation（实现）

```
Claude 按计划执行：
→ 编写/修改代码
→ 运行中间验证
→ 处理意外情况

输出：代码变更
```

#### 第四阶段：Verification（验证）

```
Claude 验证实现：
→ 运行测试
→ 检查类型错误
→ 验证功能正确性
→ 确认没有副作用

输出：验证报告
```

## ⚡ /batch 批量处理

### 什么是 /batch？

`/batch` 让你一次性将多个任务发送给 Claude Code，逐个自动处理。

```
场景：处理 10 个 GitHub Issue

你: /batch
Claude: 请提供要处理的任务列表

你:
1. 修复 #101 登录超时问题
2. 修复 #102 搜索结果排序错误
3. 实现 #103 导出 CSV 功能
4. 修复 #104 移动端布局问题

Claude:
→ 开始批量处理
→ Task 1/4: 修复登录超时... ✓
→ Task 2/4: 修复排序错误... ✓
→ Task 3/4: 实现导出 CSV... ✓
→ Task 4/4: 修复布局问题... ✓

✅ 全部完成！
```

### /batch 使用技巧

```
💡 最佳实践：

1. 独立任务优先
   /batch 最适合互不依赖的任务

2. 提供清晰的任务描述
   每个任务都应该是自包含的

3. 设置合理的批量大小
   一次处理 5-10 个任务效果最好

4. 保留处理记录
   /batch 的输出可以保存为日志
```

## 🔄 非交互模式（-p 标志）

### 什么是 -p 模式？

`-p`（pipe）标志让 Claude Code 以非交互方式运行，适合脚本化操作。

```bash
# 基本用法
claude -p "帮我检查这个文件有没有语法错误" < file.js

# 输出到文件
claude -p "生成 API 文档" > api-docs.md

# 指定允许的工具
claude -p "运行测试" --allowedTools "Bash(npm test)"

# 与 shell 循环结合
for file in src/**/*.test.js; do
  claude -p "修复这个测试文件中的失败用例" < "$file"
done
```

### -p 模式的典型用途

```
1. 批量代码审查
   $ find src/ -name "*.ts" | while read f; do
       claude -p "审查这个文件" < "$f"
     done

2. 自动生成文档
   $ claude -p "为这个模块生成 README" < src/utils/

3. CI/CD 集成
   $ claude -p "检查代码是否符合规范"

4. 格式化代码
   $ claude -p "格式化这个文件" < messy.js > clean.js
```

## ⏰ /schedule 云端定时任务

### 什么是 /schedule？

`/schedule` 让你在云端设置定时任务，Claude 会在指定时间自动执行。

```
你: /schedule 每天早上 9 点检查是否有新的依赖更新

Claude:
→ 创建定时任务
→ 每天 09:00 自动运行
→ 检查 npm audit
→ 如果有更新，生成报告

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📅 定时任务已设置
任务：检查依赖更新
频率：每天 09:00
状态：✅ 已启用
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

### /schedule 使用示例

```
# 每小时检查部署状态
/schedule 每小时检查生产环境部署状态

# 每天凌晨运行安全扫描
/schedule 每天 02:00 运行 npm audit 并报告漏洞

# 每周一早上生成周报
/schedule 每周一 09:00 总结上周的 git commit 统计
```

## 🔁 /loop 长时间运行任务

### 什么是 /loop？

`/loop` 让 Claude Code 在本地长时间运行一个任务，最多支持 **3 天**无人值守。

```
你: /loop 每 10 分钟检查一次构建状态，如果失败就自动修复

Claude:
→ 设置循环任务
→ 每 10 分钟执行一次
→ 检查构建 → 如果失败 → 分析原因 → 修复 → 重新构建

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🔁 循环任务已启动
任务：检查构建状态
间隔：10 分钟
最大运行时间：3 天
状态：🔄 运行中
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

### /loop 使用示例

```
# 持续监控测试
/loop 每 5 分钟运行测试，失败时自动修复

# 持续优化性能
/loop 每小时运行性能测试，生成报告

# 持续检查部署
/loop 每分钟检查部署是否完成

# 持续监控日志
/loop 每分钟检查错误日志，发现新错误时通知
```

### /loop vs /schedule

| 特性 | /loop（本地） | /schedule（云端） |
|------|--------------|-------------------|
| 运行位置 | 本地机器 | 云端 |
| 最长时间 | 3 天 | 不限 |
| 需要本机运行 | ✅ 是 | ❌ 否 |
| 适用场景 | 开发阶段持续监控 | 生产环境定时任务 |
| 资源消耗 | 使用本机资源 | 使用云端资源 |

## 🌐 Remote Control 远程控制

### 什么是 Remote Control？

Remote Control 让你从一台设备控制另一台设备上的 Claude Code 会话。

```
场景：你在公司电脑上启动了 Claude 处理任务
       下班后在家用笔记本远程查看进度

公司电脑：
→ Claude Code 正在运行
→ 启动 Remote Control

家用笔记本：
→ 连接到公司电脑的会话
→ 查看进度
→ 发送新的指令
→ 或者只观察不干预
```

### Claude Code on Web

除了本地 CLI，Claude Code 还可以在浏览器中使用：

```
访问 https://claude.ai/code
→ 直接在浏览器中使用 Claude Code
→ 与本地 Claude Code 功能一致
→ 无需安装任何软件
```

## 🧠 异步工作心智转变

### 从同步到异步

```
传统开发（同步）：
你做 A → 你做 B → 你做 C
一步一步来，做完一个再做下一个

Agent 协作（异步）：
你启动 Agent A（做任务 A）
你启动 Agent B（做任务 B）
你启动 Agent C（做任务 C）
你去做其他事情（甚至下班）
Agent 们完成工作后通知你
```

### 新的工作方式

```
早上到公司：
1. 分配任务给多个 Agent
2. 让它们并行工作
3. 你做高层次的架构设计、需求分析
4. 下午检查 Agent 的结果
5. 合并、审查、部署

你不是在"用工具"，而是在"管理团队"
```

### 关键思维转变

| 旧思维 | 新思维 |
|--------|--------|
| 我要亲手写每一行代码 | 我要设计好系统，让 Agent 去实现 |
| 一个任务做完再做下一个 | 能并行的就并行 |
| 盯着屏幕等结果 | 启动任务后去做其他事 |
| Claude 是一个助手 | Claude 是一个开发团队 |
| 失败了要立即处理 | 让 Agent 自动修复并重试 |

## 💻 完整实战示例

### 示例：大型功能开发

```
目标：为电商平台添加商品推荐功能

Step 1: 创建 Worktrees
$ claude --worktree recommendation-engine
$ claude --worktree api-endpoints
$ claude --worktree frontend-ui

Step 2: 启动多个 Agent
Agent 1（recommendation-engine worktree）:
"实现基于协同过滤的推荐算法"

Agent 2（api-endpoints worktree）:
"创建推荐 API 端点，
包括 GET /api/recommendations 和
POST /api/recommendations/feedback"

Agent 3（frontend-ui worktree）:
"创建推荐组件，包括推荐卡片、
推荐列表和'不感兴趣'按钮"

Step 3: 使用 /loop 持续测试
/loop 每 15 分钟运行所有测试

Step 4: 等待 Agent 完成
[去做其他工作...]

Step 5: 审查和合并
→ 检查每个 Agent 的输出
→ 运行集成测试
→ 合并分支
→ 部署
```

## 🎓 最佳实践

### ✅ DO - 应该做的

1. **合理分配任务**
   ```
   确保每个 Agent 的任务是独立的
   避免两个 Agent 修改同一个文件
   ```

2. **使用 Worktree 隔离**
   ```
   每个 Agent 在独立的 Worktree 中工作
   避免代码冲突
   ```

3. **设置合理的超时**
   ```
   给 Agent 设置完成时间
   防止无限运行
   ```

4. **定期检查进度**
   ```
   虽然是异步工作
   但要定期查看 Agent 的状态
   ```

5. **使用 /batch 处理相似任务**
   ```
   批量处理 Issue、批量修复 Bug
   用 /batch 一次性提交
   ```

### ❌ DON'T - 避免做的

1. ❌ 让多个 Agent 修改同一个文件
   ```
   这会导致合并冲突
   使用 Worktree 隔离
   ```

2. ❌ 分配过于复杂的任务
   ```
   单个 Agent 的任务应该有明确边界
   复杂任务先分解再分配
   ```

3. ❌ 忽略 Agent 的输出
   ```
   Agent 完成后一定要审查结果
   不要盲目合并代码
   ```

4. ❌ 创建过多并行 Agent
   ```
   5-10 个通常是合理的范围
   太多会消耗过多资源
   ```

## 📚 下一步

了解多 Agent 协作后，继续学习 [29. 高级命令与反模式](./29-advanced-commands.md)

## 🔗 相关资源

- [多 Agent 协作官方文档](https://code.claude.com/docs/zh-CN/multi-agent)
- [Git Worktree 指南](https://git-scm.com/docs/git-worktree)
- [Tmux 使用教程](https://github.com/tmux/tmux/wiki)


---

> 💡 **API 推荐**：[https://tryallapi.com/](https://tryallapi.com/) - 一站式接入各种AI服务，注册即送0.2刀
