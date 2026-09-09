import { NextResponse } from "next/server";

export const runtime = "nodejs";

/**
 * Заявки → Telegram и amoCRM.
 * Telegram: нужны TELEGRAM_BOT_TOKEN и TELEGRAM_CHAT_ID.
 * amoCRM: нужны AMO_SUBDOMAIN (например "inboxfortesgroupru") и AMO_TOKEN (долгосрочный токен).
 * Обе интеграции независимы — сбой одной не должен ронять заявку целиком.
 */

async function sendToAmo(params: { name?: string; phone: string; source?: string; page?: string; message?: string }) {
  const subdomain = process.env.AMO_SUBDOMAIN;
  const token = process.env.AMO_TOKEN;
  if (!subdomain || !token) {
    console.log("[LEAD — amoCRM не настроен]");
    return;
  }
  try {
    const leadName = `Заявка с сайта: ${params.page || params.source || "неизвестная страница"}`;
    const noteText = [
      params.source ? `Источник: ${params.source}` : "",
      params.message ? `Сообщение: ${params.message}` : "",
    ].filter(Boolean).join("\n");

    const res = await fetch(`https://${subdomain}.amocrm.ru/api/v4/leads/complex`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      body: JSON.stringify([
        {
          name: leadName,
          _embedded: {
            tags: params.source ? [{ name: params.source }] : [],
            contacts: [
              {
                name: params.name || params.phone,
                custom_fields_values: [
                  { field_code: "PHONE", values: [{ value: params.phone, enum_code: "WORK" }] },
                ],
              },
            ],
          },
        },
      ]),
    });
    if (!res.ok) {
      console.error("[LEAD — ошибка amoCRM]", res.status, await res.text());
      return;
    }
    const data = await res.json().catch(() => null);
    const leadId = data?._embedded?.leads?.[0]?.id;
    if (leadId && noteText) {
      await fetch(`https://${subdomain}.amocrm.ru/api/v4/leads/${leadId}/notes`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
        body: JSON.stringify([{ note_type: "common", params: { text: noteText } }]),
      }).catch((e) => console.error("[LEAD — ошибка заметки amoCRM]", e));
    }
  } catch (e) {
    console.error("[LEAD — ошибка amoCRM]", e);
  }
}

export async function POST(req: Request) {
  let body: { name?: string; phone?: string; message?: string; source?: string; page?: string; website?: string } = {};
  try { body = await req.json(); } catch { return NextResponse.json({ ok: false, error: "bad json" }, { status: 400 }); }

  // honeypot: скрытое поле "website" заполняют только боты. Отвечаем "успехом", ничего не отправляя и не подсказывая боту.
  if ((body.website || "").toString().trim().length > 0) {
    console.log("[LEAD — отклонено honeypot]", { ip: req.headers.get("x-forwarded-for") || "—" });
    return NextResponse.json({ ok: true });
  }

  const phone = (body.phone || "").toString().trim();
  const digits = phone.replace(/\D/g, "");
  // ожидаем 11 цифр целиком: код страны (7) + 10 цифр номера
  if (digits.length !== 11) return NextResponse.json({ ok: false, error: "phone" }, { status: 400 });

  const text = [
    "🟥 Заявка с сайта",
    `Источник: ${body.source || "—"}`,
    `Имя: ${body.name || "—"}`,
    `Телефон: ${phone}`,
    body.message ? `Сообщение: ${body.message}` : "",
    body.page ? `Страница: ${body.page}` : "",
  ].filter(Boolean).join("\n");

  const amoParams = { name: body.name, phone, source: body.source, page: body.page, message: body.message };

  const token = process.env.TELEGRAM_BOT_TOKEN, chat = process.env.TELEGRAM_CHAT_ID;
  if (!token || !chat) {
    console.log("[LEAD — Telegram не настроен]", text.replace(/\n/g, " | "));
    await sendToAmo(amoParams);
    return NextResponse.json({ ok: false, fallback: true });
  }
  try {
    const r = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ chat_id: chat, text }) });
    if (!r.ok) throw new Error(await r.text());
    await sendToAmo(amoParams);
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("[LEAD — ошибка Telegram]", e, text.replace(/\n/g, " | "));
    await sendToAmo(amoParams);
    return NextResponse.json({ ok: false, fallback: true });
  }
}
