#!/usr/bin/env python3
"""Daily Hub 生成脚本 —— 抓取子页面内容并生成汇总首页。"""

from __future__ import annotations

import json
import os
import re
import sys
import urllib.request
import urllib.error
from datetime import datetime, timezone, timedelta
from pathlib import Path

# --- 配置 ---
PROJECT_ROOT = Path(__file__).resolve().parent.parent
CONFIG_PATH = PROJECT_ROOT / "data" / "config.json"
HISTORY_PATH = PROJECT_ROOT / "data" / "history.json"
TEMPLATE_PATH = PROJECT_ROOT / "templates" / "hub.html"
OUTPUT_LIST = PROJECT_ROOT / "docs" / "list.html"
OUTPUT_FEED = PROJECT_ROOT / "docs" / "feed.json"
ARCHIVE_DIR = PROJECT_ROOT / "docs" / "archive"

# 北京时间
TZ_SHANGHAI = timezone(timedelta(hours=8))

HEADERS = {
    "User-Agent": "Mozilla/5.0 (compatible; DailyHubBot/1.0; +https://chenzhiheng.cn/daily-hub)"
}


def load_config() -> dict:
    with open(CONFIG_PATH, "r", encoding="utf-8") as f:
        return json.load(f)


def load_history() -> dict:
    if HISTORY_PATH.exists():
        with open(HISTORY_PATH, "r", encoding="utf-8") as f:
            return json.load(f)
    return {}


def save_history(history: dict) -> None:
    with open(HISTORY_PATH, "w", encoding="utf-8") as f:
        json.dump(history, f, ensure_ascii=False, indent=2)


def fetch_page(url: str, timeout: int = 15) -> tuple[str | None, str | None]:
    """抓取页面，返回 (html_content, error_message)。"""
    req = urllib.request.Request(url, headers=HEADERS)
    try:
        with urllib.request.urlopen(req, timeout=timeout) as resp:
            if resp.status != 200:
                return None, f"HTTP {resp.status}"
            content_type = resp.headers.get("Content-Type", "")
            charset = "utf-8"
            match = re.search(r"charset=([\w-]+)", content_type)
            if match:
                charset = match.group(1)
            html = resp.read().decode(charset, errors="replace")
            return html, None
    except urllib.error.URLError as e:
        return None, f"网络错误: {e.reason}"
    except Exception as e:
        return None, f"未知错误: {e}"


def extract_snippet(html: str, max_len: int = 120) -> str:
    """从 HTML 中提取正文摘要。优先级：meta description > h1 > 第一段文字。"""
    # 1) meta description
    m = re.search(
        r'<meta[^>]+name=["\']description["\'][^>]+content=["\']([^"\']+)["\']',
        html, re.IGNORECASE,
    )
    if m:
        return m.group(1).strip()[:max_len]

    # 2) 第一个 h1 / h2
    m = re.search(r"<h[12][^>]*>(.*?)</h[12]>", html, re.IGNORECASE | re.DOTALL)
    if m:
        text = re.sub(r"<[^>]+>", "", m.group(1)).strip()
        if text:
            return text[:max_len]

    # 3) 第一段 p 文本
    m = re.search(r"<p[^>]*>(.*?)</p>", html, re.IGNORECASE | re.DOTALL)
    if m:
        text = re.sub(r"<[^>]+>", "", m.group(1)).strip()
        if text:
            return text[:max_len]

    return ""


def extract_title(html: str) -> str | None:
    """从 HTML 中提取页面标题。"""
    m = re.search(r"<title[^>]*>(.*?)</title>", html, re.IGNORECASE | re.DOTALL)
    if m:
        return re.sub(r"<[^>]+>", "", m.group(1)).strip()
    return None


ROOM_ORDER = [
    "study",
    "living",
    "bedroom",
    "dining",
    "balcony",
    "kitchen",
    "bath",
    "hall",
]

ROOM_NAMES = {
    "study": "书房",
    "living": "客厅",
    "bedroom": "卧室",
    "dining": "餐厅",
    "balcony": "阳台",
    "kitchen": "厨房",
    "bath": "卫生间",
    "hall": "玄关",
}


def group_pages_by_room(pages: list[dict]) -> list[dict]:
    grouped: dict[str, list[dict]] = {}
    extras: list[dict] = []
    for page in pages:
        room = page.get("room") or ""
        if room in ROOM_NAMES:
            grouped.setdefault(room, []).append(page)
        else:
            extras.append(page)
    rooms = [
        {"id": room_id, "name": ROOM_NAMES[room_id], "pages": grouped[room_id]}
        for room_id in ROOM_ORDER
        if grouped.get(room_id)
    ]
    if extras:
        rooms.append({"id": "other", "name": "其他", "pages": extras})
    return rooms


def _render_page_block(template: str, page: dict) -> str:
    block = _strip_if_blocks(template, page)
    for pk, pv in page.items():
        if isinstance(pv, str):
            block = block.replace(f"{{{{ page.{pk} }}}}", pv)
    return block


def _find_for_block(text: str, open_tag: str) -> tuple[int, int, int, int] | None:
    """返回 (open_start, inner_start, inner_end, close_end)，按嵌套匹配 endfor。"""
    start = text.find(open_tag)
    if start < 0:
        return None
    inner_start = start + len(open_tag)
    depth = 1
    pos = inner_start
    while True:
        nxt_for = text.find("{% for ", pos)
        nxt_end = text.find("{% endfor %}", pos)
        if nxt_end < 0:
            return None
        if nxt_for >= 0 and nxt_for < nxt_end:
            depth += 1
            pos = nxt_for + 7
            continue
        depth -= 1
        close_end = nxt_end + len("{% endfor %}")
        if depth == 0:
            return start, inner_start, nxt_end, close_end
        pos = close_end


