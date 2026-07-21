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

A rota usa idempotencia baseada no ID do pagamento do Mercado Pago (`payment-approved/{payment_id}`) ao enviar pelo Resend. Essa chave impede duplicidade mesmo se o webhook for reenviado apos reinicio ou novo deploy, dentro da janela de idempotencia mantida pelo Resend. O servidor tambem grava um arquivo `.email-idempotency.json` como apoio local quando o ambiente permite escrita.


### E-mail obrigatorio no checkout

Antes do redirecionamento ao Mercado Pago, o carrinho exige nome e e-mail da cliente. Esses dados sao enviados ao backend em POST /api/create-preference, associados ao numero do pedido e gravados nos metadados da preferencia do Mercado Pago.


## Melhor Envio

O carrinho calcula frete real pelo backend usando a API do Melhor Envio. As credenciais e tokens ficam somente no servidor; nada e exposto no HTML, CSS ou JavaScript publico.

Configure no Render:

```env
MELHOR_ENVIO_CLIENT_ID=SEU_CLIENT_ID
MELHOR_ENVIO_CLIENT_SECRET=SEU_CLIENT_SECRET
MELHOR_ENVIO_REDIRECT_URI=https://duoactive.com.br/api/melhor-envio/callback
MELHOR_ENVIO_FROM_POSTAL_CODE=CEP_DE_ORIGEM_DA_LOJA
MELHOR_ENVIO_TOKEN_FILE=/var/data/melhor-envio-tokens.json
MELHOR_ENVIO_TECHNICAL_EMAIL=pedidos@duoactive.com.br
```

Depois do deploy, abra esta rota uma vez para autorizar a loja:

```text
https://duoactive.com.br/api/melhor-envio/autorizar
```

O callback troca o codigo OAuth por access token e refresh token, grava os tokens no arquivo definido por `MELHOR_ENVIO_TOKEN_FILE` e renova o access token automaticamente no mesmo arquivo quando estiver perto de vencer. Em producao, use `/var/data/melhor-envio-tokens.json` com disco persistente no Render. O servidor cria a pasta e o arquivo automaticamente quando necessario. Nunca envie esse arquivo para o GitHub.

O carrinho consulta o ViaCEP para preencher rua, bairro, cidade e estado. Depois chama `POST /api/frete/calcular`, que refaz a cotacao no Melhor Envio com produtos, quantidade, peso e dimensoes. A opcao escolhida e obrigatoria e o servidor recalcula o frete antes de criar a preferencia do Mercado Pago, impedindo alteracao do valor pelo navegador.

### User-Agent

As chamadas para o Melhor Envio usam:

```text
Duo Active (pedidos@duoactive.com.br)
```

Se o e-mail tecnico cadastrado no Melhor Envio for outro, configure `EMAIL_FROM` ou `MELHOR_ENVIO_TECHNICAL_EMAIL` no Render.

### Peso e dimensoes dos produtos

Os perfis iniciais usados para cotacao estao em `outputs/server.mjs`:

- Conjunto short: 25 x 30 x 4 cm, 0,35 kg
- Bermuda: 25 x 30 x 4 cm, 0,38 kg
- Legging: 28 x 35 x 5 cm, 0,50 kg
- Legging flare: 28 x 35 x 5 cm, 0,52 kg
- Macaquinho: 28 x 35 x 5 cm, 0,48 kg
- Top: 22 x 28 x 3 cm, 0,22 kg

Antes de vender em producao, pese e meça as pecas embaladas para ajustar esses valores com precisao.
