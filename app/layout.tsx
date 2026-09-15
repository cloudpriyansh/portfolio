import type { Metadata, Viewport } from 'next';
import localFont from 'next/font/local';
import { profile } from '@/lib/content';
import { siteUrl,isIndexable } from '@/lib/site';
import './globals.css';
const sans=localFont({src:'../public/fonts/dm-sans.woff2',variable:'--font-sans',weight:'400 700',display:'swap'});
const heading=localFont({src:'../public/fonts/manrope.woff2',variable:'--font-heading',weight:'400 800',display:'swap'});
const serif=localFont({src:[{path:'../public/fonts/instrument-serif.woff2',weight:'400',style:'normal'},{path:'../public/fonts/instrument-serif-italic.woff2',weight:'400',style:'italic'}],variable:'--font-serif',display:'swap'});
export const metadata:Metadata={
  ...(siteUrl?{metadataBase:new URL(siteUrl),alternates:{canonical:'/'}}:{}),
  title:'Priyansh Dobariya — Full-Stack & Applied AI Engineer',description:profile.description,
  applicationName:'Priyansh Dobariya Portfolio',authors:[{name:profile.name,...(siteUrl?{url:siteUrl}:{})}],creator:profile.name,
  keywords:['Priyansh Dobariya','Full-stack developer','React','Next.js','Node.js','NestJS','Redis','PostgreSQL','MongoDB','Applied AI Engineer','LLM systems','RAG engineer','AI agents','AI automation','LangGraph','Python','FastAPI','Stripe payments','RAG pipelines','Vector databases','n8n workflows','NestJS microservices','AWS deployment','Multi-agent architecture','LLM observability'],
  robots:{index:isIndexable,follow:isIndexable,googleBot:{index:isIndexable,follow:isIndexable,'max-image-preview':'large','max-snippet':-1,'max-video-preview':-1}},
  openGraph:{type:'website',locale:'en_IN',siteName:'Priyansh Dobariya',title:'Priyansh Dobariya — Full-Stack & Applied AI Engineer',description:profile.description,...(siteUrl?{url:siteUrl,images:[{url:`${siteUrl}/og.png`,width:1200,height:630,alt:'Priyansh Dobariya — Full-Stack & Applied AI Engineer'}]}:{})},
  twitter:{card:'summary_large_image',title:'Priyansh Dobariya — Full-Stack & Applied AI Engineer',description:profile.description,...(siteUrl?{images:[`${siteUrl}/og.png`]}:{})},
  icons:{icon:[{url:'/favicon.svg',type:'image/svg+xml'}],apple:'/apple-touch-icon.png'},
  verification:{google:process.env.GOOGLE_SITE_VERIFICATION,other:process.env.BING_SITE_VERIFICATION?{'msvalidate.01':process.env.BING_SITE_VERIFICATION}:{}},
  category:'technology',referrer:'strict-origin-when-cross-origin',
};
export const viewport:Viewport={width:'device-width',initialScale:1,themeColor:[{media:'(prefers-color-scheme: light)',color:'#f8f8f2'},{media:'(prefers-color-scheme: dark)',color:'#121d25'}]};
const themeScript=`try{const d=document.documentElement;d.dataset.theme=localStorage.getItem('portfolio-theme')||(matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light');d.dataset.motion=localStorage.getItem('portfolio-motion')||'running'}catch{}`;
export default function RootLayout({children}:Readonly<{children:React.ReactNode}>){return <html lang="en" data-scroll-behavior="smooth" suppressHydrationWarning className={`${sans.variable} ${heading.variable} ${serif.variable}`}><head><script dangerouslySetInnerHTML={{__html:themeScript}}/></head><body>{children}</body></html>;}
