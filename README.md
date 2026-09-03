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

## Conversões (Meta Pixel)

- Pixel carregado em `/obrigado`, ID `2099416627508807`. Dispara `PageView` e `Purchase` (valor fixo R$ 19,90, BRL) quando o comprador chega na página após o pagamento.
- Configure na Cakto a URL de redirecionamento pós-pagamento para `/obrigado` — é isso que faz o pixel disparar só para quem realmente comprou.
- Se o preço mudar, atualize o valor do evento `Purchase` em `obrigado/index.html`.

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
└── obrigado/
    └── index.html      # página pós-pagamento
```

Cada página é um arquivo HTML único, com CSS embutido e fontes do Google Fonts (Fraunces, Public Sans, Space Mono). Não há dependências nem etapa de build.
