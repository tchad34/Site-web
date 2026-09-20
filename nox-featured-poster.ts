import { createClient } from 'npm:@supabase/supabase-js@2';
const cors={'Access-Control-Allow-Origin':'*','Access-Control-Allow-Headers':'authorization, x-client-info, apikey, content-type','Access-Control-Allow-Methods':'POST, OPTIONS'};
function json(data:unknown,status=200){return new Response(JSON.stringify(data),{status,headers:{...cors,'Content-Type':'application/json'}})}
Deno.serve(async(req)=>{
 if(req.method==='OPTIONS')return new Response('ok',{headers:cors});
 try{
  const auth=req.headers.get('Authorization'); if(!auth)throw new Error('Authentification requise');
  const token=auth.replace(/^Bearer\s+/i,'');
  const sb=createClient(Deno.env.get('SUPABASE_URL')!,Deno.env.get('SUPABASE_ANON_KEY')!,{global:{headers:{Authorization:auth}}});
  const {data:{user},error:ue}=await sb.auth.getUser(token); if(ue||!user)throw new Error('Session invalide');
  const {data:admin}=await sb.from('admin_users').select('user_id').eq('user_id',user.id).maybeSingle(); if(!admin)throw new Error('Accès administrateur requis');
  const tmdb=String(Deno.env.get('TMDB_API_TOKEN')||'').trim(); if(!tmdb)throw new Error('TMDB_API_TOKEN non configuré dans Supabase');
  const body=await req.json(); const title=String(body.title||'').trim(); const year=String(body.year||'').trim(); if(!title)throw new Error('Titre manquant');
  const params=new URLSearchParams({query:title,language:'fr-FR',include_adult:'false'}); if(year.match(/^\d{4}$/))params.set('year',year);
  const r=await fetch('https://api.themoviedb.org/3/search/movie?'+params.toString(),{headers:{Authorization:'Bearer '+tmdb,accept:'application/json'}}); if(!r.ok)throw new Error('Recherche TMDB impossible ('+r.status+')');
  const data=await r.json(); const hit=(data.results||[]).find((x:any)=>x.poster_path)||data.results?.[0]; if(!hit?.poster_path)throw new Error('Aucune affiche de film trouvée');
  return json({ok:true,poster_url:'https://image.tmdb.org/t/p/original'+hit.poster_path,tmdb_id:hit.id,tmdb_title:hit.title||hit.original_title});
 }catch(e){return json({ok:false,error:e instanceof Error?e.message:String(e)},400)}
});
