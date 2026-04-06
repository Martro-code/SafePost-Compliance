const modules = import.meta.glob('/src/content/news/*.mdx', { eager: true });

export function getAllArticles() {
  const articles = [];
  for (const path in modules) {
    const mod = modules[path] as any;
    const slug = path.split('/').pop()?.replace('.mdx', '') ?? '';
    articles.push({
      slug,
      ...mod.frontmatter,
      Component: mod.default,
    });
  }
  return articles.sort((a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export function getArticleBySlug(slug: string) {
  return getAllArticles().find((a: any) => a.slug === slug);
}
