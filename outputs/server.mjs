import { createServer } from "node:http";
import { createHmac, timingSafeEqual } from "node:crypto";
import { readFile, writeFile } from "node:fs/promises";
import { extname, join, normalize } from "node:path";
import { fileURLToPath } from "node:url";
import { Resend } from "resend";

const root = fileURLToPath(new URL(".", import.meta.url));

const loadEnvFile = async () => {
  try {
    const envFile = await readFile(join(root, ".env"), "utf8");
    envFile
      .split(/\r?\n/)
      .map((line) => line.trim())
      .filter((line) => line && !line.startsWith("#"))
      .forEach((line) => {
        const separator = line.indexOf("=");
        if (separator === -1) return;
        const key = line.slice(0, separator).trim();
        const value = line.slice(separator + 1).trim();
        if (key && process.env[key] == null) process.env[key] = value;
      });
  } catch {
    // The .env file is optional; environment variables can be set by the hosting provider.
  }
};

await loadEnvFile();

const port = Number(process.env.PORT || 4174);
const host = process.env.HOST || "0.0.0.0";
const publicBaseUrl = process.env.PUBLIC_BASE_URL || `http://127.0.0.1:${port}`;
const emailFrom = process.env.EMAIL_FROM || "Duo Active <pedidos@duoactive.com.br>";
const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

const ordersByNumber = new Map();
const emailIdempotencyPath = join(root, ".email-idempotency.json");
let sentEmailKeys = new Set();

const mimeTypes = {
  ".css": "text/css; charset=utf-8",
  ".html": "text/html; charset=utf-8",
  ".jpeg": "image/jpeg",
  ".jpg": "image/jpeg",
  ".js": "text/javascript; charset=utf-8",
  ".png": "image/png",
};

const sendJson = (response, status, payload) => {
  response.writeHead(status, { "Content-Type": "application/json; charset=utf-8" });
  response.end(JSON.stringify(payload));
};

const readJsonBody = async (request) => {
  const chunks = [];
  for await (const chunk of request) chunks.push(chunk);
  return JSON.parse(Buffer.concat(chunks).toString("utf8") || "{}");
};
const loadEmailIdempotency = async () => {
  try {
    const data = JSON.parse(await readFile(emailIdempotencyPath, "utf8"));
    sentEmailKeys = new Set(Array.isArray(data.sent) ? data.sent : []);
  } catch {
    sentEmailKeys = new Set();
  }
};

const rememberEmailKey = async (key) => {
  sentEmailKeys.add(key);
  try {
    await writeFile(
      emailIdempotencyPath,
      JSON.stringify({ sent: [...sentEmailKeys], updated_at: new Date().toISOString() }, null, 2)
    );
  } catch (error) {
    console.warn("Nao foi possivel persistir idempotencia local de e-mail.", error);
  }
};

const PIX_DISCOUNT_RATE = 0.05;

const roundMoney = (value) => Math.round((Number(value) + Number.EPSILON) * 100) / 100;

const formatMoney = (value) =>
  new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(Number(value || 0));

const escapeHtml = (value) =>
  String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");

const makeOrderNumber = () => {
  const stamp = Date.now().toString(36).toUpperCase();
  const suffix = Math.random().toString(36).slice(2, 6).toUpperCase();
  return `DUO-${stamp}-${suffix}`;
};

const getPaymentMethod = (payload) =>
  payload.payment_method === "credit_card" ? "credit_card" : "pix";

const getPaymentMethodRules = (paymentMethod) => {
  if (paymentMethod === "credit_card") {
    return {
      installments: 6,
      excluded_payment_types: [{ id: "bank_transfer" }, { id: "ticket" }],
    };
  }

  return {
    installments: 1,
    excluded_payment_types: [{ id: "credit_card" }, { id: "debit_card" }, { id: "ticket" }],
  };
};

