# 16. Hook 系统

Hooks 让你在特定事件发生时自动执行自定义脚本。

> 📌 **版本说明**：本章已更新至 Claude Code 2.1.310（2026-10-24），内容以[官方 Hooks 文档](https://code.claude.com/docs/en/hooks)为准。

> ⚠️ **重要**：本章后半部分沿用的 `pre-edit` / `post-exec` 等 Hook 名称、`~/.claude/hooks/*.sh` 自动加载方式以及 `~/.claude/config.json` 配置**在当前官方文档中不存在**，仅作思路参考。实际配置请以下面的「官方配置方式」为准。

## ✅ 官方配置方式（2.1.310）

Hook 写在设置文件的 `hooks` 字段中：用户级 `~/.claude/settings.json`，或项目级 `.claude/settings.json`。

### 常用事件

| 事件 | 触发时机 |
|------|----------|
| `SessionStart` / `SessionEnd` | 会话开始 / 结束 |
| `UserPromptSubmit` | 用户提交提示后、Claude 处理前 |
| `PreToolUse` | 工具调用执行前（可以阻止） |
| `PermissionRequest` | 工具调用需要权限决定时 |
| `PostToolUse` | 工具调用成功后 |
| `PostToolUseFailure` | 工具调用失败后 |
| `Notification` | Claude Code 发送通知时 |
| `SubagentStart` / `SubagentStop` | 子代理启动 / 结束 |
| `Stop` | Claude 完成回复时 |
| `PreCompact` / `PostCompact` | 上下文压缩前 / 后 |

完整事件列表（30 多种）见[官方文档](https://code.claude.com/docs/en/hooks)。

### 示例：拦截危险的 `rm -rf`（官方示例）

`.claude/settings.json`：

```json
{
  "hooks": {
    "PreToolUse": [
      {
        "matcher": "Bash",
        "hooks": [
          {
            "type": "command",
            "if": "Bash(rm *)",
            "command": "${CLAUDE_PROJECT_DIR}/.claude/hooks/block-rm.sh",
            "args": []
          }
        ]
      }
    ]
  }
}
```

`.claude/hooks/block-rm.sh`（记得 `chmod +x`，并安装 `jq`）：

```bash
#!/bin/bash
# Hook 从 stdin 读取 JSON 输入
COMMAND=$(jq -r '.tool_input.command')

if echo "$COMMAND" | grep -q 'rm -rf'; then
  jq -n '{
    hookSpecificOutput: {
      hookEventName: "PreToolUse",
      permissionDecision: "deny",
      permissionDecisionReason: "Destructive command blocked by hook"
    }
  }'
else
  exit 0  # 不做决定，走正常权限流程
fi
```

- `matcher` 按工具名过滤，支持 `Edit|Write`、`mcp__.*` 这类写法
- `if` 用权限规则语法进一步缩小范围
- 在会话中可用 `/hooks` 查看已配置的 Hook

> 下文为旧版教程内容，仅供参考思路。

## 🎯 什么是 Hook？

### 核心概念

```
事件发生 → Hook 触发 → 执行脚本 → 继续或阻止

例如：
编辑文件前 → pre-edit Hook → 检查代码规范
          ↓ 通过
          继续编辑
          ↓
          编辑完成 → post-edit Hook → 自动格式化
```

### 为什么需要 Hooks？

**场景 1：自动代码检查**
```
你: 修改代码
→ pre-edit hook 运行 linter
→ 发现错误，阻止编辑
→ 修复后重试
```

**场景 2：自动格式化**
```
你: 保存文件
→ post-edit hook 运行 prettier
→ 自动格式化
→ 代码保持一致
```

**场景 3：安全检查**
```
你: 运行 rm 命令
→ pre-exec hook 检查
→ 确认删除重要文件
→ 阻止或警告
```

## 📁 Hook 配置位置

```
~/.claude/
├── hooks/
│   ├── pre-edit.sh          # 编辑前
│   ├── post-edit.sh         # 编辑后
│   ├── pre-exec.sh          # 命令执行前
│   ├── post-exec.sh         # 命令执行后
│   └── user-prompt.sh       # 用户提示前
└── config.json
```

## 💻 Hook 类型

### 可用的 Hook

| Hook 名称 | 触发时机 | 用途 |
|-----------|----------|------|
| `pre-edit` | 编辑文件前 | 代码检查、验证 |
| `post-edit` | 编辑文件后 | 格式化、通知 |
| `pre-exec` | 执行命令前 | 安全检查、验证 |
| `post-exec` | 执行命令后 | 清理、通知 |
| `user-prompt` | 用户提示前 | 自定义提示 |
| `pre-read` | 读取文件前 | 权限检查 |
| `post-read` | 读取文件后 | 缓存、处理 |

## 🛠️ Hook 脚本示例

### 示例 1: Pre-Edit - 代码规范检查

```bash
#!/bin/bash
# ~/.claude/hooks/pre-edit.sh

# 获取即将编辑的文件
FILE="$1"

# 检查是否是 TypeScript 文件
if [[ "$FILE" == *.ts ]]; then
  echo "🔍 检查 TypeScript 文件: $FILE"

  # 运行类型检查
  if ! npx tsc --noEmit "$FILE" 2>/dev/null; then
    echo "❌ 类型检查失败！"
    echo "请先修复类型错误再编辑"
    exit 1  # 阻止编辑
  fi

  echo "✅ 类型检查通过"
fi

# 检查文件大小
FILE_SIZE=$(wc -c < "$FILE")
if [ $FILE_SIZE -gt 100000 ]; then
  echo "⚠️  警告：文件较大 ($FILE_SIZE bytes)"
  echo "考虑拆分文件"
fi

exit 0  # 允许编辑
```

### 示例 2: Post-Edit - 自动格式化

```bash
#!/bin/bash
# ~/.claude/hooks/post-edit.sh

FILE="$1"
EXT="${FILE##*.}"

case "$EXT" in
  js|jsx|ts|tsx)
    echo "🎨 格式化: $FILE"
    npx prettier --write "$FILE" --log-level silent
    ;;
  py)
    echo "🐍 格式化: $FILE"
    black "$FILE"
    ;;
  go)
    echo "🐹 格式化: $FILE"
    go fmt "$FILE"
    ;;
esac

exit 0
```

### 示例 3: Pre-Exec - 危险命令确认

```bash
#!/bin/bash
# ~/.claude/hooks/pre-exec.sh

COMMAND="$1"

# 危险命令列表
DANGEROUS_COMMANDS=(
  "rm -rf"
  "dd if=/dev/zero"
  "mkfs"
  ":(){ :|:& };:"
  "git push --force"
  "chmod 000"
)

# 检查是否包含危险命令
for cmd in "${DANGEROUS_COMMANDS[@]}"; do
  if [[ "$COMMAND" == *"$cmd"* ]]; then
    echo ""
    echo "⚠️  ⚠️  ⚠️  警告：检测到危险命令 ⚠️  ⚠️  ⚠️"
    echo ""
    echo "命令: $COMMAND"
    echo ""
    read -p "确认执行？(yes/no): " confirm

    if [[ "$confirm" != "yes" ]]; then
      echo "❌ 已取消"
      exit 1  # 阻止执行
    fi
    break
  fi
done

exit 0
```

### 示例 4: Post-Exec - Git 自动提交

```bash
#!/bin/bash
# ~/.claude/hooks/post-exec.sh

COMMAND="$1"

# 如果是 git 命令且改变了状态
if [[ "$COMMAND" == git* ]] && [[ "$COMMAND" != *status ]]; then
  # 等待命令完成
  sleep 1

  # 检查是否有未提交的更改
  if [ -n "$(git status --porcelain)" ]; then
    echo ""
    echo "📝 检测到未提交的更改"

    # 生成 commit 消息
    COMMIT_MSG=$(git diff --name-only | head -n 1 | sed 's/.*/chore: update &/')

    read -p "是否提交？(Y/n): " confirm
    if [[ "$confirm" != "n" && "$confirm" != "N" ]]; then
      git add -A
      git commit -m "$COMMIT_MSG"
      echo "✅ 已提交"
    fi
  fi
fi

exit 0
```

### 示例 5: User-Prompt - 自定义提示

```bash
#!/bin/bash
# ~/.claude/hooks/user-prompt.sh

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🤖 Claude Code - AI 编程助手"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "💡 提示:"
echo "  - 输入 help 查看帮助"
echo "  - 输入 clear 清除屏幕"
echo "  - 输入 exit 退出"
echo ""
echo "📊 当前项目: $(basename $(pwd))"
echo "🌿 Git 分支: $(git branch --show-current 2>/dev/null || echo '未初始化')"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

exit 0
```

## ⚙️ Hook 配置

### 在配置文件中启用

```json
// ~/.claude/config.json
{
  "hooks": {
    "enabled": true,
    "scripts": {
      "pre-edit": "~/.claude/hooks/pre-edit.sh",
      "post-edit": "~/.claude/hooks/post-edit.sh",
      "pre-exec": "~/.claude/hooks/pre-exec.sh",
      "post-exec": "~/.claude/hooks/post-exec.sh",
      "user-prompt": "~/.claude/hooks/user-prompt.sh"
    },
    "timeout": 5000,  // 5 秒超时
    "failOnError": false  // hook 失败是否阻止操作
  }
}
```

### 项目级别 Hooks

```bash
# .claude/hooks/pre-edit.sh
# 项目特定的 hook
```

```json
// .claude/config.json
{
  "hooks": {
    "enabled": true,
    "scripts": {
      "pre-edit": ".claude/hooks/pre-edit.sh"
    }
  }
}
```

优先级：项目 Hooks > 全局 Hooks

## 🎯 实战场景

### 场景 1: 多语言项目格式化

```bash
#!/bin/bash
# ~/.claude/hooks/post-edit.sh

FILE="$1"
EXT="${FILE##*.}"

case "$EXT" in
  js|jsx)
    npx prettier --write "$FILE"
    npx eslint --fix "$FILE"
    ;;
  ts|tsx)
    npx prettier --write "$FILE"
    npx eslint --fix "$FILE"
    ;;
  py)
    black "$FILE"
    isort "$FILE"
    ;;
  go)
    go fmt "$FILE"
    goimports -w "$FILE"
    ;;
  rs)
    rustfmt "$FILE"
    ;;
esac
```

### 场景 2: 自动测试

```bash
#!/bin/bash
# ~/.claude/hooks/post-edit.sh

FILE="$1"

# 如果编辑了测试文件，自动运行
if [[ "$FILE" == *test*.js ]] || [[ "$FILE" == *test*.ts ]]; then
  echo "🧪 运行测试: $FILE"
  npm test -- "$FILE"

  # 如果测试失败，恢复文件
  if [ $? -ne 0 ]; then
    echo "❌ 测试失败，恢复更改"
    git checkout "$FILE"
    exit 1
  fi
fi
```

### 场景 3: 通知系统

```bash
#!/bin/bash
# ~/.claude/hooks/post-edit.sh

FILE="$1"

# 发送 Slack 通知
if [ -n "$SLACK_WEBHOOK" ]; then
  MESSAGE="✏️  文件已编辑: $FILE"
  curl -X POST -H 'Content-type: application/json' \
    --data "{\"text\":\"$MESSAGE\"}" \
    "$SLACK_WEBHOOK" &>/dev/null &
fi
```

### 场景 4: 性能监控

```bash
#!/bin/bash
# ~/.claude/hooks/pre-exec.sh

COMMAND="$1"

# 记录开始时间
echo "$(date +%s.%N)" > /tmp/claude_cmd_start.txt

exit 0
```

```bash
#!/bin/bash
# ~/.claude/hooks/post-exec.sh

# 读取开始时间
START_TIME=$(cat /tmp/claude_cmd_start.txt)
END_TIME=$(date +%s.%N)

# 计算持续时间
DURATION=$(echo "$END_TIME - $START_TIME" | bc)

# 如果超过 5 秒，记录
if (( $(echo "$DURATION > 5" | bc -l) )); then
  echo "⏱️  命令耗时: ${DURATION}s"

  # 记录到文件
  echo "$(date): $COMMAND took ${DURATION}s" >> ~/.claude/slow-commands.log
fi

exit 0
```

## 🔧 Hook 调试

### 启用调试模式

```bash
# 设置环境变量
export CLAUDE_HOOK_DEBUG=1

# 或在配置中
{
  "hooks": {
    "debug": true
  }
}
```

### 查看 Hook 输出

```bash
# Hook 输出会被记录到日志
tail -f ~/.claude/logs/hooks.log
```

### 测试 Hook

```bash
# 手动测试 hook
~/.claude/hooks/pre-edit.sh test-file.js
echo $?  # 查看退出码
```

## 🎯 最佳实践

### ✅ DO - 应该做的

1. **保持快速**
   ```
   Hook 应该快速执行
   避免阻塞太久
   ```

2. **优雅失败**
   ```
   Hook 失败不应阻止正常操作
   使用适当的错误处理
   ```

3. **记录日志**
   ```
   记录重要操作
   便于调试
   ```

4. **权限检查**
   ```
   确保 hook 脚本可执行
   chmod +x ~/.claude/hooks/*.sh
   ```

### ❌ DON'T - 避免做的

1. ❌ 阻塞太久
   ```
   Hook 不应超过几秒
   ```

2. ❌ 修改用户意图
   ```
   不要改变用户想做的事
   ```

3. ❌ 无声失败
   ```
   失败时应该有反馈
   ```

4. ❌ 过度使用
   ```
   不是所有事都需要 hook
   ```

## 🚨 常见问题

**Q: Hook 没有执行？**

```
A: 检查：
1. Hook 脚本是否可执行 (chmod +x)
2. 配置文件中是否启用
3. 查看日志文件
```

**Q: Hook 执行太慢？**

```
A: 优化：
1. 减少同步操作
2. 使用后台任务
3. 添加超时
```

**Q: 如何临时禁用 Hook？**

```
A: 设置环境变量
export CLAUDE_HOOKS_ENABLED=0
```

## 📚 下一步

了解 Hooks 后，继续学习 [17. Agent Skills](./17-skills.md)

## 🔗 相关资源

- [Hooks 官方文档](https://code.claude.com/docs/zh-CN/hooks)
- [Hook 示例集合](https://github.com/claude-code-hooks/examples)


---

> 💡 **API 推荐**：[https://tryallapi.com/](https://tryallapi.com/) - 一站式接入各种AI服务，注册即送0.2刀
