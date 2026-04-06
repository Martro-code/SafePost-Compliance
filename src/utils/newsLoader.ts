import type { ComponentType } from 'react';

export interface NewsArticle {
  slug: string;
  title: string;
  date: string;
  category?: string;
  author: string;
  excerpt: string;
  Component: ComponentType;
}

interface MdxModule {
  default: ComponentType;
  frontmatter: {
    title: string;
    date: string;
    category?: string;
    author: string;
    excerpt: string;
  };
}

const mdxModules = import.meta.glob('../content/news/*.mdx', { eager: true }) as Record<string, MdxModule>;

export function getAllArticles(): NewsArticle[] {
  const articles: NewsArticle[] = [];

  for (const path in mdxModules) {
    const mod = mdxModules[path];
    const { frontmatter } = mod;
    if (!frontmatter) continue;
    const slug = path.replace('../content/news/', '').replace('.mdx', '');

export function getAllArticles() {
  const articles = [];
  for (const path in modules) {
    const mod = modules[path] as any;
    const slug = path.split('/').pop()?.replace('.mdx', '') ?? '';
    articles.push({
      slug,
      title: frontmatter.title,
      date: frontmatter.date,
      category: frontmatter.category ?? 'Blog',
      author: frontmatter.author,
      excerpt: frontmatter.excerpt,
      Component: mod.default,
    });
  }
  return articles.sort((a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export function getArticleBySlug(slug: string) {
  return getAllArticles().find((a: any) => a.slug === slug);
}
