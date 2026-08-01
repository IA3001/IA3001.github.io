/**
 * Copy assets referenced by posts from source/_posts/ to public/ at the correct permalink path.
 * Supports Obsidian workflow: posts reference images via relative paths like
 * `assets/xxx/file.png`, and this script resolves them relative to the post's source dir
 * and copies them to the post's permalink dir in public.
 */
const path = require('path');
const fs = require('fs');

// Find all relative image/link references in post content.
// Matches: ![alt](path), [text](path) — only local (non-URL) paths.
function findLocalRefs(content) {
  const refs = [];
  const re = /!?\[([^\]]*)\]\(([^)\s]+)\)/g;
  let m;
  while ((m = re.exec(content)) !== null) {
    const target = m[2];
    // Skip absolute URLs and data URIs
    if (/^(https?:|\/\/|data:|#)/.test(target)) continue;
    // Skip anchor-only links
    if (target.startsWith('#')) continue;
    refs.push({ alt: m[1], target, index: m.index });
  }
  return refs;
}

hexo.extend.filter.register('after_generate', function () {
  // Copy .gitattributes to public for CRLF normalization on gh-pages
  const attrsSrc = path.join(hexo.source_dir, '.gitattributes');
  const attrsDest = path.join(hexo.public_dir, '.gitattributes');
  if (fs.existsSync(attrsSrc)) {
    fs.mkdirSync(hexo.public_dir, { recursive: true });
    fs.copyFileSync(attrsSrc, attrsDest);
    hexo.log.info('[assets] Copied .gitattributes to public');
  }

  const posts = this.locals.get('posts');

  posts.forEach(post => {
    const sourceDir = path.dirname(post.full_source);
    const refs = findLocalRefs(post._content || post.content);

    refs.forEach(ref => {
      // Resolve the referenced file relative to the post's source directory
      const srcPath = path.resolve(sourceDir, ref.target);
      if (!fs.existsSync(srcPath)) return;

      // Determine destination: post's permalink dir in public
      const destRel = path.join(post.path, ref.target);
      const destPath = path.join(hexo.public_dir, destRel);

      if (!fs.existsSync(destPath)) {
        fs.mkdirSync(path.dirname(destPath), { recursive: true });
        fs.copyFileSync(srcPath, destPath);
        hexo.log.info(`[assets] Copied: ${ref.target} → ${destRel}`);
      }
    });
  });
});
