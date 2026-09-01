# Daily Hub — 每日汇总

每日 12:00 自动抓取 11 个子页面最新内容，生成汇总首页，托管于 GitHub Pages。

## 子页面

| 名称 | URL |
|------|-----|
| Daily Photos | https://chenzhiheng.cn/daily-photos/ |
| Daily Algo | https://chenzhiheng.cn/daily-algo/ |
| Audio Workshop | https://chenzhiheng.cn/audio-workshop/ |
| Daily Lyric Learning | https://chenzhiheng.cn/daily-lyric-learning/ |
| Daily Tech Learning | https://chenzhiheng.cn/daily-tech-learning/ |
| DayAI | https://chenzhiheng.cn/DayAI/ |
| Bilibili Workshow | https://chenzhiheng.cn/bilibili-workshow/ |
| Language Paraphrase | https://chenzhiheng.cn/language_paraphrase/ |
| Drama Analysis | https://chenzhiheng.cn/drama-analysis/ |
| Tour Map | https://chenzhiheng.cn/tour_map/ |
| Bear2Cursor | https://chenzhiheng.cn/bear2cursor/ |

## 项目结构

```
daily-hub/
├── .cursor/automations/   # Cursor Automation prompt + trigger 文件
├── data/                  # 页面配置、历史记录
├── docs/                  # GitHub Pages 根目录
│   ├── index.html         # 3D 居家个人首页（静态）
│   ├── css/home.css       # 首页样式
│   ├── js/                # Three.js 场景与 UI
│   ├── hub/               # 每日汇总（自动生成）
│   │   ├── index.html
│   │   └── style.css
│   ├── style.css          # 汇总页样式（根目录保留）
│   └── archive/           # 每日归档
├── scripts/
│   └── generate.py        # 核心生成脚本
├── templates/
│   └── hub.html           # 汇总页模板
└── .gitignore
```

## 个人首页

`docs/index.html` 为 3D 居家场景首页：蓝调时刻光影、实木低亮度材质、上帝视角俯瞰全屋，沿「一日动线」漫游各房间并关联内容子站。

- **俯瞰** — 返回上帝视角
- **一日动线** — 按生活时间顺序自动导览（卧室→厨房→书房→客厅→阅读角→阳台→旅行角）
- **每日汇总** — 跳转至 `hub/` 自动生成的卡片汇总页

## 手动运行

```bash
cd daily-hub && python3 scripts/generate.py
```

## 自动运行

通过 Cursor Automation 定时触发（cron: `0 12 * * *`），配置见 `.cursor/automations/`。
