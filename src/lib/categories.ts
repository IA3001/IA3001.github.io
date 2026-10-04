import type { CollectionEntry } from 'astro:content';

const directoryLabels: Record<string, string> = {
	algo: 'ALGO',
	cf: 'CF',
	hdu: 'HDU',
	nc: 'NC',
	neu: 'NEU',
	notes: 'Notes',
	vp: 'VP',
	板子: '板子',
};

export function getPostCategories(post: CollectionEntry<'posts'>): string[] {
	return post.data.categories.length > 0 ? post.data.categories : [post.id.split('/')[0]];
}

export function getCategoryLabel(category: string): string {
	return directoryLabels[category.toLowerCase()] ?? category;
}
