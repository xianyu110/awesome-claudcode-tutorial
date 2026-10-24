# 13. 使用 MCP 工具还原设计稿


> 📷 **截图说明**：本章配图含终端风格图。标注「真实输出」的来自本机 Claude Code 2.1.310（已打码）；标注「示意图」的未能非交互复现。GUI（VS Code/JetBrains/Desktop）待补。

结合 MCP Server 和图片处理能力，可以直接从设计工具（如 Figma）读取设计并生成代码。

## 🎨 完整的设计到代码流程

### 传统流程 vs MCP 流程

```
传统流程：
设计软件 → 导出 PNG → 上传图片 → 分析 → 编写代码
(手动，容易丢失信息)

MCP 流程：
Figma → MCP 直接读取 → 分析设计 → 生成代码
(自动化，保持设计语义)
```

## 💻 实战示例

![Figma MCP 设计到代码示意](/images/screenshots/13-mcp-design.png)

> 📷 示意图

### 示例 1: 完整页面还原

```
你: 读取 Figma 设计并实现这个页面
   https://www.figma.com/file/abc123/Dashboard

Claude:
→ 连接到 Figma MCP Server
→ 读取设计文件信息

📨 Figma 文件信息
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

文件：Dashboard Design
页面：Desktop Dashboard
框架：15 个
组件：8 个

组件列表：
1. Sidebar (导航栏)
2. Header (顶部栏)
3. StatsCard (统计卡片)
4. Chart (图表)
5. RecentActivity (活动列表)
6. UserProfile (用户资料)
7. NotificationPanel (通知面板)
8. SearchBar (搜索栏)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

开始实现...

→ 创建项目结构
→ 安装依赖 (recharts, lucide-react)
→ 实现组件
✓ Sidebar.jsx
✓ Header.jsx
✓ StatsCard.jsx
✓ Chart.jsx
✓ RecentActivity.jsx
✓ UserProfile.jsx
✓ NotificationPanel.jsx
✓ SearchBar.jsx

→ 组装页面
✓ Dashboard.jsx

→ 添加样式
✓ Dashboard.module.css

→ 添加 mock 数据
✓ data/mock-data.js

✓ 完成！运行 npm run dev 查看效果
```

**生成的代码示例：**

```jsx
// src/pages/Dashboard.jsx
import styles from './Dashboard.module.css';
import { Sidebar } from '../components/Sidebar';
import { Header } from '../components/Header';
import { StatsCard } from '../components/StatsCard';
import { Chart } from '../components/Chart';
import { RecentActivity } from '../components/RecentActivity';
import { UserProfile } from '../components/UserProfile';
import { NotificationPanel } from '../components/NotificationPanel';
import { SearchBar } from '../components/SearchBar';

export default function Dashboard() {
  return (
    <div className={styles.dashboard}>
      <Sidebar className={styles.sidebar} />
      <main className={styles.main}>
        <Header className={styles.header} />
        <div className={styles.content}>
          <SearchBar className={styles.search} />
          <div className={styles.statsGrid}>
            <StatsCard
              title="总用户数"
              value="12,345"
              change="+12.5%"
              trend="up"
            />
            <StatsCard
              title="活跃用户"
              value="8,901"
              change="+8.2%"
              trend="up"
            />
            <StatsCard
              title="新注册"
              value="1,234"
              change="-2.1%"
              trend="down"
            />
            <StatsCard
              title="收入"
              value="$45,678"
              change="+15.3%"
              trend="up"
            />
          </div>
          <div className={styles.chartsAndActivity}>
            <Chart className={styles.chart} />
            <RecentActivity className={styles.activity} />
          </div>
        </div>
      </main>
      <aside className={styles.aside}>
        <UserProfile />
        <NotificationPanel />
      </aside>
    </div>
  );
}
```

```css
/* src/pages/Dashboard.module.css */
.dashboard {
  display: grid;
  grid-template-columns: 240px 1fr 280px;
  grid-template-rows: 60px 1fr;
  height: 100vh;
  gap: 0;
}

.sidebar {
  grid-row: 1 / -1;
  background: #1e293b;
  color: white;
}

.header {
  grid-column: 2 / 3;
  background: white;
  border-bottom: 1px solid #e2e8f0;
}

.main {
  grid-column: 2 / 3;
  overflow: auto;
}

.aside {
  grid-column: 3 / 4;
  grid-row: 2 / 3;
  background: #f8fafc;
  border-left: 1px solid #e2e8f0;
  overflow: auto;
}

.content {
  padding: 24px;
}

.search {
  margin-bottom: 24px;
}

.statsGrid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
  margin-bottom: 24px;
}

.chartsAndActivity {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 16px;
}
```

