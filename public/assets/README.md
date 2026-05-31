# Assets

Coloque aqui os arquivos exportados em alta qualidade:

- `logo.svg` — logo da Magie (substitua o placeholder em `src/components/Logo.tsx`)
- `background.svg` / `background.png` — fundo da página (opcional; hoje há um gradiente CSS de fallback em `globals.css`)
- vetores diversos (ícones, ilustrações)

## Como usar

### Logo

Depois de adicionar `public/assets/logo.svg`, troque o conteúdo de
`src/components/Logo.tsx` por:

```tsx
import Image from "next/image";

export function Logo() {
  return (
    <Image src="/assets/logo.svg" alt="Magie" width={120} height={34} priority />
  );
}
```

### Background

Para usar um background exportado em vez do gradiente CSS, edite a regra
`body` em `src/app/globals.css`:

```css
body {
  background: url("/assets/background.png") center / cover no-repeat fixed;
}
```
