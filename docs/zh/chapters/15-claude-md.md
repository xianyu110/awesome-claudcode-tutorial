# 15. 项目记忆文件 (CLAUDE.md)

CLAUDE.md 是项目的永久记忆，让 Claude Code 跨会话记住项目特定信息。

## 🎯 什么是 CLAUDE.md？

### 核心概念

```
没有 CLAUDE.md：
会话 A → 项目信息 → 会话结束（信息丢失）
会话 B → 重新解释项目 → 浪费时间

有 CLAUDE.md：
CLAUDE.md → 项目信息永久保存
会话 A → 读取 CLAUDE.md → 立即理解项目
会话 B → 读取 CLAUDE.md → 无需重复说明
```

### 为什么需要 CLAUDE.md？

**场景 1：新会话快速上手**
```
不用每次都解释：
"这是一个 React + Redux 项目，
使用 TypeScript，
采用 Monorepo 结构..."
```

**场景 2：团队协作**
```
团队成员 A 在 CLAUDE.md 中记录规范
团队成员 B 的 Claude Code 自动读取规范
确保一致的理解
```

**场景 3：长期项目**
```
6 个月后重新打开项目
Claude Code 仍记得：
- 架构决策
- 编码规范
- 特殊配置
```

## 📁 CLAUDE.md 位置

### 自动发现位置

```
项目根目录/
├── .claude/
│   └── CLAUDE.md          # 优先级最高
├── CLAUDE.md              # 标准位置
└── docs/
    └── CLAUDE.md          # 也能识别
```

### 优先级顺序

```
1. .claude/CLAUDE.md
2. ./CLAUDE.md
3. docs/CLAUDE.md
```

## 💻 CLAUDE.md 结构

### 基础模板

```markdown
# 项目名称

## 项目概述
[简要描述项目]

## 技术栈
- 前端：
- 后端：
- 数据库：
- 其他工具：

## 项目结构
[目录结构说明]

## 开发规范
[编码规范]

## 重要配置
[特殊配置说明]

## 常用命令
[开发命令]

## 注意事项
[重要提醒]
```

### 完整示例

```markdown
# E-Commerce Platform

## 项目概述
一个现代化的电商平台，支持多商家、多语言、多货币。

## 技术栈

### 前端
- **框架**: Next.js 14 (App Router)
- **状态管理**: Redux Toolkit + RTK Query
- **样式**: Tailwind CSS + shadcn/ui
- **表单**: React Hook Form + Zod
- **测试**: Vitest + Testing Library

### 后端
- **框架**: NestJS
- **数据库**: PostgreSQL + Prisma ORM
- **认证**: JWT + refresh tokens
- **缓存**: Redis
- **队列**: Bull + Redis

### DevOps
- **容器**: Docker
- **CI/CD**: GitHub Actions
- **监控**: Sentry + Datadog
- **部署**: Vercel (前端) + AWS (后端)

## 项目结构

```
├── apps/
│   ├── frontend/          # Next.js 前端
│   ├── backend/           # NestJS 后端
│   └── admin/             # 管理后台
├── packages/
│   ├── ui/                # 共享 UI 组件
│   ├── config/            # 共享配置
│   └── types/             # TypeScript 类型
├── .claude/
│   └── CLAUDE.md          # 本文件
└── turbo.json             # Turborepo 配置
```

## 开发规范

### 编码规范

1. **TypeScript 严格模式**
   ```typescript
   // tsconfig.json
   {
     "compilerOptions": {
       "strict": true,
       "noUncheckedIndexedAccess": true
     }
   }
   ```

2. **命名约定**
   - 组件: PascalCase (UserProfile.tsx)
   - 工具函数: camelCase (formatDate.ts)
   - 常量: UPPER_SNAKE_CASE (API_BASE_URL)
   - 类型: PascalCase (UserData.ts)

3. **导入顺序**
   ```typescript
   // 1. React 相关
   import { useState } from 'react';

   // 2. 第三方库
   import { useForm } from 'react-hook-form';

   // 3. 内部模块
   import { Button } from '@/components/ui';
   import { useAuth } from '@/hooks/useAuth';

   // 4. 类型
   import type { User } from '@/types';

   // 5. CSS
   import styles from './UserProfile.module.css';
   ```

4. **错误处理**
   ```typescript
   // 始终使用 try-catch
   try {
     const data = await fetchData();
     return { success: true, data };
   } catch (error) {
     console.error('Fetch error:', error);
     return { success: false, error: 'Failed to fetch' };
   }
   ```

### Git 规范

**Commit 消息格式:**
```
<type>(<scope>): <subject>

<body>

