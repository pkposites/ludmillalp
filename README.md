# Landing page · Ludmilla Corretora de Imóveis

Landing page estática (HTML + CSS + JS, sem build) com:

- **Hero** com a Ludmilla e um destaque das ofertas do mês
- **Sobre**: publicitária por formação, corretora por amor, +15 anos de mercado, tenista
- **Kaslik Ibirapuera**: diferenciais, números, lazer e localização (Vila Mariana)
- **Ofertas de outubro**: cards com preço "de/por" e economia, cada um com botão para o WhatsApp
- **Quiz** (6 perguntas + contato) que recomenda a unidade ideal e abre o WhatsApp com as respostas
- FAQ (inclui HIS/HMP), CTA final e botão flutuante de WhatsApp

## Fotos: coloque estes arquivos em `assets/img/`

| Arquivo                  | Foto                                        |
|--------------------------|---------------------------------------------|
| `ludmilla-retrato.jpg`   | Retrato de frente (blazer branco), usado no topo e no CTA final |
| `ludmilla-sofa.jpg`      | Foto sentada ao lado do sofá com a xícara   |
| `kaslik-fachada.jpg`     | Perspectiva da fachada do Kaslik Ibirapuera |

Enquanto uma foto não existir, a página mostra um espaço reservado elegante no lugar.
Dica: exporte em JPG com ~1200px no maior lado para carregar rápido.

## Configuração: topo do `script.js`

```js
const CONFIG = {
  whatsapp: "5511000000000",       // DDI + DDD + número, só dígitos
  instagram: "https://www.instagram.com/ludmillaimoveis/",
  creci: "Corretora de Imóveis · CRECI 000000-F",
  leadEndpoint: "",                // opcional: URL que recebe os leads (POST JSON)
  unidades: [ ... ],               // ofertas do mês: nome, área, unidade, vaga, de, por
};
```

Para atualizar as ofertas de um novo mês basta editar a lista `unidades`: os cards, o selo
"Maior desconto" e a recomendação do quiz se ajustam sozinhos.

### Captura de leads (opcional)
Por padrão o lead vai para o WhatsApp da Ludmilla com todas as respostas. Para também salvar
em planilha/CRM, coloque em `leadEndpoint` uma URL do Formspree, Make, Zapier, n8n ou Google Apps
Script. Se o Meta Pixel ou o GA4 estiverem instalados, o evento `Lead` / `generate_lead` é disparado.

## Rodar localmente

```bash
npx serve .
```

## Publicar
Pode ser publicada como site estático em Netlify, Vercel, GitHub Pages ou Cloudflare Pages:
é só apontar para a raiz do repositório.
