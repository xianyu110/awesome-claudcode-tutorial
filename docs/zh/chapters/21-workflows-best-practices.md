# 21. 工作流与最佳实践 (Workflows & Best Practices)

掌握 Claude Code 的核心工作模式和业界最佳实践，将极大提升你的开发效率。

## 🎯 核心工作流

### 1. 代码审查工作流 (Code Review Workflow)

#### 标准审查流程

```
你: 审查这个 PR 的代码变更

Claude:
→ 读取变更文件
→ 分析代码质量
→ 检查潜在问题
→ 提供改进建议

📋 审查报告
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

✅ 优点:
- 代码结构清晰
- 错误处理完善

⚠️ 需要改进:
- src/auth.js:45 - 未处理的 Promise rejection
- src/user.ts:120 - 缺少输入验证

💡 建议:
- 添加 try-catch 包装
- 使用 Zod 进行 schema 验证

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

#### 自动化审查

创建 `/review` Skill：

```
你: skill review

Claude:
→ 运行 linter
→ 运行类型检查
→ 运行测试
→ 生成覆盖率报告
→ 检查安全问题
→ 生成审查报告
```

### 2. 调试工作流 (Debugging Workflow)

#### 系统化调试

```
你: 帮我调试这个 bug：用户登录失败

Claude:
[阶段 1] 信息收集
→ 查看错误日志
→ 检查相关代码
→ 了解复现步骤

[阶段 2] 问题定位
→ 分析错误堆栈
→ 检查数据流
→ 验证假设

[阶段 3] 修复验证
→ 实施修复
→ 添加测试
→ 验证修复

✓ Bug 已修复
原因: JWT token 验证时缺少 secret key
位置: src/auth.js:78
修复: 添加了环境变量检查
```

#### 调试最佳实践

**DO - 应该做的：**

1. **提供完整的错误信息**
   ```
   你: 调试这个错误

   ❌ 不好：
   "不工作了"

   ✅ 好：
   "TypeError: Cannot read property 'map' of undefined
   at UserList.render (src/UserList.ts:45)
   复现步骤：打开用户列表页面"
   ```

2. **隔离问题**
   ```
   你: 帮我创建最小复现示例

   Claude:
   → 提取核心逻辑
   → 创建独立测试文件
   → 验证问题
   ```

3. **记录调试过程**
   ```
   # 创建调试笔记
   echo "- 发现问题在 authentication 层
   - 检查了 token 验证逻辑
   - 下一步：检查 middleware" > debug_notes.md
   ```

### 3. 重构工作流 (Refactoring Workflow)

#### 安全重构流程

```
你: 重构这个组件，提升性能

Claude:
[步骤 1] 理解代码
→ 分析组件结构
→ 识别性能瓶颈
→ 评估影响范围

[步骤 2] 制定计划
→ 使用规划模式
→ 列出重构步骤
→ 评估风险

[步骤 3] 执行重构
→ 小步迭代
→ 保持测试通过
→ 逐步优化

[步骤 4] 验证
→ 运行所有测试
→ 性能对比
→ 代码审查

✓ 重构完成
性能提升: 60%
测试: 全部通过
```

#### 重构检查清单

```markdown
## 重构前检查

- [ ] 备份当前代码
- [ ] 运行测试套件
- [ ] 记录当前性能指标
- [ ] 识别依赖关系

## 重构中检查

- [ ] 小步提交
- [ ] 每步运行测试
- [ ] 保持功能不变
- [ ] 更新文档

## 重构后检查

- [ ] 所有测试通过
- [ ] 性能提升验证
- [ ] 代码审查
- [ ] 更新 API 文档
```

## 💡 最佳实践

### 开发流程

#### 1. 项目启动流程

```
新项目开始
    ↓
[1] 创建 CLAUDE.md
→ 项目描述
→ 技术栈
→ 架构决策
→ 代码规范
    ↓
[2] 设置开发环境
→ 初始化项目
→ 配置 linter
→ 配置 testing
→ 设置 hooks
    ↓
