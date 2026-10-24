# 05. 执行终端命令 (Bash)


> 📷 **截图说明**：本章配图含终端风格图。标注「真实输出」的来自本机 Claude Code 2.1.310（已打码）；标注「示意图」的未能非交互复现。GUI（VS Code/JetBrains/Desktop）待补。

Claude Code 不仅能读写文件，还能执行终端命令，这让它成为一个完整的开发助手。

## 🎯 为什么要用 Claude Code 执行命令？

### 传统方式 vs Claude Code

| 传统方式 | Claude Code |
|----------|-------------|
| 手动输入命令 | 描述意图，自动执行 |
| 忘记命令语法 | 自动生成正确命令 |
| 手动处理错误 | 自动诊断和修复 |
| 重复操作 | 批量自动化 |

## 📝 基础用法

![Bash 工具执行示意](/images/screenshots/05-bash-tool.png)

> 📷 示意图

![Git 工作流示意](/images/screenshots/05-git-workflow.png)

> 📷 示意图

### 简单命令执行

```
你: 列出当前目录的文件

Claude: → ls -la
[执行结果]
你: 看一下 package.json

Claude: → cat package.json
[文件内容]
```

### 复杂命令链

```
你: 找出所有 .js 文件中包含 console.log 的行

Claude: → grep -r "console.log" --include="*.js" .

[结果列表]
你: 移除这些 console.log

Claude: → sed -i '' '/console\.log/d' $(find . -name "*.js")
[执行清理]
```

## 🔧 Claude 如何使用 Bash 工具

### 1. 读取优先原则

Claude Code 优先使用专用工具而非 bash：

```bash
# ❌ 不推荐：使用 bash cat
cat myfile.txt

# ✅ 推荐：使用 Read 工具
[自动调用 Read 工具]
```

**专用工具优势：**
- 📁 更好的文件搜索（Glob 而非 find）
- 🔍 更快的代码搜索（Grep 而非 grep）
- ✏️ 更安全的文件编辑（Edit 而非 sed）

### 2. Bash 的最佳使用场景

✅ **适合用 bash 的场景：**
- 运行测试：`npm test`
- 安装依赖：`pip install package`
- Git 操作：`git commit`
- 构建项目：`make build`
- 系统操作：`docker ps`
- 查看进程：`ps aux`

❌ **不适合用 bash 的场景：**
- 读取文件（用 Read）
- 编辑文件（用 Edit）
- 搜索文件（用 Glob）
- 搜索代码（用 Grep）

## 🚀 实战场景

### 场景 1: 项目初始化

```
你: 帮我创建一个新的 React TypeScript 项目

Claude:
→ npx create-react-app my-app --template typescript
→ cd my-app
→ npm install @types/react @types/react-dom
→ npm start

[项目已创建并启动]
```

### 场景 2: 依赖管理

```
你: 升级所有过期依赖

Claude:
→ npm outdated
[列出过期依赖]

→ npm update
→ npm audit fix
[更新依赖并修复安全问题]
```

### 场景 3: 测试和修复

```
你: 运行测试并修复失败的用例

Claude:
→ npm test
[测试输出...]

发现 3 个失败用例，正在修复...

[编辑文件...]

→ npm test
[所有测试通过 ✓]
```

### 场景 4: Git 工作流

```
你: 提交当前更改并推送到远程

Claude:
→ git status
[检查状态]

→ git diff
[查看更改]

→ git add .
→ git commit -m "feat: add user authentication"
→ git push

[已推送到远程]
```

### 场景 5: Docker 操作

```
你: 启动项目的 Docker 容器

Claude:
→ docker ps -a
[检查现有容器]

→ docker-compose up -d
[启动服务]

→ docker logs app
[查看日志]
```

## 🔒 命令执行权限

### 权限提示

不同模式下，bash 命令的执行方式：

**默认模式：**
```
Claude: → npm install

Allow this command? (Y/n/s):
```

**自动模式：**
```
Claude: → npm install
[直接执行]
```

**规划模式：**
```
Claude: 我将执行以下命令：
1. npm install
2. npm run build
3. npm test

批准此计划?
```

## 🛡️ 安全注意事项

### 危险命令保护

Claude Code 会特别提示危险操作：

```
⚠️  警告：此命令将删除文件

→ rm -rf node_modules

这不可逆！确认执行? (yes/no):
```

### 危险命令列表

以下命令需要额外确认：
- `rm` - 删除文件
- `dd` - 磁盘操作
- `mkfs` - 格式化
- `:(){ :|:& };:` - Fork 炸弹
- `git reset --hard` - 丢弃更改
- `git push --force` - 强制推送

## 💡 高级技巧

### 1. 命令链和管道

```
你: 找出最大的 5 个文件

Claude: → du -ah . | sort -rh | head -5
```

### 2. 后台任务

```
你: 启动开发服务器并在后台运行

Claude: → npm start &

[服务器在后台运行，PID: 12345]
```

### 3. 环境变量

```
你: 使用测试环境配置运行

Claude: → NODE_ENV=test npm test
```

### 4. 条件执行

```
你: 如果端口 3000 被占用，使用 3001

Claude:
→ lsof -ti:3000
[检查端口]

→ PORT=3001 npm start
[使用备用端口]
```

## 📊 命令历史和日志

### 查看命令历史

Claude Code 会记住执行过的命令：

```
你: 重新运行上次的测试命令

Claude: → npm test
[重复之前的命令]
```

### 命令输出处理

Claude 会智能解析命令输出：

```
→ npm test

Test Suites: 1 passed, 1 total
Tests:       3 passed, 3 total

Claude: 所有测试都通过了！
```

## ⚡ 性能优化

### 并行执行独立命令

```
你: 安装前端和后端的依赖

Claude:
→ cd frontend && npm install &  # 后台运行
→ cd backend && npm install     # 同时运行

[两个安装并行进行]
```

### 使用 Make 或脚本

对于复杂任务，Claude 会创建脚本：

```
你: 设置项目的开发环境

Claude: 我将创建一个 setup 脚本

[创建 setup.sh]

→ chmod +x setup.sh
→ ./setup.sh
```

## 🐛 错误处理

### 自动诊断和修复

```
→ npm install

Error: EACCES: permission denied

Claude: 检测到权限问题，尝试修复...

→ sudo npm install
[或使用 npx 加上 --yes 标志]
```

### 错误重试

```
→ git push

Error: failed to push some refs

Claude: 远程有新提交，先拉取再推送

→ git pull --rebase
→ git push
```

## 🔍 调试技巧

### 详细输出

```
你: 用详细模式运行安装

Claude: → npm install --verbose
```

### 查看中间结果

```
你: 逐步检查构建过程

Claude:
→ npm run clean
[清理完成]

→ npm run build:dev
[开发构建完成]

→ npm run test
[测试通过]
```

## 📚 下一步

掌握 bash 命令后，继续学习 [06. 规划模式](./06-plan-mode.md)

## 🔗 相关资源

- [Bash 工具文档](https://code.claude.com/docs/zh-CN/tools#bash)
- [终端最佳实践](https://code.claude.com/docs/zh-CN/workflows#terminal)


---

> 💡 **API 推荐**：[https://tryallapi.com/](https://tryallapi.com/) - 一站式接入各种AI服务，注册即送0.2刀
