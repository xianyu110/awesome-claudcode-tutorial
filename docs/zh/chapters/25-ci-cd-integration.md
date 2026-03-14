# 25. CI/CD 集成 (CI/CD Integration)

将 Claude Code 集成到 CI/CD 流水线，实现自动化代码审查、测试和部署。

## 🔄 CI/CD 概览

### 典型流水线

```
┌──────────────────────────────────────────────────────┐
│                    CI/CD 流水线                        │
└──────────────────────────────────────────────────────┘

[Push/PR]
    ↓
┌─────────────┐
│  检出代码    │
└──────┬──────┘
       ↓
┌─────────────────────────────────────┐
│  Claude Code 自动��检查              │
│  ├─ 代码格式检查                     │
│  ├─ 类型检查                         │
│  ├─ Linting                         │
│  └─ 安全扫描                         │
└──────────────┬──────────────────────┘
               ↓
        ┌──────────────┐
        │  运行测试     │
        └──────┬───────┘
               ↓
┌─────────────────────────────────────┐
│  Claude Code 代码审查                │
│  ├─ 分析代码变更                     │
│  ├─ 检查最佳实践                     │
│  ├─ 识别潜在问题                     │
│  └─ 生成审查报告                     │
└──────────────┬──────────────────────┘
               ↓
        ┌──────────────┐
        │   构建       │
        └──────┬───────┘
               ↓
        ┌──────────────┐
        │   部署       │
        └──────────────┘
```

## 🚀 GitHub Actions 集成

### 1. 基础 CI 流水线

```yaml
# .github/workflows/claude-ci.yml
name: Claude Code CI

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main, develop]

jobs:
  claude-check:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout code
        uses: actions/checkout@v3
        with:
          fetch-depth: 0  # 完整历史，用于更好的分析

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'

      - name: Install Claude Code
        run: |
          curl -fsSL https://claude.ai/install.sh | bash
          claude --version

      - name: Install dependencies
        run: npm ci

      - name: Run Claude Code checks
        run: |
          claude check --format=github
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}

      - name: Upload results
        if: always()
        uses: actions/upload-artifact@v3
        with:
          name: claude-results
          path: .claude/reports/
```

### 2. 代码审查工作流

```yaml
# .github/workflows/claude-review.yml
name: Claude Code Review

on:
  pull_request:
    types: [opened, synchronize, reopened]

permissions:
  pull-requests: write
  contents: read

jobs:
  code-review:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout PR
        uses: actions/checkout@v3
        with:
          fetch-depth: 0

      - name: Setup Claude Code
        run: |
          curl -fsSL https://claude.ai/install.sh | bash

      - name: Run Code Review
        id: review
        run: |
          claude review \
            --base=${{ github.base_ref }} \
            --head=${{ github.head_ref }} \
            --output=review.md \
            --format=markdown
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
          ANTHROPIC_API_KEY: ${{ secrets.ANTHROPIC_API_KEY }}

      - name: Comment on PR
        uses: actions/github-script@v6
        with:
          script: |
            const fs = require('fs');
            const review = fs.readFileSync('review.md', 'utf8');

            github.rest.issues.createComment({
              issue_number: context.issue.number,
              owner: context.repo.owner,
              repo: context.repo.repo,
              body: review
            });

      - name: Check for critical issues
        run: |
          if grep -q "severity: high" review.md; then
            echo "Critical issues found, failing check"
            exit 1
          fi
```

### 3. 安全扫描集成

```yaml
# .github/workflows/security-scan.yml
name: Claude Security Scan

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]
  schedule:
    - cron: '0 0 * * 0'  # 每周日运行

jobs:
  security-scan:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout
        uses: actions/checkout@v3

      - name: Setup Claude Code
        run: |
          curl -fsSL https://claude.ai/install.sh | bash

      - name: Run security scan
        run: |
          claude security scan \
            --output=security-report.json \
            --format=json
        env:
          ANTHROPIC_API_KEY: ${{ secrets.ANTHROPIC_API_KEY }}

      - name: Upload to GitHub Security
        uses: github/codeql-action/upload-sarif@v2
        with:
          sarif_file: security-report.json

      - name: Comment on PR
        if: github.event_name == 'pull_request'
        uses: actions/github-script@v6
        with:
          script: |
            const fs = require('fs');
            const report = JSON.parse(fs.readFileSync('security-report.json', 'utf8'));

            if (report.issues.length > 0) {
              const comment = `## 🔒 Security Scan Results\n\nFound ${report.issues.length} potential security issues:\n\n` +
                report.issues.map(issue => `- **${issue.severity}**: ${issue.message}\n  Location: ${issue.file}:${issue.line}\n`).join('\n');

              github.rest.issues.createComment({
                issue_number: context.issue.number,
                owner: context.repo.owner,
                repo: context.repo.repo,
                body: comment
              });
            }
```

## 🔧 GitLab CI 集成

### 基础配置

```yaml
# .gitlab-ci.yml
stages:
  - check
  - review
  - test
  - deploy

variables:
  CLAUDE_VERSION: "latest"

