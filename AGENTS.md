# AGENTS.md — IA3001's Blog

个人 ACM 补题题解博客：Hexo 8 + markdown-it + KaTeX，主题 `pure`，用 Obsidian 编辑，deploy 到 GitHub Pages。博客内容为中文，题目/代码为原样。

## Project

- 入口：`source/_posts/`，按 `比赛名/赛季/contestNN.md` 组织（如 `HDU/2026Summer/contest01.md`）。
- 源稿（gitignored，勿提交）：`my/TheArtOfCP/` — Typst 写的题解，按知识点分文件（`content/01_DP.typ` 动态规划、`02_String`、`03_Math`、`04_DS`、`05_Graph`、`06_Geometry`、`07_Others`、`08_Repentance`、`09_templates`、`notes`）。Typst 标题自带比赛路径，如 `== HDU/2026Spring/warm_up/1004 小z的开箱`、`== CF2209F Dynamic Values And Maximum Sum`。
- 站点配置：`_config.yml`（`theme: pure`，KaTeX 插件，`url: https://IA3001.github.io`）。

## Commands

- `npm run dev` — 本地预览（hexo clean && hexo server -p 4000）
- `npm run build` — 生成静态站到 `public/`
- `npm run deploy` — 构建并推送 gh-pages（deploy 仓库为 IA3001.github.io）
- `npm run clean` — 清理 `public/`

## Architecture

- `source/_posts/HDU/`、`NC/` — 已发布的比赛题解（每场一个 `contestNN.md`，NN 为场次号）。
- `source/_posts/Templates/` — 题解模板。**统一用 `HDUTemplate.md` 风格；`NCTemplate.md` 已废弃，不要再用**。
- `source/_posts/板子/` — 代码板子（如 FastIO），与题解模板区分开。
- `source/_posts/Notes/` — 非比赛知识笔记（如扫描线方法论），按默认发布。
- `source/_posts/Excalidraw/` — Excalidraw 手稿，由 `scripts/hide-excalidraw.js` 强制隐藏 + `_config.yml` ignore，不发布。
- `scripts/gen-map.js` — 构建时自动生成"比赛地图"页 `/map/`（比赛系列 → 赛季 → 每场比赛 → 题目锚点链接），只收录 `published: true` 的比赛文章，跳过 Templates/Excalidraw/Notes/板子。新文章发布后自动入图，无需维护。
- `scripts/copy-assets.js` — 把文章里相对路径引用的图片（`assets/xxx/file.png`）复制到 public 对应 permalink 目录；图片放在文章所在目录的 `assets/<post>/` 下。
- `my/TheArtOfCP/` — Typst 源稿（gitignore），搬运的素材来源。

## Conventions

- Front-matter：`title`（官方全名）、`tags`、`published`。HDU 用 `[杭电多校, HDU]`，NC 用 `[牛客多校, NC]`，CF 用 `[Codeforces, CF]`，NEU 用 `[NEU]`。**新搬运的文章默认 `published: true`**；只有模板（`Templates/`）和明确待定的文章才 `published: false`。
- 一篇文章一场比赛；每道题一个 `## 题号 题名`（HDU 是数字 `1001`，NC 是字母 `A`），题内小节用 HDU 模板：`### Problem Description` / `Input` / `Output` / `Sample Input`(` ```txt `) / `Sample Output` / `Hint` / `Solution` / `Code`(` ```cpp `)。标题空 `###` 段（如没有 Hint）就省略。
- 数学公式用 KaTeX 的 `$...$`；**搬运 Typst 时数学语法要转 KaTeX**（如 `<=`→`\le`、`*`→`\times`、`#"字符串"`→`\text{...}`、`cases(...)`→`\begin{cases}...`、`sum_(...)`→`\sum_{...}`、下标 `T'_"r"`→`T'_r`）。块映射：`#note[题面]`→`### Problem Description`，`#tip[思路]`→`### Solution`，`#warn[踩坑]`→Solution 内 **踩坑** 小节，`#algo("标签")`→Solution 开头 **算法名 + 复杂度** 一行，`#UNK/#WA/#TLE` 等 tag→**加粗**标签（`**UNK**`）。正文**一律不用斜体**；Typst 的 `*强调*` → **加粗**，算法/数据结构等关键技术术语（如 exKMP、lcp）同样加粗。无代码的题就省略 `### Code` 段。
- 代码块 ` ```cpp `，正文中文。
- 命名规则（已定）：文件 `比赛名/赛季/contestNN.md`，title 用官方全名（如 `2026"钉耙编程"中国大学生算法设计暑期联赛（1）`）；warm_up 用 `HDU/2026Spring/warm_up.md`；CF 单独建 `source/_posts/CF/<round>.md`（round 为场次号），title 用 `Codeforces Round <round>`；NEU 按新系列 `NEU/2026Spring/contestNN.md`，tags 用 `[NEU]`；牛客单题（无场次）用 `NC/daily/<题号>.md`，title 用题名。

## Notes

- 已完成：`my/TheArtOfCP` 的 Typst 题解已全部按比赛场次搬运到 `source/_posts/`（01~09 + notes 均已处理；06_Geometry 为空跳过）。搬运用 `my/TheArtOfCP/guide.md` 的整理思路（只留数学模型、精简），题解思路保留 Typst 里的 `#tip` 内容。
- HDU 2026Spring 各场次 title 已用官方名：`2026"钉耙编程"中国大学生算法设计春季联赛（N）`（warm_up 为（热身））；NEU 2026Spring 各场次 title 仍为占位（`NEU 2026Spring（N）`），待补官方名。
- 待办：`Templates/NCTemplate.md` 删除或标注废弃；存量 NC 文章若与新模板不一致，是否回填统一模板待定。
