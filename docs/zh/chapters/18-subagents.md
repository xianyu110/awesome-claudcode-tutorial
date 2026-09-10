# 18. SubAgent

SubAgent 是可以独立运行并返回结果的专用 AI 助手，适合并行处理复杂任务。

## 🎯 什么是 SubAgent？

### 核心概念

```
单个 Agent (Claude Code):
┌─────────────────────┐
│                     │
│  顺序处理所有任务    │
│                     │
└─────────────────────┘
速度：慢（一次一个）

多个 SubAgent:
┌──────┐ ┌──────┐ ┌──────┐
│ Agent│ │Agent │ │Agent │
│  1   │ │  2   │ │  3   │
└──────┘ └──────┘ └──────┘
并行处理不同任务
速度：快（同时进行）
```

### 为什么需要 SubAgent？

**场景 1：大型代码审查**
```
单个 Agent：逐个审查 50 个文件 → 需要很久
SubAgent：5 个 Agent 并行审查各 10 个文件 → 快 5 倍
```

**场景 2：多方面分析**
```
单个 Agent：先分析安全性，再分析性能，再分析可维护性
SubAgent：3 个 Agent 同时分析 → 节省 2/3 时间
```

**场景 3：独立任务**
```
单个 Agent：按顺序执行不相关的任务
SubAgent：同时执行所有任务 → 效率最大化
```

## 🆚 SubAgent vs Skill

| 特性 | SubAgent | Skill |
|------|----------|-------|
| 自主性 | 高度自主 | 遵循脚本 |
| 复杂度 | 适合复杂任务 | 适合标准化流程 |
| 通信 | 需要协调 | 无需通信 |
| 创建 | 简单 | 需要编写配置 |
| 适用 | 探索性任务 | 重复性任务 |

## 💻 SubAgent 示例

### 示例 1: 并行代码审查

```
你: 使用 SubAgent 并行审查这些目录：
- src/components/
- src/utils/
- src/api/
- src/hooks/
- src/types/

Claude:
🚀 启动 5 个 SubAgent
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Agent 1: 审查 src/components/
Agent 2: 审查 src/utils/
Agent 3: 审查 src/api/
Agent 4: 审查 src/hooks/
Agent 5: 审查 src/types/

[所有 Agent 并行工作...]

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📊 审查完成！

Agent 1 (components):
- 审查文件: 23
- 发现问题: 5
- 评分: 7/10

Agent 2 (utils):
- 审查文件: 15
- 发现问题: 2
- 评分: 9/10

Agent 3 (api):
- 审查文件: 8
- 发现问题: 6
- 评分: 6/10

Agent 4 (hooks):
- 审查文件: 12
- 发现问题: 3
- 评分: 8/10

Agent 5 (types):
- 审查文件: 18
- 发现问题: 1
- 评分: 9/10

总览:
- 审查文件: 76
- 发现问题: 17
- 平均评分: 7.8/10

详细报告已合并。
```

### 示例 2: 多策略实现

```
你: 实现用户认证功能
让 3 个 SubAgent 各自探索不同方案

Claude:
🚀 启动 3 个 SubAgent
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Agent 1: 探索 JWT 方案
Agent 2: 探索 Session 方案
Agent 3: 探索 OAuth 方案

[探索中...]

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Agent 1 (JWT):
✓ 完成探索
方案：使用 jsonwebtoken
优点：
- 无状态，易扩展
- 移动端友好
缺点：
- Token 无法撤销
- 需要处理过期

代码示例：
[提供 JWT 实现]

Agent 2 (Session):
✓ 完成探索
方案：使用 express-session
优点：
- 服务器控制，可撤销
- 安全性高
缺点：
- 需要会话存储
- 扩展性较差

代码示例：
[提供 Session 实现]

Agent 3 (OAuth):
✓ 完成探索
方案：使用 Passport.js
优点：
- 支持第三方登录
- 用户体验好
缺点：
- 实现复杂
- 依赖外部服务

代码示例：
[提供 OAuth 实现]

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

推荐方案：JWT

理由：
1. 最适合你的架构（微服务）
2. 实现简单
3. 性能最好

是否使用 JWT 方案实现？
```

