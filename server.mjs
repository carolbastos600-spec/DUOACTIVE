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

const createPreference = async (request, response) => {
  if (!process.env.MERCADO_PAGO_ACCESS_TOKEN) {
    sendJson(response, 500, {
      error: "Configure MERCADO_PAGO_ACCESS_TOKEN para ativar o checkout.",
    });
    return;
  }

  try {
    const item = await readJsonBody(request);
    const unitPrice = Number(item.unit_price);

    if (!item.title || !Number.isFinite(unitPrice) || unitPrice <= 0) {
      sendJson(response, 400, { error: "Produto inválido para checkout." });
      return;
    }

    const mercadoPagoResponse = await fetch("https://api.mercadopago.com/checkout/preferences", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.MERCADO_PAGO_ACCESS_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        items: [
          {
            title: item.title,
            quantity: Number(item.quantity || 1),
            unit_price: unitPrice,
            currency_id: "BRL",
          },
        ],
        payment_methods: {
          installments: 6,
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
  } catch {
    sendJson(response, 500, { error: "Erro inesperado ao iniciar checkout." });
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
    response.end("Arquivo não encontrado");
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
  response.end("Método não permitido");
}).listen(port, host, () => {
  console.log(`DUO ACTIVE disponível em http://${host}:${port}/`);
});
