# 17. Agent Skills


> 📷 **截图说明**：本章配图含终端风格图。标注「真实输出」的来自本机 Claude Code 2.1.310（已打码）；标注「示意图」的未能非交互复现。GUI（VS Code/JetBrains/Desktop）待补。

Skills 是可重用的自定义工作流，让 Claude Code 执行复杂的多步骤任务。

## 🎯 什么是 Skill？

![/skills 示意](/images/screenshots/17-skills.png)

> 📷 示意图

![/skill-doctor 示意](/images/screenshots/17-skill-doctor.png)

> 📷 示意图

### 核心概念

```
没有 Skills：
每次都要详细解释步骤
"运行测试，然后如果通过就构建，
然后如果构建成功就部署..."

有 Skills：
"执行部署流程"
→ 自动运行测试、构建、部署
```

### Skill vs 普通命令

| 特性 | 普通命令 | Skill |
|------|----------|-------|
| 复杂度 | 单一操作 | 多步骤工作流 |
| 可重用性 | 每次手动输入 | 定义一次，重复使用 |
| 智能性 | 固定执行 | 可包含条件逻辑 |
| 参数 | 命令行参数 | 结构化参数 |

## 📁 Skill 结构

### 基本结构

```
.claude/
└── skills/
    ├── deploy/
    │   ├── skill.json        # Skill 配置
    │   ├── instructions.md   # 执行指令
    │   └── schema.json       # 参数定义
    └── test-and-fix/
        ├── skill.json
        ├── instructions.md
        └── schema.json
```

### skill.json 示例

```json
{
  "name": "deploy",
  "displayName": "部署应用",
  "description": "运行测试、构建并部署应用",
  "version": "1.0.0",
  "author": "Your Name",
  "parameters": {
    "environment": {
      "type": "string",
      "description": "部署环境",
      "enum": ["staging", "production"],
      "default": "staging"
    },
    "skipTests": {
      "type": "boolean",
      "description": "跳过测试",
      "default": false
    }
  },
  "instructionsFile": "instructions.md"
}
```

## 💻 Skill 示例

### 示例 1: 自动部署

```markdown
<!-- instructions.md -->
# 部署应用

你是一个部署专家。请按照以下步骤部署应用：

## 前置条件检查

1. 检查 Git 状态
```bash
git status
```

2. 确认在正确的分支
- Production: `main` 分支
- Staging: `develop` 分支

## 步骤 1: 运行测试

除非 `skipTests` 为 true，否则运行完整测试套件：

```bash
npm test
```

如果测试失败，停止部署并报告失败的测试。

## 步骤 2: 构建应用

```bash
npm run build
```

检查构建输出，确保没有错误或警告。

## 步骤 3: 部署

根据环境选择部署命令：

**Staging:**
```bash
npm run deploy:staging
```

**Production:**
```bash
npm run deploy:production
```

## 步骤 4: 验证

部署完成后：

1. 检查应用健康状态
2. 运行烟雾测试
3. 报告部署结果

## 错误处理

如果在任何步骤失败：
- 停止部署
- 报告错误详情
- 建议修复方案

## 完成

成功部署后，提供：
- 部署的版本/commit
- 部署 URL
- 任何重要的变更说明
```

**使用 Skill：**

```
你: skill deploy

Claude:
🚀 开始部署流程
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

环境: staging (默认)
跳过测试: false

[步骤 1] 运行测试...
→ npm test
✓ 所有测试通过 (45/45)

[步骤 2] 构建应用...
→ npm run build
✓ 构建成功

[步骤 3] 部署到 staging...
→ npm run deploy:staging
✓ 部署成功

[步骤 4] 验证...
→ 检查健康状态
✓ 应用运行正常

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✅ 部署完成！

版本: abc123
URL: https://staging.example.com
变更: 3 个文件，+156 -42 行
```

### 示例 2: 测试并修复

```json
{
  "name": "test-and-fix",
  "displayName": "测试并自动修复",
  "description": "运行测试并自动修复失败的用例",
  "parameters": {
    "target": {
      "type": "string",
      "description": "测试目标",
      "default": "all"
    },
    "maxAttempts": {
      "type": "number",
      "description": "最大尝试次数",
      "default": 3
    }
  }
}
```