# Claude Code 代码检查
claude:check:
  stage: check
  image: node:18
  before_script:
    - curl -fsSL https://claude.ai/install.sh | bash
    - claude --version
  script:
    - npm ci
    - claude check --format=gitlab
  artifacts:
    reports:
      codequality: claude-report.json
    paths:
      - claude-report.json
    expire_in: 1 week

# Claude Code 审查
claude:review:
  stage: review
  image: node:18
  before_script:
    - curl -fsSL https://claude.ai/install.sh | bash
  script:
    - claude review --merge-request=$CI_MERGE_REQUEST_IID --output=review.md
  artifacts:
    paths:
      - review.md
    expire_in: 1 week
  only:
    - merge_requests

# 安全扫描
claude:security:
  stage: check
  image: node:18
  before_script:
    - curl -fsSL https://claude.ai/install.sh | bash
  script:
    - claude security scan --output=security-report.json
  artifacts:
    reports:
      sast: security-report.json
    paths:
      - security-report.json
  allow_failure: true
```

## 🐳 Jenkins 集成

### Jenkinsfile 配置

```groovy
// Jenkinsfile
pipeline {
    agent any

    environment {
        CLAUDE_HOME = tool 'claude-code'
        PATH = "${CLAUDE_HOME}/bin:${env.PATH}"
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Claude Check') {
            steps {
                sh 'npm ci'
                sh 'claude check --format=jenkins --output=check-report.xml'
            }
        }

        stage('Claude Review') {
            when {
                changeRequest()
            }
            steps {
                script {
                    def review = sh(
                        script: 'claude review --base=origin/${CHANGE_TARGET} --format=json',
                        returnStdout: true
                    )

                    // 保存审查结果
                    writeFile file: 'review.json', text: review

                    // 添加到构建信息
                    def reviewData = readJSON file: 'review.json'
                    currentBuild.displayName = "${currentBuild.displayName} (${reviewData.issues.size} issues)"
                }
            }
        }

        stage('Run Tests') {
            steps {
                sh 'npm test'
            }
        }

        stage('Build') {
            steps {
                sh 'npm run build'
            }
        }
    }

    post {
        always {
            // 归份报告
            archiveArtifacts artifacts: '*.json,*.xml', allowEmptyArchive: true

            // 发布报告
            publishHTML([
                reportDir: '.claude/reports',
                reportFiles: 'index.html',
                reportName: 'Claude Code Report',
                keepAll: true
            ])
        }

        failure {
            // 发送通知
            emailext(
                subject: "Build Failed: ${env.JOB_NAME} - ${env.BUILD_NUMBER}",
                body: "Claude Code checks failed. Please check the report.",
                to: "${env.CHANGE_AUTHOR_EMAIL}"
            )
        }
    }
}
```

## 🎯 高级用例

### 1. 自动修复

```yaml
# .github/workflows/auto-fix.yml
name: Claude Auto Fix

on:
  pull_request:
    branches: [main]

jobs:
  auto-fix:
    runs-on: ubuntu-latest
    if: github.event.pull_request.user.login == 'dependabot[bot]'

    steps:
      - name: Checkout
        uses: actions/checkout@v3

      - name: Setup Claude Code
        run: |
          curl -fsSL https://claude.ai/install.sh | bash

      - name: Run auto-fix
        run: |
          claude fix \
            --issues=lint,type,style \
            --commit \
            --message="Auto-fix by Claude Code"
        env:
          ANTHROPIC_API_KEY: ${{ secrets.ANTHROPIC_API_KEY }}
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}

      - name: Push fixes
        run: |
          git config --local user.email "claude-bot@example.com"
          git config --local user.name "Claude Bot"
          git push
```

### 2. 性能回归检测

```yaml
# .github/workflows/performance.yml
name: Performance Check

on:
  pull_request:
    branches: [main]

jobs:
  performance:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout
        uses: actions/checkout@v3
        with:
          fetch-depth: 0

      - name: Setup Claude Code
        run: |
          curl -fsSL https://claude.ai/install.sh | bash

      - name: Benchmark base
        run: |
          git checkout origin/${{ github.base_ref }}
          npm ci
          npm run benchmark > base-benchmark.json

      - name: Benchmark PR
        run: |
          git checkout origin/${{ github.head_ref }}
          npm ci
          npm run benchmark > pr-benchmark.json

      - name: Compare performance
        run: |
          claude benchmark compare \
            --base=base-benchmark.json \
            --pr=pr-benchmark.json \
            --threshold=5 \
            --output=performance-report.md

      - name: Comment results
        uses: actions/github-script@v6
        with:
          script: |
            const fs = require('fs');
            const report = fs.readFileSync('performance-report.md', 'utf8');
            github.rest.issues.createComment({
              issue_number: context.issue.number,
              owner: context.repo.owner,
              repo: context.repo.repo,
              body: report
            });

      - name: Check regression
        run: |
          if grep -q "regression" performance-report.md; then
            echo "Performance regression detected"
            exit 1
          fi
```

### 3. 文档生成

```yaml
# .github/workflows/docs.yml
name: Generate Documentation

