/* ============================================================
   CONFIGURAÇÃO DA BARBEARIA — é o ÚNICO arquivo que você edita
   (fora as fotos da pasta img/ e 3 linhas no index.html).
   ============================================================ */
const MANHA_TARDE=[[9,12],[13.5,20]]; // horas em decimal: 13.5 = 13h30
const CFG={
  // ---- Identidade ----
  nome:"Barbearia Caumo",        // nome completo (aba do navegador, Google, rodapé)
  marca:"Caumo",                 // nome curto no topo do site (e a letra do ícone)
  slogan:"Imagem masculina",
  titulo:"Corte, barba e hora marcada.",
  subtitulo:"Escolha o serviço, o dia e o horário. A confirmação chega pelo WhatsApp.",
  descricao:"Barbearia em Constantina, RS: cortes, barba e acabamento. Escolha o serviço e agende pelo WhatsApp.",
  cores:{claro:"#8a6a1c",claroTexto:"#e6c26e",escuro:"#d4ad55"}, // destaque: modo claro, texto do botão claro, modo escuro

  // ---- Contato e endereço ----
  whats:"5555996899568",         // 55 + DDD + número, só números
  instagram:"caumobarbearia",    // sem @ (deixe "" para esconder)
  endereco:"Av. Pres. Vargas, 511",
  cidade:"Constantina", uf:"RS", cep:"99680-000",
  mapa:"https://maps.app.goo.gl/mtKi4YGc2hCREo1LA", // link "Compartilhar" do Google Maps

  // ---- Horário de atendimento (domingo, segunda ... sábado). [] = fechado ----
  horarios:[
    [],                          // domingo
    [[13.5,19.5]],               // segunda
    MANHA_TARDE,MANHA_TARDE,MANHA_TARDE,MANHA_TARDE, // terça a sexta
    [[8.5,12],[13.5,17]]         // sábado
  ],

  // ---- Serviços: c=categoria, n=nome, d=descrição, m=minutos, p=preço, hot=1 destaca "Mais pedido" ----
  servicos:[
    {id:1,c:"Combos",n:"Corte + barba",d:"O completo, com toalha quente",m:70,p:80,hot:1},
    {id:2,c:"Cabelo",n:"Corte social",d:"Tesoura ou máquina, na navalha",m:40,p:50},
    {id:3,c:"Cabelo",n:"Degradê",d:"Na régua, com acabamento",m:45,p:60},
    {id:4,c:"Barba",n:"Barba completa",d:"Toalha quente e hidratação",m:30,p:40},
    {id:5,c:"Barba",n:"Pigmentação",d:"Cobre falhas e fios brancos",m:40,p:70},
    {id:6,c:"Barba",n:"Sobrancelha",d:"Na navalha ou pinça",m:10,p:15}
  ],

  // ---- Textos das fotos (acessibilidade e Google): hero.webp, g1 ... g5 ----
  fotos:["Barbeiro cortando o cabelo de um cliente sorrindo","Degradê com vapor ao fundo","Cliente com toalha quente no rosto","Barbeiro na cadeira da barbearia","Cartão e produtos da barbearia","Navalha, tesoura e pente sobre madeira"],

  // ---- Supabase (bloqueio de horários e painel do barbeiro) ----
  supabase:{
    url:"https://qgvblbmvgpmrymeoldli.supabase.co",   // Project URL
    key:"sb_publishable_yG34FeVj8ibZgriOzGQAgg_vtV9iocH" // chave publishable/anon (NUNCA a service_role)
  }
};