```markdown
<!-- instructions.md -->
# 测试并修复

## 步骤 1: 运行测试

```bash
npm test {{target}}
```

## 步骤 2: 分析结果

如果测试全部通过，报告成功并结束。

如果有失败的测试：
- 列出所有失败的测试
- 分析失败原因
- 尝试修复代码

## 步骤 3: 修复失败

对于每个失败的测试：

1. 读取测试代码
2. 读取被测试的代码
3. 识别问题
4. 应用修复
5. 重新运行测试

最多尝试 `maxAttempts` 次。

## 步骤 4: 报告

提供详细的修复报告：
- 修复的文件列表
- 修复的问题描述
- 最终测试结果
```

**使用 Skill：**

```
you: skill test-and-fix

Claude:
🧪 测试并修复流程
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

[运行测试]
→ npm test

发现 3 个失败的测试：

1. ❌ UserAuth.test.js: should reject invalid password
2. ❌ API.test.js: should return 404 for missing user
3. ❌ Form.test.js: should validate email format

[分析和修复...]

修复 1/3:
问题：密码验证逻辑错误
→ 修改 src/auth/validate.js
→ 重新测试 ✓

修复 2/3:
问题：缺少 404 处理
→ 修改 src/api/users.js
→ 重新测试 ✓

修复 3/3:
问题：Email 正则表达式错误
→ 修改 src/utils/validators.js
→ 重新测试 ✓

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✅ 所有测试已修复！

修复的文件：
- src/auth/validate.js
- src/api/users.js
- src/utils/validators.js

测试结果：45/45 通过 ✓
```

### 示例 3: 代码审查

```json
{
  "name": "code-review",
  "displayName": "代码审查",
  "description": "审查代码并提供改进建议",
  "parameters": {
    "files": {
      "type": "array",
      "description": "要审查的文件",
      "items": {"type": "string"}
    },
    "level": {
      "type": "string",
      "enum": ["quick", "standard", "thorough"],
      "default": "standard"
    }
  }
}
```

```markdown
<!-- instructions.md -->
# 代码审查

## 步骤 1: 读取文件

读取所有指定的文件。

## 步骤 2: 根据级别审查

**Quick (快速):**
- 检查语法错误
- 检查明显的 bug
- 检查命名规范

**Standard (标准):**
- Quick 检查 +
- 检查代码质量
- 检查可维护性
- 检查安全性
- 提供改进建议

**Thorough (彻底):**
- Standard 检查 +
- 性能分析
- 架构评估
- 最佳实践检查
- 详细的重构建议

## 步骤 3: 生成报告

提供结构化的审查报告：

### 总体评分
- 代码质量: X/10
- 可维护性: X/10
- 安全性: X/10

### 发现的问题
按严重程度分类：
- 🔴 严重（必须修复）
- 🟡 警告（建议修复）
- 🔵 建议（可以改进）

### 改进建议
具体的改进建议和示例代码

### 正面反馈
指出做得好的地方
```

## 🎛️ Skill 管理

### 列出所有 Skills

```bash
claude skills list
```

```
可用的 Skills:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

1. deploy              - 部署应用
2. test-and-fix        - 测试并自动修复
3. code-review         - 代码审查
4. refactor-component  - 重构组件
5. update-dependencies - 更新依赖

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

### 创建 Skill

```bash
# 交互式创建
claude skills create

# 或手动创建目录
mkdir -p .claude_skills/my-skill
cd .claude_skills/my-skill

# 创建必需文件
touch skill.json instructions.md schema.json
```

### 编辑 Skill

```bash
claude skills edit my-skill
```

### 删除 Skill

```bash
claude skills delete my-skill
```

### 分享 Skill

```bash
# 导出 Skill
claude skills export my-skill > my-skill.tar.gz

# 导入 Skill
claude skills import my-skill.tar.gz
```

## 🎯 高级 Skill 特性

### 条件逻辑

```markdown
<!-- instructions.md -->
## 条件部署

如果 `environment` 是 "production"：
1. 运行完整测试套件
2. 运行安全扫描
3. 创建备份
4. 部署到生产环境
5. 运行烟雾测试
6. 通知团队

如果 `environment` 是 "staging"：
1. 运行快速测试
2. 部署到 staging
3. 验证部署
```

### 循环和重试

```markdown
<!-- instructions.md -->
## 重试逻辑

最多尝试 3 次部署：

对于每次尝试：
1. 尝试部署
2. 如果成功，退出循环
3. 如果失败，等待 30 秒
4. 重试

如果 3 次都失败：
- 报告错误
- 回滚到之前版本
- 通知团队
```

### 子 Skill 调用

```markdown
<!-- instructions.md -->
## 部署流程

1. 调用 skill `test-and-fix`
2. 调用 skill `security-scan`
3. 调用 skill `deploy`
4. 调用 skill `verify-deployment`
```

### 并行执行

```markdown
<!-- instructions.md -->
## 并行测试

