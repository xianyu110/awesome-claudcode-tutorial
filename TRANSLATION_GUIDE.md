# AI 翻译指南

本指南说明如何使用 `translate_to_english.py` 脚本将中文文章翻译为英文。

## 前置要求

1. **Python 环境**：Python 3.8 或更高版本
2. **依赖安装**：
   ```bash
   pip install anthropic
   ```

3. **API 配置**：需要 Claude API Key

## API 配置方案

### 方案 1：使用 MaynorAI API 服务（推荐 - 国内可用）

MaynorAI API 服务提供国内可直连的 Claude API 服务，无需科学上网。

**服务地址**：https://tryallapi.com/

**配置步骤**：
1. 访问 https://tryallapi.com/ 注册账号并获取 API Key
2. 设置环境变量：
   ```bash
   # Windows
   set ANTHROPIC_API_KEY=your_api_key
   set ANTHROPIC_BASE_URL=https://tryallapi.com/v1

   # Linux/Mac
   export ANTHROPIC_API_KEY=your_api_key
   export ANTHROPIC_BASE_URL=https://tryallapi.com/v1
   ```

### 方案 2：使用 Anthropic 官方 API

如果你有 Anthropic 官方 API Key：

```bash
# Windows
set ANTHROPIC_API_KEY=your_api_key

# Linux/Mac
export ANTHROPIC_API_KEY=your_api_key
```

## 使用方法

### 基本用法

```bash
# 翻译所有中文文章到英文
python translate_to_english.py
```

### 指定 API 配置

```bash
# 使用命令行参数指定 API Key 和 Base URL
python translate_to_english.py --api-key your_api_key --api-base https://tryallapi.com/v1
```

### 自定义源目录和目标目录

```bash
# 指定自定义目录
python translate_to_english.py --source docs/zh/articles --target docs/en/articles
```

### 重置翻译进度

如果需要重新翻译所有文章：

```bash
python translate_to_english.py --reset
```

## 进度管理

- 脚本会自动保存翻译进度到 `.translation_progress.json` 文件
- 如果翻译过程中断，再次运行会从上次停止的地方继续
- 已翻译的文章不会被重新翻译

## 翻译特性

1. **保持格式**：完整保留 Markdown 格式（标题、列表、表格等）
2. **保护代码块**：代码块内容不会被翻译
3. **术语准确**：保持技术术语的准确性
4. **专业英文**：使用自然、专业的英文表达
5. **错误重试**：支持自动重试机制，提高成功率

## 注意事项

1. **API 费用**：翻译 200+ 篇文章可能产生一定的 API 费用，请确认账户余额充足
2. **网络连接**：确保网络连接稳定，避免翻译过程中断
3. **速率限制**：脚本已内置延迟机制，避免触发 API 速率限制
4. **备份原文**：翻译前建议备份原始文章，以防意外

## 故障排查

### 错误：未找到 API Key

```
[ERROR] 未找到 API Key，请设置环境变量 ANTHROPIC_API_KEY 或 CLAUDE_API_KEY
```

**解决方案**：设置环境变量或使用 `--api-key` 参数

### 错误：网络连接失败

**解决方案**：
1. 检查网络连接
2. 如果使用官方 API，确认是否需要科学上网
3. 推荐使用 MaynorAI API 服务（国内可直连）

### 错误：API 速率限制

**解决方案**：
- 等待几分钟后重新运行
- 脚本会自动从上次停止的地方继续

## 估算翻译时间

- 单篇文章翻译时间：约 5-15 秒
- 208 篇文章总计：约 30-60 分钟
- 实际时间取决于文章长度和网络速度

## 示例

### 完整示例（使用 MaynorAI API）

```bash
# 1. 安装依赖
pip install anthropic

# 2. 设置 API 配置
set ANTHROPIC_API_KEY=sk-ant-xxxxx
set ANTHROPIC_BASE_URL=https://tryallapi.com/v1

# 3. 开始翻译
python translate_to_english.py

# 4. 如果中途中断，再次运行会继续
python translate_to_english.py
```

## 验证翻译结果

翻译完成后，可以：

1. 检查 `docs/en/articles/` 目录下的文件数量
2. 随机抽查几篇文章的翻译质量
3. 运行 VitePress 构建，检查是否有错误：
   ```bash
   npm run docs:build
   ```

## 技术支持

如有问题，请访问：
- MaynorAI API 服务：https://tryallapi.com/
- GitHub Issues：https://github.com/xianyu110/claudecode-tutorial/issues