const normalizeCustomer = (payload) => {
  const customer = payload.customer || {};
  const name = String(customer.name || "").trim();
  const email = String(customer.email || "").trim().toLowerCase();

  if (!name) throw new Error("Informe o nome da cliente para continuar.");
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    throw new Error("Informe um e-mail valido para receber os dados do pedido.");
  }

  return { name, email };
};

const normalizeOrderItems = (payload) => {
  const rawItems = Array.isArray(payload.items) ? payload.items : [payload];

  return rawItems.map((item) => {
    const title = String(item.title || "").trim();
    const size = String(item.size || "").trim();
    const quantity = Number.parseInt(item.quantity, 10);
    const unitPrice = Number(item.unit_price);

    if (!title || !size || !Number.isInteger(quantity) || quantity < 1) {
      throw new Error("Revise os produtos, tamanhos e quantidades do carrinho.");
    }

    if (!Number.isFinite(unitPrice) || unitPrice <= 0) {
      throw new Error("Produto com preco invalido no carrinho.");
    }

    return {
      title,
      size,
      quantity,
      unit_price: roundMoney(unitPrice),
      line_total: roundMoney(unitPrice * quantity),
    };
  });
};

const normalizePreferenceItems = (payload) => {
  const paymentMethod = getPaymentMethod(payload);
  const orderItems = normalizeOrderItems(payload);

  const items = orderItems.map((item) => {
    const pixDiscount = paymentMethod === "pix" ? roundMoney(item.unit_price * PIX_DISCOUNT_RATE) : 0;
    const finalUnitPrice = roundMoney(item.unit_price - pixDiscount);

    return {
      title: `${item.title} - Tamanho ${item.size}`,
      description: `Tamanho ${item.size}`,
      quantity: item.quantity,
      unit_price: finalUnitPrice,
      currency_id: "BRL",
    };
  });

  const shipping = roundMoney(payload.shipping || 0);

  if (shipping > 0) {
    items.push({
      title: "Frete",
      quantity: 1,
      unit_price: shipping,
      currency_id: "BRL",
    });
  }

  return items;
};

const buildOrder = (payload, orderNumber) => {
  const customer = normalizeCustomer(payload);
  const items = normalizeOrderItems(payload);
  const subtotal = roundMoney(items.reduce((total, item) => total + item.line_total, 0));
  const shipping = roundMoney(payload.shipping || 0);
  const paymentMethod = getPaymentMethod(payload);
  const pixDiscount = paymentMethod === "pix" ? roundMoney(subtotal * PIX_DISCOUNT_RATE) : 0;
  const couponDiscount = roundMoney(payload.summary?.coupon_discount || 0);
  const total = roundMoney(Math.max(0, subtotal + shipping - pixDiscount - couponDiscount));

  return {
    orderNumber,
    customer,
    items,
    paymentMethod,
    couponCode: String(payload.coupon_code || "").trim(),
    summary: { subtotal, shipping, pixDiscount, couponDiscount, total },
    createdAt: new Date().toISOString(),
  };
};

const orderRowsHtml = (items) =>
  items
    .map(
      (item) => `
        <tr>
          <td style="padding:12px 0;border-bottom:1px solid #e8e2d8;">
            <strong>${escapeHtml(item.title)}</strong><br />
            <span style="color:#777777;">Tamanho ${escapeHtml(item.size)} · Quantidade ${item.quantity}</span>
          </td>
          <td align="right" style="padding:12px 0;border-bottom:1px solid #e8e2d8;font-weight:700;">
            ${formatMoney(item.line_total)}
          </td>
        </tr>`
    )
    .join("");

