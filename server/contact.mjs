const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const json = (data,status=200) => Response.json(data,{status,headers:{'Cache-Control':'no-store'}});
const attempts=new Map();
export async function handleContact(request,env,send=fetch) {
  if(request.method!=='POST')return new Response(null,{status:405,headers:{Allow:'POST'}});
  const origin=request.headers.get('origin');
  if(!origin||origin!==new URL(request.url).origin)return json({error:'Please submit the form from this website.'},403);
  if(!request.headers.get('content-type')?.includes('application/json'))return json({error:'Invalid request format.'},415);
  if(Number(request.headers.get('content-length')||0)>16000)return json({error:'Your message is too long.'},413);
  let data;
  try {const raw=await request.text();if(raw.length>16000)return json({error:'Your message is too long.'},413);data=JSON.parse(raw);}catch{return json({error:'Invalid request.'},400);}
  if(!data||typeof data!=='object'||Array.isArray(data))return json({error:'Invalid request.'},400);
  if(data.website)return json({error:'Unable to submit this message.'},400);
  const name=typeof data.name==='string'?data.name.trim():'';
  const email=typeof data.email==='string'?data.email.trim():'';
  const message=typeof data.message==='string'?data.message.trim():'';
  const projectType=typeof data.projectType==='string'?data.projectType.trim():'';
  if(name.length<2||name.length>100||/[\r\n]/.test(name)||email.length>254||!emailPattern.test(email)||message.length<20||message.length>5000||projectType.length>100)return json({error:'Please enter your name, a valid email, and a message between 20 and 5,000 characters.'},400);
  if(!env.SENDGRID_API_KEY||!emailPattern.test(env.SENDGRID_FROM_EMAIL||'')||!emailPattern.test(env.CONTACT_TO_EMAIL||''))return json({error:'The contact form is not connected yet. Please email me directly.'},503);
  const ip=request.headers.get('cf-connecting-ip');
  if(ip){
    const now=Date.now();
    for(const [key,entry] of attempts)if(entry.until<now)attempts.delete(key);
    const entry=attempts.get(ip)||{count:0,until:now+600000};
    if(entry.count>=5)return json({error:'Too many messages. Please wait a few minutes before trying again.'},429);
    if(attempts.size>10000)attempts.clear();
    entry.count++;attempts.set(ip,entry);
  }
  try {
    const response=await send('https://api.sendgrid.com/v3/mail/send',{method:'POST',headers:{Authorization:`Bearer ${env.SENDGRID_API_KEY}`,'Content-Type':'application/json'},signal:AbortSignal.timeout(12000),body:JSON.stringify({personalizations:[{to:[{email:env.CONTACT_TO_EMAIL}]}],from:{email:env.SENDGRID_FROM_EMAIL,name:'Priyansh Portfolio'},reply_to:{email,name},subject:`Portfolio enquiry: ${projectType||'New project'}`,content:[{type:'text/plain',value:`Name: ${name}\nEmail: ${email}\nProject: ${projectType||'Not specified'}\n\n${message}`}]})});
    if(response.status!==202)return json({error:'The message could not be sent. Please try again or email me directly.'},502);
    return json({ok:true});
  }catch{return json({error:'The email service is unavailable. Please try again or email me directly.'},502);}
}
