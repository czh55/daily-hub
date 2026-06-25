# Daily Hub - Agent 完整 Prompt

## 执行步骤

### 1. 运行生成脚本

```bash
cd daily-hub && python3 scripts/generate.py
```

该脚本会：
- 从 `data/config.json` 读取 6 个子页面配置
- 依次 HTTP GET 每个子页面的 URL
- 从返回的 HTML 中提取标题和正文摘要
- 渲染 `templates/hub.html` 模板生成汇总页面
- 输出到 `docs/index.html`
- 同时保存归档副本到 `docs/archive/YYYY-MM-DD.html`
- 更新 `data/history.json` 记录生成状态

### 2. 检查结果

确认以下文件已更新：
- `docs/index.html` — 首页内容已刷新
- `docs/archive/YYYY-MM-DD.html` — 归档副本已生成
- `data/history.json` — 历史记录已追加

### 3. 提交并推送

```bash
cd daily-hub && git add -A && git commit -m "daily: $(date +%Y-%m-%d) 每日汇总" && git push origin main
```

### 4. 验证部署

确认 GitHub Pages URL 可正常访问：`https://chenzhiheng.cn/daily-hub`

## 讲解/生成准则

- 每个子页面用心跳检测，失败不中断整体流程，记录错误原因
- 摘要提取优先级：meta description → h1/h2 → 第一段 p 文本
- 请求超时设为 15 秒，避免单个子页面拖慢全程
- 生成时间以北京时间（UTC+8）为准

## 异常处理

| 问题 | 处理 |
|------|------|
| 某个子页面 HTTP 错误 | 卡片显示错误原因，不影响其他页面汇总 |
| 网络不可达 | 所有卡片显示网络错误，依然提交页面（保留上一次有效内容） |
| git push 失败 | 先 `git pull --rebase origin main` 解决冲突，再 push |
| Python 依赖缺失 | 该脚本仅用标准库（json, urllib, re），无需 pip install |