### 示例 2: 组件库生成

```
你: 从这个 Figma 文件生成组件库
   https://www.figma.com/file/xyz789/Design-System

Claude:
→ 读取设计系统文件

🎨 设计系统分析
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

发现组件：45 个

分类：
1. 基础组件 (20 个)
   - Button (6 变体)
   - Input (4 变体)
   - Badge (3 变体)
   - Avatar (2 变体)
   - Card (3 变体)
   - Divider (2 变体)

2. 表单组件 (10 个)
   - Checkbox, Radio, Switch, Select, etc.

3. 反馈组件 (8 个)
   - Alert, Toast, Modal, etc.

4. 导航组件 (7 个)
   - Tabs, Breadcrumb, Pagination, etc.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

生成组件库...

→ 创建组件目录结构
→ 生成每个组件
→ 创建 Storybook 配置
✓ 完成！
```

**生成的组件示例：**

```jsx
// src/components/Button/Button.jsx
import styles from './Button.module.css';
import { classNames } from '../../utils/classNames';

export function Button({
  children,
  variant = 'primary',
  size = 'medium',
  disabled = false,
  onClick,
  ...props
}) {
  return (
    <button
      className={classNames(
        styles.button,
        styles[variant],
        styles[size],
        disabled && styles.disabled
      )}
      onClick={onClick}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
}
```

```css
/* src/components/Button/Button.module.css */
.button {
  border: none;
  border-radius: 8px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

/* Variants */
.primary {
  background: #3b82f6;
  color: white;
}
.primary:hover:not(:disabled) {
  background: #2563eb;
}

.secondary {
  background: #6b7280;
  color: white;
}
.secondary:hover:not(:disabled) {
  background: #4b5563;
}

.outline {
  background: transparent;
  border: 1px solid #d1d5db;
  color: #374151;
}
.outline:hover:not(:disabled) {
  background: #f9fafb;
}

/* Sizes */
.small {
  padding: 8px 16px;
  font-size: 14px;
}

.medium {
  padding: 12px 24px;
  font-size: 16px;
}

.large {
  padding: 16px 32px;
  font-size: 18px;
}

/* States */
.disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
```

### 示例 3: 响应式设计

```
你: 这个设计有多个断点，实现响应式

Claude:
→ 读取所有断点的设计
→ 分析布局变化

📱 响应式断点分析
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

断点：
- Mobile: 375px
- Tablet: 768px
- Desktop: 1024px
- Wide: 1440px

布局变化：
Mobile:
- 单列
- 隐藏侧边栏
- 汉堡菜单

Tablet:
- 两列
- 侧边栏可折叠
- 底部导航

Desktop:
- 三列
- 固定侧边栏
- 顶部导航

Wide:
- 四列
- 更大间距

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

生成响应式代码...

✓ 已创建 responsive.css
✓ 已添加媒体查询
✓ 已测试所有断点
```

### 示例 4: 动画和交互

```
你: 这个设计有动画，实现它们

Claude:
→ 分析动画规范
→ 识别动画元素

🎬 动画分析
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

发现的动画：

1. Button Hover
   - 类型: Scale
   - 值: 1.05
   - 时长: 200ms
   - 缓动: ease-out

2. Page Transition
   - 类型: Fade + Slide
   - 方向: Right to Left
   - 时长: 300ms
   - 缓动: ease-in-out

3. Modal
   - 类型: Scale + Fade
   - 值: 0.95
   - 到: 1
   - 时长: 250ms
   - 缓动: cubic-bezier(0.4, 0, 0.2, 1)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

实现动画...

→ 安装 framer-motion
→ 创建动画组件
✓ 完成！
```