[3] 创建基础结构
→ 文件夹结构
→ 配置文件
→ 示例代码
    ↓
[4] 开始开发
```

#### 2. 功能开发流程

```
需求 → 设计 → 实现 → 测试 → 审查 → 部署

详细流程：

你: 实现用户认证功能

Claude:
[设计阶段]
→ 使用规划模式
→ 设计数据模型
→ 设计 API 接口
→ 设计错误处理

[实现阶段]
→ 创建数据模型
→ 实现 API 端点
→ 添加验证
→ 添加错误处理

[测试阶段]
→ 单元测试
→ 集成测试
→ E2E 测试

[审查阶段]
→ 代码审查
→ 性能检查
→ 安全检查

[部署阶段]
→ 部署脚本
→ 验证部署
→ 监控设置
```

### 代码质量

#### 1. 编码规范

**使用 CLAUDE.md 统一规范：**

```markdown
# CLAUDE.md

## 代码风格

### 命名约定
- 组件: PascalCase (UserCard.tsx)
- 工具函数: camelCase (formatDate.ts)
- 常量: UPPER_SNAKE_CASE (API_BASE_URL)
- 类型: PascalCase (UserProfile)

### 文件组织
- 每个文件一个主要导出
- 相关文件放在同一目录
- 使用 index.ts 简化导入

### 注释规范
- 公共 API 必须有 JSDoc
- 复杂逻辑需要解释
- 避免无意义的注释
```

#### 2. 测试策略

```
测试金字塔理论：

        /\
       /E2E\        10% - 端到端测试
      /------\
     /  集成  \      30% - 集成测试
    /----------\
   /   单元测试  \    60% - 单元测试
  /--------------\
```

**自动化测试工作流：**

```
你: 创建测试套件

Claude:
→ 分析需要测试的场景
→ 生成单元测试
→ 生成集成测试
→ 设置测试覆盖率目标
→ 配置 CI/CD 集成

建议：
- 单元测试覆盖率 > 80%
- 关键路径必须有 E2E 测试
- 每次提交运行快速测试
- PR 运行完整测试套件
```

### 性能优化

#### 1. 识别性能瓶颈

```
你: 分析这个应用性能

Claude:
[分析工具]
→ 使用 profiler
→ 检查 bundle size
→ 分析渲染性能
→ 检查网络请求

[常见问题]
→ Bundle 体积过大
→ 不必要的重渲染
→ 未优化的图片
→ 缓存缺失

[优化建议]
→ Code splitting
→ React.memo
→ 图片懒加载
→ 添加缓存策略
```

#### 2. 性能优化清单

```markdown
## 前端性能

- [ ] Bundle 分析和拆分
- [ ] 代码懒加载
- [ ] 图片优化
- [ ] CDN 配置
- [ ] 缓存策略
- [ ] SSR/SSG 评估

## 后端性能

- [ ] 数据库查询优化
- [ ] 索引优化
- [ ] 缓存层���置
- [ ] API 响应时间
- [ ] 并发处理
- [ ] 连接池配置

## 监控指标

- [ ] Core Web Vitals
- [ ] API 响应时间
- [ ] 错误率
- [ ] 资源使用率
```

### 安全实践

#### 1. 安全检查清单

```
你: 进行安全审查

Claude:
→ 检查依赖漏洞
→ 检查输入验证
→ 检查认证授权
→ 检查数据加密
→ 检查 CORS 配置
→ 检查敏感信息泄露

安全报告：

🔴 高危问题:
- SQL 注入风险: src/user/query.js:45
- 硬编码密钥: .env.example:3

🟡 中危问题:
- 缺少 CSRF 保护
- 跨域配置过于宽松

💡 修复建议:
[详细修复步骤...]
```

#### 2. 敏感信息保护

```bash
# 使用 .env.example 模板
cat > .env.example << EOF
# 敏感配置示例 - 不要提交真实密钥
DATABASE_URL=postgresql://user:password@localhost/db
API_SECRET_KEY=your-secret-key-here
JWT_SECRET=your-jwt-secret
EOF

