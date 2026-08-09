/**
 * Generate the contest "map" page (/map/) at build time.
 * Groups published contest posts by series → season → contest, and lists each
 * problem heading with an anchor link into the post, so the blog has an
 * overview of every contest and its covered problems.
 *
 * Non-contest directories (Templates / Excalidraw / Notes / 板子) are skipped.
 */
const path = require('path');
const { slugize } = require('hexo-util');

// Directories under source/_posts/ that are not contest posts.
const SKIP_DIRS = new Set(['Templates', 'Excalidraw', 'Notes', '板子', '.obsidian']);

hexo.extend.generator.register('map', function (locals) {
  const groups = [];
  const groupMap = new Map(); // series -> { name, subs: [{ name, contests }] }

  locals.posts.forEach((post) => {
    if (!post.published) return;

    const rel = path.relative(hexo.source_dir, post.full_source).split(path.sep);
    const postsIdx = rel.indexOf('_posts');
    if (postsIdx === -1) return;
    const parts = rel.slice(postsIdx + 1); // ['HDU', '2026Summer', 'contest01.md']
    const dir = parts.slice(0, -1);
    if (dir.length === 0) return;

    const series = dir[0];
    if (SKIP_DIRS.has(series)) return;
    const sub = dir.length > 1 ? dir[1] : null; // 赛季 / daily 等

    // Extract problem headings (`## 题号 题名`) from the raw markdown.
    const problems = [];
    const raw = post._content || post.content || '';
    raw.split('\n').forEach((line) => {
      const m = line.match(/^##\s+(.+?)\s*$/);
      if (m) {
        const text = m[1].trim();
        problems.push({ text, anchor: slugize(text) });
      }
    });

    if (!groupMap.has(series)) {
      const g = { name: series, id: slugize(series), subs: [], subMap: new Map() };
      groupMap.set(series, g);
      groups.push(g);
    }
    const g = groupMap.get(series);
    const subName = sub || '未分类';
    if (!g.subMap.has(subName)) {
      const s = { name: sub, id: sub ? slugize(sub) : null, contests: [] };
      g.subMap.set(subName, s);
      g.subs.push(s);
    }
    const s = g.subMap.get(subName);
    s.contests.push({ title: post.title, url: post.path, problems });
  });

  // Stable ordering: series → season → contest title.
  groups.sort((a, b) => a.name.localeCompare(b.name));
  groups.forEach((g) => {
    g.subs.sort((a, b) => (a.name || '').localeCompare(b.name || ''));
    g.subs.forEach((s) => s.contests.sort((a, b) => a.title.localeCompare(b.title)));
  });

  return {
    path: 'map/index.html',
    layout: ['map', 'page', 'index'],
    data: { groups: groups.map((g) => ({ name: g.name, id: g.id, subs: g.subs })) },
  };
});
