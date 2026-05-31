# Magie — Formulário de inscrição (Conversations)

Formulário de captação de leads da Magie. Coleta **nome, telefone, empresa e email**,
valida os dados em tempo real, formata o telefone automaticamente no padrão
`(XX) XXXXX-XXXX` e grava cada inscrição em uma planilha do Google Sheets.

## Stack

- **Next.js 16** (App Router) + **TypeScript**
- **Tailwind CSS v4** (visual glassmorphism)
- **React Hook Form** + **Zod** (validação)
- **Google Apps Script Web App** (gravação no Google Sheets)
- Deploy na **Vercel**

## Estrutura

```
src/
  app/
    api/subscribe/route.ts   # Recebe o submit, valida e repassa ao Apps Script
    layout.tsx               # Fontes (Figtree + Montserrat) e metadata
    page.tsx                 # Card glassmorphism
    globals.css              # Tema, gradiente de fundo
  components/
    SignupForm.tsx           # Formulário + estados (form/confirmação)
    Field.tsx                # Input com label flutuante e erro
    Logo.tsx                 # Logo (placeholder — troque pelo SVG oficial)
  lib/
    schema.ts                # Schema Zod de validação
    phone.ts                 # Máscara/normalização do telefone
google-apps-script/Code.gs   # Script para colar na sua planilha
public/assets/               # Logos, background e vetores exportados
```

## Configuração

### 1. Instalar dependências

```bash
npm install
```

### 2. Conectar ao Google Sheets (Apps Script)

1. Abra a sua planilha no Google Sheets.
2. Vá em **Extensões → Apps Script**.
3. Apague o conteúdo e cole o arquivo [`google-apps-script/Code.gs`](google-apps-script/Code.gs).
4. Clique em **Implantar → Nova implantação**.
5. Tipo **App da Web**, executar como **Eu**, acesso **Qualquer pessoa**.
6. Copie a URL gerada (termina em `/exec`).

### 3. Variável de ambiente

Crie `.env.local` (ou configure na Vercel):

```
GOOGLE_SHEETS_WEBHOOK_URL="https://script.google.com/macros/s/XXXX/exec"
```

### 4. Rodar localmente

```bash
npm run dev
```

Acesse http://localhost:3000

## Deploy na Vercel

```bash
npm i -g vercel       # se ainda não tiver
vercel                # primeiro deploy / link do projeto
```

No painel da Vercel, em **Settings → Environment Variables**, adicione
`GOOGLE_SHEETS_WEBHOOK_URL` com a URL do Apps Script. Depois:

```bash
vercel --prod
```

## Personalização

- **Assets**: coloque os arquivos exportados em `public/assets/` e siga
  [`public/assets/README.md`](public/assets/README.md) para plugar logo e background.
- **Fontes**: Figtree (título/subtítulo) e Montserrat (inputs/botões) são carregadas
  via `next/font/google` em `src/app/layout.tsx`.
- **Data do evento**: o texto "3 de junho" da tela de confirmação está em
  `src/components/SignupForm.tsx`.
- **Regras de validação**: ajuste em `src/lib/schema.ts`.

## Validações aplicadas

| Campo    | Regra |
|----------|-------|
| Nome     | Nome e sobrenome (mín. 2 palavras, apenas letras) |
| Telefone | Celular BR com DDD — 11 dígitos, máscara `(XX) XXXXX-XXXX` |
| Empresa  | Mín. 2 caracteres |
| Email    | Formato de email válido |

O botão **Enviar** só é habilitado quando todos os campos são válidos.
A validação também é refeita no servidor antes de gravar na planilha.
