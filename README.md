# Daily Hub — 每日汇总

每日 12:00 自动抓取 6 个子页面最新内容，生成汇总首页，托管于 GitHub Pages。

## 子页面

| 名称 | URL |
|------|-----|
| Daily Photos | https://chenzhiheng.cn/daily-photos/ |
| Daily Algo | https://chenzhiheng.cn/daily-algo/ |
| Audio Workshop | https://chenzhiheng.cn/audio-workshop/ |
| Daily Lyric Learning | https://chenzhiheng.cn/daily-lyric-learning/ |
| Daily Tech Learning | https://chenzhiheng.cn/daily-tech-learning/ |
| DayAI | https://chenzhiheng.cn/DayAI/ |

## 项目结构

```
daily-hub/
├── .cursor/automations/   # Cursor Automation prompt + trigger 文件
├── data/                  # 页面配置、历史记录
├── docs/                  # GitHub Pages 根目录
│   ├── index.html         # 汇总首页（自动生成）
│   ├── style.css          # 全局样式
│   └── archive/           # 每日归档
├── scripts/
│   └── generate.py        # 核心生成脚本
├── templates/
│   └── hub.html           # 首页模板
└── .gitignore
```

## 手动运行

```bash
cd daily-hub && python3 scripts/generate.py
```

## 自动运行

通过 Cursor Automation 定时触发（cron: `0 12 * * *`），配置见 `.cursor/automations/`。
