import type {MetadataRoute} from 'next';
import {siteUrl,isIndexable} from '@/lib/site';
export const dynamic='force-static';
export default function sitemap():MetadataRoute.Sitemap{return siteUrl&&isIndexable?[{url:siteUrl+'/',lastModified:new Date(),changeFrequency:'monthly',priority:1}]:[];}
