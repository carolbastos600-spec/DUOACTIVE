import { createServer } from "node:http";
import { readFile } from "node:fs/promises";
import { extname, join, normalize } from "node:path";
import { fileURLToPath } from "node:url";

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

const PIX_DISCOUNT_RATE = 0.05;

const roundMoney = (value) => Math.round((Number(value) + Number.EPSILON) * 100) / 100;

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

const normalizePreferenceItems = (payload) => {
  const rawItems = Array.isArray(payload.items) ? payload.items : [payload];
  const paymentMethod = getPaymentMethod(payload);

  const items = rawItems.map((item) => {
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

    const pixDiscount = paymentMethod === "pix" ? roundMoney(unitPrice * PIX_DISCOUNT_RATE) : 0;
    const finalUnitPrice = roundMoney(unitPrice - pixDiscount);

    return {
      title: `${title} - Tamanho ${size}`,
      description: `Tamanho ${size}`,
      quantity,
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

const createPreference = async (request, response) => {
  if (!process.env.MERCADO_PAGO_ACCESS_TOKEN) {
    sendJson(response, 500, {
      error: "Configure MERCADO_PAGO_ACCESS_TOKEN no Render para ativar o checkout.",
    });
    return;
  }

  try {
    const payload = await readJsonBody(request);
    const paymentMethod = getPaymentMethod(payload);
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
        payment_methods: getPaymentMethodRules(paymentMethod),
        metadata: {
          payment_method_selected: paymentMethod,
          coupon_code: String(payload.coupon_code || "").trim(),
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

    sendJson(response, 200, {
      id: preference.id,
      init_point: preference.init_point,
      sandbox_init_point: preference.sandbox_init_point,
    });
  } catch (error) {
    sendJson(response, 400, {
      error: error instanceof Error ? error.message : "Erro inesperado ao iniciar checkout.",
    });
  }
};

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
    response.writeHead(200, {
      "Content-Type": mimeTypes[extname(filePath)] || "application/octet-stream",
    });
    response.end(file);
  } catch {
    response.writeHead(404);
    response.end("Arquivo nao encontrado");
  }
};

createServer(async (request, response) => {
  if (request.method === "GET" && request.url === "/health") {
    sendJson(response, 200, { status: "ok" });
    return;
  }

  if (request.method === "POST" && request.url === "/api/create-preference") {
    await createPreference(request, response);
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
