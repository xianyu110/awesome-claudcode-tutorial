# 更新日志

## 2026-10-24 - 已更新至 Claude Code 2.1.310

对照 npm 最新版（2.1.310）、[官方 CHANGELOG](https://github.com/anthropics/claude-code/blob/main/CHANGELOG.md) 和[官方文档](https://code.claude.com/docs/en/overview)更新教程：

- 新增第 30 章「新版速览：Claude Code 2.1.310」：5.5 系列模型、auto 默认权限模式、已移除命令、新命令与 CLI 用法
- 第 01 章：系统要求、stable / latest 更新通道、Homebrew / WinGet 升级、npm 安装、`claude update` / `claude install` / `claude doctor`
- 第 02 章：`claude auth status`、`claude setup-token`、云服务商（Bedrock / Agent Platform / Foundry）、第三方 Base URL（`ANTHROPIC_AUTH_TOKEN` vs `ANTHROPIC_API_KEY`、settings.json `env`）
- 第 03、04、06、07 章：改用 `--permission-mode auto|plan|acceptEdits|dontAsk|bypassPermissions`，补充 6 种权限模式及 Shift+Tab 循环，标注不存在的旧参数
- 第 11 章：改用官方 `claude mcp add` / `.mcp.json` / `~/.claude.json`
- 第 12 章：改用 `-c` / `-r` / `--fork-session` / `/resume` / `/branch` / `/export`，会话存储位置更新
- 第 16 章：新增官方 Hooks 配置方式（settings.json `hooks`）
- 第 25 章：新增官方 `anthropics/claude-code-action@v1` 示例，标注未核实的 `claude check/review` 子命令
- 第 28 章：修正 `--worktree` 语法
- 第 09、14 章：标注不存在的 `~/.claude/config.json` 配置
- 新增第七部分、第 31 章「Claude Desktop：图形界面里的 Claude Code」：安装登录、Code 标签、权限模式对照、`claude_desktop_config.json` MCP 配置、连接器/插件、Computer Use、`--desktop` / `/desktop` 与 CLI 互通（14 张配图：6 张 Mac 真实打码输出 + 8 张示意图）
- 全部章节补充终端风格配图（真实输出已打码，示意图均已标注）

## 2026-03-14 - 新增第五部分：企业级应用与最佳实践

### 新增章节 (21-25)

基于官方文档分析，新增 5 个企业级应用章节：

#### 第 21 章：工作流与最佳实践
- 核心工作流（代码审查、调试、重构）
- 最佳实践（开发流程、代码质量、性能优化、安全）
- 高级工作流（多项目协作、数据库迁移、API 集成）
- 效率提升技巧

#### 第 22 章：企业部署
- 托管设置 (Managed Settings)
- MDM / 操作系统级策略
- 企业安全最佳实践
- 团队协作配置
- 部署策略
- 合规性管理 (SOC 2, GDPR)

#### 第 23 章：远程控制与会话
- SSH 远程会话
- 云会话（实验性）
- 会话恢复和检查点
- 多设备协作
- 安全性考虑

#### 第 24 章：监控与可观测性
- OpenTelemetry 集成
- 指标监控（Metrics）
- 结构化日志（Logging）
- 链路追踪（Tracing）
- 监控仪表板
- 告警配置
- 性能分析

#### 第 25 章：CI/CD 集成
- GitHub Actions 集成
- GitLab CI 集成
- Jenkins 集成
- 高级用例（自动修复、性能检测、文档生成）
- 报告和通知

### 教程统计更新

- 总章节数: 20 → **25**
- 代码示例: 100+ → **150+**
- 实战案例: 50+ → **80+**
- 页面总数: 400+ → **600+**
- 总字数: 10万+ → **15万+**

### 文件结构

```
awesome-claudcode-tutorial/
├── README.md (已更新)
├── CLAUDE.md
├── RESOURCES.md
├── CHANGELOG.md (新增)
└── docs/
    ├── 01-20 (原有章节)
    ├── 21-workflows-best-practices.md (新增)
    ├── 22-enterprise-deployment.md (新增)
    ├── 23-remote-control-sessions.md (新增)
    ├── 24-monitoring-observability.md (新增)
    └── 25-ci-cd-integration.md (新增)
```

### 下一步建议

这些新章节涵盖了企业级使用 Claude Code 的核心场景：

1. **团队标准化**: 第 21 章的工作流和最佳实践
2. **企业部署**: 第 22 章的托管设置和合规性
3. **远程协作**: 第 23 章的多设备和云会话
4. **生产监控**: 第 24 章的可观测性和告警
5. **自动化**: 第 25 章的 CI/CD 集成

教程现已覆盖从初学者到企业级用户的完整学习路径。
