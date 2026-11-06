const WHATS="5511999999999"; // 55 + DDD + número
const S=[
{id:1,c:"Combos",n:"Corte + barba",d:"O completo, com toalha quente",m:70,p:80,hot:1},
{id:2,c:"Cabelo",n:"Corte social",d:"Tesoura ou máquina, na navalha",m:40,p:50},
{id:3,c:"Cabelo",n:"Degradê",d:"Na régua, com acabamento",m:45,p:60},
{id:4,c:"Barba",n:"Barba completa",d:"Toalha quente e hidratação",m:30,p:40},
{id:5,c:"Barba",n:"Pigmentação",d:"Cobre falhas e fios brancos",m:40,p:70},
{id:6,c:"Barba",n:"Sobrancelha",d:"Na navalha ou pinça",m:10,p:15}];
const hrs=d=>d==0?null:d==6?[8,18]:[9,20];
const $=s=>document.querySelector(s),pick=new Set(),D=[];
const dur=m=>m>=60?Math.floor(m/60)+"h"+(m%60?String(m%60).padStart(2,"0"):""):m+" min";
const wa=m=>"https://wa.me/"+WHATS+"?text="+encodeURIComponent(m);
const fmt=d=>d.toLocaleTimeString("pt-BR",{hour:"2-digit",minute:"2-digit"});
const sel=()=>S.filter(s=>pick.has(s.id));
const sum=()=>sel().reduce((a,s)=>({p:a.p+s.p,m:a.m+s.m}),{p:0,m:0});
let cat="Todos",day=0,time=null;

document.querySelectorAll(".wa").forEach(a=>a.href=wa(a.dataset.m));
function tabs(){$("#tabs").innerHTML=["Todos",...new Set(S.map(s=>s.c))].map(c=>`<button class="chip sel" aria-pressed="${c==cat}">${c}</button>`).join("")}
function list(){$("#list").innerHTML=S.filter(s=>cat=="Todos"||s.c==cat).map(s=>`<button class="svc" aria-pressed="${pick.has(s.id)}" data-id="${s.id}"><span><b>${s.n}${s.hot?'<span class="tag">Mais pedido</span>':""}</b><small>${s.d} · ${dur(s.m)}</small></span><span class="pr"><i>R$</i>${s.p}</span><span class="tg" aria-hidden="true"></span></button>`).join("")}
function bar(){const t=sum(),n=pick.size;$("#tot").textContent=n?"R$ "+t.p:"Escolha acima";$("#meta").textContent=n?n+(n>1?" serviços · ":" serviço · ")+dur(t.m):"Toque em um serviço";$("#go").textContent=n?"Continuar":"Ver serviços"}
function status(){const n=new Date(),h=hrs(n.getDay()),t=n.getHours()+n.getMinutes()/60,o=h&&t>=h[0]&&t<h[1];$("#st").classList.toggle("off",!o);$("#st span").textContent=o?"Aberto até "+h[1]+"h":"Fechado agora"}
function slots(d){const h=hrs(d.getDay());if(!h)return[];const m=sum().m,r=[];for(let t=h[0]*60;t+m<=h[1]*60;t+=30){const x=new Date(d);x.setHours(0,t,0,0);if(x>new Date())r.push(x)}return r}
function days(){$("#days").innerHTML=D.map((d,i)=>`<button class="day sel" ${slots(d).length?"":"disabled"} aria-pressed="${day==i}" data-i="${i}"><small>${i?d.toLocaleDateString("pt-BR",{weekday:"short"}).replace(".",""):"hoje"}</small><b>${d.getDate()}</b></button>`).join("")}
function hours(){$("#slots").innerHTML=slots(D[day]).map(x=>`<button class="slot sel" aria-pressed="${time==fmt(x)}">${fmt(x)}</button>`).join("")}
function ok(){$("#ok").disabled=!(time&&$("#nm").value.trim())}

for(let i=0;i<7;i++){const d=new Date();d.setDate(d.getDate()+i);d.setHours(0,0,0,0);D.push(d)}
$("#tabs").onclick=e=>{const b=e.target.closest(".chip");if(b){cat=b.textContent;tabs();list()}};
$("#list").onclick=e=>{const b=e.target.closest(".svc");if(!b)return;const i=+b.dataset.id;pick.has(i)?pick.delete(i):pick.add(i);b.setAttribute("aria-pressed",pick.has(i));bar()};
$("#go").onclick=()=>{if(!pick.size)return $("#servicos").scrollIntoView();day=Math.max(0,D.findIndex(d=>slots(d).length));time=null;days();hours();const t=sum();$("#sv").textContent=sel().map(s=>s.n).join(" + ");$("#sp").textContent="R$ "+t.p+" · "+dur(t.m);ok();$("#sh").showModal()};
$("#days").onclick=e=>{const b=e.target.closest(".day");if(b){day=+b.dataset.i;time=null;days();hours();ok()}};
$("#slots").onclick=e=>{const b=e.target.closest(".slot");if(b){time=b.textContent;hours();ok()}};
$("#nm").oninput=ok;
$("#cl").onclick=()=>$("#sh").close();
$("#sh").onclick=e=>{if(e.target.id=="sh")e.target.close()};
$("#ok").onclick=()=>{const t=sum(),d=D[day].toLocaleDateString("pt-BR",{weekday:"long",day:"numeric",month:"long"});
  window.open(wa("Olá! Sou "+$("#nm").value.trim()+". Quero agendar: "+sel().map(s=>s.n).join(" + ")+" (R$ "+t.p+", "+dur(t.m)+") em "+d+", às "+time+". Pode confirmar?"),"_blank","noopener")};
tabs();list();bar();status();setInterval(status,6e4);
