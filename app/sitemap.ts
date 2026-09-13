import type {MetadataRoute} from 'next';
import {siteUrl,isIndexable} from '@/lib/site';
import {projects} from '@/lib/content';
export const dynamic='force-static';
export default function sitemap():MetadataRoute.Sitemap{return siteUrl&&isIndexable?[{url:siteUrl+'/',changeFrequency:'monthly',priority:1},...projects.map(project=>({url:`${siteUrl}/projects/${project.id}/`,changeFrequency:'monthly' as const,priority:.8}))]:[];}
