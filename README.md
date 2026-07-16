# DUO ACTIVE

Site da DUO ACTIVE com vitrine de produtos, abas de categorias, guia de medidas e checkout Mercado Pago.

## Estrutura

```text
.
├── package.json
├── render.yaml
├── .env.example
├── README.md
└── outputs/
    ├── index.html
    ├── styles.css
    ├── script.js
    ├── server.mjs
    └── assets/
```

## Rodar localmente

1. Copie o arquivo de exemplo:

```powershell
Copy-Item .env.example outputs\.env
```

2. Edite `outputs\.env` e coloque seu token do Mercado Pago:

```env
MERCADO_PAGO_ACCESS_TOKEN=APP_USR_SEU_ACCESS_TOKEN_AQUI
```

3. Inicie o site:

```powershell
npm start
```

4. Abra:

```text
http://127.0.0.1:4174/
```

## Mercado Pago

O site usa Checkout Pro via API de preferências.

Fluxo:

1. A cliente clica em **Adicionar ao carrinho**.
2. O navegador chama `POST /api/create-preference`.
3. O servidor cria uma preferência no Mercado Pago usando `MERCADO_PAGO_ACCESS_TOKEN`.
4. O servidor retorna `init_point`.
5. A cliente é redirecionada para o checkout seguro do Mercado Pago.

Meios como Pix, cartão e boleto aparecem conforme estiverem habilitados na sua conta Mercado Pago.

### Variáveis necessárias

```env
MERCADO_PAGO_ACCESS_TOKEN=APP_USR_SEU_ACCESS_TOKEN_AQUI
PUBLIC_BASE_URL=https://www.duoactive.com.br
CHECKOUT_SUCCESS_URL=https://www.duoactive.com.br/#checkout
CHECKOUT_PENDING_URL=https://www.duoactive.com.br/#checkout
CHECKOUT_FAILURE_URL=https://www.duoactive.com.br/#checkout
```

Importante: nunca coloque o `MERCADO_PAGO_ACCESS_TOKEN` no `index.html`, `script.js` ou qualquer arquivo público.

## Deploy no Render

### Opção 1: Deploy pelo GitHub

1. Crie um repositório no GitHub.
2. Envie estes arquivos para o repositório.
3. Entre no Render.
4. Clique em **New +** e depois **Web Service**.
5. Conecte o repositório do GitHub.
6. Configure:

```text
Runtime: Node
Build Command: npm install
Start Command: npm start
Health Check Path: /health
```

7. Em **Environment Variables**, adicione:

```env
HOST=0.0.0.0
PUBLIC_BASE_URL=https://www.duoactive.com.br
CHECKOUT_SUCCESS_URL=https://www.duoactive.com.br/#checkout
CHECKOUT_PENDING_URL=https://www.duoactive.com.br/#checkout
CHECKOUT_FAILURE_URL=https://www.duoactive.com.br/#checkout
MERCADO_PAGO_ACCESS_TOKEN=APP_USR_SEU_ACCESS_TOKEN_AQUI
```

8. Clique em **Deploy Web Service**.

### Opção 2: Blueprint

O arquivo `render.yaml` já está pronto para Blueprint.

No Render:

1. Clique em **New +**.
2. Escolha **Blueprint**.
3. Selecione o repositório.
4. Confirme a criação.
5. Preencha a variável secreta `MERCADO_PAGO_ACCESS_TOKEN`.

## Configurar domínio no Render

Depois que o serviço estiver publicado:

1. No Render, abra o serviço da DUO ACTIVE.
2. Vá em **Settings** e depois **Custom Domains**.
3. Adicione:

```text
duoactive.com.br
www.duoactive.com.br
```

4. O Render vai mostrar os registros DNS necessários.
5. No Registro.br, aponte o domínio para os registros indicados pelo Render.
6. Aguarde a propagação do DNS.

Depois disso, atualize as variáveis no Render para:

```env
PUBLIC_BASE_URL=https://www.duoactive.com.br
CHECKOUT_SUCCESS_URL=https://www.duoactive.com.br/#checkout
CHECKOUT_PENDING_URL=https://www.duoactive.com.br/#checkout
CHECKOUT_FAILURE_URL=https://www.duoactive.com.br/#checkout
```

## Comandos úteis

Verificar sintaxe:

```powershell
npm run check
```

Rodar local:

```powershell
npm start
```
