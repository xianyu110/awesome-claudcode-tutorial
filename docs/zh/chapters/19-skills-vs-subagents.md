# 19. Skills vs SubAgent 的区别


> 📷 **截图说明**：本章配图含终端风格图。标注「真实输出」的来自本机 Claude Code 2.1.310（已打码）；标注「示意图」的未能非交互复现。GUI（VS Code/JetBrains/Desktop）待补。

理解何时使用 Skills、何时使用 SubAgent，对于高效完成任务至关重要。

## 🆚 快速对比

![Skills vs Subagents 示意](/images/screenshots/19-compare.png)

> 📷 示意图

| 特性 | Skills | SubAgent |
|------|--------|----------|
| **本质** | 可重用脚本 | 独立 AI 助手 |
| **自主性** | 低（遵循指令） | 高（自主决策） |
| **复杂度** | 简单到中等 | 复杂 |
| **创建** | 需要配置文件 | 即时启动 |
| **通信** | 无需通信 | 需要协调 |
| **适用场景** | 标准化流程 | 探索性任务 |
| **速度** | 快（已定义） | 中（需思考） |
| **可维护性** | 需要维护 | 无需维护 |
| **可分享性** | 易于分享 | 难以分享 |

## 💡 决策树

```
需要完成任务
    │
    ├─ 是否是重复性任务？
    │   ├─ 是 → 使用 Skill ✓
    │   └─ 否 → 继续
    │
    ├─ 是否需要探索和决策？
    │   ├─ 是 → 使用 SubAgent ✓
    │   └─ 否 → 继续
    │
    ├─ 是否可以完全自动化？
    │   ├─ 是 → 使用 Skill ✓
    │   └─ 否 → 继续
    │
    ├─ 任务是否复杂？
    │   ├─ 是 → 使用 SubAgent ✓
    │   └─ 否 → 使用 Skill ✓
    │
    └─ 是否需要并行处理？
        ├─ 是 → 使用多个 SubAgent ✓
        └─ 否 → 使用 Skill ✓
```

## 📋 详细对比

### 1. 创建方式

#### Skill

```bash
# 手动创建
mkdir .claude/skills/deploy
cd .claude/skills/deploy

# 创建配置文件
cat > skill.json << EOF
{
  "name": "deploy",
  "displayName": "部署应用",
  "description": "自动化部署流程"
}
EOF

# 创建指令文件
cat > instructions.md << EOF
# 部署流程

1. 运行测试
2. 构建应用
3. 部署
EOF

# Skill 已创建
```

#### SubAgent

```bash
# 即时启动，无需配置
你: 启动一个 SubAgent 分析代码

Claude: → 启动 SubAgent "code-analyzer"
      [立即开始工作]
```

**结论:**
- **Skill**: 需要预先创建和配置
- **SubAgent**: 即时启动，无需准备

### 2. 灵活性

#### Skill

```markdown
<!-- instructions.md -->
# 部署流程

严格按照以下步骤：
1. 运行测试
2. 构建
3. 部署

不能跳过步骤或改变顺序
```

**特点:**
- 固定流程
- 不能改变
- 可预测

#### SubAgent

```
你: 帮我优化性能

SubAgent:
→ 分析代码
→ 发现瓶颈
→ 尝试不同优化
→ 选择最佳方案
→ 实施优化

[自主决策每一步]
```

**特点:**
- 灵活应对
- 可以调整
- 智能决策

**结论:**
- **Skill**: 灵活性低，可预测性高
- **SubAgent**: 灵活性高，可预测性低

### 3. 适用场景

#### Skill 适合的场景

**场景 1: CI/CD 部署**
```
每次部署都需要相同的步骤：
- 测试
- 构建
- 部署
- 验证

→ 使用 Skill
```

**场景 2: 代码格式化**
```
固定的格式化规则：
- Prettier
- ESLint
- 排序导入

→ 使用 Skill
```

**场景 3: 测试运行**
```
标准的测试流程：
- 单元测试
- 集成测试
- E2E 测试

→ 使用 Skill
```

#### SubAgent 适合的场景

**场景 1: 代码审查**
```
需要：
- 分析代码质量
- 识别问题
- 提供建议
- 可能需要深入研究

→ 使用 SubAgent
```

**场景 2: 架构设计**
```
需要：
- 理解需求
- 探索方案
- 评估权衡
- 做出决策

→ 使用 SubAgent
```

**场景 3: Bug 调试**
```
需要：
- 分析症状
- 定位问题
- 尝试修复
- 验证结果

→ 使用 SubAgent
```

## 🎯 实战对比

### 任务 1: 部署应用

#### 使用 Skill