### 示例 3: 并行测试

```
你: 在不同浏览器中并行测试应用

Claude:
🚀 启动 SubAgent 进行并行测试
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Agent 1: Chrome 测试
Agent 2: Firefox 测试
Agent 3: Safari 测试
Agent 4: Edge 测试

[并行运行测试...]

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Agent 1 (Chrome): ✓ 所有测试通过 (45/45)
Agent 2 (Firefox): ✓ 所有测试通过 (45/45)
Agent 3 (Safari): ⚠️ 3 个测试失败
Agent 4 (Edge): ✓ 所有测试通过 (45/45)

Safari 失败的测试：
1. test/animation.test.js: Animation timing
2. test/flexbox.test.js: Flex gap support
3. test/webgl.test.js: WebGL context

需要我修复 Safari 的问题吗？
```

### 示例 4: 分阶段重构

```
你: 重构这个大型应用
使用 SubAgent 分阶段处理

Claude:
🚀 启动 3 个 SubAgent
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

阶段 1 Agent: 分析当前架构
阶段 2 Agent: 设计新架构
阶段 3 Agent: 实现重构

[顺序执行...]

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

阶段 1 完成：
发现的问题：
- 循环依赖过多
- 状态管理混乱
- 组件过于庞大

建议的改进：
[详细列表]

阶段 2 完成：
新架构设计：
- 使用 Redux Toolkit
- 组件拆分策略
- 状态管理方案

架构图：
[提供架构图]

阶段 3 完成：
重构实施：
✓ 已重构 45 个组件
✓ 已集成 Redux
✓ 已优化性能

测试验证：
✓ 所有测试通过
✓ 性能提升 40%

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

## 🎛️ SubAgent 管理

### 创建 SubAgent

```
你: 启动一个 SubAgent 来分析性能

Claude:
→ 启动 SubAgent "performance-analyzer"
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Agent ID: agent-perf-001
任务: 分析应用性能
状态: 运行中

[SubAgent 独立工作...]

✓ Agent 完成
结果: [性能分析报告]
```

### 查看运行中的 SubAgent

```
你: 显示所有运行的 SubAgent

Claude:
🤖 运行中的 SubAgent
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

ID              任务                  状态    进度
agent-001       代码审查              运行中  60%
agent-002       性能分析              运行中  80%
agent-003       文档生成              运行中  40%

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

### 停止 SubAgent

```
你: 停止 agent-002

Claude:
→ 停止 agent-002
✓ Agent 已停止

部分结果已保存
```

### SubAgent 通信

```
你: 让 agent-001 和 agent-002 交换结果

Claude:
→ 收集 agent-001 的结果
→ 收集 agent-002 的结果
→ 交换信息

✓ Agent 已共享结果
现在两者都有完整的信息
```

## 🎯 SubAgent 类型

### 1. 并行 Agent

同时执行相似任务：

```
5 个 Agent 各自审查不同的文件
→ 并行处理
→ 合并结果
```

### 2. 顺序 Agent

按顺序执行不同阶段：

```
Agent 1: 分析
→ 传递结果给 Agent 2
Agent 2: 设计
→ 传递结果给 Agent 3
Agent 3: 实现
```

### 3. 探索 Agent

探索不同方案：

```
Agent 1: 尝试方案 A
Agent 2: 尝试方案 B
Agent 3: 尝试方案 C

→ 比较结果
→ 选择最佳方案
```

### 4. 专家 Agent

专门领域专家：

```
Security Agent: 安全审查
Performance Agent: 性能优化
Accessibility Agent: 可访问性检查
```


## 🤝 Agent Teams

### 什么是 Agent Teams？

