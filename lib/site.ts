// The verified private review origin is the fallback; override when launching publicly.
const configured = process.env.SITE_URL?.trim() || 'https://priyansh-dobariya-ai-portfolio.yadavkumar49900.chatgpt.site';
if (process.env.ALLOW_INDEXING === 'true' && !process.env.SITE_URL?.trim()) {
  throw new Error('Public indexing requires an explicit SITE_URL. Set your public HTTPS domain before building.');
}
function getSiteUrl() {
  if (!configured) return null;
  const url = new URL(configured);
  if (url.protocol !== 'https:' || url.username || url.password || url.pathname !== '/' || url.search || url.hash) throw new Error('SITE_URL must be an HTTPS origin, e.g. https://your-domain.com');
  return url.origin;
}
export const siteUrl = getSiteUrl();
export const isIndexable = Boolean(siteUrl) && process.env.ALLOW_INDEXING === 'true';