const layoutEmail = ({ title, preview, content }) => `<!doctype html>
<html lang="pt-BR">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>${escapeHtml(title)}</title>
  </head>
  <body style="margin:0;background:#f8f5ef;color:#1e1e1e;font-family:Arial,Helvetica,sans-serif;">
    <span style="display:none!important;opacity:0;color:transparent;height:0;width:0;overflow:hidden;">${escapeHtml(preview)}</span>
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#f8f5ef;padding:28px 14px;">
      <tr>
        <td align="center">
          <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:640px;background:#ffffff;border:1px solid #e8e2d8;border-radius:8px;overflow:hidden;">
            <tr>
              <td style="padding:28px 28px 18px;border-bottom:1px solid #e8e2d8;">
                <div style="font-family:Georgia,'Times New Roman',serif;font-size:34px;letter-spacing:0;color:#111111;">DUO ACTIVE</div>
                <div style="margin-top:8px;font-size:12px;font-weight:700;letter-spacing:0.16em;text-transform:uppercase;color:#777777;">Moda fitness</div>
              </td>
            </tr>
            <tr>
              <td style="padding:28px;">${content}</td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;

const orderSummaryHtml = (order) => `
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin-top:18px;border-collapse:collapse;">
    ${orderRowsHtml(order.items)}
  </table>
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin-top:18px;">
    <tr><td style="padding:5px 0;color:#777777;">Subtotal</td><td align="right" style="padding:5px 0;">${formatMoney(order.summary.subtotal)}</td></tr>
    <tr><td style="padding:5px 0;color:#777777;">Frete</td><td align="right" style="padding:5px 0;">${formatMoney(order.summary.shipping)}</td></tr>
    <tr><td style="padding:5px 0;color:#777777;">Desconto PIX</td><td align="right" style="padding:5px 0;">-${formatMoney(order.summary.pixDiscount)}</td></tr>
    <tr><td style="padding:5px 0;color:#777777;">Cupom</td><td align="right" style="padding:5px 0;">-${formatMoney(order.summary.couponDiscount)}</td></tr>
    <tr><td style="padding:14px 0 0;border-top:1px solid #e8e2d8;font-size:18px;font-weight:800;">Total</td><td align="right" style="padding:14px 0 0;border-top:1px solid #e8e2d8;font-size:18px;font-weight:800;">${formatMoney(order.summary.total)}</td></tr>
  </table>`;

const sendEmailOnce = async ({ key, to, subject, html }) => {
  if (!to) return { skipped: "missing-recipient" };
  if (sentEmailKeys.has(key)) return { skipped: "duplicate-local" };
  if (!resend) {
    console.warn(`Resend nao configurado. E-mail nao enviado: ${subject}`);
    return { skipped: "missing-resend-key" };
  }

  const { data, error } = await resend.emails.send(
    { from: emailFrom, to: [to], subject, html },
    { idempotencyKey: key }
  );

  if (error) {
    console.error("Erro ao enviar e-mail Resend", error);
    return { error };
  }

  await rememberEmailKey(key);
  return { data };
};

const sendOrderReceivedEmail = (order) =>
  sendEmailOnce({
    key: `order-received:${order.orderNumber}`,
    to: order.customer.email,
    subject: `Pedido recebido ${order.orderNumber} | DUO ACTIVE`,
    html: layoutEmail({
      title: "Pedido recebido | DUO ACTIVE",
      preview: `Recebemos seu pedido ${order.orderNumber}.`,
      content: `
        <h1 style="margin:0 0 12px;font-family:Georgia,'Times New Roman',serif;font-size:34px;font-weight:400;line-height:1.05;">Pedido recebido</h1>
        <p style="margin:0 0 16px;color:#777777;line-height:1.6;">Oi, ${escapeHtml(order.customer.name)}. Recebemos seu pedido <strong>${escapeHtml(order.orderNumber)}</strong>. Assim que o pagamento for aprovado, voce recebera uma nova confirmacao.</p>
        ${orderSummaryHtml(order)}
      `,
    }),
  });

const sendPaymentApprovedEmail = (order, paymentId) =>
  sendEmailOnce({
    key: `payment-approved/${paymentId}`,
    to: order.customer.email,
    subject: `Pagamento aprovado ${order.orderNumber} | DUO ACTIVE`,
    html: layoutEmail({
      title: "Pagamento aprovado | DUO ACTIVE",
      preview: `Pagamento aprovado para o pedido ${order.orderNumber}.`,
      content: `
        <h1 style="margin:0 0 12px;font-family:Georgia,'Times New Roman',serif;font-size:34px;font-weight:400;line-height:1.05;">Pagamento aprovado</h1>
        <p style="margin:0 0 16px;color:#777777;line-height:1.6;">Seu pagamento foi aprovado. Vamos preparar o pedido <strong>${escapeHtml(order.orderNumber)}</strong> com carinho.</p>
        ${orderSummaryHtml(order)}
      `,
    }),
  });

const sendOrderShippedEmail = ({ order, trackingCode }) =>
  sendEmailOnce({
    key: `order-shipped:${order.orderNumber}:${trackingCode}`,
    to: order.customer.email,
    subject: `Pedido enviado ${order.orderNumber} | DUO ACTIVE`,
    html: layoutEmail({
      title: "Pedido enviado | DUO ACTIVE",
      preview: `Seu pedido ${order.orderNumber} foi enviado.`,
      content: `
        <h1 style="margin:0 0 12px;font-family:Georgia,'Times New Roman',serif;font-size:34px;font-weight:400;line-height:1.05;">Pedido enviado</h1>
        <p style="margin:0 0 16px;color:#777777;line-height:1.6;">Seu pedido <strong>${escapeHtml(order.orderNumber)}</strong> saiu para entrega.</p>
        <p style="margin:0 0 18px;padding:14px 16px;background:#f8f5ef;border:1px solid #e8e2d8;border-radius:6px;"><strong>Codigo de rastreio:</strong> ${escapeHtml(trackingCode)}</p>
        ${orderSummaryHtml(order)}
      `,
    }),
  });

const validateMercadoPagoWebhook = ({ request, url, payload, paymentId }) => {
  const secret = process.env.MERCADO_PAGO_WEBHOOK_SECRET;
  if (!secret) throw new Error("Configure MERCADO_PAGO_WEBHOOK_SECRET para validar webhooks.");

  const xSignature = request.headers["x-signature"] || "";
  const xRequestId = request.headers["x-request-id"] || "";
  const parts = Object.fromEntries(
    String(xSignature)
      .split(",")
      .map((part) => part.split("=").map((value) => value.trim()))
      .filter(([key, value]) => key && value)
  );

  const ts = parts.ts;
  const receivedSignature = parts.v1;
  const dataId = String(url.searchParams.get("data.id") || payload?.data?.id || paymentId || "").toLowerCase();

  if (!ts || !receivedSignature || !xRequestId || !dataId) {
    throw new Error("Webhook Mercado Pago sem assinatura completa.");
  }

  const manifest = `id:${dataId};request-id:${xRequestId};ts:${ts};`;
  const expectedSignature = createHmac("sha256", secret).update(manifest).digest("hex");
  const received = Buffer.from(receivedSignature, "hex");
  const expected = Buffer.from(expectedSignature, "hex");

  if (received.length !== expected.length || !timingSafeEqual(received, expected)) {
    throw new Error("Assinatura Mercado Pago invalida.");
  }
};

const fetchMercadoPagoPayment = async (paymentId) => {
  const response = await fetch(`https://api.mercadopago.com/v1/payments/${paymentId}`, {
    headers: { Authorization: `Bearer ${process.env.MERCADO_PAGO_ACCESS_TOKEN}` },
  });

  const payment = await response.json();
  if (!response.ok) throw new Error(payment.message || "Nao foi possivel consultar o pagamento.");
  return payment;
};

