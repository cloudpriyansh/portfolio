import type { Metadata, Viewport } from 'next';
import { profile } from '@/lib/content';
import { siteUrl,isIndexable } from '@/lib/site';
import './globals.css';
import './fonts.css';
export const metadata:Metadata={
  ...(siteUrl?{metadataBase:new URL(siteUrl),alternates:{canonical:'/'}}:{}),
  title:'Priyansh Dobariya — Full-Stack & Applied AI Engineer',description:profile.description,
  applicationName:'Priyansh Dobariya Portfolio',authors:[{name:profile.name,...(siteUrl?{url:siteUrl}:{})}],creator:profile.name,
  keywords:['Priyansh Dobariya','Full-stack developer','React','Next.js','Node.js','NestJS','Redis','PostgreSQL','MongoDB','Applied AI Engineer','LLM systems','RAG engineer','AI agents','AI automation','LangGraph','Python','FastAPI','Stripe payments','RAG pipelines','Vector databases','n8n workflows','NestJS microservices','AWS deployment','Multi-agent architecture','LLM observability'],
  robots:{index:isIndexable,follow:isIndexable,googleBot:{index:isIndexable,follow:isIndexable,'max-image-preview':'large','max-snippet':-1,'max-video-preview':-1}},
  openGraph:{type:'website',locale:'en_IN',siteName:'Priyansh Dobariya',title:'Priyansh Dobariya — Full-Stack & Applied AI Engineer',description:'I build full-stack products and applied AI systems: polished interfaces, reliable backends, agents, and automations.',...(siteUrl?{url:siteUrl,images:[{url:`${siteUrl}/social/portfolio.jpg`,width:1200,height:630,type:'image/jpeg',alt:'Priyansh Dobariya — full-stack and applied AI engineer'}]}:{})},
  twitter:{card:'summary_large_image',title:'Priyansh Dobariya — Full-Stack & Applied AI Engineer',description:'I build full-stack products and applied AI systems: polished interfaces, reliable backends, agents, and automations.',...(siteUrl?{images:[`${siteUrl}/social/portfolio.jpg`]}:{})},
  icons:{icon:[{url:'/favicon.ico',sizes:'any',type:'image/x-icon'},{url:'/favicon.png',sizes:'256x256',type:'image/png'},{url:'/favicon.svg',type:'image/svg+xml'}],shortcut:'/favicon.ico',apple:'/apple-touch-icon.png'},
  verification:{google:process.env.GOOGLE_SITE_VERIFICATION,other:process.env.BING_SITE_VERIFICATION?{'msvalidate.01':process.env.BING_SITE_VERIFICATION}:{}},
  category:'technology',referrer:'strict-origin-when-cross-origin',
};
export const viewport:Viewport={width:'device-width',initialScale:1,themeColor:[{media:'(prefers-color-scheme: light)',color:'#f8f8f2'},{media:'(prefers-color-scheme: dark)',color:'#121d25'}]};
const themeScript=`try{const d=document.documentElement;d.dataset.theme=localStorage.getItem('portfolio-theme')||(matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light');d.dataset.motion=localStorage.getItem('portfolio-motion')||'running'}catch{}`;
export default function RootLayout({children}:Readonly<{children:React.ReactNode}>){
  return <html lang="en" data-scroll-behavior="smooth" suppressHydrationWarning>
    <head>
      <link rel="preload" href="/fonts/manrope.woff2" as="font" type="font/woff2" crossOrigin="anonymous"/>
      <link rel="preload" href="/fonts/dm-sans.woff2" as="font" type="font/woff2" crossOrigin="anonymous"/>
      <link rel="preload" href="/fonts/instrument-serif-italic.woff2" as="font" type="font/woff2" crossOrigin="anonymous"/>
      <script dangerouslySetInnerHTML={{__html:themeScript}}/>
    </head>
    <body>{children}</body>
  </html>;
}
