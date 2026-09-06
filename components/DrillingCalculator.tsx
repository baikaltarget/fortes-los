"use client";
import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import bur from "@/content/burenie.json";
import LeadForm from "./LeadForm";
import { BP } from "@/lib/content";
import { reachGoal } from "@/components/Analytics";

const R = bur.calculator.rates as Record<string, number>;
const rub = (n: number) => new Intl.NumberFormat("ru-RU").format(n) + " ₽";

const Q = {
  depth: [{ v: 30, l: "До 35 м — долины Куды, Каи, Иркута" }, { v: 50, l: "35–60 м — большинство посёлков" }, { v: 80, l: "60–100 м — Байкальский тракт, Бурдаковка" }, { v: 110, l: "Больше 100 м — Мельничная Падь" }],
  build: [{ v: "steel", l: "Сталь — для дачи, первый горизонт" }, { v: "combo", l: "Металл + пластик — для дома, 50 лет" }, { v: "plastic", l: "Пластик НПВХ на всю глубину" }],
  fit: [{ v: "none", l: "Только бурение" }, { v: "summer", l: "Летнее: оголовок и насос" }, { v: "adapter", l: "Адаптер, оборудование в доме" }, { v: "kesson", l: "Кессон с обвязкой" }],
  entry: [{ v: 0, l: "Не нужен" }, { v: 8, l: "До 10 м" }, { v: 20, l: "10–30 м" }, { v: 40, l: "Больше 30 м" }],
  water: [{ v: "no", l: "Нет, сначала анализ" }, { v: "yes", l: "Да, заложить фильтр в смету" }],
};

export default function DrillingCalculator() {
  const [step, setStep] = useState(0);
  const [depth, setDepth] = useState(50);
  const [build, setBuild] = useState("combo");
  const [fit, setFit] = useState("kesson");
  const [entry, setEntry] = useState(8);
  const [water, setWater] = useState("no");

  const steps = [
    { q: "Ориентировочная глубина воды в вашем посёлке", opts: Q.depth, val: depth, set: (v: number) => setDepth(v) },
    { q: "Конструкция скважины", opts: Q.build, val: build, set: (v: string) => setBuild(v) },
    { q: "Обустройство", opts: Q.fit, val: fit, set: (v: string) => setFit(v) },
    { q: "Ввод воды в дом — длина трассы", opts: Q.entry, val: entry, set: (v: number) => setEntry(v) },
    { q: "Нужна ли водоочистка?", opts: Q.water, val: water, set: (v: string) => setWater(v) },
  ] as const;

  const result = useMemo(() => {
    const lines: [string, number][] = [];
    const meter = build === "steel" ? R.meterSteel : build === "combo" ? R.meterCombo : R.meterPlastic;
    const buildName = build === "steel" ? "стальная колонна" : build === "combo" ? "металл + пластик" : "пластик НПВХ";
    lines.push([`Бурение ~${depth} м, ${buildName}, обсадка, прокачка, паспорт`, depth * meter]);
    if (fit === "summer") lines.push(["Летнее обустройство: оголовок, кран", R.summer]);
    if (fit === "adapter") lines.push(["Скважинный адаптер с обвязкой", R.adapter]);
    if (fit === "kesson") lines.push(["Кессон с обвязкой и утеплением", R.kessonRings]);
    if (fit !== "none") {
      lines.push([`Насос с монтажом${depth > 60 ? " (глубокий, высокий напор)" : ""}`, R.pumpBase + (depth > 60 ? R.pumpDeepAdd : 0)]);
      if (fit !== "summer") lines.push(["Автоматика: гидроаккумулятор, реле, защита", R.automation]);
    }
    if (entry > 0 && fit !== "none") lines.push([`Ввод воды в дом ~${entry} м, гильза, утепление, проход фундамента`, entry * R.entryPerMeter + R.entryFixed]);
    if (water === "yes") lines.push(["Водоочистка (обезжелезивание) — по анализу", R.filtration]);
    const total = lines.reduce((s, l) => s + l[1], 0);
    return { lines, total, meter, buildName };
  }, [depth, build, fit, entry, water]);

  const done = step >= steps.length;
  useEffect(() => { if (done) reachGoal("calculator_complete"); }, [done]);

  const summary = `Калькулятор скважины: ~${depth} м, ${result.buildName}, обустройство: ${Q.fit.find((f) => f.v === fit)?.l}, ввод в дом: ${Q.entry.find((e) => e.v === entry)?.l}, водоочистка: ${water === "yes" ? "да" : "нет"}. Ориентир: ~${rub(result.total)}.`;

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
            {step === 0 && <p className="mt-2 text-[14px] text-muted">Не знаете? Посмотрите <Link href={BP.map} className="text-brand underline">карту глубин</Link> или выберите средний вариант.</p>}
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
            <p className="mt-2 text-ink/80">Бурение считается по метрам — {rub(result.meter)} за метр в конструкции «{result.buildName}». Итоговая глубина известна только после бурения, поэтому в договоре фиксируем цену метра.</p>
            <table className="mt-5 w-full text-[15px]">
              <tbody>
                {result.lines.map(([k, v]) => (
                  <tr key={k} className="border-b border-line"><td className="py-2 pr-3">{k}</td><td className="py-2 text-right font-medium whitespace-nowrap">{rub(v)}</td></tr>
                ))}
                <tr><td className="py-3 font-bold">Итого ориентировочно</td><td className="py-3 text-right text-2xl font-extrabold tracking-tight whitespace-nowrap">{rub(result.total)}</td></tr>
              </tbody>
            </table>
            <p className="text-[13px] text-muted mt-2">Для сравнения: обустройство скважины с кессоном из колец, насосом и вводом 4 м в Хайрюзовке — 90 957 ₽; скважина 52 м с кессоном, разводкой на 4 постройки и двумя септиками в Патронах — 615 246 ₽.</p>
            <div className="mt-4 flex flex-wrap gap-2">
              <Link href={BP.object("patrony-park-skvazhina-52")} className="btn-outline">Смотреть объект 52 м</Link>
              <button type="button" className="btn-ghost" onClick={() => setStep(0)}>Пересчитать</button>
            </div>
          </div>
        )}
      </div>
      <div className="lg:sticky lg:top-24">
        {done ? (
          <LeadForm source="калькулятор бурения" presetMessage={summary} />
        ) : (
          <div className="card p-6 md:p-8">
            <h3 className="text-xl">Как считаем</h3>
            <ul className="mt-3 text-[15px] text-ink/80 space-y-2 leading-relaxed">
              <li>Бурение — по метрам: цена метра зависит от конструкции обсадной колонны, в неё входят труба, фильтр, прокачка и паспорт.</li>
              <li>Обустройство — кессон, адаптер или летний оголовок с обвязкой.</li>
              <li>Насос — по глубине: на скважины глубже 60 м нужен насос с высоким напором.</li>
              <li>Ввод в дом — по метрам трассы с гильзой, утеплением и проходом фундамента.</li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