const orderFromPaymentFallback = (payment) => {
  const orderNumber = payment.external_reference || payment.metadata?.order_number || `MP-${payment.id}`;
  const items = Array.isArray(payment.additional_info?.items)
    ? payment.additional_info.items.map((item) => ({
        title: item.title || "Produto DUO ACTIVE",
        size: item.description?.replace(/^Tamanho\s*/i, "") || "-",
        quantity: Number(item.quantity || 1),
        unit_price: Number(item.unit_price || 0),
        line_total: roundMoney(Number(item.unit_price || 0) * Number(item.quantity || 1)),
      }))
    : [];
  const total = roundMoney(payment.transaction_amount || 0);

  return {
    orderNumber,
    customer: {
      name: payment.payer?.first_name || "Cliente DUO ACTIVE",
      email: payment.payer?.email || payment.metadata?.customer_email || "",
    },
    items,
    paymentMethod: payment.payment_type_id || "mercado_pago",
    couponCode: payment.metadata?.coupon_code || "",
    summary: { subtotal: total, shipping: 0, pixDiscount: 0, couponDiscount: 0, total },
    createdAt: payment.date_created || new Date().toISOString(),
  };
};

const createPreference = async (request, response) => {
  if (!process.env.MERCADO_PAGO_ACCESS_TOKEN) {
    sendJson(response, 500, { error: "Configure MERCADO_PAGO_ACCESS_TOKEN no Render para ativar o checkout." });
    return;
  }

  try {
    const payload = await readJsonBody(request);
    const paymentMethod = getPaymentMethod(payload);
    const orderNumber = makeOrderNumber();
    const order = buildOrder(payload, orderNumber);
    const items = normalizePreferenceItems(payload);

    if (!items.length) {
      sendJson(response, 400, { error: "Adicione produtos ao carrinho antes de finalizar." });
      return;
    }

    const mercadoPagoResponse = await fetch("https://api.mercadopago.com/checkout/preferences", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.MERCADO_PAGO_ACCESS_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        items,
        external_reference: orderNumber,
        notification_url: `${publicBaseUrl}/api/webhooks/mercadopago`,
        payer: {
          name: order.customer.name,
          email: order.customer.email,
        },
        payment_methods: getPaymentMethodRules(paymentMethod),
        metadata: {
          order_number: orderNumber,
          customer_name: order.customer.name,
          customer_email: order.customer.email,
          payment_method_selected: paymentMethod,
          coupon_code: order.couponCode,
          subtotal: order.summary.subtotal,
          shipping: order.summary.shipping,
          pix_discount: order.summary.pixDiscount,
          coupon_discount: order.summary.couponDiscount,
          total: order.summary.total,
        },
        back_urls: {
          success: process.env.CHECKOUT_SUCCESS_URL || `${publicBaseUrl}/#checkout`,
          pending: process.env.CHECKOUT_PENDING_URL || `${publicBaseUrl}/#checkout`,
          failure: process.env.CHECKOUT_FAILURE_URL || `${publicBaseUrl}/#checkout`,
        },
        auto_return: "approved",
      }),
    });

    const preference = await mercadoPagoResponse.json();

    if (!mercadoPagoResponse.ok) {
      sendJson(response, mercadoPagoResponse.status, {
        error: preference.message || "Erro ao criar pagamento no Mercado Pago.",
      });
      return;
    }

    ordersByNumber.set(orderNumber, { ...order, preferenceId: preference.id });
    await sendOrderReceivedEmail(order);

    sendJson(response, 200, {
      id: preference.id,
      order_number: orderNumber,
      init_point: preference.init_point,
      sandbox_init_point: preference.sandbox_init_point,
    });
  } catch (error) {
    sendJson(response, 400, {
      error: error instanceof Error ? error.message : "Erro inesperado ao iniciar checkout.",
    });
  }
};

