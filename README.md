# Decisão Clínica em Feridas

Site estático do Workshop Decisão Clínica em Feridas — Enf.ª Dra. Patrícia Lemos e Enf.ª Dra. Luz Marina Alfonso Dutra.

## Páginas

| Rota | Arquivo | Conteúdo |
|---|---|---|
| `/` | `index.html` | Índice com os links das páginas |
| `/workshop` | `workshop/index.html` | Landing page de inscrição do workshop |
| `/oferta` | `oferta/index.html` | Documento de planejamento da oferta (promessa, mecanismo, funil) |
| `/criativos` | `criativos/index.html` | Os 9 roteiros de vídeo, para as especialistas gravarem |
| `/obrigado` | `obrigado/index.html` | Página pós-pagamento: confirmação + link do grupo do WhatsApp |

## Conversões (Meta Pixel + Conversions API)

- **Pixel (client-side):** carregado em `/obrigado`, ID `2099416627508807`, dispara `PageView` quando o comprador chega na página após o pagamento.
- **Conversions API (server-side):** `api/cakto-webhook.js`, uma serverless function da Vercel. Configure na Cakto um webhook de "pagamento aprovado" apontando para `https://SEU-DOMINIO/api/cakto-webhook` — a function envia o evento `Purchase` para o Meta.
- **Variável de ambiente obrigatória** (Vercel → Project Settings → Environment Variables): `META_ACCESS_TOKEN`. Nunca commitar o token no repositório.
- O formato exato do payload da Cakto pode variar — confira os logs da function após o primeiro teste de compra e ajuste os nomes de campo em `api/cakto-webhook.js` se necessário.
- Configure também, na Cakto, a URL de redirecionamento pós-pagamento para `/obrigado`.

## Deploy

Site estático, sem build. Na Vercel basta importar o repositório e fazer o deploy com as configurações padrão — sem framework, sem comando de build, output na raiz. As rotas `/workshop` e `/oferta` funcionam pela estrutura de pastas.

Para rodar localmente:

```bash
npx serve .
```

## Estrutura

```
.
├── index.html          # índice
├── workshop/
│   └── index.html      # landing page
├── oferta/
│   └── index.html      # planejamento da oferta
├── criativos/
│   └── index.html      # roteiros de vídeo
├── obrigado/
│   └── index.html      # página pós-pagamento
└── api/
    └── cakto-webhook.js  # webhook Cakto → Conversions API (Meta)
```

Cada página é um arquivo HTML único, com CSS embutido e fontes do Google Fonts (Fraunces, Public Sans, Space Mono). Não há dependências nem etapa de build — a única exceção é `api/cakto-webhook.js`, uma serverless function Node.js processada pela Vercel.
