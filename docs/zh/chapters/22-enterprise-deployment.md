# 22. 企业部署 (Enterprise Deployment)

在企业环境中部署和管理 Claude Code，需要考虑安全、合规、团队协作等多个方面。

## 🏢 企业级特性

### 1. 托管设置 (Managed Settings)

#### 什么是托管设置？

托管设置允许组织通过集中配置管理 Claude Code 的行为，确保所有开发人员使用一致的设置。

```
企业配置管理
    ↓
┌─────────────────────────────────────┐
│  MDM / 配置管理系统                  │
│  (公司集中管理平台)                  │
└──────────────┬──────────────────────┘
               ↓
        推送配置文件
               ↓
┌─────────────────────────────────────┐
│  Claude Code 客户端                  │
│  (自动应用托管设置)                  │
└─────��─────────────────────��─────────┘
```

#### 配置文件位置

```bash
# macOS
~/Library/Application Support/Claude Code/managed-settings.json

# Linux
~/.config/Claude Code/managed-settings.json

# Windows
%APPDATA%/Claude Code/managed-settings.json
```

### 2. 托管设置配置

#### 基础配置示例

```json
{
  "version": "1.0",
  "organization": "ExampleCorp",
  "settings": {
    // 权限设置
    "permissions": {
      "defaultMode": "auto",
      "autoApprove": {
        "bash": [
          "npm test",
          "npm run build",
          "git status"
        ],
        "fileOperations": {
          "read": ["**/*.ts", "**/*.tsx", "**/*.json"],
          "write": ["src/**/*", "test/**/*"]
        }
      },
      "requireApproval": {
        "bash": ["rm -rf", "sudo", "docker"],
        "fileOperations": {
          "write": [".env", "*.key", "*.pem"]
        }
      }
    },

    // 安全设置
    "security": {
      "allowedDomains": [
        "github.com",
        "gitlab.example.com",
        "api.example.com"
      ],
      "blockedDomains": [
        "suspicious-site.com"
      ],
      "dataResidency": "eu",
      "disableTelemetry": true
    },

    // 功能开关
    "features": {
      "enableRewind": true,
      "enableBackgroundTasks": true,
      "enableMCP": true,
      "enableSkills": true,
      "maxConcurrentTasks": 5
    },

    // 团队设置
    "team": {
      "sharedSkillsPath": "/opt/claude-skills",
      "sharedMcpServers": [
        "github@organization",
        "jira@company"
      ]
    }
  }
}
```

#### 高级安全配置

```json
{
  "security": {
    // 代码扫描规则
    "codeScanning": {
      "preventSecretLeakage": true,
      "secretPatterns": [
        "AWS_ACCESS_KEY",
        "PRIVATE_KEY",
        "API_SECRET"
      ],
      "blockCommit": true
    },

    // 合规设置
    "compliance": {
      "auditLogging": true,
      "logRetentionDays": 90,
      "auditLogPath": "/var/log/claude-code/audit.log"
    },

    // 网络限制
    "network": {
      "allowedHosts": [
        "*.example.com",
        "github.com",
        "registry.npmjs.org"
      ],
      "proxy": {
        "http": "http://proxy.example.com:8080",
        "https": "http://proxy.example.com:8080"
      }
    }
  }
}
```

### 3. MDM / 操作系统级策略

#### macOS (使用 MDM)

```xml
<!-- com.claude.code.mobileconfig -->
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
    <key>ManagedSettings</key>
    <dict>
        <key>Permissions</key>
        <dict>
            <key>DefaultMode</key>
            <string>auto</string>
        </dict>
        <key>Security</key>
        <dict>
            <key>DisableTelemetry</key>
            <true/>
            <key>AllowedDomains</key>
            <array>
                <string>github.com</string>
                <string>example.com</string>
            </array>
        </dict>
    </dict>
</dict>
</plist>
```

#### Windows (使用 Group Policy)

```powershell
# Group Policy Object
# Path: Computer Configuration -> Administrative Templates -> Claude Code

# 禁用遥测
reg add "HKLM\SOFTWARE\Policies\Anthropic\Claude Code" /v DisableTelemetry /t REG_DWORD /d 1

# 设置默认权限模式
reg add "HKLM\SOFTWARE\Policies\Anthropic\Claude Code" /v DefaultPermissionMode /t REG_SZ /d "auto"

# 配置代理
reg add "HKLM\SOFTWARE\Policies\Anthropic\Claude Code" /v ProxyServer /t REG_SZ /d "proxy.example.com:8080"
```

