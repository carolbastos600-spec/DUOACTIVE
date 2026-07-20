# DUO ACTIVE

Site da DUO ACTIVE com vitrine de produtos, abas de categorias, guia de medidas e checkout Mercado Pago.

## Estrutura

```text
.
â”œâ”€â”€ package.json
â”œâ”€â”€ render.yaml
â”œâ”€â”€ .env.example
â”œâ”€â”€ README.md
â””â”€â”€ outputs/
    â”œâ”€â”€ index.html
    â”œâ”€â”€ styles.css
    â”œâ”€â”€ script.js
    â”œâ”€â”€ server.mjs
    â””â”€â”€ assets/
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

O site usa Checkout Pro via API de preferÃªncias.

Fluxo:

1. A cliente clica em **Adicionar ao carrinho**.
2. O navegador chama `POST /api/create-preference`.
3. O servidor cria uma preferÃªncia no Mercado Pago usando `MERCADO_PAGO_ACCESS_TOKEN`.
4. O servidor retorna `init_point`.
5. A cliente Ã© redirecionada para o checkout seguro do Mercado Pago.

Meios como Pix, cartÃ£o e boleto aparecem conforme estiverem habilitados na sua conta Mercado Pago.

### VariÃ¡veis necessÃ¡rias

```env
MERCADO_PAGO_ACCESS_TOKEN=APP_USR_SEU_ACCESS_TOKEN_AQUI
PUBLIC_BASE_URL=https://www.duoactive.com.br
CHECKOUT_SUCCESS_URL=https://www.duoactive.com.br/#checkout
CHECKOUT_PENDING_URL=https://www.duoactive.com.br/#checkout
CHECKOUT_FAILURE_URL=https://www.duoactive.com.br/#checkout
```

Importante: nunca coloque o `MERCADO_PAGO_ACCESS_TOKEN` no `index.html`, `script.js` ou qualquer arquivo pÃºblico.

## Deploy no Render

### OpÃ§Ã£o 1: Deploy pelo GitHub

1. Crie um repositÃ³rio no GitHub.
2. Envie estes arquivos para o repositÃ³rio.
3. Entre no Render.
4. Clique em **New +** e depois **Web Service**.
5. Conecte o repositÃ³rio do GitHub.
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

### OpÃ§Ã£o 2: Blueprint

O arquivo `render.yaml` jÃ¡ estÃ¡ pronto para Blueprint.

No Render:

1. Clique em **New +**.
2. Escolha **Blueprint**.
3. Selecione o repositÃ³rio.
4. Confirme a criaÃ§Ã£o.
5. Preencha a variÃ¡vel secreta `MERCADO_PAGO_ACCESS_TOKEN`.

## Configurar domÃ­nio no Render

Depois que o serviÃ§o estiver publicado:

1. No Render, abra o serviÃ§o da DUO ACTIVE.
2. VÃ¡ em **Settings** e depois **Custom Domains**.
3. Adicione:

```text
duoactive.com.br
www.duoactive.com.br
```

4. O Render vai mostrar os registros DNS necessÃ¡rios.
5. No Registro.br, aponte o domÃ­nio para os registros indicados pelo Render.
6. Aguarde a propagaÃ§Ã£o do DNS.

Depois disso, atualize as variÃ¡veis no Render para:

```env
PUBLIC_BASE_URL=https://www.duoactive.com.br
CHECKOUT_SUCCESS_URL=https://www.duoactive.com.br/#checkout
CHECKOUT_PENDING_URL=https://www.duoactive.com.br/#checkout
CHECKOUT_FAILURE_URL=https://www.duoactive.com.br/#checkout
```

## Comandos Ãºteis

Verificar sintaxe:

```powershell
npm run check
```

Rodar local:

```powershell
npm start
```
## E-mails transacionais com Resend

O projeto usa o SDK oficial do Resend para enviar e-mails transacionais pelo backend. Nenhuma chave fica no navegador.

Remetente configurado:

```text
Duo Active <pedidos@duoactive.com.br>
```

Configure no Render:

```env
RESEND_API_KEY=SUA_CHAVE_RESEND
EMAIL_FROM=Duo Active <pedidos@duoactive.com.br>
MERCADO_PAGO_WEBHOOK_SECRET=SEGREDO_DO_WEBHOOK_MERCADO_PAGO
```

Antes de enviar em producao, verifique o dominio `duoactive.com.br` no painel do Resend para liberar o remetente `pedidos@duoactive.com.br`.

### E-mails implementados

- **Pedido recebido**: enviado quando o servidor cria a preferencia de pagamento no Mercado Pago. Inclui nome, numero do pedido, produtos, tamanhos, quantidades e total.
- **Pagamento aprovado**: enviado somente pelo webhook `/api/webhooks/mercadopago`, depois que o servidor consulta o pagamento pela API do Mercado Pago e confirma `status: approved`.
- **Pedido enviado**: template pronto para disparo manual futuro com codigo de rastreio pela rota segura `POST /api/orders/send-shipped-email`.

### Webhook Mercado Pago

Configure no painel Mercado Pago Developers a URL:

```text
https://www.duoactive.com.br/api/webhooks/mercadopago
```

O webhook valida `x-signature`, `x-request-id` e `data.id` usando `MERCADO_PAGO_WEBHOOK_SECRET`. Depois consulta o pagamento em `https://api.mercadopago.com/v1/payments/{id}` antes de enviar o e-mail de pagamento aprovado.

A rota evita duplicidade por numero de pedido enquanto a instancia do servidor estiver ativa.

