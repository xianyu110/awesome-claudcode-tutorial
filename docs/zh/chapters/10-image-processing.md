# 10. 图片处理


> 📷 **截图说明**：本章配图含终端风格图。标注「真实输出」的来自本机 Claude Code 2.1.310（已打码）；标注「示意图」的未能非交互复现。GUI（VS Code/JetBrains/Desktop）待补。

Claude Code 的多模态能力让它能够"看"懂图片，这对于设计实现、UI 开发特别有用。

## 🎨 为什么需要图片处理？

### 应用场景

1. **设计稿转代码**
   ```
   Figma/Sketch 设计稿 → React 组件
   ```

2. **UI Bug 定位**
   ```
   截图显示问题 → Claude 识别并修复
   ```

3. **图标识别**
   ```
   找出设计稿中使用的图标库
   ```

4. **布局分析**
   ```
   分析页面结构和组件层次
   ```

5. **颜色提取**
   ```
   从设计中提取色板和样式
   ```

## 📸 支持的图片格式

| 格式 | 支持 | 用途 |
|------|------|------|
| PNG | ✅ | 截图、设计稿 |
| JPG | ✅ | 照片、UI |
| JPEG | ✅ | 照片、UI |
| WebP | ✅ | 现代 Web 格式 |
| GIF | ⚠️ | 静态帧分析 |
| SVG | ⚠️ | 需要转栅格 |

## 💻 实战示例

![图片输入转代码示意](/images/screenshots/10-image.png)

> 📷 示意图

### 示例 1: 设计稿转代码

**输入设计稿：**

```
你: [上传截图: login-design.png]
   帮我实现这个登录页面

Claude Code 分析图片...

📐 设计分析：
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

布局结构：
- 居中卡片布局 (400px × 500px)
- 垂直间距：24px
- 内边距：32px

颜色方案：
- 主色：#3B82F6 (蓝色)
- 背景：#F3F4F6 (浅灰)
- 文字：#1F2937 (深灰)
- 错误：#EF4444 (红色)

组件：
1. Logo (顶部，居中)
2. 标题 "欢迎回来"
3. 邮箱输入框
4. 密码输入框
5. "忘记密码" 链接
6. 登录按钮
7. 注册链接

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

开始实现...

[生成代码]

✓ 已创建 src/pages/Login.jsx
✓ 已创建 src/pages/Login.module.css
✓ 已安装必要依赖
```

**生成的代码示例：**

```jsx
// src/pages/Login.jsx
import styles from './Login.module.css';

export default function Login() {
  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <img src="/logo.svg" alt="Logo" className={styles.logo} />
        <h1 className={styles.title}>欢迎回来</h1>

        <form className={styles.form}>
          <input
            type="email"
            placeholder="邮箱地址"
            className={styles.input}
          />
          <input
            type="password"
            placeholder="密码"
            className={styles.input}
          />

          <a href="/forgot" className={styles.forgotLink}>
            忘记密码？
          </a>

          <button type="submit" className={styles.submitBtn}>
            登录
          </button>
        </form>

        <p className={styles.registerLink}>
          还没有账户？<a href="/register">立即注册</a>
        </p>
      </div>
    </div>
  );
}
```

```css
/* src/pages/Login.module.css */
.container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #F3F4F6;
}

.card {
  width: 400px;
  padding: 32px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.logo {
  width: 64px;
  height: 64px;
  margin: 0 auto 24px;
  display: block;
}

.title {
  text-align: center;
  color: #1F2937;
  margin-bottom: 32px;
  font-size: 24px;
}

.form {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.input {
  padding: 12px;
  border: 1px solid #E5E7EB;
  border-radius: 8px;
  font-size: 14px;
}

.submitBtn {
  padding: 12px;
  background: #3B82F6;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  cursor: pointer;
  margin-top: 8px;
}

.submitBtn:hover {
  background: #2563EB;
}
```

### 示例 2: UI Bug 修复

```
你: [上传截图: ui-bug.png]
   这个按钮的位置不对，应该右对齐

Claude Code 分析图片...

🐛 问题识别：
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
当前问题：按钮左对齐
预期位置：按钮应该右对齐

位置：src/components/Header.jsx 第 45 行

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

修复中...

→ 修改 src/components/Header.jsx

✓ 已修复！按钮现在右对齐了
```

### 示例 3: 图标识别和实现

```
你: [上传截图: icons.png]
   识别这些图标并告诉我用哪个库

Claude Code 分析图片...

🎨 图标识别结果：
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

1. 🏠 Home → Lucide-React: Home
2. 👤 User → Lucide-React: User
3. ⚙️ Settings → Lucide-React: Settings
4. 🔔 Bell → Lucide-React: Bell
5. 🔍 Search → Lucide-React: Search

推荐使用：Lucide React
安装：npm install lucide-react

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

需要我帮你集成吗？

你: 是的

Claude:
→ npm install lucide-react ✓
→ 更新 src/components/Navigation.jsx ✓
→ 导入并使用图标 ✓

✓ 完成！
```

### 示例 4: 颜色和样式提取

