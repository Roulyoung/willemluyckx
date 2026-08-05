import fs from "fs";
import crypto from "crypto";

const SHEET_ID = "1vd2rMjxAyBDn5lSWLJwBNJ1NI8FD0OlMcQ4WR-diLwA";
const SERVICE_ACCOUNT_PATH = "worker/secretgogle/service-account.json";

const serviceAccount = JSON.parse(fs.readFileSync(SERVICE_ACCOUNT_PATH, "utf8"));

const base64url = (input) =>
  Buffer.from(input)
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");

async function getToken() {
  const now = Math.floor(Date.now() / 1000);
  const header = base64url(JSON.stringify({ alg: "RS256", typ: "JWT" }));
  const claimSet = base64url(
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
  const jwt = `${unsigned}.${base64url(signer.sign(serviceAccount.private_key))}`;

  const response = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
      assertion: jwt,
    }),
  });

  const payload = await response.json();
  if (!response.ok) throw new Error(JSON.stringify(payload));
  return payload.access_token;
}

async function readRange(token, range) {
  const response = await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/${encodeURIComponent(range)}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  const payload = await response.json();
  if (!response.ok) throw new Error(JSON.stringify(payload));
  return Array.isArray(payload.values) ? payload.values : [];
}

async function writeRange(token, range, values) {
  const response = await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/${encodeURIComponent(range)}?valueInputOption=USER_ENTERED`, {
    method: "PUT",
    headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
    body: JSON.stringify({ values }),
  });
  const payload = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(JSON.stringify(payload));
}

async function clearRange(token, range) {
  const response = await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/${encodeURIComponent(range)}:clear`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
    body: JSON.stringify({}),
  });
  const payload = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(JSON.stringify(payload));
}

const keepV1 = (rows) => {
  const [header, ...body] = rows;
  return [header, ...body.filter((row) => String(row[1] ?? "") === "V1")];
};

const token = await getToken();
const rounds = keepV1(await readRange(token, "ReviewRounds!A:Z"));
const items = keepV1(await readRange(token, "ReviewItems!A:Z"));
const approvals = keepV1(await readRange(token, "ReviewApprovals!A:Z"));

await clearRange(token, "ReviewRounds!A:Z");
await clearRange(token, "ReviewItems!A:Z");
await clearRange(token, "ReviewApprovals!A:Z");

await writeRange(token, "ReviewRounds!A:Z", rounds);
await writeRange(token, "ReviewItems!A:Z", items);
await writeRange(token, "ReviewApprovals!A:Z", approvals);

console.log(JSON.stringify({ rounds: rounds.length, items: items.length, approvals: approvals.length }, null, 2));
