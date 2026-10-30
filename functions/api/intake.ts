import { getAccessToken, parseServiceAccount } from "../lib/googleSheets";

type IntakePayload = {
  name?: unknown;
  email?: unknown;
  phone?: unknown;
  health_consent?: unknown;
  health_consent_version?: unknown;
  health_consent_recorded_at?: unknown;
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
  birth_date?: unknown;
  training_years?: unknown;
  sports_history?: unknown;
  pr_5k?: unknown;
  pr_10k?: unknown;
  pr_half?: unknown;
  pr_marathon?: unknown;
  recent_times?: unknown;
  training_log?: unknown;
  training_overview_url?: unknown;
  available_days?: unknown;
  session_duration?: unknown;
  strength_training?: unknown;
  technique_training?: unknown;
  target_time?: unknown;
  race_date?: unknown;
  goal_other?: unknown;
  online_guidance?: unknown;
  product?: unknown;
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
  const birthDate = String(payload.birth_date ?? "").trim();
  const emailLooksValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  if (!name || !email || !phone || !birthDate || !emailLooksValid) {
    return Response.json({ ok: false, error: "Missing required fields" }, { status: 400 });
  }
  if (payload.health_consent !== true || !String(payload.health_consent_version ?? "").trim()) {
    return Response.json({ ok: false, error: "Explicit health-data consent required" }, { status: 400 });
  }

  const serviceAccount = parseServiceAccount(env as Record<string, unknown>);
  if (!serviceAccount?.client_email || !serviceAccount.private_key) {
    return Response.json({ ok: false, error: "Missing Google service account secret." }, { status: 503 });
  }

  const token = await getAccessToken(serviceAccount);
  const availableDays = Array.isArray(payload.available_days)
    ? payload.available_days.map((day) => String(day)).join(", ")
    : String(payload.available_days ?? "");
  const goal = [String(payload.goal ?? ""), String(payload.goal_other ?? "")].filter(Boolean).join(": ");
  const submittedAt = new Date().toISOString();
  const values = [
    [
      name,
      email,
      phone,
      goal,
      String(payload.race_distance ?? payload.goal ?? ""),
      String(payload.weekly_volume ?? payload.training_years ?? ""),
      String(payload.main_challenge ?? payload.training_log ?? ""),
      String(payload.injuries ?? ""),
      String(payload.support_type ?? payload.online_guidance ?? ""),
      String(payload.runs_per_week ?? ""),
      String(payload.timeline ?? payload.race_date ?? ""),
      String(payload.coaching_preference ?? availableDays),
      [
        String(payload.extra_notes ?? ""),
        `Explicit health-data consent: yes; version: ${String(payload.health_consent_version ?? "")}; recorded by server: ${new Date().toISOString()}`,
      ].filter(Boolean).join("\n"),
      birthDate,
      String(payload.training_years ?? ""),
      String(payload.sports_history ?? ""),
      String(payload.pr_5k ?? ""),
      String(payload.pr_10k ?? ""),
      String(payload.pr_half ?? ""),
      String(payload.pr_marathon ?? ""),
      String(payload.recent_times ?? ""),
      String(payload.training_log ?? ""),
      String(payload.training_overview_url ?? ""),
      availableDays,
      String(payload.session_duration ?? ""),
      String(payload.strength_training ?? ""),
      String(payload.technique_training ?? ""),
      String(payload.target_time ?? ""),
      String(payload.race_date ?? ""),
      String(payload.online_guidance ?? ""),
      String(payload.product ?? ""),
      String(payload.locale ?? "nl"),
      String(payload.source ?? "intake-page"),
      submittedAt,
      "TRUE",
      String(payload.health_consent_version ?? ""),
      String(payload.health_consent_recorded_at ?? ""),
    ],
  ];

  const extendedHeaders = [[
    "Geboortedatum",
    "Jaren training",
    "Sportverleden",
    "PR 5 km",
    "PR 10 km",
    "PR halve marathon",
    "PR marathon",
    "Beste tijden laatste 6 maanden",
    "Trainingslogboek laatste maand",
    "Link trainingsoverzicht",
    "Beschikbare trainingsdagen",
    "Tijd per training",
    "Krachttraining",
    "Looptechniektraining",
    "Gewenste eindtijd",
    "Wedstrijddatum",
    "Online gesprek",
    "Product",
    "Taal",
    "Bron",
    "Ingediend op",
    "Gezondheidstoestemming",
    "Toestemmingsversie",
    "Toestemming geregistreerd op",
  ]];

  const headerResponse = await fetch(
    `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/${encodeURIComponent("Intake!N1:AK1")}?valueInputOption=RAW`,
    {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ values: extendedHeaders }),
    },
  );
  if (!headerResponse.ok) {
    const headerJson = await headerResponse.json().catch(() => ({}));
    return Response.json(
      { ok: false, error: `Google Sheets header update failed (${headerResponse.status}): ${JSON.stringify(headerJson)}` },
      { status: 500 },
    );
  }

  const appendResponse = await fetch(
    `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/${encodeURIComponent("Intake!A:AE")}:append?valueInputOption=USER_ENTERED&insertDataOption=INSERT_ROWS`,
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
