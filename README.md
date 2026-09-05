# 志恒的家 · Daily Hub

个人生活记录的 3D 房子首页。默认上帝视角俯看整屋内外，光影停在下午蓝调时刻。沿一日动线走进房间，会同时看到生活本身和对应的分享内容。

每日 12:00 仍会抓取各子页面摘要，写入 `docs/feed.json` 与卡片目录，**不会覆盖** 3D 首页。

## 房子与内容

| 房间 | 一天里的位置 | 对应分享 |
|------|--------------|----------|
| 卧室 | 07:00 醒来 / 22:40 睡前 | 摄影分享 |
| 卫生间 | 07:25 洗漱 | 生活场景 |
| 厨房 | 07:50 早餐 / 19:00 晚饭 | 生活场景 |
| 餐厅 | 08:15 早餐听播客 | 播客记录 |
| 书房 | 上午：算法、面试、技术、AI、语言、笔记、审美 | 算法 / 面试口述 / 技术学习 / DayAI / 语言 / Bear2Cursor / 审美训练 |
| 客厅 | 下午与夜里：音乐、视频、剧集 | 歌词 / 视频总结 / 影视分析 |
| 阳台 | 17:40 蓝调时刻 | 旅行规划 / 摄影 |

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
| Daily Meet Question | https://chenzhiheng.cn/daily_meet_question/ |
| Daily Design | https://chenzhiheng.cn/daily-design/ |

## 项目结构

```
daily-hub/
├── .cursor/automations/   # Cursor Automation prompt + trigger 文件
├── data/                  # 页面配置、历史记录
├── docs/                  # GitHub Pages 根目录
│   ├── index.html         # 3D 房子首页
│   ├── home.css           # 首页 HUD
│   ├── js/                # Three.js 场景与动线
│   ├── feed.json          # 每日摘要（供房子侧栏读取）
│   ├── list.html          # 卡片目录（自动生成）
│   ├── style.css          # 卡片目录样式
│   └── archive/           # 每日归档
├── scripts/
│   └── generate.py        # 抓取子页面，写入 feed.json + list.html
├── templates/
│   └── hub.html           # 卡片目录模板
└── .gitignore
```

## 手动运行

```bash
python3 scripts/generate.py
```

本地预览 3D 首页：

```bash
python3 -m http.server 4173 --directory docs
```

## 自动运行

通过 Cursor Automation 定时触发（cron: `0 12 * * *`），配置见 `.cursor/automations/`。
