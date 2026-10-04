# IA3001 的博客

这是一个使用 Astro 生成的静态博客，发布地址是 [IA3001.github.io](https://IA3001.github.io)。文章使用 Markdown 编写，保留比赛、赛季等文件夹层级。

## 本地运行

```sh
npm ci
npm run dev
```

打开 `http://localhost:4321/`。

## 构建和预览

```sh
npm run build
npm run preview
```

构建结果放在 `dist/`，不需要手动提交它。

## 目录说明

- `src/content/posts/`：博客文章。文件夹层级会保留在文章网址中。
- `src/pages/`：首页、文章、归档、分类、友链、地图和标签页面。
- `src/components/`：页面共用部分，例如导航栏、目录树和文章 TOC。
- `src/layouts/BlogPost.astro`：文章页面的共同布局。
- `src/data/friends.ts`：友链卡片的数据。
- `src/lib/`：页面使用的文章和目录辅助函数。
- `src/styles/global.css`：全站样式。
- `public/`：网站图标等静态文件。
- `my/`：本地私有素材，例如 Typst 源稿和 Excalidraw 手稿，不会发布到网站。

## 发布

把改动提交并推送到 `main` 后，GitHub Actions 会自动构建 Astro 并发布到 GitHub Pages。工作流配置在 `.github/workflows/deploy-astro.yml`。
