import { defineConfig } from 'vitepress'
import { generateSidebar, generateChapterSidebar } from './utils/sidebar'

export default defineConfig({
  title: 'Claude Code 教程',
  description: 'Claude Code 完整中文教程 - AI编程助手学习指南',

  // 基础配置
  base: '/', // 使用自定义域名时设置为根路径
  lang: 'zh-CN',
  lastUpdated: true,
  cleanUrls: true,

  // 忽略跨语言链接的死链接检查
  ignoreDeadLinks: [
    /\/zh\/articles\/(index)?$/,
    /\/tw\/articles\/(index)?$/,
    /\/en\/articles\/(index)?$/
  ],

  // 头部配置
  head: [
    ['link', { rel: 'icon', href: '/favicon.svg', type: 'image/svg+xml' }],
    ['meta', { name: 'theme-color', content: '#159957' }],
    ['meta', { name: 'apple-mobile-web-app-capable', content: 'yes' }],
    ['meta', { name: 'apple-mobile-web-app-status-bar-style', content: 'black' }],
    // SEO 优化
    ['meta', { name: 'keywords', content: 'Claude Code, AI编程, 编程助手, AI助手, Anthropic, 教程' }],
    ['meta', { property: 'og:type', content: 'website' }],
    ['meta', { property: 'og:locale', content: 'zh_CN' }],
    ['meta', { property: 'og:site_name', content: 'Claude Code 教程' }],
  ],

  // 主题配置
  themeConfig: {
    logo: '/logo.svg',
    siteTitle: 'MaynorAI',

    // 导航栏
    nav: [
      { text: '首页', link: '/zh/' },
      { text: '文章教程', link: '/zh/articles/' },
      { text: '课程章节', link: '/zh/chapters/' },
      { text: 'GitHub', link: 'https://github.com/xianyu110/claudecode-tutorial' }
    ],

    // 侧边栏 - 将由脚本自动生成
    sidebar: {
      '/zh/articles/': generateSidebar('zh'),
      '/zh/chapters/': generateChapterSidebar('zh'),
      '/tw/articles/': generateSidebar('tw'),
      '/tw/chapters/': generateChapterSidebar('tw'),
      '/en/articles/': generateSidebar('en'),
      '/en/chapters/': generateChapterSidebar('en')
    },

    // 社交链接
    socialLinks: [
      { icon: 'github', link: 'https://github.com/xianyu110/claudecode-tutorial' }
    ],

    // 页脚
    footer: {
      message: '基于 MIT 许可发布 | <a href="https://link3.cc/maynorai" target="_blank" rel="noopener noreferrer">永久导航</a>',
      copyright: 'Copyright © 2024-present MaynorAI'
    },

    // 搜索配置
    search: {
      provider: 'local',
      options: {
        locales: {
          zh: {
            translations: {
              button: {
                buttonText: '搜索文档',
                buttonAriaLabel: '搜索文档'
              },
              modal: {
                noResultsText: '无法找到相关结果',
                resetButtonTitle: '清除查询条件',
                footer: {
                  selectText: '选择',
                  navigateText: '切换'
                }
              }
            }
          },
          tw: {
            translations: {
              button: {
                buttonText: '搜尋文檔',
                buttonAriaLabel: '搜尋文檔'
              },
              modal: {
                noResultsText: '無法找到相關結果',
                resetButtonTitle: '清除查詢條件',
                footer: {
                  selectText: '選擇',
                  navigateText: '切換'
                }
              }
            }
          },
          en: {
            translations: {
              button: {
                buttonText: 'Search',
                buttonAriaLabel: 'Search'
              },
              modal: {
                noResultsText: 'No results found',
                resetButtonTitle: 'Clear query',
                footer: {
                  selectText: 'Select',
                  navigateText: 'Navigate'
                }
              }
            }
          }
        }
      }
    },

    // 编辑链接
    editLink: {
      pattern: 'https://github.com/xianyu110/claudecode-tutorial/edit/main/docs/:path',
      text: '在 GitHub 上编辑此页面'
    },

    // 最后更新时间文本
    lastUpdated: {
      text: '最后更新于',
      formatOptions: {
        dateStyle: 'full',
        timeStyle: 'medium'
      }
    },

    // 文档页脚
    docFooter: {
      prev: '上一页',
      next: '下一页'
    },

    // 大纲配置
    outline: {
      level: [2, 3],
      label: '页面导航'
    },

    // 返回顶部
    returnToTopLabel: '返回顶部',
    sidebarMenuLabel: '菜单',
    darkModeSwitchLabel: '主题',
    lightModeSwitchTitle: '切换到浅色模式',
    darkModeSwitchTitle: '切换到深色模式'
  },

  // 国际化配置
  locales: {
    root: {
      label: '简体中文',
      lang: 'zh-CN',
      link: '/zh/',
      themeConfig: {
        nav: [
          { text: '首页', link: '/zh/' },
          { text: '文章教程', link: '/zh/articles/' },
          { text: '课程章节', link: '/zh/chapters/' },
          { text: 'GitHub', link: 'https://github.com/xianyu110/claudecode-tutorial' }
        ],
        sidebar: {
          '/zh/articles/': generateSidebar('zh'),
          '/zh/chapters/': generateChapterSidebar('zh')
        }
      }
    },
    tw: {
      label: '繁體中文',
      lang: 'zh-TW',
      link: '/tw/',
      themeConfig: {
        nav: [
          { text: '首頁', link: '/tw/' },
          { text: '文章教程', link: '/tw/articles/' },
          { text: '課程章節', link: '/tw/chapters/' },
          { text: 'GitHub', link: 'https://github.com/xianyu110/claudecode-tutorial' }
        ],
        sidebar: {
          '/tw/articles/': generateSidebar('tw'),
          '/tw/chapters/': generateChapterSidebar('tw')
        },
        editLink: {
          pattern: 'https://github.com/xianyu110/claudecode-tutorial/edit/main/docs/:path',
          text: '在 GitHub 上編輯此頁面'
        },
        lastUpdated: {
          text: '最後更新於',
        },
        docFooter: {
          prev: '上一頁',
          next: '下一頁'
        },
        outline: {
          label: '頁面導航'
        },
        returnToTopLabel: '返回頂部',
        sidebarMenuLabel: '選單',
        darkModeSwitchLabel: '主題',
        lightModeSwitchTitle: '切換到淺色模式',
        darkModeSwitchTitle: '切換到深色模式'
      }
    },
    en: {
      label: 'English',
      lang: 'en-US',
      link: '/en/',
      themeConfig: {
        nav: [
          { text: 'Home', link: '/en/' },
          { text: 'Article Tutorial', link: '/en/articles/' },
          { text: 'Chapters', link: '/en/chapters/' },
          { text: 'GitHub', link: 'https://github.com/xianyu110/claudecode-tutorial' }
        ],
        sidebar: {
          '/en/articles/': generateSidebar('en'),
          '/en/chapters/': generateChapterSidebar('en')
        },
        editLink: {
          pattern: 'https://github.com/xianyu110/claudecode-tutorial/edit/main/docs/:path',
          text: 'Edit this page on GitHub'
        },
        lastUpdated: {
          text: 'Last updated',
        },
        docFooter: {
          prev: 'Previous',
          next: 'Next'
        },
        outline: {
          label: 'On this page'
        },
        returnToTopLabel: 'Return to top',
        sidebarMenuLabel: 'Menu',
        darkModeSwitchLabel: 'Theme'
      }
    }
  },

  // Markdown 配置
  markdown: {
    lineNumbers: true,
    theme: {
      light: 'github-light',
      dark: 'github-dark'
    }
  },

  // 构建配置
  build: {
    chunkSizeWarningLimit: 1000
  },

  // Sitemap 配置
  sitemap: {
    hostname: 'https://awesome.claude-opus.top'
  }
})
