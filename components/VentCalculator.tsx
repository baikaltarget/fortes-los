"use client";
import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import vent from "@/content/ventilyaciya.json";
import LeadForm from "./LeadForm";
import { NP } from "@/lib/content";
import { reachGoal } from "@/components/Analytics";

/** Калькулятор вентиляции дома (v32): пять вопросов → ориентир по позициям. Ставки — ventilyaciya.json → calculator.rates (draft). */
const R = vent.calculator.rates as Record<string, number>;
const rub = (n: number) => new Intl.NumberFormat("ru-RU").format(n) + " ₽";

const Q = {
  area: [{ v: 60, l: "До 60 м² — дача, баня" }, { v: 100, l: "80–120 м²" }, { v: 150, l: "130–170 м²" }, { v: 220, l: "180–250 м²" }, { v: 300, l: "Больше 250 м²" }],
  wet: [{ v: 1, l: "Один санузел" }, { v: 2, l: "Два санузла" }, { v: 3, l: "Три и больше" }],
  scheme: [{ v: "basic", l: "Вытяжки + приточные клапаны в стенах" }, { v: "breezer", l: "Вытяжки + бризеры с подогревом в спальнях" }, { v: "recup", l: "Приточно-вытяжная установка с рекуперацией Turkov" }],
  stage: [{ v: "build", l: "Стройка — потолки ещё открыты" }, { v: "done", l: "Дом готов, потолки чистовые" }],
  extra: [{ v: "none", l: "Без доп. опций" }, { v: "auto", l: "Автоматика: датчики CO₂ и влажности, приложение" }, { v: "auto-boiler", l: "Автоматика + вытяжка котельной и гаража" }],
};

