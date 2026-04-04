import fs from 'fs'
import path from 'path'

interface SidebarItem {
  text: string
  link?: string
  items?: SidebarItem[]
  collapsed?: boolean
}

/**
 * 生成章节侧边栏配置
 * @param locale 语言代码 ('zh', 'tw' 或 'en')
 */
export function generateChapterSidebar(locale: string): SidebarItem[] {
  const chaptersDir = path.resolve(__dirname, `../../${locale}/chapters`)

  // 如果目录不存在，返回空数组
  if (!fs.existsSync(chaptersDir)) {
    return []
  }

  // 读取所有markdown文件
  const files = fs.readdirSync(chaptersDir)
    .filter(file => file.endsWith('.md'))
    .sort()

  // 按章节分组
  const sections = new Map<number, SidebarItem[]>()

  files.forEach(file => {
    // 解析文件名: 01-installation.md, 21-workflows-best-practices.md
    const match = file.match(/^(\d+)-(.+)\.md$/)
    if (!match) return

    const [, chapterNum, slug] = match
    const sectionNum = Math.ceil(parseInt(chapterNum) / 5) // 每5章为一个部分

    if (!sections.has(sectionNum)) {
      sections.set(sectionNum, [])
    }

    // 读取文件标题
    const filePath = path.join(chaptersDir, file)
    const content = fs.readFileSync(filePath, 'utf-8')
    const titleMatch = content.match(/^#\s+(.+)$/m)
    const title = titleMatch ? titleMatch[1] : slug

    sections.get(sectionNum)!.push({
      text: title,
      link: `/${locale}/chapters/${file.replace('.md', '')}`
    })
  })

  // 转换为VitePress侧边栏格式
  const sidebar: SidebarItem[] = []

  // 部分标题映射
  const sectionTitles: Record<number, { zh: string; tw: string; en: string }> = {
    1: {
      zh: '第一部分：环境搭建与基础交互',
      tw: '第一部分：環境搭建與基礎交互',
      en: 'Part 1: Setup & Basic Interaction'
    },
    2: {
      zh: '第二部分：复杂任务处理与终端控制',
      tw: '第二部分：複雜任務處理與終端控制',
      en: 'Part 2: Complex Tasks & Terminal Control'
    },
    3: {
      zh: '第三部分：多模态与上下文管理',
      tw: '第三部分：多模態與上下文管理',
      en: 'Part 3: Multimodal & Context Management'
    },
    4: {
      zh: '第四部分：高级功能扩展与定制',
      tw: '第四部分：高級功能擴展與定制',
      en: 'Part 4: Advanced Features & Customization'
    },
    5: {
      zh: '第五部分：企业级应用与最佳实践 ⭐',
      tw: '第五部分：企業級應用與最佳實踐 ⭐',
      en: 'Part 5: Enterprise Applications & Best Practices ⭐'
    },
    6: {
      zh: '第六部分：高级能力与多 Agent 协作 ⭐',
      tw: '第六部分：高級能力與多 Agent 協作 ⭐',
      en: 'Part 6: Advanced Capabilities & Multi-Agent Collaboration ⭐'
    }
  }

  Array.from(sections.keys())
    .sort((a, b) => a - b)
    .forEach(section => {
      const title = sectionTitles[section]
      let sectionTitle: string

      if (locale === 'zh') {
        sectionTitle = title?.zh || `第${section}部分`
      } else if (locale === 'tw') {
        sectionTitle = title?.tw || `第${section}部分`
      } else {
        sectionTitle = title?.en || `Part ${section}`
      }

      sidebar.push({
        text: sectionTitle,
        items: sections.get(section)!,
        collapsed: section !== 5 && section !== 6 // 第5、6部分默认展开
      })
    })

  return sidebar
}

/**
 * 生成文章侧边栏配置
 * @param locale 语言代码 ('zh' 或 'en')
 */
export function generateSidebar(locale: string): SidebarItem[] {
  const articlesDir = path.resolve(__dirname, `../../${locale}/articles`)

  // 如果目录不存在，返回空数组
  if (!fs.existsSync(articlesDir)) {
    return []
  }

  // 读取所有markdown文件
  const files = fs.readdirSync(articlesDir)
    .filter(file => file.endsWith('.md'))
    .sort()

  // 按章节分组
  const chapters = new Map<string, SidebarItem[]>()

  files.forEach(file => {
    // 解析文件名: 001_1.1 Claude Code是什么.md
    const match = file.match(/^(\d+)_([\d.]+)\s+(.+)\.md$/)
    if (!match) return

    const [, , sectionNumber, title] = match
    const chapterNumber = sectionNumber.split('.')[0]

    if (!chapters.has(chapterNumber)) {
      chapters.set(chapterNumber, [])
    }

    chapters.get(chapterNumber)!.push({
      text: `${sectionNumber} ${title}`,
      link: `/${locale}/articles/${file.replace('.md', '')}`
    })
  })

  // 转换为VitePress侧边栏格式
  const sidebar: SidebarItem[] = []

  // 章节标题映射（多语言）
  const chapterTitles: Record<string, { zh: string; tw: string; en: string }> = {
    '1': { zh: '第一章：入门指南', tw: '第一章：入門指南', en: 'Chapter 1: Getting Started' },
    '2': { zh: '第二章：核心功能', tw: '第二章：核心功能', en: 'Chapter 2: Core Features' },
    '3': { zh: '第三章：高级特性', tw: '第三章：高級特性', en: 'Chapter 3: Advanced Features' },
    '4': { zh: '第四章：实战应用', tw: '第四章：實戰應用', en: 'Chapter 4: Practical Applications' },
    '5': { zh: '第五章：进阶技巧', tw: '第五章：進階技巧', en: 'Chapter 5: Advanced Techniques' },
    '6': { zh: '第六章：最佳实践', tw: '第六章：最佳實踐', en: 'Chapter 6: Best Practices' },
    '7': { zh: '第七章：性能优化', tw: '第七章：性能優化', en: 'Chapter 7: Performance Optimization' },
    '8': { zh: '第八章：问题排查', tw: '第八章：問題排查', en: 'Chapter 8: Troubleshooting' },
    '9': { zh: '第九章：企业应用', tw: '第九章：企業應用', en: 'Chapter 9: Enterprise Applications' },
    '10': { zh: '第十章：扩展开发', tw: '第十章：擴展開發', en: 'Chapter 10: Extension Development' }
  }

  Array.from(chapters.keys())
    .sort((a, b) => parseInt(a) - parseInt(b))
    .forEach(chapter => {
      const title = chapterTitles[chapter]
      let chapterTitle: string

      if (locale === 'zh') {
        chapterTitle = title?.zh || `第${chapter}章`
      } else if (locale === 'tw') {
        chapterTitle = title?.tw || `第${chapter}章`
      } else {
        chapterTitle = title?.en || `Chapter ${chapter}`
      }

      sidebar.push({
        text: chapterTitle,
        items: chapters.get(chapter)!,
        collapsed: false
      })
    })

  return sidebar
}
