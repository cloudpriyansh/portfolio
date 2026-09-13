import { handleContact } from './contact.mjs';
export default {
  async fetch(request,env) {
    const url=new URL(request.url);
    if(url.pathname.replace(/\/$/,'')==='/api/contact')return handleContact(request,env);
    if(env.ASSETS)return env.ASSETS.fetch(request);
    return new Response('Not found',{status:404});
  }
};