```
你: skill deploy production

Claude:
[按照预定义流程]
→ 运行测试 ✓
→ 构建 ✓
→ 部署 ✓
→ 验证 ✓

✓ 部署完成

优点：
- 快速
- 可靠
- 一致

缺点：
- 不灵活
```

#### 使用 SubAgent

```
你: 启动 SubAgent 部署应用

SubAgent:
→ 分析部署需求
→ 检查环境
→ 准备部署
→ 执行部署
→ 验证结果
→ 处理问题

✓ 部署完成

优点：
- 智能处理
- 适应性强

缺点：
- 较慢
- 不确定性
```

**推荐: 部署使用 Skill**
- 标准化流程
- 需要一致性
- 速度重要

### 任务 2: 代码重构

#### 使用 Skill

```
你: skill refactor-component Button

Claude:
[按照预定义步骤]
→ 读取组件
→ 应用重构规则
→ 运行测试
→ 完成

可能的问题：
- 不理解上下文
- 机械执行
- 可能引入错误
```

#### 使用 SubAgent

```
你: 启动 SubAgent 重构 Button 组件

SubAgent:
→ 分析组件结构
→ 理解组件用途
→ 识别问题
→ 设计改进
→ 实施重构
→ 验证功能
→ 运行测试

优势：
- 理解意图
- 智能决策
- 适应上下文
```

**推荐: 重构使用 SubAgent**
- 需要理解
- 需要决策
- 上下文重要

### 任务 3: 并行处理

#### 使用 Skill

```bash
# Skill 不能真正并行
# 它是顺序执行脚本

你: skill test-all

Claude:
→ 测试模块 A
→ 测试模块 B
→ 测试模块 C

[顺序执行]
```

#### 使用 SubAgent

```
你: 启动 3 个 SubAgent 并行测试

Claude:
→ Agent 1: 测试模块 A
→ Agent 2: 测试模块 B
→ Agent 3: 测试模块 C

[并行执行]

✓ 同时完成
```

**推荐: 并行任务使用 SubAgent**
- 真正的并行
- 节省时间

## 🔄 结合使用

### 最佳策略: 组合使用

```
复杂任务 = SubAgent + Skills

例如：部署新版本

SubAgent (统筹):
→ 分析变更
→ 制定计划
→ 协调执行

Skill 1: 运行测试
Skill 2: 构建应用
Skill 3: 部署
Skill 4: 验证

SubAgent:
→ 监控执行
→ 处理错误
→ 汇报结果
```

### 实战示例

```
你: 发布新版本

Claude:
→ 启动 SubAgent "release-manager"

SubAgent:
🚀 发布流程
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

[步骤 1] 分析变更
发现：12 个文件，3 个新功能，5 个 bug 修复

[步骤 2] 执行 Skill

→ skill test
✓ 所有测试通过

→ skill build
✓ 构建成功

→ skill deploy
✓ 部署成功

→ skill verify
✓ 验证通过

[步骤 3] 生成报告
✓ 发布 v2.3.0 成功

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

## 📊 选择指南

### 使用 Skill 当：

✅ 任务流程固定
✅ 需要一致性
✅ 重复执行
✅ 速度重要
✅ 可完全自动化
✅ 不需要决策

### 使用 SubAgent 当：

✅ 任务复杂
✅ 需要探索
✅ 需要决策
✅ 需要理解
✅ 上下文重要
✅ 并行处理

### 组合使用当：

✅ 大型复杂任务
✅ 需要统筹协调
✅ 包含标准化步骤
✅ 需要错误处理

## 🎓 实践建议

### 1. 从 Skill 开始

```
第一次执行任务：
手动完成

第二次：
使用 SubAgent

第三次及以后：
创建 Skill
```

### 2. 逐步优化

```
初始：使用 SubAgent
      ↓
观察：哪些步骤是固定的
      ↓
创建：Skill 处理固定步骤
      ↓
优化：SubAgent 处理变化部分
      ↓
结果：高效组合
```

### 3. 文档化

```
记录：
- 何时使用 Skill
- 何时使用 SubAgent
- 有效的组合模式

分享给团队：
统一理解和实践
```

## 📚 下一步

了解区别后，继续学习 [20. Plugin 系统](./20-plugins.md)

## 🔗 相关资源

- [Skills vs SubAgent 指南](https://code.claude.com/docs/zh-CN/skills-vs-subagents)
- [最佳实践](https://code.claude.com/docs/zh-CN/best-practices)


---

> 💡 **API 推荐**：[https://tryallapi.com/](https://tryallapi.com/) - 一站式接入各种AI服务，注册即送0.2刀