#### Linux (使用配置文件)

```bash
# /etc/claude-code/managed-settings.json
sudo mkdir -p /etc/claude-code
sudo cp managed-settings.json /etc/claude-code/

# 设置权限
sudo chmod 644 /etc/claude-code/managed-settings.json
sudo chown root:root /etc/claude-code/managed-settings.json
```

## 🔒 企业安全最佳实践

### 1. 访问控制

#### 基于角色的配置

```json
{
  "roles": {
    "junior-developer": {
      "permissions": {
        "defaultMode": "default",
        "autoApprove": {
          "bash": ["npm test", "npm run lint"]
        }
      },
      "restrictions": {
        "blockDestructiveCommands": true,
        "requireCodeReview": true
      }
    },
    "senior-developer": {
      "permissions": {
        "defaultMode": "auto",
        "autoApprove": {
          "bash": ["npm *", "git *", "docker *"]
        }
      }
    },
    "devops": {
      "permissions": {
        "defaultMode": "auto",
        "autoApprove": {
          "bash": ["*"]
        }
      },
      "features": {
        "enableDeployment": true
      }
    }
  }
}
```

### 2. 审计和合规

#### 审计日志配置

```json
{
  "auditLogging": {
    "enabled": true,
    "logLevel": "detailed",
    "events": [
      "command.execution",
      "file.access",
      "permission.grant",
      "permission.deny",
      "skill.execution",
      "error"
    ],
    "output": {
      "type": "syslog",
      "server": "logserver.example.com:514",
      "format": "json"
    }
  }
}
```

#### 审计日志示例

```json
{
  "timestamp": "2024-03-15T10:30:45Z",
  "user": "john.doe@example.com",
  "deviceId": "device-12345",
  "event": "command.execution",
  "details": {
    "command": "npm install",
    "approved": true,
    "approvalMethod": "managed_settings",
    "duration": 45000,
    "exitCode": 0
  }
}
```

### 3. 数据治理

#### 敏感数据保护

```json
{
  "dataProtection": {
    "preventDataLeakage": true,
    "sensitivePatterns": [
      "password",
      "api[_-]?key",
      "secret",
      "token",
      "credential"
    ],
    "allowedProjects": [
      "company/*",
      "internal/*"
    ],
    "blockedProjects": [
      "personal/*"
    ],
    "contextLimits": {
      "maxFileSize": 10485760,
      "maxContextLength": 200000
    }
  }
}
```

## 👥 团队协作

### 1. 共享资源配置

#### 共享 Skills 仓库

```bash
# 设置团队共享 Skills 目录
export CLAUDE_TEAM_SKILLS_PATH=/opt/team-claude-skills

# 目录结构
/opt/team-claude-skills/
├── code-review/
│   ├── skill.json
│   └── instructions.md
├── deploy-staging/
├── test-coverage/
└── security-scan/
```

#### 共享 MCP Servers

```json
{
  "teamMcpServers": {
    "github": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-github"],
      "env": {
        "GITHUB_TOKEN": "${GITHUB_TOKEN}"
      }
    },
    "jira": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-jira"],
      "env": {
        "JIRA_URL": "https://jira.example.com",
        "JIRA_USERNAME": "${JIRA_USERNAME}",
        "JIRA_API_TOKEN": "${JIRA_API_TOKEN}"
      }
    }
  }
}
```

### 2. 标准化工作流

#### 团队 CLAUDE.md 模板

```markdown
# 公司项目标准配置

## 项目信息
- **组织**: Example Corp
- **部门**: Engineering
- **项目类型**: Web Application

## 技术栈
- **前端**: React 18 + TypeScript
- **后端**: Node.js + Express
- **数据库**: PostgreSQL
- **部署**: Docker + Kubernetes

## 开发规范

### 代码风格
- 使用 ESLint + Prettier
- 遵循 Airbnb Style Guide
- 强制类型检查

### 提交规范
- 使用 Conventional Commits
- feat: 新功能
- fix: Bug 修复
- docs: 文档更新

### 测试要求
- 单元测试覆盖率 > 80%
- PR 必须通过 CI
- 必须包含测试用例

## 安全要求
- 不得提交敏感信息
- 使用环境变量管理密钥
- 定期依赖更新

## 审批流程
- 代码必须经过 Review
- 主分支需要 2 个 approval
- 部署需要 TL 批准
```

