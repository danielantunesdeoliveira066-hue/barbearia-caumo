const WHATS="5555996899568"; // 55 + DDD + número
const S=[
{id:1,c:"Combos",n:"Corte + barba",d:"O completo, com toalha quente",m:70,p:80,hot:1},
{id:2,c:"Cabelo",n:"Corte social",d:"Tesoura ou máquina, na navalha",m:40,p:50},
{id:3,c:"Cabelo",n:"Degradê",d:"Na régua, com acabamento",m:45,p:60},
{id:4,c:"Barba",n:"Barba completa",d:"Toalha quente e hidratação",m:30,p:40},
{id:5,c:"Barba",n:"Pigmentação",d:"Cobre falhas e fios brancos",m:40,p:70},
{id:6,c:"Barba",n:"Sobrancelha",d:"Na navalha ou pinça",m:10,p:15}];
const T=[[9,12],[13.5,20]]; // intervalos de atendimento (em horas)
const hrs=d=>[null,[[13.5,19.5]],T,T,T,T,[[8.5,12],[13.5,17]]][d]||[];
const fh=h=>{const H=Math.floor(h),M=Math.round((h-H)*60);return H+"h"+(M?String(M).padStart(2,"0"):"")};
const $=s=>document.querySelector(s),pick=new Set(),D=[];
const dur=m=>m>=60?Math.floor(m/60)+"h"+(m%60?String(m%60).padStart(2,"0"):""):m+" min";
const wa=m=>"https://wa.me/"+WHATS+"?text="+encodeURIComponent(m);
const fmt=d=>d.toLocaleTimeString("pt-BR",{hour:"2-digit",minute:"2-digit"});
const sel=()=>S.filter(s=>pick.has(s.id));
const sum=()=>sel().reduce((a,s)=>({p:a.p+s.p,m:a.m+s.m}),{p:0,m:0});
const R=[]; // avaliações reais, com autorização: {n:"Nome",t:"Texto da avaliação"}
let cat="Todos",day=0,time=null;

document.querySelectorAll(".wa").forEach(a=>a.href=wa(a.dataset.m));
function tabs(){$("#tabs").innerHTML=["Todos",...new Set(S.map(s=>s.c))].map(c=>`<button class="chip sel" aria-pressed="${c==cat}">${c}</button>`).join("")}
function list(){$("#list").innerHTML=S.filter(s=>cat=="Todos"||s.c==cat).map(s=>`<button class="svc" aria-pressed="${pick.has(s.id)}" data-id="${s.id}"><span><b>${s.n}${s.hot?'<span class="tag">Mais pedido</span>':""}</b><small>${s.d} · ${dur(s.m)}</small></span><span class="pr"><i>R$</i>${s.p}</span><span class="tg" aria-hidden="true"></span></button>`).join("")}
function bar(){const t=sum(),n=pick.size;$("#tot").textContent=n?"R$ "+t.p:"Escolha acima";$("#meta").textContent=n?n+(n>1?" serviços · ":" serviço · ")+dur(t.m):"Toque em um serviço";$("#go").textContent=n?"Continuar":"Agendar"}
function status(){const n=new Date(),t=n.getHours()+n.getMinutes()/60,h=hrs(n.getDay()).find(([a,b])=>t>=a&&t<b);$("#st").classList.toggle("off",!h);$("#st span").textContent=h?"Aberto até "+fh(h[1]):"Fechado agora"}
function slots(d){const m=sum().m,r=[];hrs(d.getDay()).forEach(([a,b])=>{for(let t=a*60;t+m<=b*60;t+=30){const x=new Date(d);x.setHours(0,t,0,0);if(x>new Date())r.push(x)}});return r}
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
  window.open(wa("Olá! Sou "+$("#nm").value.trim()+". Quero agendar:\n"+sel().map(s=>"• "+s.n).join("\n")+"\n\nDia: "+d+"\nHorário: "+time+"\nTotal: R$ "+t.p+" ("+dur(t.m)+")\n\nPode confirmar?"),"_blank","noopener")};
if(R.length)$("#rv").innerHTML=R.map(r=>`<blockquote><div class="stars" aria-label="5 estrelas">★★★★★</div><p>${r.t}</p><cite>${r.n}</cite></blockquote>`).join("");
tabs();list();bar();status();setInterval(status,6e4);

/* Galeria "O espaço": arrastar com o mouse (toque usa a rolagem nativa) */
(()=>{const r=$(".rail");let down=false,moved=false,x0=0,s0=0,tx=0,raf=0;
r.addEventListener("pointerdown",e=>{if(e.pointerType!=="mouse"||e.button!==0)return;down=true;moved=false;x0=e.clientX;s0=r.scrollLeft});
r.addEventListener("pointermove",e=>{if(!down)return;const dx=e.clientX-x0;if(!moved&&Math.abs(dx)>4){moved=true;r.classList.add("drag");r.setPointerCapture(e.pointerId)}if(moved){tx=s0-dx;if(!raf)raf=requestAnimationFrame(()=>{r.scrollLeft=tx;raf=0})}});
const end=()=>{if(!down)return;down=false;moved=false;r.classList.remove("drag")};
r.addEventListener("pointerup",end);r.addEventListener("pointercancel",end);
r.addEventListener("dragstart",e=>e.preventDefault());
})();
