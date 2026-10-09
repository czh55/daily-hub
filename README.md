# 志恒的家 · Daily Hub

个人生活记录的 3D 房子首页。默认上帝视角俯看整屋内外，光影停在下午蓝调时刻。沿一日动线走进房间，会同时看到生活本身和对应的分享内容。

每日 12:00 仍会抓取各子页面摘要，写入 `docs/feed.json` 与卡片目录，**不会覆盖** 3D 首页。

## 房子与内容

| 房间 | 一天里的位置 | 对应分享 |
|------|--------------|----------|
| 卧室 | 07:00 醒来 / 22:40 睡前 | 摄影分享 / 图片画廊 |
| 卫生间 | 07:25 洗漱 | 生活场景 |
| 厨房 | 07:50 早餐 / 19:00 晚饭 | 生活场景 |
| 餐厅 | 08:15 早餐听播客 | 播客记录 / 才岁播客 |
| 书房 | 上午：算法、面试、技术、AI、流水线、语言、笔记、审美 | 算法 / 面试口述 / 表达系统 / 技术学习 / DayAI / My Pipeline / 语言 / 英语四模块 / Bear2Cursor / 审美训练 |
| 客厅 | 下午与夜里：音乐、视频、剧集 | 歌词 / 视频总结 / 影视分析 |
| 阳台 | 17:40 蓝调时刻 | 旅行攻略 / 摄影 / 图片画廊 / 一百件事 |

## 分类维度

三套轴彼此正交，互不覆盖：

| 轴 | 字段 | 回答的问题 |
|----|------|------------|
| 生活坐标 | `room` | 落在一天的哪一段 |
| 能力坐标 | `track`（仅书房） | 硬功 / 开口 / 修养 |
| 内容生态 | `flow` × `media` | 相对本人是输入 / 输出 / 进出；载体是文字 / 声音 / 图片 / 视频 |

目录页可按「输入 · 输出 · 进出」筛选；房子侧栏条目下会显示对应标签。

## 子页面

| 名称 | URL |
|------|-----|
| Daily Photos | https://chenzhiheng.cn/daily-photos/ |
| Daily Algo | https://chenzhiheng.cn/daily-algo/ |
| Audio Workshop | https://chenzhiheng.cn/audio-workshop/ |
| Daily Lyric Learning | https://chenzhiheng.cn/daily-lyric-learning/ |
| Daily Tech Learning | https://chenzhiheng.cn/daily-tech-learning/ |
| DayAI | https://chenzhiheng.cn/DayAI/ |
| Video Notes | https://chenzhiheng.cn/video-notes/ |
| Language Paraphrase | https://chenzhiheng.cn/language_paraphrase/ |
| Drama Analysis | https://chenzhiheng.cn/drama-analysis/ |
| Tour Map | https://chenzhiheng.cn/tour_map/ |
| Bear2Cursor | https://chenzhiheng.cn/bear2cursor/ |
| Daily Meet Question | https://chenzhiheng.cn/daily_meet_question/ |
| Daily Design | https://chenzhiheng.cn/daily-design/ |
| My Podcast | https://chenzhiheng.cn/my_podcast/ |
| English System | https://chenzhiheng.cn/english-system/ |
| Express System | https://chenzhiheng.cn/express_system/ |
| My Pipeline | https://chenzhiheng.cn/my_pipeline/pipelines/ |
| Image Show | https://chenzhiheng.cn/image_show/ |
| Plan 100 | https://chenzhiheng.cn/plan_100/ |

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
