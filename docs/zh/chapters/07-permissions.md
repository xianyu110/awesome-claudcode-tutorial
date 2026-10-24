# 07. 跳过所有权限检测 (dangerously-skip-permissions)

## ⚠️ 重要警告

`--dangerously-skip-permissions` 是一个高级选项，适合以下场景：
- 完全信任 Claude Code 的操作
- 在隔离的沙盒环境中工作
- 执行经过验证的重复性任务

**不推荐在生产环境或关键项目中使用！**

> 📌 **版本说明**：本章已更新至 Claude Code 2.1.310（2026-10-24），内容以[官方文档](https://code.claude.com/docs/en/overview)和[官方 CHANGELOG](https://github.com/anthropics/claude-code/blob/main/CHANGELOG.md) 为准。

> 🆕 **新版提示**：`--dangerously-skip-permissions` 等价于 `--permission-mode bypassPermissions`。官方建议只在**无外网的容器、虚拟机或 dev container** 等隔离环境中使用。如果只是想少点确认，优先考虑 auto 模式（v2.1.283 起交互式会话默认启用）或 `acceptEdits` 模式，详见 [04. 三种模式详解](./04-modes.md)。

## 🎯 什么是权限跳过？

### 默认行为 vs 权限跳过

```bash
# 默认行为：每个操作都需要确认
$ claude
→ 将读取 src/app.js
Allow? (Y/n) Y
→ 将修改 src/app.js
Allow? (Y/n) Y

# 权限跳过：自动执行所有操作
$ claude --dangerously-skip-permissions
→ 读取 src/app.js ✓
→ 修改 src/app.js ✓
→ 运行测试 ✓
[全部自动完成，无中断]
```

## 🚀 使用方式

### 方式一：命令行参数

```bash
# 跳过所有权限检测
claude --dangerously-skip-permissions

# 等价写法
claude --permission-mode bypassPermissions
```

### 方式二：配置文件

在用户级 `~/.claude/settings.json`（或托管设置）中设置（写在项目 `.claude/settings.json` 中不会生效）：

```json
{
  "permissions": {
    "defaultMode": "bypassPermissions"
  }
}
```

> ⚠️ 旧版教程中的 `claude -y` 简写、`~/.claude/config.json` 的 `dangerouslySkipPermissions` 字段和 `CLAUDE_SKIP_PERMISSIONS` 环境变量在当前官方文档中不存在。
>
> ℹ️ 即使在此模式下，`deny` 规则依然生效；首次以此模式启动交互会话时会弹出警告对话框要求确认。

## 📊 权限系统概览

### 四个权限级别

| 级别 | 命令 | 确认次数 | 安全性 | 适用场景 |
|------|------|----------|--------|----------|
| **严格模式** | 默认 | 每个操作 | ⭐⭐⭐⭐⭐ | 生产环境 |
| **自动模式** | `--permission-mode auto` | 少量 | ⭐⭐⭐ | 长任务、日常开发 |
| **规划模式** | `--permission-mode plan` | 1次 | ⭐⭐⭐⭐⭐ | 大型重构 |
| **跳过权限** | `--dangerously-skip-permissions` | 0 | ⭐ | 沙盒/测试 |

### 权限类型详解

#### 1. 读取权限 (Read Permissions)

```bash
# 默认行为
→ 读取 package.json
Allow? (Y/n)

# 跳过后
→ 读取 package.json ✓ [无提示]
```

#### 2. 编辑权限 (Edit Permissions)

```bash
# 默认行为
→ 修改 src/index.js
Allow? (Y/n)

# 跳过后
→ 修改 src/index.js ✓ [无提示]
```

#### 3. 文件创建权限 (Write Permissions)

```bash
# 默认行为
→ 创建 src/utils/helper.js
Allow? (Y/n)

# 跳过后
→ 创建 src/utils/helper.js ✓ [无提示]
```

#### 4. 命令执行权限 (Bash Permissions)

```bash
# 默认行为
→ npm install
Allow? (Y/n)

# 跳过后
→ npm install [自动运行]
```

#### 5. 网络请求权限 (Network Permissions)

```bash
# 默认行为
→ 发送 API 请求到 https://api.example.com
Allow? (Y/n)

# 跳过后
→ 发送 API 请求 ✓ [无提示]
```

## 💻 实战场景

### 场景 1: 沙盒环境中的快速原型开发

```bash
# 创建一个隔离的测试环境
mkdir -p ~/sandbox/test-project
cd ~/sandbox/test-project

# 使用权限跳过快速开发
claude --dangerously-skip-permissions
```

```
你: 创建一个 Express 服务器，包含：
- 用户 CRUD API
- JWT 认证
- 请求日志中间件
- 错误处理

Claude:
→ npm init -y ✓
→ npm install express jsonwebtoken bcryptjs ✓
→ 创建 src/server.js ✓
→ 创建 src/routes/users.js ✓
→ 创建 src/middleware/auth.js ✓
→ 创建 src/middleware/logger.js ✓
→ 创建 .env.example ✓
→ 配置 package.json scripts ✓

✓ 项目创建完成！
运行 `npm run dev` 启动服务器
```

### 场景 2: 批量代码格式化

```bash
claude --dangerously-skip-permissions
```

```
你: 格式化项目中所有的 JavaScript 文件，
使用 Prettier，使用单引号，2 空格缩进

Claude:
→ 检查项目配置...
→ 安装 prettier ✓
→ 创建 .prettierrc ✓
→ 找到 147 个 .js 文件...
→ 格式化所有文件 ✓

✓ 完成！已格式化 147 个文件
```

### 场景 3: 自动化测试修复

```bash
claude --dangerously-skip-permissions
```

```
你: 运行所有测试，自动修复失败的用例

Claude:
→ npm test ✓

测试结果：23 个失败

正在分析和修复...

1️⃣ 修复 test/user.test.js
→ 修改 src/models/user.js ✓
→ npm test src/models/user.js ✓

2️⃣ 修复 test/auth.test.js
→ 修改 src/middleware/auth.js ✓
→ npm test src/middleware/auth.js ✓

[继续修复...]

→ npm test ✓

✓ 所有测试通过！（347/347）
```

### 场景 4: 依赖升级

```bash
claude --dangerously-skip-permissions
```

```
你: 检查并升级所有过期的依赖到最新版本

Claude:
→ npm outdated ✓

发现 15 个过期依赖：
- react: 18.2.0 → 18.3.0
- react-dom: 18.2.0 → 18.3.0
- webpack: 5.88.0 → 5.89.0
...

→ npm update ✓
→ npm audit fix ✓
→ npm test ✓

✓ 依赖升级完成，所有测试通过
```

## 🛡️ 安全措施

### 1. 使用 Git 保护

```bash
# 在使用权限跳过前，确保 Git 已初始化
git init
git add .
git commit -m "Before auto changes"

# 现在可以安全地使用
claude --dangerously-skip-permissions

# 完成后审查更改
git diff

# 如果满意，提交
git add .
git commit -m "After auto changes"

# 如果不满意，回滚
git reset --hard HEAD~1
```

### 2. 使用 Docker 容器

```bash
# 在 Docker 容器中运行，隔离环境
docker run -it --rm \
  -v $(pwd):/app \
  -w /app \
  node:22 \
  npx -y @anthropic-ai/claude-code --dangerously-skip-permissions
```

### 3. 限制操作范围

```bash
# 只预先放行指定工具（其余仍需确认）
claude --allowedTools "Read" "Bash(npm test)"

# CI/脚本：只允许白名单工具，其余一律拒绝
claude -p "run the test suite" --permission-mode dontAsk --allowedTools "Bash(npm test)" "Read"
```

排除敏感文件可在 `settings.json` 中配置 `deny` 规则（即使在 bypassPermissions 模式下也生效）：

```json
{
  "permissions": {
    "deny": ["Read(./.env)", "Read(./secrets/**)"]
  }
}
```

> ⚠️ 旧版教程中的 `--auto-approve-reads`、`--allowed-dirs`、`--exclude-patterns` 参数在当前官方文档中不存在。

### 4. 保险丝机制

创建一个保护脚本：

```bash
#!/bin/bash
# claude-safe.sh

# 检查是否在正确的分支
BRANCH=$(git branch --show-current)
if [ "$BRANCH" != "development" ]; then
    echo "❌ 只能在 development 分支使用"
    exit 1
fi

# 检查是否有未提交的更改
if [ -n "$(git status --porcelain)" ]; then
    echo "⚠️  你有未提交的更改"
    git status
    read -p "继续吗？(yes/no) " -n 3 ans
    if [ "$ans" != "yes" ]; then
        exit 1
    fi
fi

# 保存当前状态
git stash
git commit --allow-empty -m "Before claude-auto"

# 运行 Claude Code
claude --dangerously-skip-permissions "$@"

# 显示更改
echo "📊 更改摘要："
git diff --stat
```

## 🎯 最佳实践

### ✅ 推荐做法

1. **在测试环境中使用**
   ```bash
   cd test-project/
   claude --dangerously-skip-permissions
   ```

2. **配合 Git 使用**
   ```bash
   git commit -am "Checkpoint"
   claude --dangerously-skip-permissions
   git diff  # 审查更改
   ```

3. **限制操作类型**
   ```bash
   # 只自动接受读取和文件编辑，其他操作仍需确认
   claude --permission-mode acceptEdits
   ```

4. **设置时间限制**
   ```bash
   # 使用 timeout 命令限制运行时间
   timeout 300 claude --dangerously-skip-permissions
   ```

### ❌ 不推荐做法

1. ❌ 在生产环境使用
2. ❌ 修改关键基础设施代码
3. ❌ 没有 Git 版本控制时使用
4. ❌ 不理解操作内容时使用

## 🔄 权限跳过与其他模式对比

```bash
# 1. 完全跳过权限
claude --dangerously-skip-permissions
# 效果：无任何确认，直接执行

# 2. 自动模式
claude --permission-mode auto
# 效果：大多数操作无需确认，由后台分类器做安全检查

# 3. 先规划后执行
claude --permission-mode plan
# 效果：先看计划，批准后按所选方式执行
```

## 📊 实时监控

即使在跳过权限模式下，你仍然可以监控活动：

### 查看 Claude Code 日志

```bash
# Claude Code 会记录所有操作
cat ~/.claude/logs/$(date +%Y-%m-%d).log
```

### 使用 audit 工具

```bash
# 审计最近的更改
git log --since="1 hour ago" --patch

# 查看文件更改统计
git diff --stat HEAD~1 HEAD
```

## 🎓 使用场景决策树

```
需要自动化操作
    │
    ├─ 是否在生产环境？
    │   ├─ 是 → ❌ 不要使用权限跳过
    │   └─ 否 → 继续
    │
    ├─ 是否有 Git 版本控制？
    │   ├─ 否 → ❌ 先初始化 Git
    │   └─ 是 → 继续
    │
    ├─ 操作是否可逆？
    │   ├─ 否 → ⚠️  谨慎使用
    │   └─ 是 → 继续
    │
    └─ 是否信任操作内容？
        ├─ 是 → ✅ 可以使用
        └─ 否 → ❌ 使用规划模式先审查
```

## 🚨 应急处理

### 如果出错

```bash
# 1. 立即停止 Claude Code
Ctrl+C

# 2. 检查 Git 状态
git status

# 3. 回滚更改
git reset --hard HEAD
git clean -fd  # 删除未跟踪的文件

# 4. 查看日志了解发生了什么
cat ~/.claude/logs/latest.log
```

### 创建恢复脚本

```bash
#!/bin/bash
# revert-claude.sh

echo "🔄 正在回滚 Claude Code 的更改..."

# 恢复文件到上一个提交
git reset --hard HEAD~1

# 清理未跟踪的文件
git clean -fd -e ".env" -e "node_modules"

echo "✓ 回滚完成"
echo "📊 当前状态："
git status
```

## 📚 下一步

了解权限系统后，继续学习 [08. 后台任务管理](./08-background-tasks.md)

## 🔗 相关资源

- [权限系统官方文档](https://code.claude.com/docs/zh-CN/permissions)
- [安全最佳实践](https://code.claude.com/docs/zh-CN/best-practices#security)


---

> 💡 **API 推荐**：[https://tryallapi.com/](https://tryallapi.com/) - 一站式接入各种AI服务，注册即送0.2刀
