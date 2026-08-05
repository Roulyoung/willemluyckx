type ReviewDraftPayload = {
  token?: unknown;
  version?: unknown;
  currentPageIndex?: unknown;
  completedPages?: unknown;
  pageStatuses?: unknown;
  sectionStatuses?: unknown;
  notes?: unknown;
  updatedAt?: unknown;
  mode?: unknown;
};

type ServiceAccount = { client_email: string; private_key: string };

const SHEET_ID = "1vd2rMjxAyBDn5lSWLJwBNJ1NI8FD0OlMcQ4WR-diLwA";
const REVIEW_RANGE = "ReviewRounds!A:Z";
const REVIEW_ITEMS_RANGE = "ReviewItems!A:Z";
const REVIEW_APPROVALS_RANGE = "ReviewApprovals!A:Z";

const getAdminKey = (env: Record<string, unknown>) =>
  String(env.ADMIN_REVIEW_KEY ?? env.ADMIN_KEY ?? "").trim();

const isAuthorized = (request: Request, env: Record<string, unknown>) => {
  const adminKey = getAdminKey(env);
  if (!adminKey) return true;
  return request.headers.get("X-Admin-Key") === adminKey;
};

const isAdminListRequest = (request: Request) => {
  const url = new URL(request.url);
  return request.method === "GET" && !url.searchParams.get("token");
};

const makeReviewKey = (token: string, version: string) => `${token}::${version}`;

const readJson = async (request: Request): Promise<ReviewDraftPayload> => {
  try {
    return (await request.json()) as ReviewDraftPayload;
  } catch {
    return {};
  }
};

const parseServiceAccount = (env: Record<string, unknown>): ServiceAccount | null => {
  const raw = [env.GOOGLE_SERVICE_ACCOUNT_JSON, env.GOOGLE_SHEETS_SERVICE_ACCOUNT_JSON]
    .map((value) => String(value ?? "").trim())
    .find(Boolean);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as ServiceAccount;
  } catch {
    return null;
  }
};

const bytesToBase64Url = (bytes: Uint8Array) => {
  let binary = "";
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
};

const stringToBase64Url = (value: string) => bytesToBase64Url(new TextEncoder().encode(value));

const pemToArrayBuffer = (pem: string) => {
  const body = pem.replace(/-----BEGIN PRIVATE KEY-----/, "").replace(/-----END PRIVATE KEY-----/, "").replace(/\s+/g, "");
  const binary = atob(body);
  const bytes = new Uint8Array(binary.length);
  for (let index = 0; index < binary.length; index += 1) bytes[index] = binary.charCodeAt(index);
  return bytes.buffer;
};

async function getAccessToken(serviceAccount: ServiceAccount) {
  const now = Math.floor(Date.now() / 1000);
  const header = stringToBase64Url(JSON.stringify({ alg: "RS256", typ: "JWT" }));
  const claimSet = stringToBase64Url(
    JSON.stringify({
      iss: serviceAccount.client_email,
      scope: "https://www.googleapis.com/auth/spreadsheets",
      aud: "https://oauth2.googleapis.com/token",
      exp: now + 3600,
      iat: now,
    }),
  );
  const unsigned = `${header}.${claimSet}`;
  const key = await crypto.subtle.importKey(
    "pkcs8",
    pemToArrayBuffer(serviceAccount.private_key),
    { name: "RSASSA-PKCS1-v1_5", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const signature = await crypto.subtle.sign("RSASSA-PKCS1-v1_5", key, new TextEncoder().encode(unsigned));
  const jwt = `${unsigned}.${bytesToBase64Url(new Uint8Array(signature))}`;

  const response = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
      assertion: jwt,
    }),
  });

  const payload = await response.json();
  if (!response.ok) throw new Error(`Token request failed: ${JSON.stringify(payload)}`);
  return payload.access_token as string;
}

