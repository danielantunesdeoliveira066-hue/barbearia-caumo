# Barbearia Caumo

Site estático (HTML, CSS e JS).

## Trocar antes de publicar
- `script.js`: `WHATS` (número com 55 + DDD) e a lista `S` (serviços e preços)
- `index.html`: endereço, horários, link do mapa e o JSON-LD
- `index.html`: `SEU-SITE.vercel.app` no `og:image`, pelo endereço final

## Bloqueio de horários ocupados (Supabase)
Sem isso, o site funciona normal, mas não bloqueia horários.
1. Crie uma conta gratuita em supabase.com e um projeto novo (região South America, São Paulo).
2. SQL Editor, New query: cole o conteúdo de `supabase.sql` e clique em Run.
3. Project Settings, API: copie a **Project URL** e a chave **anon public**.
4. No `script.js`, preencha `SB_URL` e `SB_KEY`. Use só a chave anon public. Nunca a service_role.
5. Faça o commit e o push. O Vercel publica sozinho.

Como o dono usa:
- Ver os agendamentos: Supabase, Table Editor, agendamentos.
- Cancelar: apagar a linha. O horário volta a ficar livre.
- Bloquear um horário (folga, compromisso): adicionar uma linha com `inicio`, `fim` (ex.: 2026-11-12 14:00-03) e nome "BLOQUEIO".

## Estrutura
index.html, style.css, script.js, favicon.svg, img/, supabase.sql

## Publicar
Vercel: Add New Project, importar o repositório, Deploy.
