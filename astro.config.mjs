// @ts-check

import sitemap from '@astrojs/sitemap';
import { satteri } from '@astrojs/markdown-satteri';
import { defineConfig } from 'astro/config';
import { satteriKatex } from 'satteri-katex';

// https://astro.build/config
export default defineConfig({
	site: 'https://IA3001.github.io',
	integrations: [sitemap()],
	markdown: {
		processor: satteri({
			features: { math: true },
			mdastPlugins: [satteriKatex({ strict: 'ignore' })],
		}),
	},
});