export default function VentCalculator() {
  const [step, setStep] = useState(0);
  const [area, setArea] = useState(100);
  const [wet, setWet] = useState(2);
  const [scheme, setScheme] = useState("recup");
  const [stage, setStage] = useState("build");
  const [extra, setExtra] = useState("none");

  const steps = [
    { q: "Площадь дома", opts: Q.area, val: area, set: (v: number) => setArea(v) },
    { q: "Сколько санузлов?", opts: Q.wet, val: wet, set: (v: number) => setWet(v) },
    { q: "Какая схема вентиляции?", opts: Q.scheme, val: scheme, set: (v: string) => setScheme(v) },
    { q: "На каком этапе дом?", opts: Q.stage, val: stage, set: (v: string) => setStage(v) },
    { q: "Автоматика и доп. вытяжки", opts: Q.extra, val: extra, set: (v: string) => setExtra(v) },
  ] as const;

  const result = useMemo(() => {
    const lines: [string, number][] = [];
    const rooms = Math.max(2, Math.round(area / 30)); // жилые комнаты
    lines.push([`Вытяжка санузлов: ${wet} шт. — канальные вентиляторы, воздуховоды, проход кровли`, wet * R.exhaustPoint]);
    lines.push(["Вытяжка кухни (общеобменная, отдельно от зонта)", R.kitchen]);
    if (scheme === "basic") lines.push([`Приточные клапаны в стенах: ${rooms} шт.`, rooms * R.valve]);
    if (scheme === "breezer") lines.push([`Бризеры с подогревом: ${Math.min(rooms, 3)} шт.`, Math.min(rooms, 3) * R.breezer]);
    if (scheme === "recup") {
      lines.push([`Установка Turkov с рекуперацией, ~${Math.round(area * 2.2 / 50) * 50} м³/ч`, R.recuperatorBase + area * R.recuperatorPerM2]);
      lines.push([`Воздуховоды в ${rooms} комнат, шумоглушители, решётки, утепление на чердаке`, area * (stage === "done" ? R.ductPerM2Wood : R.ductPerM2)]);
      if (stage === "done") lines.push(["Короба и разборка/восстановление потолков в коридоре", R.attic]);
    }
    if (extra !== "none") lines.push(["Автоматика: датчики CO₂ и влажности, расписание, приложение", R.automation]);
    if (extra === "auto-boiler") lines.push(["Вытяжка котельной и гаража", 2 * R.boilerRoom]);
    const sub = lines.reduce((s, l) => s + l[1], 0);
    if (sub < R.minTurnkey) lines.push(["Доведение до минимального заказа по дому", R.minTurnkey - sub]);
    const total = lines.reduce((s, l) => s + l[1], 0);
    return { lines, total, rooms };
  }, [area, wet, scheme, stage, extra]);

  const done = step >= steps.length;
  useEffect(() => { if (done) reachGoal("calculator_complete"); }, [done]);

  const summary = `Калькулятор вентиляции: ${area} м², санузлов ${wet}, схема: ${Q.scheme.find((s) => s.v === scheme)?.l}, этап: ${Q.stage.find((s) => s.v === stage)?.l}, доп.: ${Q.extra.find((e) => e.v === extra)?.l}. Ориентир: ~${rub(result.total)}.`;

  return (
    <div className="grid gap-6 lg:grid-cols-[1.1fr_1fr] items-start">
      <div className="card p-6 md:p-8 shadow-card">
        <div className="flex items-center justify-between text-[13px] text-muted">
          <span>{done ? "Готово" : `Вопрос ${step + 1} из ${steps.length}`}</span>
          {step > 0 && !done && <button type="button" className="underline" onClick={() => setStep(step - 1)}>Назад</button>}
        </div>
        <div className="mt-2 h-1.5 rounded-full bg-line overflow-hidden" aria-hidden>
          <div className="h-full bg-brand transition-all" style={{ width: `${(Math.min(step, steps.length) / steps.length) * 100}%` }} />
        </div>
        {!done ? (
          <div className="mt-6">
            <h3 className="text-2xl">{steps[step].q}</h3>
            {step === 2 && <p className="mt-2 text-[14px] text-muted">Рекуператор возвращает до 80% тепла — для дома на электроотоплении окупается за 3–4 сезона.</p>}
            <div className="mt-5 grid gap-2 sm:grid-cols-2">
              {steps[step].opts.map((o) => {
                const active = steps[step].val === o.v;
                return (
                  <button key={String(o.v)} type="button"
                    onClick={() => { (steps[step].set as (v: never) => void)(o.v as never); setStep(step + 1); }}
                    className={`text-left rounded-btn border-2 px-4 py-3 font-medium transition-colors ${active ? "border-ink bg-ink text-white" : "border-line bg-white hover:border-ink"}`}>
                    {o.l}
                  </button>
                );
              })}
            </div>
          </div>
        ) : (
          <div className="mt-6">
            <div className="text-[13px] text-muted">Ориентировочно</div>
            <h3 className="text-3xl mt-1">{rub(result.total)}</h3>
            <p className="mt-2 text-ink/80">Смета в договоре фиксируется построчно: установка, воздуховоды, вентиляторы, решётки, автоматика, пусконаладка. Точный расход установки считаем по каждому помещению.</p>
            <table className="mt-5 w-full text-[15px]">
              <tbody>
                {result.lines.map(([k, v]) => (
                  <tr key={k} className="border-b border-line"><td className="py-2 pr-3">{k}</td><td className="py-2 text-right font-medium whitespace-nowrap">{rub(v)}</td></tr>
                ))}
                <tr><td className="py-3 font-bold">Итого ориентировочно</td><td className="py-3 text-right text-2xl font-extrabold tracking-tight whitespace-nowrap">{rub(result.total)}</td></tr>
              </tbody>
            </table>
            <p className="text-[13px] text-muted mt-2">Вентиляцию удобно считать вместе с отоплением: рекуператор снижает нагрузку на котёл, воздуховоды и трубы делят одно перекрытие.</p>
            <div className="mt-4 flex flex-wrap gap-2">
              <Link href={NP.page("pritochno-vytyazhnaya-ventilyaciya-s-rekuperaciej")} className="btn-outline">Про рекуперацию</Link>
              <button type="button" className="btn-ghost" onClick={() => setStep(0)}>Пересчитать</button>
            </div>
          </div>
        )}
      </div>
      <div className="lg:sticky lg:top-24">
        {done ? (
          <LeadForm source="калькулятор вентиляции" presetMessage={summary} />
        ) : (
          <div className="card p-6 md:p-8">
            <h3 className="text-xl">Как считаем</h3>
            <ul className="mt-3 text-[15px] text-ink/80 space-y-2 leading-relaxed">
              <li>Вытяжки — по числу санузлов, кухни и котельной: канальный вентилятор, утеплённый воздуховод, проход кровли.</li>
              <li>Приток — клапаны, бризеры или установка с рекуперацией по площади и числу комнат.</li>
              <li>Воздуховоды — по м² дома; в готовом доме дороже из-за коробов и потолков.</li>
              <li>Минимальный заказ по дому — 50 000 ₽; коммерческие объекты — по запросу.</li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