const handleMercadoPagoWebhook = async (request, response) => {
  if (!process.env.MERCADO_PAGO_ACCESS_TOKEN) {
    sendJson(response, 500, { error: "Configure MERCADO_PAGO_ACCESS_TOKEN." });
    return;
  }

  try {
    const url = new URL(request.url, `http://${request.headers.host}`);
    const payload = await readJsonBody(request);
    const paymentId = url.searchParams.get("data.id") || payload?.data?.id || payload?.id;

    if (!paymentId) {
      sendJson(response, 200, { received: true, ignored: "missing-payment-id" });
      return;
    }

    validateMercadoPagoWebhook({ request, url, payload, paymentId });
    const payment = await fetchMercadoPagoPayment(paymentId);

    if (payment.status !== "approved") {
      sendJson(response, 200, { received: true, status: payment.status });
      return;
    }

    const orderNumber = payment.external_reference || payment.metadata?.order_number || `MP-${payment.id}`;
    const order = ordersByNumber.get(orderNumber) || orderFromPaymentFallback(payment);
    await sendPaymentApprovedEmail(order, payment.id);
    ordersByNumber.set(orderNumber, { ...order, paymentId: payment.id, paymentStatus: payment.status });

    sendJson(response, 200, { received: true, status: payment.status, order_number: orderNumber });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Erro no webhook Mercado Pago.";
    const status = message.includes("Assinatura") || message.includes("Webhook Mercado Pago") ? 401 : 400;
    sendJson(response, status, { error: message });
  }
};