### 3. 团队 Hooks

#### 预提交 Hook

```bash
#!/bin/bash
# .claude/hooks/pre-commit

echo "🔍 运行团队预提交检查..."

# 1. 检查敏感信息
if git diff --cached | grep -iE "(password|api_key|secret)"; then
  echo "❌ 发现可能的敏感信息！"
  exit 1
fi

# 2. 运行 linter
npm run lint -- --quiet
if [ $? -ne 0 ]; then
  echo "❌ Lint 失败，请修复后提交"
  exit 1
fi

# 3. 运行类型检查
npm run type-check -- --quiet
if [ $? -ne 0 ]; then
  echo "❌ 类型检查失败"
  exit 1
fi

# 4. 运行快速测试
npm test -- --testPathPattern="unit" --quiet
if [ $? -ne 0 ]; then
  echo "❌ 单元测试失败"
  exit 1
fi

echo "✅ 预提交检查通过"
```

## 🚀 部署策略

### 1. 滚动部署

```
[阶段 1] 试点
→ 选择 5% 用户
→ 部署新配置
→ 监控 1 周
    ↓
[阶段 2] 逐步推广
→ 扩展到 25% 用户
→ 收集反馈
→ 修复问题
    ↓
[阶段 3] 全量部署
→ 推广到所有用户
→ 持续监控
```

### 2. 配置版本控制

```bash
# Git 仓库管理配置
claude-enterprise-configs/
├── production/
│   ├── managed-settings.json
│   ├── mobileconfig/
│   └── policies/
├── staging/
│   └── managed-settings.json
└── development/
    └── managed-settings.json

# 部署流程
git tag -a v1.2.3 -m "Release v1.2.3"
git push origin v1.2.3
# CI/CD 自动推送到 MDM
```

### 3. 监控和告警

```json
{
  "monitoring": {
    "metrics": {
      "usage": {
        "activeUsers": true,
        "commandsExecuted": true,
        "skillsUsed": true
      },
      "performance": {
        "responseTime": true,
        "errorRate": true
      },
      "security": {
        "blockedCommands": true,
        "permissionDenials": true
      }
    },
    "alerts": {
      "errorThreshold": 5,
      "timeWindow": "5m",
      "notification": [
        "slack://alerts-channel",
        "email://ops@example.com"
      ]
    }
  }
}
```

## 📊 合规性管理

### 1. SOC 2 / ISO 27001

#### 必要配置

```json
{
  "compliance": {
    "framework": "SOC2",
    "controls": {
      "accessControl": {
        "requireAuthentication": true,
        "sessionTimeout": 30,
        "mfaRequired": true
      },
      "dataEncryption": {
        "inTransit": true,
        "atRest": true
      },
      "changeManagement": {
        "requireApproval": true,
        "auditTrail": true,
        "versionControl": true
      }
    }
  }
}
```

### 2. GDPR 合规

```json
{
  "gdpr": {
    "dataResidency": "eu",
    "rightToErasure": {
      "enabled": true,
      "retentionDays": 30
    },
    "consent": {
      "required": true,
      "version": "2.0"
    },
    "dataProcessing": {
      "purpose": "development-tools",
      "legalBasis": "legitimate-interest"
    }
  }
}
```

## 🎓 最佳实践总结

### ✅ DO - 应该做的

1. **集中管理配置**
   ```bash
   # 使用版本控制管理所有配置
   git clone claude-enterprise-configs
   ```

2. **渐进式部署**
   ```bash
   # 先在小范围测试
   # 收集反馈后再全量部署
   ```

3. **启用审计日志**
   ```json
   {
     "auditLogging": {
       "enabled": true,
       "logLevel": "detailed"
     }
   }
   ```

4. **定期安全审查**
   ```bash
   # 每季度审查权限配置
   # 更新安全策略
   ```

### ❌ DON'T - 避免做的

1. ❌ 一次性全量部署
2. ❌ 忽略监控和告警
3. ❌ 不更新配置
4. ❌ 绕过安全检查

## 📚 下一步

了解企业部署后，继续学习 [23. 远程控制与会话](./23-remote-control-sessions.md)

## 🔗 相关资源

- [企业部署指南](https://code.claude.com/docs/zh-CN/enterprise)
- [安全最佳实践](https://code.claude.com/docs/zh-CN/security)
- [合规性文档](https://code.claude.com/docs/zh-CN/compliance)
