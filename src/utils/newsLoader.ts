import type { ComponentType } from 'react';
import matter from 'gray-matter';

export interface NewsArticle {
  slug: string;
  title: string;
  date: string;
  category: 'Press Release' | 'Blog' | 'Industry News';
  author: string;
  excerpt: string;
  Component: ComponentType;
}

const rawFiles = import.meta.glob('/src/content/news/*.mdx', { query: '?raw', import: 'default', eager: true }) as Record<string, string>;
const mdxModules = import.meta.glob('/src/content/news/*.mdx', { eager: true }) as Record<string, { default: ComponentType }>;

export function getAllArticles(): NewsArticle[] {
  const articles: NewsArticle[] = [];

  for (const path in rawFiles) {
    const raw = rawFiles[path];
    const { data } = matter(raw);
    const slug = path.replace('/src/content/news/', '').replace('.mdx', '');
    const mod = mdxModules[path];

    articles.push({
      slug,
      title: data.title,
      date: data.date,
      category: data.category,
      author: data.author,
      excerpt: data.excerpt,
      Component: mod.default,
    });
  }

  return articles.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export function getArticleBySlug(slug: string): NewsArticle | undefined {
  return getAllArticles().find((a) => a.slug === slug);
}
