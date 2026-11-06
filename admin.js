const SB_URL=CFG.supabase.url,SB_KEY=CFG.supabase.key; // vem do config.js
const $=s=>document.querySelector(s),RT="caumo_rt";
document.title="Agenda — "+CFG.nome;$("#nome").textContent=CFG.nome;
let tok=null,view="next",timer=0;
const store={get:()=>{try{return localStorage.getItem(RT)}catch{return null}},set:v=>{try{v?localStorage.setItem(RT,v):localStorage.removeItem(RT)}catch{}}};
const esc=s=>String(s??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const hm=d=>d.toLocaleTimeString("pt-BR",{hour:"2-digit",minute:"2-digit"});
const label=a=>{const t=new Date();t.setHours(0,0,0,0);const n=Math.round((new Date(a).setHours(0,0,0,0)-t)/864e5);return(n==0?"Hoje · ":n==1?"Amanhã · ":"")+a.toLocaleDateString("pt-BR",{weekday:"long",day:"numeric",month:"long"})};

async function token(grant,body){
  const r=await fetch(SB_URL+"/auth/v1/token?grant_type="+grant,{method:"POST",headers:{apikey:SB_KEY,"Content-Type":"application/json"},body:JSON.stringify(body)});
  const j=await r.json().catch(()=>({}));
  if(!r.ok)throw new Error(j.error_description||j.msg||"Falha no login");
  tok=j.access_token;store.set(j.refresh_token);
}
async function api(path,opt={},retry=true){
  const r=await fetch(SB_URL+"/rest/v1/"+path,{...opt,headers:{apikey:SB_KEY,Authorization:"Bearer "+tok,"Content-Type":"application/json",...opt.headers}});
  if(r.status==401&&retry){
    try{await token("refresh_token",{refresh_token:store.get()})}catch{out();throw new Error("Sessão expirada")}
    return api(path,opt,false);
  }
  return r;
}
const show=on=>{$("#login").hidden=on;$("#app").hidden=!on};
function out(){tok=null;store.set(null);clearInterval(timer);show(false)}
function start(){show(true);load();clearInterval(timer);timer=setInterval(load,6e4)}

async function load(){
  const now=new Date().toISOString();
  const q=view=="next"?"fim=gte."+now+"&order=inicio.asc":"fim=lt."+now+"&order=inicio.desc&limit=60";
  try{
    const r=await api("agendamentos?select=id,inicio,fim,nome,servicos&"+q);
    if(!r.ok)throw 0;
    $("#msg").textContent="";draw(await r.json());
  }catch{$("#msg").textContent="Não foi possível carregar. Confira a internet e as permissões do banco."}
}
function draw(rows){
  if(!rows.length){$("#list").innerHTML='<p class="empty">'+(view=="next"?"Nenhum agendamento por enquanto.":"Nada no histórico.")+"</p>";return}
  let dia="",h="";
  for(const r of rows){
    const a=new Date(r.inicio),b=new Date(r.fim),blk=r.nome=="BLOQUEIO";
    if(a.toDateString()!=dia){dia=a.toDateString();h+=`<h2 class="dh">${esc(label(a))}</h2>`}
    h+=`<div class="card${blk?" blk":""}"><div class="t">${hm(a)}<small>até ${hm(b)}</small></div><div><b>${blk?"Horário bloqueado":esc(r.nome)}</b><small>${esc(r.servicos)}</small></div><button class="del" data-id="${+r.id}">${blk?"Liberar":"Excluir"}</button></div>`;
  }
  $("#list").innerHTML=h;
}

$("#lf").onsubmit=async e=>{
  e.preventDefault();$("#lm").textContent="";
  try{await token("password",{email:$("#em").value.trim(),password:$("#pw").value});$("#pw").value="";start()}
  catch(x){$("#lm").textContent=/invalid login/i.test(x.message)?"E-mail ou senha incorretos.":x.message}
};
$("#out").onclick=out;
$("#rf").onclick=load;
document.querySelectorAll("[data-v]").forEach(b=>b.onclick=()=>{
  view=b.dataset.v;
  document.querySelectorAll("[data-v]").forEach(x=>x.setAttribute("aria-pressed",x==b));
  load();
});
$("#list").onclick=async e=>{
  const b=e.target.closest(".del");if(!b)return;
  if(!b.classList.contains("arm")){ // 1º toque arma, 2º toque exclui
    const o=b.textContent;b.classList.add("arm");b.textContent="Toque para confirmar";
    setTimeout(()=>{b.classList.remove("arm");b.textContent=o},4000);return;
  }
  b.disabled=true;
  const r=await api("agendamentos?id=eq."+b.dataset.id,{method:"DELETE",headers:{Prefer:"return=representation"}});
  const j=r.ok?await r.json():[];
  $("#msg").textContent=j.length?"":"Não foi possível excluir. Confira o login e as permissões.";
  load();
};
$("#bf").onsubmit=async e=>{
  e.preventDefault();
  const d=$("#bd").value,i=new Date(d+"T"+$("#bi").value),f=new Date(d+"T"+$("#bt").value);
  if(!(f>i)){$("#bm").textContent="O fim precisa ser depois do início.";return}
  const r=await api("agendamentos",{method:"POST",headers:{Prefer:"return=minimal"},body:JSON.stringify({inicio:i.toISOString(),fim:f.toISOString(),nome:"BLOQUEIO",servicos:$("#bn").value.trim()||"Bloqueio"})});
  if(r.status==409)$("#bm").textContent="Já existe um agendamento nesse horário. Exclua-o primeiro.";
  else if(!r.ok)$("#bm").textContent="Não foi possível bloquear.";
  else{$("#bm").textContent="";e.target.reset();$("#bk").open=false;load()}
};
document.addEventListener("visibilitychange",()=>{if(!document.hidden&&tok)load()});
$("#bd").min=new Date().toISOString().slice(0,10);

const rt=store.get();
rt?token("refresh_token",{refresh_token:rt}).then(start).catch(out):show(false);
