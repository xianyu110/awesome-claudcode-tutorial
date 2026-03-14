# Claude Code 教程项目

## 项目概述

这是一个全面的 Claude Code 中文教程项目，涵盖从入门到精通的所有内容。

## 项目结构

```
awesome-claudcode-tutorial/
├── README.md                    # 主目录和概述
├── CLAUDE.md                    # 本文件 - 项目记忆
└── docs/                        # 教程章节
    ├── 01-installation.md       # 安装指南
    ├── 02-authentication.md     # 登录与授权
    ├── 03-first-task.md         # 第一个实战问题
    ├── 04-modes.md              # 三种模式详解
    ├── 05-terminal-commands.md  # 终端命令执行
    ├── 06-plan-mode.md          # 规划模式
    ├── 07-permissions.md        # 权限管理
    ├── 08-background-tasks.md   # 后台任务
    ├── 09-rewind.md             # 版本回滚
    ├── 10-image-processing.md   # 图片处理
    ├── 11-mcp-setup.md          # MCP Server 安装
    ├── 12-resume.md             # 恢复历史会话
    ├── 13-mcp-design.md         # MCP 还原设计稿
    ├── 14-context-management.md # 上下文管理
    ├── 15-claude-md.md          # CLAUDE.md 项目记忆
    ├── 16-hooks.md              # Hook 系统
    ├── 17-skills.md             # Agent Skills
    ├── 18-subagents.md          # SubAgent
    ├── 19-skills-vs-subagents.md # Skills vs SubAgents
    └── 20-plugins.md            # Plugin 系统
```

## 写作风格和规范

### 章节结构

每个章节应遵循以下结构：

1. **章节标题** - 清晰的标题和编号
2. **核心概念** - 简单解释本章内容
3. **为什么需要** - 说明功能的必要性
4. **实战示例** - 多个实际使用场景
5. **最佳实践** - DO 和 DON'T 列表
6. **下一步** - 指向下一章
7. **相关资源** - 相关文档链接

### 代码示例

- 使用真实的代码示例
- 添加详细的注释
- 包含成功和失败的示例
- 使用代码块标记语言

```javascript
// ✅ 好的示例：有注释和上下文
// 创建用户认证中间件
function authMiddleware(req, res, next) {
  const token = req.headers.authorization;
  if (!token) {
    return res.status(401).json({ error: 'No token' });
  }
  // 验证 token...
  next();
}
```

### 表格使用

使用表格进行对比和总结：

| 功能 | 旧方法 | Claude Code |
|------|--------|-------------|
| 安装 | 手动配置 | 自动化 |
| 更新 | 手动检查 | 智能提示 |

### Emoji 使用

- 📚 文档和教程
- 🎯 目标和要点
- ✅ 推荐做法
- ❌ 避免的做法
- ⚠️ 警告和注意
- 💡 提示和技巧
- 🚀 快速开始
- 🔧 配置和工具
- 📊 数据和统计

## 代码规范

### Markdown 规范

1. **标题层级**
   ```markdown
   # 主标题 (H1) - 只用于文档标题
   ## 章节标题 (H2) - 主要章节
   ### 小节标题 (H3) - 章节内的小节
   #### 细节标题 (H4) - 具体细节
   ```

2. **列表**
   ```markdown
   - 无序列表项
     - 嵌套项

   1. 有序列表项
   2. 另一项
   ```

3. **代码块**
   ````markdown
   ```bash
   # 命令行代码
   npm install
   ```

   ```javascript
   // JavaScript 代码
   const x = 1;
   ```
   ````

4. **链接**
   ```markdown
   [链接文本](URL)
   [外部链接](https://example.com)
   [内部链接](./other-file.md)
   ```

### 命令示例

- 使用 `$` 表示普通用户命令
- 使用 `#` 表示 root 用户命令
- 使用 `→` 表示 Claude Code 的输出

```bash
$ npm install
→ Installing packages...
✓ Done
```

## 内容质量标准

### 准确性

- 所有命令和代码必须测试过
- 版本信息要准确
- API 调用要符合最新文档

### 完整性

- 每个功能要有完整示例
- 包含常见问题
- 提供故障排除步骤

### 实用性

- 示例要真实可用
- 场景要贴近实际
- 避免过于理论化

### 可读性

- 使用简单的语言
- 避免过于技术化的术语
- 提供必要的解释

## 目标受众

- **初学者**: 刚接触 Claude Code 的开发者
- **中级用户**: 想要深入了解功能的用户
- **高级用户**: 想要定制和扩展的开发者

## 教程语言

- **主要语言**: 中文（简体）
- **代码注释**: 中文
- **技术术语**: 英文 + 中文解释

## 引用和资源

### 官方资源

- Claude Code 官方文档: https://code.claude.com/docs/zh-CN/
- GitHub 仓库: https://github.com/anthropics/claude-code

### 社区资源

- Claude 中文社区: https://www.claude-cn.org
- 知乎专栏教程
- B站视频教程

## 更新频率

- **主要版本**: 每个 Claude Code 大版本更新
- **次要版本**: 每月或重要功能添加时
- **修正**: 随时修正错误和不准确之处

## 贡���指南

欢迎贡献！请遵循以下规范：

1. **新章节**: 遵循现有章节结构
2. **代码示例**: 测试后再提交
3. **语言**: 使用中文并保持专业
4. **格式**: 遵循 Markdown 规范

## 项目目标

- 📚 成为最全面的 Claude Code 中文教程
- 🎓 帮助开发者快速上手并精通
- 🌟 提供实用的示例和最佳实践
- 🔄 持续更新以跟上 Claude Code 的发展

## 联系方式

- 项目地址: https://github.com/[your-username]/awesome-claudcode-tutorial
- 问题反馈: GitHub Issues
