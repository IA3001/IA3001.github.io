const fs = require('fs');
const path = require('path');

/**
 * Completely hide Excalidraw content from the site.
 * 1. Mark posts as unpublished (before_post_render, high priority)
 * 2. Remove category/tag from models (before_generate)
 * 3. Delete physical files from public (after_generate, as safety net)
 */

// Step 1: Hide posts early, before auto-category runs
hexo.extend.filter.register('before_post_render', function (data) {
  if (isExcalidraw(data)) {
    data.published = false;
  }
  return data;
}, 1);

function isExcalidraw(data) {
  if (data.excalidraw_plugin === 'parsed' || data['excalidraw-plugin'] === 'parsed') return true;
  if (data.source && data.source.startsWith('_posts/Excalidraw/')) return true;
  return false;
}

// Step 2: Purge Excalidraw category & tag from models before page generation
hexo.extend.filter.register('before_generate', function () {
  const Category = hexo.model('Category');
  const Tag = hexo.model('Tag');

  if (Category) {
    const cat = Category.findOne({ name: 'Excalidraw' });
    if (cat) {
      Category.removeById(cat._id);
      hexo.log.info('[excalidraw] Purged category: Excalidraw');
    }
  }

  if (Tag) {
    const tag = Tag.findOne({ name: 'excalidraw' });
    if (tag) {
      Tag.removeById(tag._id);
      hexo.log.info('[excalidraw] Purged tag: excalidraw');
    }
  }
});

// Step 3: Remove their routes & force categories overview page to regenerate
hexo.extend.filter.register('before_generate', function () {
  ['categories/Excalidraw', 'tags/excalidraw', 'categories/index.html', 'tags/index.html', 'archives/index.html'].forEach(p => {
    const route = hexo.route.get(p);
    if (route) {
      hexo.route.remove(p);
      hexo.log.info('[excalidraw] Removed route: ' + p);
    }
  });
});

// Step 4: Safety net — delete physical files from public/
hexo.extend.filter.register('after_generate', function () {
  ['categories/Excalidraw', 'tags/excalidraw'].forEach(p => {
    const f = path.join(hexo.public_dir, p, 'index.html');
    if (fs.existsSync(f)) { fs.unlinkSync(f); hexo.log.info('[excalidraw] Deleted file: ' + p); }
  });
});
