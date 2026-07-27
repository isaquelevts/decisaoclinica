# Decisão Clínica em Feridas

Site estático do Workshop Decisão Clínica em Feridas — Enf.ª Dra. Patrícia Lemos e Enf.ª Dra. Luz Marina Alfonso Dutra.

## Páginas

| Rota | Arquivo | Conteúdo |
|---|---|---|
| `/` | `index.html` | Índice com os links das duas páginas |
| `/workshop` | `workshop/index.html` | Landing page de inscrição do workshop |
| `/oferta` | `oferta/index.html` | Documento de planejamento da oferta (promessa, mecanismo, funil, criativos) |

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
└── oferta/
    └── index.html      # planejamento da oferta
```

Cada página é um arquivo HTML único, com CSS embutido e fontes do Google Fonts (Fraunces, Public Sans, Space Mono). Não há dependências nem etapa de build.