同时运行以下测试：
1. 单元测试 (npm test)
2. 类型检查 (npm run type-check)
3. Linting (npm run lint)

等待所有测试完成。

如果任何测试失败，停止并报告。
```

## 🎓 Skill 最佳实践

### ✅ DO - 应该做的

1. **清晰的命名**
   ```
   deploy → 好的名字
   do-stuff → 不好的名字
   ```

2. **详细的文档**
   ```
   解释每个步骤的目的
   提供错误处理说明
   ```

3. **参数验证**
   ```
   检查参数有效性
   提供默认值
   ```

4. **错误处理**
   ```
   定义错误情况
   提供恢复建议
   ```

### ❌ DON'T - 避免做的

1. ❌ 过于复杂
   ```
   单个 skill 不应超过 10 个步骤
   ```

2. ❌ 硬编码值
   ```
   使用参数而不是硬编码
   ```

3. ❌ 缺少文档
   ```
   总是提供使用说明
   ```

## 📚 Skill 市场

### 官方 Skills

```bash
# 浏览官方 Skills
claude skills browse

# 安装官方 Skill
claude skills install official/deploy
```

### 社区 Skills

```bash
# 从 GitHub 安装
claude skills install github:user/skill-repo

# 搜索社区 Skills
claude skills search "testing"
```

### 发布 Skill

```bash
# 发布到市场
claude skills publish my-skill

# 或推送到 GitHub
git push origin main
```


## 📝 Slash Commands（.claude/commands/）

### 什么是 Slash Commands？

除了 Skills，Claude Code 还支持一种更轻量的自定义命令 —— Slash Commands。

```
.claude/
├── commands/
│   ├── review.md        # → /project:review
│   ├── deploy.md        # → /project:deploy
│   └── test-fix.md      # → /project:test-fix
└── skills/
    └── ...              # → Skills（更复杂的工作流）
```

### 创建 Slash Command

```markdown
<!-- .claude/commands/review.md -->
审查当前分支的所有变更，重点关注安全漏洞、性能问题和代码风格。
输出结构化的审查报告。
```

使用：

```
你: /project:review
→ Claude 读取 review.md 的指令并执行
```

### 内联 Bash 脚本预计算

Slash Commands 支持 Bash 脚本预计算：

```markdown
<!-- .claude/commands/pr-status.md -->
当前 PR 状态：
\`\`\`bash
gh pr view --json title,state,additions,deletions,reviewDecision
\`\`\`
请根据以上信息分析 PR 进展。
```

Claude 会先执行 Bash 命令获取动态数据，然后根据数据执行后续指令。

## 🤔 Skills vs Commands 选择指南

| 特性 | Slash Commands | Skills |
|------|---------------|--------|
| 创建速度 | 快（一个 Markdown 文件） | 慢（多个文件） |
| 复杂度 | 简单指令 | 多步骤工作流 |
| 参数 | 无结构化参数 | 支持结构化参数 |
| 条件逻辑 | 纯文本 | 可编程 |
| 分享 | Git 提交即可 | 可导出导入 |
| Bash 预计算 | ✅ 支持 | ✅ 支持 |

### 选择原则

```
用 Slash Commands：
→ 简单的、一次性的指令
→ 不需要参数的命令
→ 快速创建和使用
→ 主要由文本指令组成

用 Skills：
→ 复杂的多步骤工作流
→ 需要参数化配置
→ 需要条件逻辑和错误处理
→ 需要跨项目复用和分享
```

## 🔗 技能与 SubAgent 的区别

| 特性 | Skill | SubAgent |
|------|-------|----------|
| 复杂度 | 简单到中等 | 复杂 |
| 自主性 | 脚本化 | 高度自主 |
| 通信 | 无需通信 | 需要协调 |
| 用途 | 标准化流程 | 复杂任务 |

**何时使用 Skill：**
- 标准化的工作流
- 可预测的任务
- 需要快速执行

**何时使用 SubAgent：**
- 复杂的多步骤任务
- 需要探索和决策
- 需要并行处理

## 📚 下一步

了解 Skills 后，继续学习 [18. SubAgent](./18-subagents.md)

## 🔗 相关资源

- [Skills 官方文档](https://code.claude.com/docs/zh-CN/skills)
- [Skill 市场](https://code.claude.com/skills)
- [社区 Skills](https://github.com/claude-code-skills)


---

> 💡 **API 推荐**：[https://tryallapi.com/](https://tryallapi.com/) - 一站式接入各种AI服务，注册即送0.2刀
