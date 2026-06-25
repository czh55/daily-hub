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
OUTPUT_INDEX = PROJECT_ROOT / "docs" / "index.html"
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


def render_template(template: str, context: dict) -> str:
    """简易模板渲染（避免额外依赖）。处理 {{ var }} 和 {% for %} {% if %} 块。"""
    result = template
    for key, value in context.items():
        if isinstance(value, str):
            result = result.replace(f"{{{{ {key} }}}}", value)

    # 处理循环块 {% for page in pages %} ... {% endfor %}
    loop_match = re.search(
        r"\{% for page in pages %\}(.*?)\{% endfor %\}",
        result, re.DOTALL,
    )
    if loop_match:
        loop_template = loop_match.group(1)
        rendered_blocks = []
        for page in context.get("pages", []):
            block = loop_template
            # 先移除 if 块（全部展开，因为 page 字段已提前填充好）
            block = _strip_if_blocks(block, page)
            for pk, pv in page.items():
                if isinstance(pv, str):
                    block = block.replace(f"{{{{ page.{pk} }}}}", pv)
            rendered_blocks.append(block)
        result = (
            result[: loop_match.start()]
            + "\n".join(rendered_blocks)
            + result[loop_match.end() :]
        )
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
                "emoji": page["emoji"],
                "name": page["name"],
                "url": page["url"],
                "description": page["description"],
                "snippet": snippet,
                "error": error if error else "",
                "updated_at": updated_at,
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
    }

    html_output = render_template(template, context)

    # 写入首页
    OUTPUT_INDEX.parent.mkdir(parents=True, exist_ok=True)
    with open(OUTPUT_INDEX, "w", encoding="utf-8") as f:
        f.write(html_output)
    print(f"  ✓ 首页已生成: {OUTPUT_INDEX}")

    # 写入归档
    ARCHIVE_DIR.mkdir(parents=True, exist_ok=True)
    archive_path = ARCHIVE_DIR / f"{date_str}.html"
    with open(archive_path, "w", encoding="utf-8") as f:
        f.write(html_output)
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