const handleOrderShippedEmail = async (request, response) => {
  try {
    const secret = process.env.MERCADO_PAGO_WEBHOOK_SECRET;
    const receivedSecret = request.headers["x-duo-admin-secret"];

    if (!secret || receivedSecret !== secret) {
      sendJson(response, 401, { error: "Acesso negado." });
      return;
    }

    const payload = await readJsonBody(request);
    const order = ordersByNumber.get(payload.order_number);
    const trackingCode = String(payload.tracking_code || "").trim();

    if (!order) {
      sendJson(response, 404, { error: "Pedido nao encontrado nesta instancia." });
      return;
    }

    if (!trackingCode) {
      sendJson(response, 400, { error: "Informe o codigo de rastreio." });
      return;
    }

    await sendOrderShippedEmail({ order, trackingCode });
    sendJson(response, 200, { sent: true, order_number: order.orderNumber });
  } catch (error) {
    sendJson(response, 400, { error: error instanceof Error ? error.message : "Erro ao enviar e-mail." });
  }
};

await loadEmailIdempotency();

const serveStatic = async (request, response) => {
  const url = new URL(request.url, `http://${request.headers.host}`);
  const requestedPath = url.pathname === "/" ? "/index.html" : decodeURIComponent(url.pathname);
  const filePath = normalize(join(root, requestedPath));

  if (!filePath.startsWith(normalize(root))) {
    response.writeHead(403);
    response.end("Acesso negado");
    return;
  }

  try {
    const file = await readFile(filePath);
    response.writeHead(200, { "Content-Type": mimeTypes[extname(filePath)] || "application/octet-stream" });
    response.end(file);
  } catch {
    response.writeHead(404);
    response.end("Arquivo nao encontrado");
  }
};

createServer(async (request, response) => {
  const url = new URL(request.url, `http://${request.headers.host}`);

  if (request.method === "GET" && url.pathname === "/health") {
    sendJson(response, 200, { status: "ok" });
    return;
  }

  if (request.method === "POST" && url.pathname === "/api/create-preference") {
    await createPreference(request, response);
    return;
  }

  if (request.method === "POST" && url.pathname === "/api/webhooks/mercadopago") {
    await handleMercadoPagoWebhook(request, response);
    return;
  }

  if (request.method === "POST" && url.pathname === "/api/orders/send-shipped-email") {
    await handleOrderShippedEmail(request, response);
    return;
  }

  if (request.method === "GET") {
    await serveStatic(request, response);
    return;
  }

  response.writeHead(405);
  response.end("Metodo nao permitido");
}).listen(port, host, () => {
  console.log(`DUO ACTIVE disponivel em http://${host}:${port}/`);
});