<footer>
```

**类型:**
- `feat`: 新功能
- `fix`: Bug 修复
- `docs`: 文档
- `style`: 格式（不影响代码运行）
- `refactor`: 重构
- `perf`: 性能优化
- `test`: 测试
- `chore`: 构建/工具

**示例:**
```
feat(auth): add OAuth2 Google login

Implemented Google OAuth2 authentication flow:
- Added Google OAuth callback endpoint
- Created OAuth2 service
- Updated auth module

Closes #123
```

### PR 规范

**PR 标题:** 使用 Conventional Commits

**PR 描述模板:**
```markdown
## 类型
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation

## 变更说明
[描述做了什么]

## 测试
- [ ] 单元测试
- [ ] 集成测试
- [ ] 手动测试

## 截图（如适用）
[添加截图]

## Checklist
- [ ] 遵循编码规范
- [ ] 自我审查代码
- [ ] 添加注释
- [ ] 更新文档
- [ ] 通过所有测试
```

## 重要配置

### 环境变量

```bash
# .env.example
# Database
DATABASE_URL="postgresql://user:pass@localhost:5432/mydb"

# Auth
JWT_SECRET="your-secret-key"
JWT_EXPIRES_IN="15m"
REFRESH_TOKEN_EXPIRES_IN="7d"

# Redis
REDIS_URL="redis://localhost:6379"

# External APIs
STRIPE_SECRET_KEY="sk_test_..."
GOOGLE_OAUTH_CLIENT_ID="..."

# App
NEXT_PUBLIC_APP_URL="http://localhost:3000"
NODE_ENV="development"
```

### 代码分割

```typescript
// 动态导入大型组件
const HeavyChart = dynamic(() => import('./HeavyChart'), {
  loading: () => <ChartSkeleton />,
  ssr: false
});

// 路由级别代码分割
// app/dashboard/page.tsx
export const dynamic = 'force-dynamic';
```

### API 响应格式

```typescript
// 统一的 API 响应格式
interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: unknown;
  };
  meta?: {
    timestamp: string;
    requestId: string;
  };
}
```

## 常用命令

### 开发

```bash
# 启动所有服务
turbo run dev

# 仅启动前端
turbo run dev --filter=@myapp/frontend

# 仅启动后端
turbo run dev --filter=@myapp/backend

# 类型检查
turbo run type-check

# 代码格式化
turbo run format

# 代码检查
turbo run lint
```

### 测试

```bash
# 运行所有测试
turbo run test

# 监听模式
turbo run test --watch

# 覆盖率
turbo run test --coverage

# E2E 测试
turbo run test:e2e
```

### 构建

```bash
# 生产构建
turbo run build

# 本地预览构建
turbo run preview

# 分析构建产物
turbo run analyze
```

### 数据库

```bash
# 生成迁移
npx prisma migrate dev --name init

# 应用迁移
npx prisma migrate deploy

# 生成客户端
npx prisma generate

# 打开 Prisma Studio
npx prisma studio

# 重置数据库（开发环境）
npx prisma migrate reset
```

## 架构决策

### 为什么选择 Monorepo？

**决策时间:** 2024-01-15

**原因:**
1. 代码共享方便（UI 组件、类型定义）
2. 统一的依赖管理
3. 原子化提交（前端 + 后端一起）
4. 简化 CI/CD

**权衡:**
- 构建时间较长（用 Turborepo 缓存解决）
- 学习曲线（但团队已熟悉）

### 为什么选择 Prisma？

**决策时间:** 2024-01-20

**原因:**
1. 优秀的 TypeScript 支持
2. 自动迁移生成
3. 开发者体验好
4. 社区活跃

**替代方案考虑:**
- TypeORM: TypeScript 支持不够好
- Sequelize: API 过于复杂
- Drizzle: 太新，生态不够成熟

## 性能优化

### 前端优化

1. **图片优化**
   ```typescript
   import Image from 'next/image';

   <Image
     src="/hero.png"
     alt="Hero"
     width={1200}
     height={600}
     priority  // 首屏图片
     placeholder="blur"
   />
   ```

2. **数据获取**
   ```typescript
   // 使用 SWR 或 React Query
   const { data, error } = useSWR('/api/users', fetcher);

   // 并行请求
   const [users, products] = await Promise.all([
     fetch('/api/users'),
     fetch('/api/products')
   ]);
   ```

3. **代码分割**
   ```typescript
   // 路由级别分割
   const Dashboard = dynamic(() => import('./Dashboard'));

   // 组件级别分割
   const Chart = dynamic(() => import('./Chart'), {
     loading: () => <Skeleton />
   });
   ```

### 后端优化

1. **数据库查询**
   ```typescript
   // 使用 select 限制字段
   const users = await prisma.user.findMany({
     select: {
       id: true,
       name: true,
       email: true
       // 排除大字段
     }
   });

   // 使用索引
   // schema.prisma
   @@index([email])
   @@index([createdAt])
   ```

2. **缓存策略**
   ```typescript
   // Redis 缓存
   const cached = await redis.get(`user:${id}`);
   if (cached) return JSON.parse(cached);

   const user = await prisma.user.findUnique({ where: { id } });
   await redis.setex(`user:${id}`, 3600, JSON.stringify(user));

   return user;
   ```

3. **分页**
   ```typescript
   // 使用 cursor 分页（大数据集）
   const users = await prisma.user.findMany({
     take: 20,
     cursor: { id: lastId },
     orderBy: { id: 'asc' }
   });
   ```

## 安全措施

### 认证授权

```typescript
// JWT 验证中间件
import { verify } from 'jsonwebtoken';

