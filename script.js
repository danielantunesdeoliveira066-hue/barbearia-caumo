const $=s=>document.querySelector(s),pick=new Set(),D=[];
const esc=s=>String(s??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const WHATS=CFG.whats,SB_URL=CFG.supabase.url,SB_KEY=CFG.supabase.key,S=CFG.servicos;
const H={"apikey":SB_KEY,"Content-Type":"application/json"};
if(SB_KEY.startsWith("eyJ"))H.Authorization="Bearer "+SB_KEY; // chave antiga usa Authorization; a nova (sb_publishable_) não
let ocupados=[],cat="Todos",day=0,time=null;
const hrs=d=>CFG.horarios[d]||[];
const p2=n=>String(n).padStart(2,"0");
const fh=h=>{const a=Math.floor(h),m=Math.round((h-a)*60);return a+"h"+(m?p2(m):"")};
const hh=h=>{const a=Math.floor(h),m=Math.round((h-a)*60);return p2(a)+"h"+(m?p2(m):"")};
const hm=h=>p2(Math.floor(h))+":"+p2(Math.round((h%1)*60));
const dur=m=>m>=60?Math.floor(m/60)+"h"+(m%60?p2(m%60):""):m+" min";
const wa=m=>"https://wa.me/"+WHATS+"?text="+encodeURIComponent(m);
const fmt=d=>d.toLocaleTimeString("pt-BR",{hour:"2-digit",minute:"2-digit"});
const sel=()=>S.filter(s=>pick.has(s.id));
const sum=()=>sel().reduce((a,s)=>({p:a.p+s.p,m:a.m+s.m}),{p:0,m:0});

/* ---- Aplica o config.js na página ---- */
(()=>{
  const loc=CFG.cidade+", "+CFG.uf,c=CFG.cores;
  const NOM=["Domingo","Segunda","Terça","Quarta","Quinta","Sexta","Sábado"],ING=["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
  const set=(s,v)=>{const e=document.querySelector(s);if(e)e.setAttribute("content",v)};
  document.title=CFG.nome+" — "+loc+" | Agende seu horário";
  set('meta[name="description"]',CFG.descricao);
  $(".brand").innerHTML=esc(CFG.marca)+"<small>"+esc(CFG.slogan)+"</small>";
  $("#h1").textContent=CFG.titulo;$("#sub").textContent=CFG.subtitulo;
  document.querySelectorAll(".hero img,.rail img").forEach((im,i)=>{if(CFG.fotos[i])im.alt=CFG.fotos[i]});
  $("#end").innerHTML=esc(CFG.endereco)+"<br>"+esc(loc);
  const g=[];[1,2,3,4,5,6,0].forEach(d=>{const k=JSON.stringify(hrs(d)),u=g[g.length-1];u&&u.k==k?u.d.push(d):g.push({k,d:[d]})});
  $("#info").insertAdjacentHTML("beforeend",g.map(x=>{
    const a=x.d[0],b=x.d[x.d.length-1],n=x.d.length==1?NOM[a]:NOM[a]+(x.d.length==2?" e ":" a ")+NOM[b].toLowerCase(),h=hrs(a);
    return"<dt>"+n+"</dt><dd>"+(h.length?h.map(([i,f])=>hh(i)+" às "+hh(f)).join("<br>"):"Fechado")+"</dd>"}).join(""));
  $("#mapa").href=CFG.mapa;
  const ig=CFG.instagram?"https://www.instagram.com/"+CFG.instagram:"";
  ig?$("#ig").href=ig:$("#ig").remove();
  $("#rod").innerHTML="© "+new Date().getFullYear()+" "+esc(CFG.nome)+" · "+esc(loc)+(ig?' · <a target="_blank" rel="noopener" href="'+ig+'">@'+esc(CFG.instagram)+"</a>":"");
  const st=document.createElement("style");
  st.textContent=`:root{--gold:${c.claro};--btn-ink:${c.claroTexto}}@media (prefers-color-scheme:dark){:root:not([data-theme="light"]){--gold:${c.escuro};--btn:${c.escuro}}}:root[data-theme="dark"]{--gold:${c.escuro};--btn:${c.escuro}}`;
  document.head.append(st);
  const ic=document.createElement("link");ic.rel="icon";
  ic.href="data:image/svg+xml,"+encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><rect width="64" height="64" rx="14" fill="#0c0b09"/><text x="32" y="46" font-size="40" font-weight="700" text-anchor="middle" font-family="sans-serif" fill="${c.escuro}">${esc(CFG.marca[0])}</text></svg>`);
  document.head.append(ic);
  const ld=document.createElement("script");ld.type="application/ld+json";
  ld.textContent=JSON.stringify({"@context":"https://schema.org","@type":"HairSalon",name:CFG.nome,description:CFG.descricao,
    address:{"@type":"PostalAddress",streetAddress:CFG.endereco,addressLocality:CFG.cidade,addressRegion:CFG.uf,postalCode:CFG.cep,addressCountry:"BR"},
    hasMap:CFG.mapa,sameAs:ig?[ig]:[],
    openingHoursSpecification:g.flatMap(x=>hrs(x.d[0]).map(([i,f])=>({"@type":"OpeningHoursSpecification",dayOfWeek:x.d.map(d=>ING[d]),opens:hm(i),closes:hm(f)})))});
  document.head.append(ld);
})();

document.querySelectorAll(".wa").forEach(a=>a.href=wa(a.dataset.m));
function tabs(){$("#tabs").innerHTML=["Todos",...new Set(S.map(s=>s.c))].map(c=>`<button class="chip sel" aria-pressed="${c==cat}">${esc(c)}</button>`).join("")}
function list(){$("#list").innerHTML=S.filter(s=>cat=="Todos"||s.c==cat).map(s=>`<button class="svc" aria-pressed="${pick.has(s.id)}" data-id="${s.id}"><span><b>${esc(s.n)}${s.hot?'<span class="tag">Mais pedido</span>':""}</b><small>${esc(s.d)} · ${dur(s.m)}</small></span><span class="pr"><i>R$</i>${s.p}</span><span class="tg" aria-hidden="true"></span></button>`).join("")}
function bar(){const t=sum(),n=pick.size;$("#tot").textContent=n?"R$ "+t.p:"Escolha acima";$("#meta").textContent=n?n+(n>1?" serviços · ":" serviço · ")+dur(t.m):"Toque em um serviço";$("#go").textContent=n?"Continuar":"Agendar"}
function status(){const n=new Date(),t=n.getHours()+n.getMinutes()/60,h=hrs(n.getDay()).find(([a,b])=>t>=a&&t<b);$("#st").classList.toggle("off",!h);$("#st span").textContent=h?"Aberto até "+fh(h[1]):"Fechado agora"}
function slots(d){const m=sum().m,r=[];hrs(d.getDay()).forEach(([a,b])=>{for(let t=a*60;t+m<=b*60;t+=30){const x=new Date(d);x.setHours(0,t,0,0);const f=new Date(x.getTime()+m*6e4);if(x>new Date()&&!ocupados.some(o=>x<o.b&&f>o.a))r.push(x)}});return r}
function days(){$("#days").innerHTML=D.map((d,i)=>`<button class="day sel" ${slots(d).length?"":"disabled"} aria-pressed="${day==i}" data-i="${i}"><small>${i?d.toLocaleDateString("pt-BR",{weekday:"short"}).replace(".",""):"hoje"}</small><b>${d.getDate()}</b></button>`).join("")}
function hours(){$("#slots").innerHTML=slots(D[day]).map(x=>`<button class="slot sel" aria-pressed="${time==fmt(x)}">${fmt(x)}</button>`).join("")}
async function carregarOcupados(){
  if(!SB_URL)return;
  const r=await fetch(SB_URL+"/rest/v1/rpc/ocupados",{method:"POST",headers:H,body:JSON.stringify({de:D[0].toISOString(),ate:new Date(D[6].getTime()+864e5).toISOString()})});
  if(r.ok)ocupados=(await r.json()).map(o=>({a:new Date(o.inicio),b:new Date(o.fim)}));
}
function ok(){$("#ok").disabled=!(time&&$("#nm").value.trim())}

for(let i=0;i<7;i++){const d=new Date();d.setDate(d.getDate()+i);d.setHours(0,0,0,0);D.push(d)}
$("#tabs").onclick=e=>{const b=e.target.closest(".chip");if(b){cat=b.textContent;tabs();list()}};
$("#list").onclick=e=>{const b=e.target.closest(".svc");if(!b)return;const i=+b.dataset.id;pick.has(i)?pick.delete(i):pick.add(i);b.setAttribute("aria-pressed",pick.has(i));bar()};
$("#go").onclick=async()=>{if(!pick.size)return $("#servicos").scrollIntoView();await carregarOcupados().catch(()=>{});day=Math.max(0,D.findIndex(d=>slots(d).length));time=null;days();hours();const t=sum();$("#sv").textContent=sel().map(s=>s.n).join(" + ");$("#sp").textContent="R$ "+t.p+" · "+dur(t.m);ok();$("#sh").showModal()};
$("#days").onclick=e=>{const b=e.target.closest(".day");if(b){day=+b.dataset.i;time=null;days();hours();ok()}};
$("#slots").onclick=e=>{const b=e.target.closest(".slot");if(b){time=b.textContent;hours();ok()}};
$("#nm").oninput=ok;
$("#cl").onclick=()=>$("#sh").close();
$("#sh").onclick=e=>{if(e.target.id=="sh")e.target.close()};
$("#ok").onclick=async()=>{const t=sum(),d=D[day].toLocaleDateString("pt-BR",{weekday:"long",day:"numeric",month:"long"});
  const msg="Olá! Sou "+$("#nm").value.trim()+". Quero agendar:\n"+sel().map(s=>"• "+s.n).join("\n")+"\n\nDia: "+d+"\nHorário: "+time+"\nTotal: R$ "+t.p+" ("+dur(t.m)+")\n\nPode confirmar?";
  const w=window.open("","_blank"); // abre já no clique, para o navegador não bloquear
  if(SB_URL){
    $("#ok").disabled=true;$("#ok").textContent="Reservando...";
    const ini=slots(D[day]).find(x=>fmt(x)==time);
    const r=await fetch(SB_URL+"/rest/v1/agendamentos",{method:"POST",headers:{...H,"Prefer":"return=minimal"},body:JSON.stringify({inicio:ini.toISOString(),fim:new Date(ini.getTime()+t.m*6e4).toISOString(),nome:$("#nm").value.trim(),servicos:sel().map(s=>s.n).join(" + ")})}).catch(()=>null);
    $("#ok").textContent="Confirmar pelo WhatsApp";
    if(r&&r.status==409){
      if(w)w.close();
      alert("Esse horário acabou de ser ocupado. Escolha outro, por favor.");
      await carregarOcupados().catch(()=>{});time=null;days();hours();ok();return;
    }
    ok();
  }
  w?w.location.href=wa(msg):location.href=wa(msg)};
tabs();list();bar();status();setInterval(status,6e4);

/* Galeria "O espaço": arrastar com o mouse (toque usa a rolagem nativa) */
(()=>{const r=$(".rail");let down=false,moved=false,x0=0,s0=0,tx=0,raf=0;
r.addEventListener("pointerdown",e=>{if(e.pointerType!=="mouse"||e.button!==0)return;down=true;moved=false;x0=e.clientX;s0=r.scrollLeft});
r.addEventListener("pointermove",e=>{if(!down)return;const dx=e.clientX-x0;if(!moved&&Math.abs(dx)>4){moved=true;r.classList.add("drag");r.setPointerCapture(e.pointerId)}if(moved){tx=s0-dx;if(!raf)raf=requestAnimationFrame(()=>{r.scrollLeft=tx;raf=0})}});
const end=()=>{if(!down)return;down=false;moved=false;r.classList.remove("drag")};
r.addEventListener("pointerup",end);r.addEventListener("pointercancel",end);
r.addEventListener("dragstart",e=>e.preventDefault());
})();