const appendRows = async (accessToken: string, range: string, values: string[][]) => {
  if (!values.length) return null;
  const response = await fetch(
    `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/${encodeURIComponent(range)}:append?valueInputOption=USER_ENTERED&insertDataOption=INSERT_ROWS`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ values }),
    },
  );
  const payload = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(`Google Sheets API request failed (${response.status}) on ${range}: ${JSON.stringify(payload)}`);
  }
  return payload;
};

const clearRange = async (accessToken: string, range: string) => {
  const response = await fetch(
    `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/${encodeURIComponent(range)}:clear`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({}),
    },
  );
  const payload = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(`Google Sheets API request failed (${response.status}) on clear ${range}: ${JSON.stringify(payload)}`);
  }
  return payload;
};

const writeRows = async (accessToken: string, range: string, values: string[][]) => {
  const response = await fetch(
    `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/${encodeURIComponent(range)}?valueInputOption=USER_ENTERED`,
    {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ values }),
    },
  );
  const payload = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(`Google Sheets API request failed (${response.status}) on write ${range}: ${JSON.stringify(payload)}`);
  }
  return payload;
};

const appendReviewSnapshot = async (accessToken: string, payload: ReviewDraftPayload) => {
  const reviewHeader = ["token", "version", "current_page_index", "updated_at", "status", "payload_json"];
  const itemHeader = ["token", "version", "item_type", "page_key", "section_key", "status", "note", "current_page_index", "updated_at"];
  const approvalHeader = ["token", "version", "approved_at", "status"];
  const reviewRows = [[
    String(payload.token ?? "").trim(),
    String(payload.version ?? "V1"),
    String(Number(payload.currentPageIndex ?? 0)),
    String(payload.updatedAt ?? new Date().toISOString()),
    String(payload.mode ?? "needs_review"),
    JSON.stringify({
      token: String(payload.token ?? "").trim(),
      version: String(payload.version ?? "V1"),
      currentPageIndex: Number(payload.currentPageIndex ?? 0),
      completedPages: payload.completedPages ?? {},
      pageStatuses: payload.pageStatuses ?? {},
      sectionStatuses: payload.sectionStatuses ?? {},
      notes: payload.notes ?? {},
      updatedAt: String(payload.updatedAt ?? new Date().toISOString()),
    }),
  ]];

  const itemRows = buildItemRows(payload);
  await appendRows(accessToken, REVIEW_RANGE, reviewRows);
  await appendRows(accessToken, REVIEW_ITEMS_RANGE, itemRows);

  if (String(payload.mode ?? "") === "final_approved") {
    await appendRows(accessToken, REVIEW_APPROVALS_RANGE, [[
      String(payload.token ?? "").trim(),
      String(payload.version ?? "V1"),
      String(payload.updatedAt ?? new Date().toISOString()),
      "approved",
    ]]);
  }
};

const rowToSnapshot = (row: string[]) => ({
  token: row[0] ?? "",
  version: row[1] ?? "V1",
  currentPageIndex: Number(row[2] ?? 0),
  updatedAt: row[3] ?? "",
  status: row[4] ?? "needs_review",
  payload: row[5] ?? "",
});

const buildItemRows = (payload: ReviewDraftPayload) => {
  const token = String(payload.token ?? "").trim();
  const version = String(payload.version ?? "V1");
  const currentPageIndex = String(Number(payload.currentPageIndex ?? 0));
  const updatedAt = String(payload.updatedAt ?? new Date().toISOString());
  const pageStatuses = (payload.pageStatuses ?? {}) as Record<string, unknown>;
  const sectionStatuses = (payload.sectionStatuses ?? {}) as Record<string, unknown>;
  const notes = (payload.notes ?? {}) as Record<string, unknown>;

  const pageRows = Object.entries(pageStatuses).map(([pageKey, status]) => [
    token,
    version,
    "page",
    pageKey,
    "",
    String(status ?? "pending"),
    String(notes[`page:${pageKey}`] ?? ""),
    currentPageIndex,
    updatedAt,
  ]);

  const sectionRows = Object.entries(sectionStatuses).map(([itemKey, status]) => {
    const [pageKey, sectionKey] = itemKey.split(":");
    return [
      token,
      version,
      "section",
      pageKey ?? "",
      sectionKey ?? "",
      String(status ?? "pending"),
      String(notes[`section:${itemKey}`] ?? ""),
      currentPageIndex,
      updatedAt,
    ];
  });

  return [...pageRows, ...sectionRows];
};

