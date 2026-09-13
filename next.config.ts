import type { NextConfig } from 'next';
const config: NextConfig = { ...(process.env.NODE_ENV === 'production' ? { output: 'export' as const } : {}), images: { unoptimized: true }, poweredByHeader: false, trailingSlash: true, ...(process.env.NODE_ENV === 'development' ? { async rewrites() { return [{ source: '/api/contact', destination: 'http://127.0.0.1:3001/api/contact' }]; } } : {}) };
export default config;
