import { getAccessToken, parseServiceAccount } from "../lib/googleSheets";

type IntakePayload = {
  name?: unknown;
  email?: unknown;
  phone?: unknown;
  goal?: unknown;
  race_distance?: unknown;
  weekly_volume?: unknown;
  main_challenge?: unknown;
  injuries?: unknown;
  support_type?: unknown;
  runs_per_week?: unknown;
  timeline?: unknown;
  coaching_preference?: unknown;
  extra_notes?: unknown;
  locale?: unknown;
  source?: unknown;
};


const SHEET_ID = "1vd2rMjxAyBDn5lSWLJwBNJ1NI8FD0OlMcQ4WR-diLwA";

const readJson = async (request: Request): Promise<IntakePayload> => {
  try {
    return (await request.json()) as IntakePayload;
  } catch {
    return {};
  }
};

export const onRequestPost: PagesFunction = async ({ request, env }) => {
  const payload = await readJson(request);
  const name = String(payload.name ?? "").trim();
  const email = String(payload.email ?? "").trim();
  const phone = String(payload.phone ?? "").trim();
  const emailLooksValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  if (!name || !email || !phone || !emailLooksValid) {
    return Response.json({ ok: false, error: "Missing required fields" }, { status: 400 });
  }

  const serviceAccount = parseServiceAccount(env as Record<string, unknown>);
  if (!serviceAccount?.client_email || !serviceAccount.private_key) {
    return Response.json({ ok: false, error: "Missing Google service account secret." }, { status: 503 });
  }

  const token = await getAccessToken(serviceAccount);
  const values = [
    [
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
    ],
  ];

  const appendResponse = await fetch(
    `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/${encodeURIComponent("Intake!A:M")}:append?valueInputOption=USER_ENTERED&insertDataOption=INSERT_ROWS`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        values,
      }),
    },
  );

  const appendJson = await appendResponse.json().catch(() => ({}));
  if (!appendResponse.ok) {
    return Response.json(
      { ok: false, error: `Google Sheets API request failed (${appendResponse.status}): ${JSON.stringify(appendJson)}` },
      { status: 500 },
    );
  }

  return Response.json(
    {
      ok: true,
      locale: String(payload.locale ?? "nl"),
      source: String(payload.source ?? "intake-page"),
      brand: "TopFit Running",
    },
    {
      headers: {
        "Cache-Control": "no-store",
        "Access-Control-Allow-Origin": "*",
      },
    },
  );
};

export const onRequestOptions: PagesFunction = async () =>
  new Response(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Accept",
      "Access-Control-Max-Age": "86400",
    },
  });
