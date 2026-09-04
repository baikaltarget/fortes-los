"use client";
import { useState } from "react";
import { company } from "@/lib/content";

type Status = "idle" | "sending" | "ok" | "fallback" | "error";

export default function LeadForm({ source = "site", compact = false, presetMessage = "" }: { source?: string; compact?: boolean; presetMessage?: string }) {
  const [status, setStatus] = useState<Status>("idle");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [msg, setMsg] = useState(presetMessage);
  const [agree, setAgree] = useState(true);

  const tgText = encodeURIComponent(`Заявка с сайта (${source})\nИмя: ${name}\nТелефон: ${phone}\n${msg}`);
  const tgLink = `https://t.me/${company.telegramUser}?text=${tgText}`;

  async function submit() {
    if (!phone.trim() || !agree) return;
    setStatus("sending");
    try {
      const r = await fetch("/api/lead", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ name, phone, message: msg, source, page: typeof window !== "undefined" ? window.location.href : "" }) });
      const j = await r.json();
      setStatus(j.ok ? "ok" : j.fallback ? "fallback" : "error");
    } catch {
      setStatus("error");
    }
  }

  if (status === "ok") {
    return (
      <div className="card p-6 md:p-8 border border-ok/30" role="status">
        <div className="text-2xl font-extrabold tracking-tight">Заявка отправлена</div>
        <p className="mt-2 text-ink/80">Перезвоним в течение 30 минут в рабочее время ({company.hours}). Если срочно — {company.phone}.</p>
      </div>
    );
  }

  return (
    <div className={`card ${compact ? "p-5" : "p-6 md:p-8"} shadow-card`}>
      {!compact && (
        <>
          <h3 className="text-2xl">Рассчитать стоимость под ключ</h3>
          <p className="mt-1 text-muted text-[15px]">Перезвоним за 30 минут в рабочее время, сориентируем по цене и запишем на бесплатный выезд инженера.</p>
        </>
      )}
      <div className={`mt-4 grid gap-3 ${compact ? "" : "sm:grid-cols-2"}`}>
        <input className="input" placeholder="Имя" value={name} onChange={(e) => setName(e.target.value)} autoComplete="name" />
        <input className="input" placeholder="Телефон *" value={phone} onChange={(e) => setPhone(e.target.value)} type="tel" autoComplete="tel" required aria-required />
        {!compact && <textarea className="input h-24 py-3 sm:col-span-2 resize-none" placeholder="Сколько человек, дом или дача, посёлок — что знаете" value={msg} onChange={(e) => setMsg(e.target.value)} />}
      </div>
      <label className="mt-3 flex items-start gap-2 text-[13px] text-muted cursor-pointer">
        <input type="checkbox" checked={agree} onChange={(e) => setAgree(e.target.checked)} className="mt-0.5 accent-brand" />
        <span>Соглашаюсь с <a href="/politika/" className="underline">политикой конфиденциальности</a></span>
      </label>
      <div className="mt-4 flex flex-col sm:flex-row gap-2">
        <button type="button" onClick={submit} disabled={status === "sending" || !phone.trim() || !agree} className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed">
          {status === "sending" ? "Отправляем…" : "Получить расчёт"}
        </button>
        <a href={tgLink} target="_blank" rel="noopener" className="btn-outline">Написать в Telegram</a>
      </div>
      {status === "fallback" && (
        <p className="mt-3 text-[14px] text-ink/80" role="status">Отправка заявок через сайт ещё не настроена. Позвоните {company.phone} или нажмите «Написать в Telegram» — сообщение уже заполнено.</p>
      )}
      {status === "error" && (
        <p className="mt-3 text-[14px] text-brand" role="alert">Не удалось отправить. Позвоните {company.phone} или напишите в Telegram.</p>
      )}
    </div>
  );
}