# Git hooks 防止提交敏感信息
cat > .git/hooks/pre-commit << 'EOF'
#!/bin/bash
# 检查是否有敏感信息
if git diff --cached | grep -q "password\|secret\|api_key"; then
  echo "警告：可能包含敏感信息！"
  exit 1
fi
EOF
```

## 🚀 高级工作流

### 1. 多项目协作

```
项目 A (API) ←�� 项目 B (Frontend) ←→ 项目 C (Docs)

使用 Workspaces：

你: 在所有项目中更新依赖版本

Claude:
→ 检测 monorepo 结构
→ 识别所有工作空间
→ 批量更新依赖
→ 运行所有测试
→ 检查兼容性
→ 提交变更

✓ 已更新 15 个包
✓ 3 个项目测试通过
```

### 2. 数据库迁移工作流

```
你: 创建数据库迁移

Claude:
[分析变更]
→ 对比 schema 变更
→ 生成迁移脚本
→ 评估数据影响
→ 创建回滚计划

[执行流程]
→ 开发环境测试
→ 生成测试数据
→ 验证迁移
→ 执行迁移
→ 验证结果

✓ 迁移完成
影响行数: 1,234,567
回滚脚本: migrations/rollback_2024_03_15.sql
```

### 3. API 集成工作流

```
你: 集成第三方支付 API

Claude:
[调研阶段]
→ 阅读 API 文档
→ 分析接口规范
→ 评估认证方式

[实现阶段]
→ 创建类型定义
→ 实现客户端
→ 添加错误处理
→ 实现重试逻辑

[测试阶段]
→ Mock API 响应
→ 单元测试
→ 集成测试
→ 沙箱测试

[文档阶段]
→ API 使用指南
→ 错误码说明
→ 示例代码

✓ 集成完成
文档: docs/payment-api.md
测试: 覆盖率 95%
```

## 📊 效率提升技巧

### 1. 快捷命令

创建常用 Skills：

```bash
# .claude/skills/quick-test/skill.json
{
  "name": "quick-test",
  "displayName": "快速测试",
  "description": "运行快速测试套件"
}

# .claude/skills/quick-test/instructions.md
# 快速测试

仅运行单元测试，跳过 E2E：

```bash
npm test -- --testPathPattern="unit"
```
```

### 2. 批量操作

```
你: 批量重构所有组件的导入

Claude:
→ 扫描所有组件文件
→ 识别导入模式
→ 规划重构策略
→ 批量执行重构
→ 运行测试验证

✓ 已重构 47 个文件
导入方式统一为: @/components
```

### 3. 自动化工作流

```bash
# 创建 hooks 自动化流程

# .claude/hooks/pre-skill
#!/bin/bash
# Skill 执行前自动保存工作区
git add -A
git stash save "pre-skill-$(date +%s)"

# .claude/hooks/post-skill
#!/bin/bash
# Skill 执行后自动运行测试
npm test -- --silent
```

## 🎓 学习路径

### 初级 → 中级

```
[初级]
→ 学习基本命令
→ 掌握文件操作
→ 理解三种模式
    ↓
[中级]
→ 掌握规划模式
→ 使用 Skills
→ 代码审查
→ 调试技巧
```

### 中级 → 高级

```
[中级]
→ 性能优化
→ 安全实践
→ 测试策略
    ↓
[高级]
→ SubAgent 并行处理
→ Plugin 开发
→ CI/CD 集成
→ 团队协作
```

## 📚 下一步

掌握工作流和最佳实践后，继续学习 [22. 企业部署](./22-enterprise-deployment.md)

## 🔗 相关资源

- [Claude Code 最佳实践](https://code.claude.com/docs/zh-CN/best-practices)
- [工作流指南](https://code.claude.com/docs/zh-CN/workflows)
- [性能优化](https://code.claude.com/docs/zh-CN/performance)