export const onRequestGet: PagesFunction = async ({ request, env }) => {
  const envRecord = env as Record<string, unknown>;
  if (isAdminListRequest(request) && !isAuthorized(request, envRecord)) {
    return Response.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }

  const url = new URL(request.url);
  const token = String(url.searchParams.get("token") ?? "").trim();
  const version = String(url.searchParams.get("version") ?? "").trim();
  const serviceAccount = parseServiceAccount(envRecord);
  if (!serviceAccount?.client_email || !serviceAccount.private_key) {
    return Response.json({ ok: false, error: "Missing Google service account secret." }, { status: 503 });
  }

  const accessToken = await getAccessToken(serviceAccount);
  const response = await fetch(
    `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/${encodeURIComponent(REVIEW_RANGE)}`,
    {
      headers: { Authorization: `Bearer ${accessToken}` },
    },
  );
  const payload = await response.json().catch(() => ({}));
  if (!response.ok) {
    return Response.json({ ok: false, error: `Google Sheets API request failed (${response.status}): ${JSON.stringify(payload)}` }, { status: 500 });
  }

  const rows = Array.isArray(payload.values) ? (payload.values as string[][]) : [];
  const snapshots = rows.slice(1).map(rowToSnapshot).filter((snapshot) => Boolean(snapshot.token));

  if (token) {
    const filtered = snapshots.filter((snapshot) => snapshot.token === token && (!version || snapshot.version === version));
    const latest = filtered[filtered.length - 1] ?? null;
    return Response.json({ ok: true, latest }, { headers: { "Cache-Control": "no-store", "Access-Control-Allow-Origin": "*" } });
  }

  const latestByToken = new Map<string, ReturnType<typeof rowToSnapshot>>();
  for (const snapshot of snapshots) {
    latestByToken.set(makeReviewKey(snapshot.token, snapshot.version), snapshot);
  }

  return Response.json(
    { ok: true, items: Array.from(latestByToken.values()) },
    { headers: { "Cache-Control": "no-store", "Access-Control-Allow-Origin": "*" } },
  );
};

export const onRequestPost: PagesFunction = async ({ request, env }) => {
  const envRecord = env as Record<string, unknown>;
  const payload = await readJson(request);
  const token = String(payload.token ?? "").trim();
  if (!token) {
    return Response.json({ ok: false, error: "Missing token" }, { status: 400 });
  }

  const serviceAccount = parseServiceAccount(envRecord);
  if (!serviceAccount?.client_email || !serviceAccount.private_key) {
    return Response.json({ ok: false, error: "Missing Google service account secret." }, { status: 503 });
  }

  const accessToken = await getAccessToken(serviceAccount);
  try {
    await appendReviewSnapshot(accessToken, payload);
  } catch (error) {
    return Response.json({ ok: false, error: error instanceof Error ? error.message : "Sheets append failed" }, { status: 500 });
  }

  return Response.json(
    {
      ok: true,
      snapshot: {
        token,
        version: String(payload.version ?? "V1"),
        currentPageIndex: Number(payload.currentPageIndex ?? 0),
        updatedAt: String(payload.updatedAt ?? new Date().toISOString()),
        status: String(payload.mode ?? "needs_review"),
      },
    },
    { headers: { "Cache-Control": "no-store", "Access-Control-Allow-Origin": "*" } },
  );
};

export const onRequestOptions: PagesFunction = async () =>
  new Response(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Accept",
      "Access-Control-Max-Age": "86400",
    },
  });
