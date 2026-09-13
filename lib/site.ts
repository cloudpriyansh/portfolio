const configured = process.env.SITE_URL?.trim();
function getSiteUrl() {
  if (!configured) return null;
  const url = new URL(configured);
  if (url.protocol !== 'https:' || url.username || url.password || url.pathname !== '/' || url.search || url.hash) throw new Error('SITE_URL must be an HTTPS origin, e.g. https://your-domain.com');
  return url.origin;
}
export const siteUrl = getSiteUrl();
export const isIndexable = Boolean(siteUrl) && process.env.ALLOW_INDEXING === 'true';
