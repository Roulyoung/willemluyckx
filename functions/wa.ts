const normalizeWhatsappNumber = (value: string) => {
  const trimmed = String(value || "").trim();
  if (!trimmed) return "";

  const withoutPlus = trimmed.replace(/^\+/, "");
  const digits = withoutPlus.replace(/\D+/g, "");

  if (digits.length < 8 || digits.length > 15) return "";
  return digits;
};

const getDefaultMessage = (pathname: string) => {
  if (pathname.startsWith("/en")) return "Hi TopFit Running, I have a question about coaching, subscriptions or the shop.";
  if (pathname.startsWith("/he")) return "Hi TopFit Running, I have a question about coaching, subscriptions or the shop.";
  return "Hoi TopFit Running, ik heb een vraag over coaching, abonnementen of de shop.";
};

export const onRequest: PagesFunction = async ({ request, env }) => {
  const url = new URL(request.url);
  const referrer = request.headers.get("Referer") || "";
  const refPath = (() => {
    try {
      return new URL(referrer).pathname;
    } catch {
      return "";
    }
  })();

  const phoneRaw =
    String((env as Record<string, unknown>)?.WHATSAPP_E164 || "").trim() ||
    String((env as Record<string, unknown>)?.WHATSAPP_NUMBER || "").trim() ||
    "31647264454";
  const phone = normalizeWhatsappNumber(phoneRaw);

  if (!phone) {
    return Response.redirect("https://topfitrunning.com/nl/contact", 302);
  }

  const customText = String(url.searchParams.get("text") || "").trim();
  const text = customText || getDefaultMessage(refPath);

  const target = new URL(`https://wa.me/${phone}`);
  target.searchParams.set("text", text.slice(0, 500));

  return new Response(null, {
    status: 302,
    headers: {
      Location: target.toString(),
      "Cache-Control": "no-store",
    },
  });
};

