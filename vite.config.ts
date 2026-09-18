import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import fs from "fs";
import crypto from "crypto";
import type { IncomingMessage, ServerResponse } from "http";
import { componentTagger } from "lovable-tagger";
import type { ViteDevServer } from "vite";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [
    react(),
    mode === "development" &&
      componentTagger(),
    mode === "development" && {
      name: "dev-proposition-api",
      configureServer(server: ViteDevServer) {
        server.middlewares.use(async (req: IncomingMessage, res: ServerResponse, next: () => void) => {
          const requestPath = req.url?.split("?")[0];
          const isContent = req.method === "GET" && requestPath === "/api/topfit";
          if (!isContent && (req.method !== "POST" || requestPath !== "/api/newsletter")) { next(); return; }
          try {
            const chunks: Buffer[] = [];
            for await (const chunk of req) chunks.push(Buffer.from(chunk));
            const keyPath = path.resolve(__dirname, "worker/secretgogle/service-account.json");
            const env = { GOOGLE_SERVICE_ACCOUNT_JSON: process.env.GOOGLE_SERVICE_ACCOUNT_JSON || (fs.existsSync(keyPath) ? fs.readFileSync(keyPath, "utf8") : "") };
            const handlers = await server.ssrLoadModule(isContent ? "/functions/api/topfit.ts" : "/functions/api/newsletter.ts");
            const handler = isContent ? handlers.onRequestGet : handlers.onRequestPost;
            const request = new Request(`https://topfitrunning.com${req.url}`, { method: req.method, ...(isContent ? {} : { body: Buffer.concat(chunks).toString("utf8") }) });
            const response: Response = await handler({ request, env });
            res.writeHead(response.status, Object.fromEntries(response.headers));
            res.end(await response.text());
          } catch {
            res.writeHead(503, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ ok: false, error: "Newsletter temporarily unavailable" }));
          }
        });
      },
    },
    mode === "development" && {
      name: "dev-intake-api",
      configureServer(server: ViteDevServer) {
        server.middlewares.use(async (req: IncomingMessage, res: ServerResponse, next: () => void) => {
          if (req.method !== "POST" || req.url !== "/api/intake") {
            next();
            return;
          }

          try {
            const chunks: Buffer[] = [];
            for await (const chunk of req) chunks.push(Buffer.from(chunk));
            const body = Buffer.concat(chunks).toString("utf8");
            const payload = body ? JSON.parse(body) : {};
            const name = String(payload.name ?? "").trim();
            const email = String(payload.email ?? "").trim();
            const phone = String(payload.phone ?? "").trim();
            const emailLooksValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

            if (!name || !email || !phone || !emailLooksValid) {
              res.writeHead(400, { "Content-Type": "application/json" });
              res.end(JSON.stringify({ ok: false, error: "Missing required fields" }));
              return;
            }

            const saPath = path.resolve(__dirname, "worker/secretgogle/service-account.json");
            const serviceAccount = JSON.parse(fs.readFileSync(saPath, "utf8"));
            const now = Math.floor(Date.now() / 1000);
            const base64Url = (value: string) =>
              Buffer.from(value)
                .toString("base64")
                .replace(/\+/g, "-")
                .replace(/\//g, "_")
                .replace(/=+$/, "");
            const header = base64Url(JSON.stringify({ alg: "RS256", typ: "JWT" }));
            const claimSet = base64Url(
              JSON.stringify({
                iss: serviceAccount.client_email,
                scope: "https://www.googleapis.com/auth/spreadsheets",
                aud: "https://oauth2.googleapis.com/token",
                exp: now + 3600,
                iat: now,
              }),
            );
            const unsigned = `${header}.${claimSet}`;
            const signer = crypto.createSign("RSA-SHA256");
            signer.update(unsigned);
            const signature = signer.sign(serviceAccount.private_key);
            const jwt = `${unsigned}.${signature
              .toString("base64")
              .replace(/\+/g, "-")
              .replace(/\//g, "_")
              .replace(/=+$/, "")}`;

            const tokenRes = await fetch("https://oauth2.googleapis.com/token", {
              method: "POST",
              headers: { "Content-Type": "application/x-www-form-urlencoded" },
              body: new URLSearchParams({
                grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
                assertion: jwt,
              }),
            });
            const tokenJson = await tokenRes.json();
            if (!tokenRes.ok) throw new Error(JSON.stringify(tokenJson));

            const values = [[
              name,
              email,
              phone,
              String(payload.goal ?? ""),
              String(payload.race_distance ?? ""),
              String(payload.weekly_volume ?? ""),
              String(payload.main_challenge ?? ""),
              String(payload.injuries ?? ""),
              String(payload.support_type ?? ""),
              String(payload.runs_per_week ?? ""),
              String(payload.timeline ?? ""),
              String(payload.coaching_preference ?? ""),
              String(payload.extra_notes ?? ""),
            ]];

            const appendRes = await fetch(
              "https://sheets.googleapis.com/v4/spreadsheets/1vd2rMjxAyBDn5lSWLJwBNJ1NI8FD0OlMcQ4WR-diLwA/values/Intake!A:M:append?valueInputOption=USER_ENTERED&insertDataOption=INSERT_ROWS",
              {
                method: "POST",
                headers: {
                  Authorization: `Bearer ${tokenJson.access_token}`,
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({ values }),
              },
            );

            const appendText = await appendRes.text();
            if (!appendRes.ok) {
              throw new Error(appendText || `Sheets append failed (${appendRes.status})`);
            }

            res.writeHead(200, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ ok: true }));
          } catch (error) {
            res.writeHead(500, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ ok: false, error: error instanceof Error ? error.message : "Failed" }));
          }
        });
      },
    },
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
