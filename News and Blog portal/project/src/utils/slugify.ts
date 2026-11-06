export function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export function createArticleId(url: string): string {
  return btoa(url).replace(/[/+=]/g, '').slice(0, 16);
}
