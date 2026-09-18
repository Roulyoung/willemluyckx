import { spawn } from "node:child_process";
import { setTimeout as delay } from "node:timers/promises";

const port = Number(process.env.PORT ?? 5173);
const host = process.env.HOST ?? "localhost";
const url = `http://${host}:${port}`;
const chromePath = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";

const vite = spawn("npm", ["exec", "vite", "--", "--host", host, "--port", String(port)], {
  stdio: "inherit",
  shell: true,
});

const openChrome = async () => {
  await delay(1200);
  const chrome = spawn(chromePath, [url], {
    detached: true,
    stdio: "ignore",
  });
  chrome.unref();
};

void openChrome().catch(() => undefined);

vite.on("exit", (code) => {
  process.exit(code ?? 0);
});