def render_template(template: str, context: dict) -> str:
    """简易模板渲染（避免额外依赖）。处理 {{ var }} 和 {% for %} {% if %} 块。"""
    result = template
    for key, value in context.items():
        if isinstance(value, str):
            result = result.replace(f"{{{{ {key} }}}}", value)

    room_span = _find_for_block(result, "{% for room in rooms %}")
    if room_span:
        start, inner_start, inner_end, close_end = room_span
        room_template = result[inner_start:inner_end]
        rendered_rooms = []
        for room in context.get("rooms", []):
            block = room_template
            page_span = _find_for_block(block, "{% for page in room.pages %}")
            if page_span:
                p_start, p_inner, p_end, p_close = page_span
                page_blocks = [
                    _render_page_block(block[p_inner:p_end], page)
                    for page in room.get("pages", [])
                ]
                block = block[:p_start] + "\n".join(page_blocks) + block[p_close:]
            block = block.replace("{{ room.name }}", room.get("name", ""))
            block = block.replace("{{ room.id }}", room.get("id", ""))
            rendered_rooms.append(block)
        result = result[:start] + "\n".join(rendered_rooms) + result[close_end:]

    page_span = _find_for_block(result, "{% for page in pages %}")
    if page_span:
        start, inner_start, inner_end, close_end = page_span
        rendered_blocks = [
            _render_page_block(result[inner_start:inner_end], page)
            for page in context.get("pages", [])
        ]
        result = result[:start] + "\n".join(rendered_blocks) + result[close_end:]
    return result


def _strip_if_blocks(block: str, page: dict) -> str:
    """移除 {% if page.X %} ... {% endif %} 标签，保留内部内容（因为字段值已预填）。"""
    # 匹配 {% if page.xxx %} 任意内容 {% endif %}
    block = re.sub(
        r"\{% if page\.\w+ %\}",
        "",
        block,
    )
    block = re.sub(
        r"\{% endif %\}",
        "",
        block,
    )
    return block


def generate() -> None:
    now = datetime.now(TZ_SHANGHAI)
    date_str = now.strftime("%Y-%m-%d")
    datetime_str = now.strftime("%Y-%m-%d %H:%M:%S")

    config = load_config()
    sub_pages = config["sub_pages"]

    print(f"[{datetime_str}] 开始抓取 {len(sub_pages)} 个子页面...")

    page_data = []
    for page in sub_pages:
        print(f"  → {page['name']} ({page['url']})")
        html, error = fetch_page(page["url"])
        snippet = ""
        updated_at = ""
        if html:
            snippet = extract_snippet(html)
            title = extract_title(html)
            if title:
                updated_at = f"标题: {title}"
        page_data.append(
            {
                "id": page["id"],
                "emoji": page["emoji"],
                "name": page["name"],
                "url": page["url"],
                "description": page["description"],
                "snippet": snippet,
                "error": error if error else "",
                "updated_at": updated_at,
                "room": page.get("room", ""),
            }
        )

    # 读取模板
    with open(TEMPLATE_PATH, "r", encoding="utf-8") as f:
        template = f.read()

    context = {
        "site_title": config["site"]["title"],
        "site_description": config["site"]["description"],
        "date": date_str,
        "generated_at": datetime_str,
        "pages": page_data,
        "rooms": group_pages_by_room(page_data),
    }

    html_output = render_template(template, context)

    # 卡片目录（不覆盖 3D 首页 docs/index.html）
    OUTPUT_LIST.parent.mkdir(parents=True, exist_ok=True)
    with open(OUTPUT_LIST, "w", encoding="utf-8") as f:
        f.write(html_output)
    print(f"  ✓ 卡片目录已生成: {OUTPUT_LIST}")

    feed = {
        "generated_at": datetime_str,
        "date": date_str,
        "pages": [
            {
                "id": p["id"],
                "name": p["name"],
                "url": p["url"],
                "description": p["description"],
                "snippet": p["snippet"],
                "error": p["error"],
                "updated_at": p["updated_at"],
                "room": p["room"],
            }
            for p in page_data
        ],
    }
    with open(OUTPUT_FEED, "w", encoding="utf-8") as f:
        json.dump(feed, f, ensure_ascii=False, indent=2)
    print(f"  ✓ 内容源已生成: {OUTPUT_FEED}")

    # 写入归档
    ARCHIVE_DIR.mkdir(parents=True, exist_ok=True)
    archive_path = ARCHIVE_DIR / f"{date_str}.html"
    archive_html = (
        html_output.replace('href="style.css"', 'href="../style.css"')
        .replace('href="./"', 'href="../"')
        .replace('href="archive/"', 'href="./"')
    )
    with open(archive_path, "w", encoding="utf-8") as f:
        f.write(archive_html)
    print(f"  ✓ 归档已保存: {archive_path}")

    # 更新历史
    history = load_history()
    history[date_str] = {
        "generated_at": datetime_str,
        "pages_count": len(page_data),
        "errors": [p["name"] for p in page_data if p["error"]],
    }
    save_history(history)
    print(f"  ✓ 历史已更新")

    # 失败数汇总
    errors = [p["name"] for p in page_data if p["error"]]
    if errors:
        print(f"  ⚠ 抓取失败的页面: {', '.join(errors)}")
    else:
        print(f"  🎉 全部 {len(page_data)} 个页面抓取成功")

    print(f"[{datetime_str}] 生成完成")


if __name__ == "__main__":
    generate()