Agent Teams 是多个 Claude Code 会话互相通信和协调的高级工作模式，比单个 SubAgent 更强大。

```
单个 SubAgent：
主 Agent → SubAgent → 返回结果（一对一）

Agent Teams：
Writer Agent ←→ Reviewer Agent ←→ Tester Agent
（多对多关系，互相通信协调）
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

→ 循环迭代直到质量达标
```

### 测试驱动模式（TDD）

```
Tester Agent:
→ 先写测试用例（测试先行）

Writer Agent:
→ 实现代码让测试通过

Reviewer Agent:
→ 审查实现质量

→ 测试保障代码质量
```

### Git Worktrees 作为并行基础设施

Agent Teams 通常配合 Git Worktrees 使用，确保每个 Agent 在独立的代码副本中工作：

```
my-project/                ← 主分支
├── .claude/worktrees/
│   ├── writer/            ← Writer Agent 的工作目录
│   ├── reviewer/          ← Reviewer Agent 的工作目录
│   └── tester/            ← Tester Agent 的工作目录

每个 Agent 在独立的 worktree 中工作
→ 不会互相冲突
→ 完成后合并分支即可
```

```bash
# Claude Code 可以自动创建 worktree
claude --worktree
```

💡 **更详细的多 Agent 协作内容参见 [28. 多 Agent 协作](./28-multi-agent-collaboration.md)**

## 💡 高级用法

### 动态创建 Agent

```
你: 为每个服务创建一个 SubAgent 进行健康检查

Claude:
发现服务：user, order, payment, notification, email

→ 为每个服务启动 Agent

✓ 已启动 5 个 SubAgent
并行检查所有服务健康状态
```

### Agent 协作

```
你: 让这些 Agent 协作完成代码迁移

Agent 1: 分析旧代码
Agent 2: 设计新架构
Agent 3: 实现迁移
Agent 4: 测试迁移
Agent 5: 更新文档

[Agent 协作流程]
Agent 1 → 结果 → Agent 2
Agent 2 → 设计 → Agent 3
Agent 3 → 代码 → Agent 4
Agent 4 → 测试 → Agent 5

✓ 迁移完成
```

### 结果聚合

```
你: 聚合所有 Agent 的结果

Claude:
📊 结果聚合
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Agent 1: 审查结果
- 问题: 5
- 建议: 12

Agent 2: 性能结果
- 瓶颈: 3
- 优化: 8

Agent 3: 测试结果
- 覆盖率: 85%
- 失败: 2

统一报告：
[综合所有结果的报告]

优先级建议：
1. 修复安全漏洞（Agent 1）
2. 优化数据库查询（Agent 2）
3. 增加测试覆盖（Agent 3）

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

## 🎓 最佳实践

### ✅ DO - 应该做的

1. **明确任务**
   ```
   给每个 Agent 清晰的目标
   ```

2. **合理分工**
   ```
   避免任务重叠
   确保独立可并行
   ```

3. **设置超时**
   ```
   防止 Agent 无限运行
   ```

4. **聚合结果**
   ```
   合并所有 Agent 的发现
   ```

### ❌ DON'T - 避免做的

1. ❌ 创建太多 Agent
   ```
   3-5 个通常是最佳数量
   ```

2. ❌ 任务冲突
   ```
   确保 Agent 不会互相干扰
   ```

3. ❌ 忽略结果
   ```
   总是检查和聚合结果
   ```

## 📚 下一步

了解 SubAgent 后，继续学习 [19. Skills vs SubAgents](./19-skills-vs-subagents.md)

## 🔗 相关资源

- [SubAgent 官方文档](https://code.claude.com/docs/zh-CN/subagents)
- [Agent 协作模式](https://code.claude.com/docs/zh-CN/patterns/agent-coordination)


---

> 💡 **API 推荐**：[https://tryallapi.com/](https://tryallapi.com/) - 一站式接入各种AI服务，注册即送0.2刀
