import { NextResponse } from "next/server";

export const runtime = "nodejs";

/** Заявки → Telegram. Нужны TELEGRAM_BOT_TOKEN и TELEGRAM_CHAT_ID в переменных окружения Vercel. */
export async function POST(req: Request) {
  let body: { name?: string; phone?: string; message?: string; source?: string; page?: string } = {};
  try { body = await req.json(); } catch { return NextResponse.json({ ok: false, error: "bad json" }, { status: 400 }); }
  const phone = (body.phone || "").toString().trim();
  if (phone.replace(/\D/g, "").length < 10) return NextResponse.json({ ok: false, error: "phone" }, { status: 400 });

  const text = [
    "🟥 Заявка с сайта",
    `Источник: ${body.source || "—"}`,
    `Имя: ${body.name || "—"}`,
    `Телефон: ${phone}`,
    body.message ? `Сообщение: ${body.message}` : "",
    body.page ? `Страница: ${body.page}` : "",
  ].filter(Boolean).join("\n");

  const token = process.env.TELEGRAM_BOT_TOKEN, chat = process.env.TELEGRAM_CHAT_ID;
  if (!token || !chat) {
    console.log("[LEAD — Telegram не настроен]", text.replace(/\n/g, " | "));
    return NextResponse.json({ ok: false, fallback: true });
  }
  try {
    const r = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ chat_id: chat, text }) });
    if (!r.ok) throw new Error(await r.text());
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("[LEAD — ошибка Telegram]", e, text.replace(/\n/g, " | "));
    return NextResponse.json({ ok: false, fallback: true });
  }
}
