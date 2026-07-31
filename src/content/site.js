export const siteContent = {
  identity: {
    name: "阿峰",
    romanizedName: "AFENG",
    email: "3095635643@qq.com",
    githubUrl: "https://github.com/bianchengafeng",
    blogUrl: "https://bianchengafeng.xyz",
    blogName: "阿峰的编程笔记",
    siteLabel: "AFENG · PERSONAL SITE",
    copyrightYear: "2026",
    lastUpdatedYear: "2026"
  },

  statistics: {
    since: "2026.07.31",
    baseline: {
      visitors: 1843,
      pageViews: 2078
    }
  },

  seo: {
    home: {
      title: "阿峰｜个人主页",
      description: "阿峰的个人网站。关于本人、项目、写作和生活中的兴趣。"
    },
    projects: {
      title: "项目｜阿峰",
      description: "阿峰做过和正在做的项目。"
    },
    writing: {
      title: "写作｜阿峰",
      description: "阿峰的写作精选，完整文章发布于独立博客。"
    },
    about: {
      title: "关于｜阿峰",
      description: "关于阿峰。"
    },
    notFound: {
      title: "页面未找到｜阿峰",
      description: "请求的页面不存在。"
    }
  },

  home: {
    intro: {
      greeting: "你好，我是阿峰",
      title: ["这里记录此刻，", "也为变化留白。"],
      summary: "这是一个持续变化的个人空间。放下当下的状态、最近留下的痕迹，以及那些愿意长久保留的东西。"
    },
    now: {
      period: "2026.07",
      badge: "持续更新",
      headline: ["保持输入，", "也认真留下"],
      focus: [
        { icon: "layers", label: "正在做", value: "整理最近的输入" },
        { icon: "window", label: "正在完善", value: "这个个人空间" },
        { icon: "article", label: "正在留下", value: "值得保留的片段" }
      ],
      facts: [
        { label: "近况", value: "学习、尝试、整理" },
        { label: "更新", value: "随真实变化发生" },
        { label: "状态", value: "继续向前" }
      ]
    },
    traces: [
      {
        type: "BUILD",
        date: "2026.07",
        title: "重建个人网站",
        text: "重新梳理信息架构、视觉表达与 React 实现，让这里真正成为个人入口。",
        tone: "blue",
        icon: "window",
        symbol: "个人网站"
      },
      {
        type: "WRITE",
        date: "持续",
        title: "维护独立博客",
        text: "技术文章、学习笔记与完整归档继续发布在独立博客。",
        tone: "cyan",
        icon: "article",
        symbol: "独立博客"
      },
      {
        type: "UPDATE",
        date: "现在",
        title: "整理个人表达",
        text: "把真实近况、项目证据和愿意长期保留的内容逐步整理出来。",
        tone: "slate",
        icon: "layers",
        symbol: "持续整理"
      }
    ],
    viewpoint: {
      label: "ONE THOUGHT",
      text: ["先做出真实的东西，", "再决定如何定义自己。"]
    },
    curiosity: {
      label: "CURIOSITY MAP",
      title: "好奇心并不只在专业里。",
      text: "兴趣、生活状态、喜欢的作品和去过的地方，会在这里逐步出现。"
    },
    recentInputs: []
  },

  about: {
    heroTitle: "认识标签之外的我。",
    heroSummary: "这里不只列出身份和经历，也记录兴趣、做事方式，以及仍在形成中的部分。",
    principles: ["真实地完成一件事", "把复杂问题讲清楚", "给变化保留空间"],
    profileSummary: "正在探索，也正在研究。通过学习、项目和写作，把模糊的问题一步步变成可见的结果。",
    coordinates: [
      { label: "专业", value: "计算机" },
      { label: "关注", value: "AI / Computer Vision" },
      { label: "表达", value: "代码 · 设计 · 写作" },
      { label: "状态", value: "探索与研究中" }
    ],
    methods: [
      { title: "先理解", detail: "不急着套答案" },
      { title: "再动手", detail: "用可见结果验证" },
      { title: "后复盘", detail: "留下可复用经验" }
    ],
    lifeCollections: [
      {
        key: "interests",
        label: "兴趣与爱好",
        intro: "记录愿意长期投入的兴趣，以及它们为什么值得留下。",
        emptyText: "真实兴趣仍在整理，暂不使用示例填充。",
        items: []
      },
      {
        key: "inputs",
        label: "最近输入",
        intro: "书、文章、影视、音乐或工具都可以进入这里，但每项都会说明为什么留下。",
        emptyText: "最近输入尚未整理成可公开条目。",
        items: []
      },
      {
        key: "traces",
        label: "收藏与足迹",
        intro: "把重要链接、喜欢的物件和去过的地方整理为有限集合。",
        emptyText: "收藏与足迹尚未整理成可公开条目。",
        items: []
      }
    ]
  },

  projects: {
    pageSize: 3,
    categories: [
      {
        id: "01",
        key: "code",
        icon: "code",
        title: "代码与开源",
        text: "GitHub 仓库、独立工具、网站和可公开查看的代码成果。",
        tone: "blue",
        emptyTitle: "代码项目仍在整理",
        emptyText: "有可公开查看的真实成果后，会从这里补充。",
        items: [
          {
            title: "这个个人网站",
            eyebrow: "真实项目",
            summary: "关于个人表达、信息架构、视觉设计和 React 实现的一次长期尝试。它本身就是当前最完整的项目证据。",
            role: "设计与开发",
            stack: "React · Vite · Liquid Glass",
            status: "持续迭代",
            href: "https://github.com/bianchengafeng/bianchengafeng.github.io",
            linkLabel: "查看 GitHub 仓库"
          }
        ]
      },
      {
        id: "02",
        key: "practice",
        icon: "window",
        title: "实践与协作",
        text: "现实中参与的产品、活动、团队协作或解决具体问题的实践。",
        tone: "cyan",
        emptyTitle: "现实项目会放在这里",
        emptyText: "产品实践、团队协作、活动成果，以及解决具体问题的过程证据。",
        items: []
      },
      {
        id: "03",
        key: "learning",
        icon: "layers",
        title: "学习与实验",
        text: "课程作品、论文复现、小型实验和探索过程，不必包装成成熟项目。",
        tone: "slate",
        emptyTitle: "探索过程也值得保留",
        emptyText: "课程作品、论文复现、小型实验，以及阶段性的目标、方法与结论。",
        items: []
      },
      {
        id: "04",
        key: "research",
        icon: "article",
        title: "研究与发表",
        text: "未来的论文、技术报告、海报或可公开研究文章；与博客内容明确分开。",
        tone: "dark",
        emptyTitle: "正式研究输出的位置",
        emptyText: "目前尚无公开研究内容；未来用于论文、技术报告和学术海报。",
        items: []
      }
    ]
  },

  writing: {
    feedUrl: "https://bianchengafeng.xyz/index.xml",
    fallbackPosts: [
      {
        title: "Hugo SEO 配置指南",
        date: "2026.06.06",
        text: "博客写好了却没人看？本文按基础必做、进阶优化与提交收录三步梳理 Hugo SEO。",
        link: "https://bianchengafeng.xyz/posts/hugo-seo-guide/"
      },
      {
        title: "使用 Mermaid 绘制流程图",
        date: "2026.06.06",
        text: "从流程图开始，逐步覆盖时序图、甘特图与实际使用中的常见问题。",
        link: "https://bianchengafeng.xyz/posts/mermaid-flowchart/"
      },
      {
        title: "Docker 容器化与轻量级部署实践",
        date: "2026.06.01",
        text: "从基本原理到构建生产级、体积更小的静态服务镜像。",
        link: "https://bianchengafeng.xyz/posts/docker-containerization/"
      }
    ]
  }
};