on:
  push:
    branches: [main]
    paths:
      - 'src/**/*.ts'
      - 'src/**/*.tsx'

jobs:
  docs:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout
        uses: actions/checkout@v3

      - name: Setup Claude Code
        run: |
          curl -fsSL https://claude.ai/install.sh | bash

      - name: Generate API docs
        run: |
          claude docs generate \
            --source=src/ \
            --output=docs/api/ \
            --format=markdown \
            --include-private=false
        env:
          ANTHROPIC_API_KEY: ${{ secrets.ANTHROPIC_API_KEY }}

      - name: Generate usage examples
        run: |
          claude docs examples \
            --source=src/ \
            --output=docs/examples/

      - name: Deploy to GitHub Pages
        uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./docs
```

## 📊 报告和通知

### 1. Slack 通知

```yaml
# .github/workflows/notify.yml
name: Notify Results

on:
  workflow_run:
    workflows: ["Claude Code CI"]
    types:
      - completed

jobs:
  notify:
    runs-on: ubuntu-latest
    if: ${{ github.event.workflow_run.conclusion == 'failure' }}

    steps:
      - name: Send Slack notification
        uses: slackapi/slack-github-action@v1
        with:
          payload: |
            {
              "text": "Claude Code CI Failed",
              "blocks": [
                {
                  "type": "section",
                  "text": {
                    "type": "mrkdwn",
                    "text": "*Claude Code CI Failed*\n\nRepository: ${{ github.repository }}\nBranch: ${{ github.ref }}\nRun: ${{ github.event.workflow_run.html_url }}"
                  }
                }
              ]
            }
        env:
          SLACK_WEBHOOK_URL: ${{ secrets.SLACK_WEBHOOK }}
```

### 2. 生成 HTML 报告

```yaml
# 在 CI 流水线中生成报告
- name: Generate HTML report
  run: |
    claude report generate \
      --input=claude-results.json \
      --output=report.html \
      --template=github

- name: Upload report
      uses: actions/upload-artifact@v3
      with:
        name: claude-report
        path: report.html

- name: Comment PR with report
      uses: actions/github-script@v6
      with:
        script: |
          const fs = require('fs');
          const report = fs.readFileSync('report.html', 'utf8');

          // 上传报告到临时存储
          const artifactUrl = 'https://github.com/${{ github.repository }}/actions/runs/${{ github.run_id }}';

          const comment = `## Claude Code Report\n\n[View Full Report](${artifactUrl})\n\n<details>\n<summary>Report Summary</summary>\n\n${report}\n</details>`;

          github.rest.issues.createComment({
            issue_number: context.issue.number,
            owner: context.repo.owner,
            repo: context.repo.repo,
            body: comment
          });
```

## 🎓 最佳实践

### ✅ DO - 应该做的

1. **缓存依赖**
   ```yaml
   - name: Cache dependencies
     uses: actions/cache@v3
     with:
       path: ~/.npm
       key: ${{ runner.os }}-node-${{ hashFiles('**/package-lock.json') }}
   ```

2. **并行运行任务**
   ```yaml
   jobs:
     lint:
       runs-on: ubuntu-latest
     test:
       runs-on: ubuntu-latest
     type-check:
       runs-on: ubuntu-latest
   # 三个任务并行运行
   ```

3. **使用矩阵策略**
   ```yaml
   strategy:
     matrix:
       node-version: [16, 18, 20]
       os: [ubuntu-latest, windows-latest, macos-latest]
   ```

4. **保护敏感信息**
   ```yaml
   env:
     ANTHROPIC_API_KEY: ${{ secrets.ANTHROPIC_API_KEY }}
   ```

### ❌ DON'T - 避免做的

1. ❌ 在 CI 中运行交互式命令
2. ❌ 忽略失败的检查
3. ❌ 不设置超时
4. ❌ 浪费 API 配额

## 📚 总结

恭喜！你已完成所有 25 个章节的学习。

### 你已经掌握了：

**第五部分：企业级应用**
- ✅ 工作流与最佳实践
- ✅ 企业部署
- ✅ 远程控制与会话
- ✅ 监控与可观测性
- ✅ CI/CD 集成

### 下一步建议

1. **实践应用**
   - 在实际项目中应用所学
   - 创建自定义工作流
   - 优化团队流程

2. **深入探索**
   - 阅读官方文档
   - 参与社区讨论
   - 分享你的经验

3. **持续学习**
   - 关注 Claude Code 更新
   - 学习新功能和特性
   - 改进工作流程

## 🔗 相关资源

- [CI/CD 最佳实践](https://code.claude.com/docs/zh-CN/ci-cd)
- [GitHub Actions 集成](https://code.claude.com/docs/zh-CN/github-actions)
- [自动化工作流](https://code.claude.com/docs/zh-CN/automation)

---

**🎉 感谢学习本教程！**

如果你觉得这个教程有帮助，请：
- ⭐ 给项目点 Star
- 🔄 分享给其他人
- 📝 提供反馈和建议
- 🤝 贡献内容

**Happy Coding with Claude Code! 🚀**
