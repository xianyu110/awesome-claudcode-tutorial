# 06. 使用规划模式 (Plan Mode)


> 📷 **截图说明**：本章配图为终端风格示意图，密钥均已打码。

规划模式是处理复杂任务的强大工具，让你在执行前就能看到完整的计划。

> 📌 **版本说明**：本章已更新至 Claude Code 2.1.310（2026-10-24），内容以[官方文档](https://code.claude.com/docs/en/overview)和[官方 CHANGELOG](https://github.com/anthropics/claude-code/blob/main/CHANGELOG.md) 为准。

## 🎯 什么是规划模式？

规划模式强制 Claude Code 在执行任何操作前，先展示完整的执行计划并等待你的批准。

### 核心价值

```
传统方式：
    描述任务 → Claude 开始执行 → 发现方向不对 → 停止重来 ❌

规划模式：
    描述任务 → Claude 展示计划 → 审查调整 → 一次性执行 ✓
```

## 🚀 启动规划模式

### 方式一：启动时启用

```bash
claude --permission-mode plan
```

![规划模式启动示意](/images/screenshots/04-plan-mode.png)

> 📷 示意图

![Shift+Tab 切换权限模式](/images/screenshots/04-shift-tab.png)

> 📷 示意图

### 方式二：快捷键切换

在会话中按 **`Shift+Tab`** 循环切换权限模式，直到状态栏显示 `plan mode on`：
- 循环顺序：auto → default（Manual）→ acceptEdits → plan → 回到 auto

也可以只对一条提示使用规划模式：在提示前加 `/plan`，例如 `/plan 重构认证模块`。

### 方式三：配置文件

在 `~/.claude/settings.json`（全局）或项目的 `.claude/settings.json` 中设置：

```json
{
  "permissions": {
    "defaultMode": "plan"
  }
}
```

> ⚠️ 旧版教程中的 `--plan-mode` 参数、`planModeRequired` 字段和 `.claude/config.yml` 在当前官方文档中不存在。
>
> 💡 计划生成后按 `Ctrl+G` 可在编辑器中直接修改计划；计划文件默认保存在 `~/.claude/plans/`（可用 `plansDirectory` 修改）。
>
> ℹ️ 旧版的 `/ultraplan` 命令已在 v2.1.222 移除，请直接使用规划模式。

## 📋 规划模式工作流程

### 完整流程图

```
┌─────────────────────────────────────────────────────┐
│ 1. 描述任务                                          │
└──────────────────┬──────────────────────────────────┘
                   ↓
┌─────────────────────────────────────────────────────┐
│ 2. Claude 分析项目                                    │
│    - 探索代码结构                                      │
│    - 理解依赖关系                                      │
│    - 识别风险点                                        │
└──────────────────┬──────────────────────────────────┘
                   ↓
┌─────────────────────────────────────────────────────┐
│ 3. 生成详细计划                                        │
│    - 执行步骤                                          │
│    - 文件清单                                          │
│    - 预期变更                                          │
└──────────────────┬──────────────────────────────────────┘
                   ↓
┌─────────────────────────────────────────────────────┐
│ 4. 你审查计划                                          │
│    - 是否满足需求？                                     │
│    - 是否有遗漏？                                       │
│    - 是否有风险？                                       │
└──────────────────┬──────────────────────────────────┘
                   ↓
              ┌────┴────┐
              ↓         ↓
          批准 ✓      修改 ✗
              ↓         ↓
┌─────────────────┐  ┌─────────────────┐
│ 5. 执行计划      │  │ 3. 生成修订计划  │
│    - 按步骤执行   │  └────────┬────────┘
│    - 汇报进度    │           ↓
│    - 处理错误    │  返回步骤 4
└─────────────────┘
              ↓
┌─────────────────┐
│ 6. 验证和总结    │
└─────────────────┘
```

## 💻 实战示例

### 示例 1: 添加用户认证系统

```
你: 我想添加完整的用户认证系统，包括：
- 邮箱密码注册和登录
- JWT token 认证
- 密码重置功能
- 记住登录状态

Claude Code 分析中...

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📋 执行计划
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

## 📁 将要创建的文件 (8 个)

### 新增文件：
1. src/api/auth.js - 认证 API 接口
2. src/middleware/auth.js - 认证中间件
3. src/models/User.js - 用户模型
4. src/utils/email.js - 邮件发送工具
5. src/utils/jwt.js - JWT 工具函数
6. src/pages/Login.jsx - 登录页面
7. src/pages/Register.jsx - 注册页面
8. src/pages/ResetPassword.jsx - 密码重置页面

## 📝 将要修改的文件 (5 个)

1. src/App.jsx - 添加路由
2. src/store/index.js - 添加认证状态管理
3. .env.example - 添加环境变量模板
4. server.js - 添加认证路由
5. package.json - 添加新依赖

## 🔧 需要安装的依赖

```bash
npm install bcryptjs jsonwebtoken nodemailer
npm install @types/bcryptjs @types/jsonwebtoken  # TypeScript
```

## 📋 执行步骤

### 阶段 1: 后端准备
1. 安装认证相关依赖包
2. 创建用户数据模型
3. 实现 JWT 生成和验证
4. 创建认证 API 端点
   - POST /api/auth/register
   - POST /api/auth/login
   - POST /api/auth/logout
   - POST /api/auth/refresh
   - POST /api/auth/forgot-password
   - POST /api/auth/reset-password

### 阶段 2: 前端实现
5. 创建认证状态管理
6. 实现登录页面
7. 实现注册页面
8. 实现密码重置流程
9. 添加路由守卫

### 阶段 3: 集成测试
10. 配置测试环境变量
11. 编写单元测试
12. 测试完整认证流程

## ⚠️ 风险评估

- 🟡 中等风险：需要配置邮件服务
- 🟡 中等风险：需要妥善保管 JWT_SECRET
- 🟢 低风险：不涉及数据库迁移

## ⏱️ 预计影响

- 修改文件：13 个
- 新增代码：约 1500 行
- 预计时间：30-45 分钟

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

是否批准此计划？

[y] 批准并执行
[n] 拒绝
[m] 修改计划
[p] 保存计划到文件
[v] 查看详细步骤
```

### 示例 2: 重构组件架构

```
你: 将现在的 class 组件全部重构为 hooks，并优化性能

Claude Code 分析中...

发现 23 个 class 组件，正在生成重构计划...

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📋 组件重构计划
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

## 📊 当前状态分析

### Class 组件清单 (23 个)

#### 高优先级（频繁使用）
1. src/components/UserList.jsx (356 行)
2. src/components/Dashboard.jsx (412 行)
3. src/components/DataTable.jsx (289 行)

#### 中优先级
4-15. 其他常用组件...

#### 低优先级（较少使用）
16-23. 辅助组件...

### 发现的性能问题

1. ❌ UserList: 每次渲染都重新计算过滤结果
2. ❌ Dashboard: 缺少 React.memo 优化
3. ❌ DataTable: 未使用虚拟滚动，大数据时卡顿
4. ❌ 多个组件: 过多的 useEffect 依赖

## 🔄 重构策略

### 阶段 1: 高优先级组件
1. UserList.jsx
   - 转换为函数组件
   - 使用 useMemo 优化过滤
   - 使用 useCallback 稳定函数引用
   - 添加 React.memo

2. Dashboard.jsx
   - 转换为函数组件
   - 拆分为多个自定义 hooks
   - useDashboardData - 数据获取
   - useDashboardMetrics - 指标计算
   - useDashboardFilters - 过滤器逻辑

3. DataTable.jsx
   - 转换为函数组件
   - 集成 react-window 虚拟滚动
   - 使用 useReducer 管理复杂状态

### 阶段 2: 中优先级组件 (4-15)
批量重构，使用统一模式

### 阶段 3: 低优先级组件 (16-23)
简单转换，不需要深度优化

### 阶段 4: 自定义 Hooks 库
创建 src/hooks/index.js
- useLocalStorage
- useDebounce
- useFetch
- usePrevious

## ⚠️ 风险评估

- 🔴 高风险：破坏现有功能
- 🟡 中风险：性能可能暂时下降
- 缓解措施：
  - 保持组件 props 接口不变
  - 添加完整的单元测试
  - 逐个组件重构并测试

## 📋 回滚计划

如果出现问题：
```bash
git stash                    # 暂存更改
git checkout HEAD~1          # 回到上一个版本
```

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

是否批准此计划？

[y] 批准并执行
[n] 拒绝
[s] 分阶段执行（一次一个组件]
[v] 查看某个组件的详细重构方案
```

### 示例 3: 数据库迁移

```
你: 帮我从 MongoDB 迁移到 PostgreSQL

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📋 数据库迁移计划
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

## 🗄️ 当前 MongoDB Schema 分析

发现 12 个集合：
1. users (15,234 文档)
2. posts (45,678 文档)
3. comments (123,456 文档)
4. ...

## 📊 PostgreSQL Schema 设计

### 表结构映射

MongoDB → PostgreSQL

users → users
  _id → id (SERIAL PRIMARY KEY)
  email → email (VARCHAR(255) UNIQUE)
  password_hash → password_hash (TEXT)
  created_at → created_at (TIMESTAMP)

posts → posts
  _id → id (SERIAL PRIMARY KEY)
  author_id → author_id (INTEGER REFERENCES users(id))
  title → title (VARCHAR(500))
  content → content (TEXT)
  tags → tags (TEXT[])  -- 数组类型
  created_at → created_at (TIMESTAMP)

## 🔄 迁移步骤

### 阶段 1: 准备 (15 分钟)
1. 安装 PostgreSQL 客户端库
   ```bash
   npm install pg @types/pg
   ```

2. 创建 PostgreSQL 数据库
   ```bash
   createdb app_production
   ```

3. 创建数据库 Schema
   - 生成 SQL migration 文件
   - 创建所有表和索引
   - 设置外键约束

### 阶段 2: 数据迁移脚本 (30 分钟)
4. 编写迁移脚本
   - src/migrations/migrate-to-postgres.js
   - 使用批量处理优化性能
   - 实现断点续传功能

5. 迁移顺序（考虑外键依赖）
   ```
   users → posts → comments → likes → ...
   ```

### 阶段 3: 代码更新 (45 分钟)
6. 更新数据库连接配置
   - config/database.js

7. 更新 ORM/查询层
   - 替换 MongoDB 查询为 SQL
   - 更新所有数据库操作函数

8. 更新模型定义
   - src/models/* (所有模型)

### 阶段 4: 测试和验证 (30 分钟)
9. 数据完整性检查
   ```bash
   npm run verify-migration
   ```

10. 性能对比测试
    - 查询响应时间
    - 并发处理能力

11. 回归测试
    ```bash
    npm test
    ```

### 阶段 5: 切换 (15 分钟)
12. 维护模式公告
13. 最终增量数据迁移
14. 切换流量到 PostgreSQL
15. 监控错误和性能

## ⚠️ 风险评估

- 🔴 高风险：数据丢失风险
- 🔴 高风险：停机时间
- 🟡 中风险：性能可能不如预期

### 风险缓解措施

1. 数据安全
   - ✅ 迁移前完整备份 MongoDB
   - ✅ 保留 MongoDB 双写一周
   - ✅ 实现回滚脚本

2. 最小化停机
   - ✅ 使用增量同步
   - ✅ 预演完整流程
   - ✅ 选择低峰时段

3. 性能保证
   - ✅ 提前进行压力测试
   - ✅ 准备索引优化方案
   - ✅ 配置连接池

## 📦 需要的工具

- mongodb-to-postgres 迁移工具
- pg_dump 备份工具
- 数据验证脚本

## 🔄 回滚方案

如果迁移失败：
1. 停止 PostgreSQL 服务
2. 切换回 MongoDB
3. 修复问题
4. 重新安排迁移

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

这是重大变更，建议分阶段执行。

选择执行方式：
[1] 完整执行（约 2.5 小时）
[2] 仅执行阶段 1-2（准备和迁移脚本）
[3] 仅执行阶段 1（Schema 设计）
[4] 保存计划，稍后执行
[5] 取消
```

## 🎨 计划文件结构

规划模式会生成可保存的计划文件：

```
~/.claude/plans/
├── 2024-03-15-authentication-system.md
├── 2024-03-16-refactor-to-hooks.md
├── 2024-03-17-mongodb-to-postgres.md
└── 2024-03-18-add-payment-integration.md
```

### 计划文件格式

```markdown
# 计划：添加用户认证系统

**创建时间**: 2024-03-15 14:30
**状态**: 待执行
**优先级**: 高

## 概述
添加完整的用户认证系统...

## 影响范围
- 新增文件: 8
- 修改文件: 5
- 新增代码: ~1500 行

## 执行步骤
[详细步骤...]

## 风险评估
[风险评估...]

## 执行日志
[执行时填充...]
```

## 💡 规划模式最佳实践

### 1. 提供清晰的上下文

❌ 不好：
```
你: 重构代码
```

✅ 好：
```
你: 将所有 class 组件重构为 hooks，
重点关注性能优化，保持向后兼容
```

### 2. 分阶段处理大任务

```
你: 这个项目太大，我们先做第一阶段：
只迁移核心的用户认证模块，其他模块后续再做
```

### 3. 利用计划讨论

```
你: 我看到计划要改 20 个文件，
能否先只改最关键的 3 个？
我看看效果再决定是否继续
```

### 4. 保存并复用计划

```
你: 把这个计划保存到文件，
我需要和团队讨论后再执行

Claude: ✓ 计划已保存到
~/.claude/plans/2024-03-15-refactor.md

[一周后]
你: 读取保存的计划并执行

Claude: [读取计划文件]
找到之前保存的计划，开始执行...
```

## 🔄 规划模式 vs 其他模式对比

| 特性 | 规划模式 | 默认模式 | 自动模式 |
|------|----------|----------|----------|
| 适合任务 | 大型重构、新功能 | 小型修复、调整 | 重复任务 |
| 可见性 | 完整计划 | 逐步可见 | 完成后可见 |
| 控制力 | 最高 | 高 | 低 |
| 学习价值 | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐ |
| 安全性 | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐ |

## 🎯 何时强制使用规划模式

### 在配置文件中设置

在项目的 `.claude/settings.json` 中把默认模式设为 plan，团队成员在该项目启动的终端会话都会从规划模式开始：

```json
{
  "permissions": {
    "defaultMode": "plan"
  }
}
```

组织范围可以在[托管设置](https://code.claude.com/docs/en/managed-settings)中设置。

> ⚠️ 旧版教程中的 `CLAUDE_PLAN_MODE` 环境变量在当前官方文档中不存在。

### 适用场景

- 🏢 **团队项目** - 需要代码审查
- 🔒 **生产环境** - 风险高
- 📦 **大型重构** - 影响范围大
- 💰 **付费功能** - 涉及支付
- 🔐 **安全相关** - 认证授权

## 📚 下一步

掌握规划模式后，继续学习 [07. 跳过所有权限检测](./07-permissions.md)

## 🔗 相关资源

- [规划模式官方文档](https://code.claude.com/docs/zh-CN/plan-mode)
- [代码审查最佳实践](https://code.claude.com/docs/zh-CN/workflows#code-review)


---

> 💡 **API 推荐**：[https://tryallapi.com/](https://tryallapi.com/) - 一站式接入各种AI服务，注册即送0.2刀
