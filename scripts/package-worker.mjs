import { mkdir,cp,rm,copyFile,readFile,writeFile } from 'node:fs/promises';
await rm('dist',{recursive:true,force:true});
await mkdir('dist/server',{recursive:true});
await mkdir('dist/.openai',{recursive:true});
await cp('out','dist/client',{recursive:true});
const contact=await readFile('server/contact.mjs','utf8');
const worker=(await readFile('server/worker.mjs','utf8')).replace("import { handleContact } from './contact.mjs';",'');
await writeFile('dist/server/index.js',contact.replace('export async function','async function')+'\n'+worker);
await copyFile('.openai/hosting.json','dist/.openai/hosting.json');