```jsx
// src/components/Button/AnimatedButton.jsx
import { motion } from 'framer-motion';
import styles from './AnimatedButton.module.css';

export function AnimatedButton({ children, ...props }) {
  return (
    <motion.button
      className={styles.button}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      transition={{
        duration: 0.2,
        ease: 'easeOut'
      }}
      {...props}
    >
      {children}
    </motion.button>
  );
}

// src/components/Modal/Modal.jsx
import { motion, AnimatePresence } from 'framer-motion';

export function Modal({ isOpen, onClose, children }) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            className="overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={onClose}
          />
          <motion.div
            className="modal"
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            transition={{
              duration: 0.25,
              ease: [0.4, 0, 0.2, 1]
            }}
          >
            {children}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
```

## 🎯 设计到代码的最佳实践

### 1. 准备设计文件

```bash
# ✅ 好的设计文件
- 清晰的命名
- 逻辑分组
- 使用组件
- 定义设计系统
- 包含所有状态

# ❌ 不好的设计文件
- 混乱的图层
- 硬编码尺寸
- 缺少变体
- 没有设计系统
```

### 2. 使用设计系统

```
你: 使用我的设计系统生成组件

Claude:
→ 读取设计系统
→ 提取 tokens
→ 生成代码

✓ 已创建 src/styles/tokens.css
✓ 已创建 Tailwind 配置
✓ 已生成所有组件
```

### 3. 保持设计语义

```jsx
// ✅ 好：语义化的组件
<Button variant="primary" size="large">
  点击我
</Button>

// ❌ 不好：硬编码样式
<button className="bg-blue-500 text-white px-8 py-4 rounded">
  点击我
</button>
```

### 4. 可访问性

```jsx
// Claude 会自动添加可访问性
export function Button({ children, ...props }) {
  return (
    <button
      type="button"
      aria-label={props.ariaLabel}
      disabled={props.disabled}
      {...props}
    >
      {children}
    </button>
  );
}
```

## 🛠️ 工作流程

### 推荐的工作流程

```
1. 设计准备
   └─> 在 Figma 中完成设计
   └─> 定义组件和变体
   └─> 创建设计系统

2. 连接 MCP
   └─> 安装 Figma MCP Server
   └─> 配置访问 token
   └─> 测试连接

3. 读取设计
   └─> Claude 读取设计文件
   └─> 分析结构和组件
   └─> 识别设计模式

4. 生成代码
   └─> 创建项目结构
   └─> 生成组件代码
   └─> 添加样式

5. 审查和调整
   └─> 检查生成的代码
   └─> 测试功能
   └─> 微调样式

6. 集成到项目
   └─> 合并到主分支
   └─> 更新文档
   └─> 分享给团队
```

## 📊 对比：手动 vs MCP

| 方面 | 手动实现 | MCP 实现 |
|------|----------|----------|
| 速度 | 慢 (数小时) | 快 (数分钟) |
| 准确性 | 可能出错 | 高度准确 |
| 可维护性 | 取决于开发者 | 结构化 |
| 设计一致性 | 容易偏差 | 保持一致 |
| 迭代速度 | 慢 | 快 |
| 学习曲线 | 需要学习 | 自动化 |

## 💡 高级技巧

### 1. 批量生成

```
你: 生成这个设计系统的所有组件

Claude:
→ 分析 45 个组件
→ 批量生成代码
✓ 5 分钟内完成
```

### 2. 增量更新

```
你: 设计有更新，重新生成按钮组件

Claude:
→ 读取新的设计
→ 对比差异
→ 只更新按钮组件
✓ 完成！
```

### 3. 设计验证

```
你: 检查实现是否与设计一致

Claude:
→ 对比设计和代码
→ 标记差异
→ 生成修复建议

发现 3 处差异：
1. 按钮圆角：8px → 12px
2. 字体大小：14px → 16px
3. 颜色：#3B82F6 → #2563EB

需要修复吗？
```

## 📚 下一步

了解 MCP 设计还原后，继续学习 [14. 上下文管理](./14-context-management.md)

## 🔗 相关资源

- [Figma MCP 文档](https://github.com/modelcontextprotocol/servers/tree/main/src/figma)
- [设计系统最佳实践](https://www.figma.com/best-practices/design-systems)


---

> 💡 **API 推荐**：[https://tryallapi.com/](https://tryallapi.com/) - 一站式接入各种AI服务，注册即送0.2刀