```
你: [上传截图: design-system.png]
   提取这个设计的设计规范

Claude Code 分析图片...

🎨 设计规范提取
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

## 色板

主色：
- Primary: #6366F1 (Indigo 500)
- Primary Dark: #4F46E5 (Indigo 600)
- Primary Light: #818CF8 (Indigo 400)

辅助色：
- Success: #10B981 (Emerald 500)
- Warning: #F59E0B (Amber 500)
- Error: #EF4444 (Red 500)

中性色：
- BG Primary: #FFFFFF
- BG Secondary: #F9FAFB
- Text Primary: #111827
- Text Secondary: #6B7280
- Border: #E5E7EB

## 排版

标题字体：
- H1: 36px, Weight 700, Line-height 1.2
- H2: 30px, Weight 600, Line-height 1.3
- H3: 24px, Weight 600, Line-height 1.4

正文字体：
- Body: 16px, Weight 400, Line-height 1.5
- Small: 14px, Weight 400, Line-height 1.5

## 间距

- XS: 4px
- SM: 8px
- MD: 16px
- LG: 24px
- XL: 32px
- 2XL: 48px

## 圆角

- SM: 4px
- MD: 8px
- LG: 12px
- XL: 16px
- Full: 9999px

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

生成 Tailwind 配置...

✓ 已创建 tailwind.config.js
✓ 已创建 src/styles/tokens.css
```

```javascript
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#EEF2FF',
          100: '#E0E7FF',
          400: '#818CF8',
          500: '#6366F1',
          600: '#4F46E5',
        },
        success: '#10B981',
        warning: '#F59E0B',
        error: '#EF4444',
      },
      spacing: {
        'xs': '4px',
        'sm': '8px',
        'md': '16px',
        'lg': '24px',
        'xl': '32px',
        '2xl': '48px',
      },
      borderRadius: {
        'sm': '4px',
        'md': '8px',
        'lg': '12px',
        'xl': '16px',
      },
    },
  },
};
```

### 示例 5: 响应式布局分析

```
你: [上传三张截图：mobile.png, tablet.png, desktop.png]
   分析这个页面的响应式设计

Claude Code 分析图片...

📱 响应式断点分析
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

## Mobile (375px)
- 单列布局
- 汉堡菜单
- 12px 边距
- 14px 字体

## Tablet (768px)
- 两列布局
- 侧边栏导航
- 24px 边距
- 16px 字体

## Desktop (1440px)
- 三列布局
- 水平导航
- 48px 边距
- 16px 字体

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

生成响应式 CSS...

✓ 已更新 src/styles/responsive.css
```

```css
/* src/styles/responsive.css */
.container {
  padding: 12px;
}

@media (min-width: 768px) {
  .container {
    padding: 24px;
  }
}

@media (min-width: 1440px) {
  .container {
    padding: 48px;
  }
}

.grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 16px;
}

@media (min-width: 768px) {
  .grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (min-width: 1440px) {
  .grid {
    grid-template-columns: repeat(3, 1fr);
  }
}
```

## 🔍 图片分析能力

### Claude Code 能识别的元素

| 元素类型 | 识别能力 | 准确度 |
|----------|----------|--------|
| 布局结构 | ✅ 优秀 | ⭐⭐⭐⭐⭐ |
| 颜色 | ✅ 优秀 | ⭐⭐⭐⭐⭐ |
| 文字内容 | ✅ 良好 | ⭐⭐⭐⭐ |
| 图标 | ✅ 良好 | ⭐⭐⭐⭐ |
| 字体样式 | ⚠️ 中等 | ⭐⭐⭐ |
| 图片质量 | ⚠️ 中等 | ⭐⭐⭐ |

## 💡 最佳实践

### ✅ DO - 应该做的

1. **提供清晰的截图**
   ```
   - 高分辨率 (至少 2x)
   - 完整的 UI 元素
   - 良好的对比度
   ```

2. **提供上下文**
   ```
   这是登录页面的设计稿，
   使用 React + Tailwind CSS
   ```

3. **指定框架**
   ```
   使用 Next.js 和 Material-UI 实现
   ```

4. **要求说明**
   ```
   只需要布局和样式，
   不需要功能实现
   ```

### ❌ DON'T - 避免做的

1. ❌ 模糊的截图
   ```
   会导致识别错误
   ```

2. ❌ 不完整的 UI
   ```
   截取完整的组件或页面
   ```

3. ❌ 过于复杂的动画
   ```
   静态截图无法表达动画
   需要额外描述
   ```

## 🛠️ 工作流程

### 设计到代码的最佳流程

```
1. 设计稿 (Figma/Sketch)
   ↓
2. 导出为 PNG/PDF
   ↓
3. 上传到 Claude Code
   ↓
4. 分析并生成代码
   ↓
5. 审查和调整
   ↓
6. 测试和验证
```

### 设计系统集成

```bash
# 使用 MCP Server 直接读取 Figma
你: 使用 Figma MCP 读取设计

Claude:
→ 连接到 Figma API
→ 读取设计文件
→ 生成组件代码

✓ 完成！
```

## 🎯 高级技巧

### 批量处理

```
你: [上传多个截图]
   一次性分析所有这些页面

Claude:
✓ 已分析 5 个页面
共同模式：
- 都使用了相同的导航栏
- 统一的卡片设计
- 一致的按钮样式

生成共享组件...
```

### 对比分析

```
你: [上传两个版本的截图]
   对比这两个版本的区别

Claude:
📊 版本对比
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

版本 A vs 版本 B

颜色差异：
- 按钮：#3B82F6 → #10B981
- 背景：#F3F4F6 → #FFFFFF

布局差异：
- 侧边栏从左移到右
- 搜索框位置改变

新增元素：
- 版本 B 增加了用户头像

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

## 📚 下一步

了解图片处理后，继续学习 [11. 安装 MCP Server](./11-mcp-setup.md)

## 🔗 相关资源

- [多模态能力文档](https://code.claude.com/docs/zh-CN/multimodal)
- [设计系统集成](https://code.claude.com/docs/zh-CN/integrations/figma)


---

> 💡 **API 推荐**：[https://tryallapi.com/](https://tryallapi.com/) - 一站式接入各种AI服务，注册即送0.2刀