export function authMiddleware(req, res, next) {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }

  try {
    const decoded = verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Invalid token' });
  }
}
```

### 数据验证

```typescript
// 使用 Zod 验证
import { z } from 'zod';

const createUserSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  name: z.string().min(2)
});

app.post('/users', async (req, res) => {
  const result = createUserSchema.safeParse(req.body);

  if (!result.success) {
    return res.status(400).json({ error: result.error });
  }

  // 处理逻辑...
});
```

### 环境变量保护

```bash
# .gitignore
.env
.env.local
.env.production

# 仅提交示例
.env.example
```

## 故障排除

### 常见问题

**Q: 开发服务器启动失败**
```bash
A: 检查端口占用
lsof -ti:3000 | xargs kill -9

清除缓存
rm -rf .next node_modules
npm install
```

**Q: 类型错误**
```bash
A: 重新生成类型
npx prisma generate
turbo run type-check
```

**Q: 测试失败**
```bash
A: 清理 Jest 缓存
turbo run test --clearCache
```

## 注意事项

⚠️ **重要提醒:**

1. **永远不要提交:**
   - `.env` 文件
   - `node_modules/`
   - `.next/`
   - `dist/`

2. **部署前检查:**
   - 运行所有测试
   - 检查控制台错误
   - 验证环境变量
   - 检查 bundle 大小

3. **性能监控:**
   - 监控 Core Web Vitals
   - 设置 Sentry 错误追踪
   - 定期检查 Datadog 指标

4. **安全审查:**
   - 定期更新依赖
   - 运行 `npm audit`
   - 检查敏感信息泄露

## 最近更新

### 2024-03-15
- [x] 添加 OAuth2 认证
- [x] 更新 Redis 配置
- [x] 优化数据库查询

### 2024-03-10
- [x] 重构用户模块
- [x] 添加单元测试
- [x] 更新文档

## 待办事项

- [ ] 实现搜索功能
- [ ] 添加实时通知
- [ ] 优化移动端体验
- [ ] 完善测试覆盖率
```


## 🛡️ 护栏而非手册

### 核心理念

Claude Code 的负责人 Boris 提出了一个关键原则：

> **CLAUDE.md 应该是"护栏"（guardrails），而不是"手册"（manual）。**

```
❌ 手册式写法（不推荐）：
"项目使用 React，组件放在 src/components/ 下，
状态管理用 Redux，API 请求用 axios，
测试用 Jest，构建用 Webpack..."

→ 这是文档应该做的事
→ 太长，浪费上下文 token
→ 大部分信息 Claude 可以自己发现

✅ 护栏式写法（推荐）：
"不要修改 src/legacy/ 下的文件，
那是即将废弃的旧代码。
所有新 API 必须使用 Zod 验证。
测试覆盖率要求 80% 以上。"

→ 只写 Claude 自己无法知道的约束
→ 短小精悍（Boris 的 CLAUDE.md 约 2500 tokens）
→ 防止 Claude 犯错
```

### Boris 的 CLAUDE.md 示例

```markdown
# 项目规范

## 约束
- 不要修改 src/legacy/ 目录，那是废弃代码
- 新的 API 端点必须使用 Zod 进行输入验证
- 数据库迁移只能使用 Prisma Migrate
- 不要安装新的 npm 包，除非我明确要求

## 风格
- 使用函数式组件和 hooks
- 优先使用 TypeScript 接口而非 type
- 错误处理使用 Result 模式，不要 throw

## 测试
- 测试覆盖率要求 80%+
- 使用 Vitest 而不是 Jest
- E2E 测试使用 Playwright
```

💡 **约 2500 tokens，只包含关键的约束和偏好。**

## 🧠 Auto Memory 自动记忆系统

### 什么是 Auto Memory？

Claude Code 有一个内置的自动记忆系统，可以跨会话保存和回忆信息。

