"use client";
import { useState } from "react";
import { company } from "@/lib/content";
import { extractLocalDigits, maskPhone, fullPhone, isPhoneComplete } from "@/lib/phone";
import { reachGoal } from "@/components/Analytics";

type Status = "idle" | "sending" | "ok" | "fallback" | "error";

export default function LeadForm({ source = "site", compact = false, presetMessage = "" }: { source?: string; compact?: boolean; presetMessage?: string }) {
  const [status, setStatus] = useState<Status>("idle");
  const [name, setName] = useState("");
  const [phoneDigits, setPhoneDigits] = useState("");
  const [msg, setMsg] = useState(presetMessage);
  const [agree, setAgree] = useState(true);
  // honeypot: обычный пользователь это поле не видит и не заполняет, боты — заполняют
  const [hp, setHp] = useState("");

  const phoneReady = isPhoneComplete(phoneDigits);
  const phoneValue = phoneDigits ? fullPhone(phoneDigits) : "";

  function onPhoneChange(e: React.ChangeEvent<HTMLInputElement>) {
    setPhoneDigits(extractLocalDigits(e.target.value));
  }

  async function submit() {
    if (!phoneReady || !agree) return;
    // если бот заполнил honeypot — тихо "успешно" завершаем, никуда не отправляя
    if (hp.trim()) {
      setStatus("ok");
      return;
    }
    setStatus("sending");
    try {
      const r = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          phone: phoneValue,
          message: msg,
          source,
          page: typeof window !== "undefined" ? window.location.href : "",
          website: hp,
        }),
      });
      const j = await r.json();
      setStatus(j.ok ? "ok" : j.fallback ? "fallback" : "error");
      if (j.ok || j.fallback) reachGoal("lead_form_success");
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
        <input
          className="input"
          placeholder="+7 (___) ___-__-__"
          value={phoneDigits ? maskPhone(phoneDigits) : ""}
          onChange={onPhoneChange}
          type="tel"
          inputMode="numeric"
          autoComplete="tel"
          required
          aria-required
        />
        {!compact && <textarea className="input h-24 py-3 sm:col-span-2 resize-none" placeholder="Сколько человек, дом или дача, посёлок — что знаете" value={msg} onChange={(e) => setMsg(e.target.value)} />}
      </div>
      {/* honeypot: скрыто от людей визуально и от скринридеров, но видно ботам-заполнялкам форм */}
      <div className="w-0 h-0 overflow-hidden opacity-0 pointer-events-none" aria-hidden="true">
        <label htmlFor={`website-${source}`}>Website</label>
        <input
          id={`website-${source}`}
          name="website"
          type="text"
          tabIndex={-1}
          autoComplete="off"
          value={hp}
          onChange={(e) => setHp(e.target.value)}
        />
      </div>
      <label className="mt-3 flex items-start gap-2 text-[13px] text-muted cursor-pointer">
        <input type="checkbox" checked={agree} onChange={(e) => setAgree(e.target.checked)} className="mt-0.5 accent-brand" />
        <span>Соглашаюсь с <a href="/politika/" className="underline">политикой конфиденциальности</a></span>
      </label>
      <div className="mt-4 flex flex-col sm:flex-row sm:flex-wrap gap-2">
        <button type="button" onClick={submit} disabled={status === "sending" || !phoneReady || !agree} className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed">
          {status === "sending" ? "Отправляем…" : "Получить расчёт"}
        </button>
        <a href={company.telegramUrl} target="_blank" rel="noopener" className="btn-outline">
          <img src="/img/icons/telegram.webp" width={18} height={18} alt="" className="rounded-[4px]" />Telegram
        </a>
        <a href={company.maxUrl} target="_blank" rel="noopener" className="btn-outline">
          <img src="/img/icons/max.webp" width={18} height={18} alt="" className="rounded-[4px]" />MAX
        </a>
      </div>
      {status === "fallback" && (
        <p className="mt-3 text-[14px] text-ink/80" role="status">Отправка заявок через сайт ещё не настроена. Позвоните {company.phone} или напишите в Telegram/MAX выше.</p>
      )}
      {status === "error" && (
        <p className="mt-3 text-[14px] text-brand" role="alert">Не удалось отправить. Позвоните {company.phone} или напишите в Telegram/MAX выше.</p>
      )}
    </div>
  );
}
