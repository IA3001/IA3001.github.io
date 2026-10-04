# IA3001 博客项目说明

本项目使用 Astro 生成静态博客，部署到 `https://IA3001.github.io`。

## 常用命令

- `npm run dev`：本地预览，地址为 `http://localhost:4321/`。
- `npm run build`：构建网站到 `dist/`。
- `npm run preview`：预览构建后的站点。

## 目录分工

- `src/content/posts/`：Markdown 文章。按比赛、赛季等建文件夹；层级会成为文章路径的一部分。
- `src/pages/`：页面路由。这里包含首页、文章、归档、分类、友链、地图和标签。
- `src/components/`：多个页面共用的界面模块，例如导航栏、目录树和文章 TOC。
- `src/layouts/BlogPost.astro`：文章页面共同使用的外框。
- `src/data/friends.ts`：友链名称、网址、图标和介绍。
- `src/lib/`：供页面调用的文章信息与目录处理函数。
- `src/styles/global.css`：全站 CSS。
- `public/`：原样复制到网站的静态文件。
- `my/`：本地私有材料，包括 Typst 源稿和 Excalidraw 手稿；此目录被 Git 忽略，不会发布。

## 文章规则

文章使用 Markdown 和 Astro 配置的 Sätteri / KaTeX 渲染。Frontmatter 使用 `title`、`tags`、`published`，也可使用 `date`、`updated`、`categories`、`description`。设为 `published: false` 的文章不会出现在公开页面。

## 发布流程

`.github/workflows/deploy-astro.yml` 会在 `main` 分支的博客文件变更后构建并发布 `dist/`。不要提交 `dist/` 或 `.astro/` 生成文件。
