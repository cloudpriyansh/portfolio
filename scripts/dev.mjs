import { createServer } from 'node:http';
import { spawn } from 'node:child_process';
import nextEnv from '@next/env';
import { handleContact } from '../server/contact.mjs';
nextEnv.loadEnvConfig(process.cwd());
const api=createServer(async(req,res)=>{
  const chunks=[];let size=0;
  for await(const chunk of req){size+=chunk.length;if(size>16000){res.writeHead(413);res.end();return;}chunks.push(chunk);}
  const request=new Request('http://localhost:3000/api/contact',{method:req.method,headers:req.headers,body:['GET','HEAD'].includes(req.method)?undefined:Buffer.concat(chunks)});
  const response=await handleContact(request,process.env);
  res.writeHead(response.status,Object.fromEntries(response.headers));res.end(await response.text());
});
api.listen(3001,'127.0.0.1');
const next=spawn(process.execPath,['node_modules/next/dist/bin/next','dev','--hostname','0.0.0.0','--webpack'],{stdio:'inherit'});
function stop(){api.close();next.kill('SIGTERM');}
process.on('SIGINT',stop);process.on('SIGTERM',stop);next.on('exit',code=>{api.close();process.exitCode=code||0;});