```
记忆位置：
~/.claude/projects/<项目路径>/memory/

目录结构：
~/.claude/projects/my-app/memory/
├── MEMORY.md          # 记忆索引
├── user_role.md       # 用户画像
├── feedback_xxx.md    # 用户反馈记录
├── project_xxx.md     # 项目信息
└── reference_xxx.md   # 外部资源引用
```

### Auto Memory 的工作方式

```
会话中：
你: "我喜欢用函数式编程风格"
→ Claude 自动保存到 memory/user_style.md

下次会话：
Claude: [自动读取 memory/]
→ 知道你偏好函数式风格
→ 自动按你的偏好编写代码
```

### CLAUDE.md vs Auto Memory

| 特性 | CLAUDE.md | Auto Memory |
|------|-----------|-------------|
| 存储位置 | 项目根目录 | `~/.claude/projects/` |
| 创建方式 | 手动编写 | Claude 自动创建 |
| 提交到 Git | ✅ 可以 | ❌ 不需要 |
| 团队共享 | ✅ 团队可见 | ❌ 仅个人 |
| 内容类型 | 项目规范、约束 | 个人偏好、反馈 |
| 优先级 | 高（项目规则） | 中（个人偏好） |

### 迭代飞轮：持续降低错误率

```
Claude 犯了一个错误
    ↓
你纠正：不要这样做，应该那样做
    ↓
Claude 保存到 Auto Memory
    ↓
下次不再犯同样的错误
    ↓
错误率持续降低 📉
```

### Shrivu Shankar 的反模式建议

Claude Code 团队成员 Shrivu Shankar 提出了几个重要的反模式：

```
❌ 反模式 1：@引用大文档
"参考这个 200 页的设计文档" → @design-doc.pdf
→ 大文档消耗大量上下文
→ Claude 反而更难找到关键信息

✅ 正确做法：
从文档中提取关键部分
或用几句话总结要点

❌ 反模式 2：只写"永远不要做 X"
"永远不要删除文件"
→ 没有说明为什么
→ Claude 可能在不同上下文中误判

✅ 正确做法：
"不要删除 src/data/ 下的文件，因为它们是
手动维护的种子数据，删除后需要从生产环境
重新导出"
→ 说明原因和背景
→ Claude 能更好地判断
```

### 该写/不该写什么

| 该写 ✅ | 不该写 ❌ |
|---------|----------|
| Claude 自己无法发现的约束 | 项目的基本结构（它能自己看） |
| 容易犯的错误和注意事项 | 框架的基本用法（它已经知道） |
| 项目特有的约定和规范 | 通用的编程最佳实践 |
| 为什么某个决策这样做 | 大段的代码示例 |
| 团队的工作流程 | 依赖列表和版本号 |

## 📁 层级结构详解

### CLAUDE.md 的层级

```
全局级（对所有项目生效）：
~/.claude/CLAUDE.md
→ 你的个人偏好
→ 例如："我喜欢中文注释"

项目级（对当前项目生效）：
project/CLAUDE.md
→ 项目规范和约束
→ 团队共享

子目录级（对特定目录生效）：
project/src/api/CLAUDE.md
→ 特定模块的规范
→ 例如："这个目录下的代码必须使用 Result 模式"
```

### @引用语法

你可以在 CLAUDE.md 中引用其他文件：

```markdown
# CLAUDE.md

## 参考
@docs/architecture.md       # 引用架构文档
@docs/api-conventions.md    # 引用 API 约定
@package.json               # 引用 package.json
```

💡 **注意**：@引用会增加上下文消耗，只引用必要的文件。

## 🎯 最佳实践

### ✅ DO - 应该做的

1. **保持简洁**
   ```
   只包含必要信息
   避免冗长描述
   ```

2. **定期更新**
   ```
   架构变更后更新
   添加新技术时记录
   ```

3. **使用结构化格式**
   ```
   Markdown 标题
   代码块
   列表
   ```

4. **包含实际示例**
   ```
   真实可用的代码
   实际的命令
   ```

### ❌ DON'T - 避免做的

1. ❌ 写小说
   ```
   不是博客，保持简洁
   ```

2. ❌ 过时信息
   ```
   定期检查和更新
   ```

3. ❌ 过于具体
   ```
   关注原则，不是细节
   ```

4. ❌ 重复信息
   ```
   不要重复 README
   ```

## 📚 下一步

了解 CLAUDE.md 后，继续学习 [16. Hook 系统](./16-hooks.md)

## 🔗 相关资源

- [CLAUDE.md 官方文档](https://code.claude.com/docs/zh-CN/claude-md)
- [项目记忆最佳实践](https://code.claude.com/docs/zh-CN/best-practices#project-memory)


---

> 💡 **API 推荐**：[https://tryallapi.com/](https://tryallapi.com/) - 一站式接入各种AI服务，注册即送0.2刀
