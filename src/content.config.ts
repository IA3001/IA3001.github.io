import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const posts = defineCollection({
	loader: glob({ base: './src/content/posts', pattern: '**/*.md' }),
	schema: z.object({
		title: z.string(),
		tags: z.array(z.string()).default([]),
		categories: z.array(z.string()).default([]),
		published: z.boolean().default(true),
		description: z.string().optional(),
		date: z.coerce.date().optional(),
		updated: z.coerce.date().optional(),
	}),
});

export const collections = { posts };
