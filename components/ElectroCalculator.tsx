"use client";
import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import elek from "@/content/elektrika.json";
import LeadForm from "./LeadForm";
import { EP } from "@/lib/content";
import { reachGoal } from "@/components/Analytics";

const R = elek.calculator.rates as Record<string, number>;
const rub = (n: number) => new Intl.NumberFormat("ru-RU").format(n) + " ₽";

const Q = {
  walls: [{ v: "block", l: "Газобетон, кирпич, блоки — скрытая в штробах" }, { v: "frame", l: "Каркас, СИП — скрытая внутри стен" }, { v: "wood", l: "Брус, бревно — в металлорукаве / кабель-канале" }, { v: "retro", l: "Брус, бревно — ретро на изоляторах" }],
  area: [{ v: 60, l: "До 60 м² — дача, баня, небольшой дом" }, { v: 100, l: "80–120 м²" }, { v: 150, l: "130–170 м²" }, { v: 220, l: "180–250 м²" }, { v: 300, l: "Больше 250 м²" }],
  entry: [{ v: "none", l: "Ввод и щит учёта уже есть" }, { v: "sip", l: "СИП от опоры на фасад" }, { v: "post", l: "Трубостойка со щитом учёта + СИП" }, { v: "under", l: "Подземный ввод кабелем ~20 м" }],
  voltage: [{ v: 1, l: "220 В — дача, дом без электроотопления" }, { v: 3, l: "380 В, 15 кВт — дом с электрокотлом и техникой" }],
  heating: [{ v: "none", l: "Без электроотопления (газ, ТТ-котёл, печь)" }, { v: "boiler", l: "Электрокотёл" }, { v: "boiler-floor", l: "Электрокотёл + тёплые полы + бойлер" }, { v: "conv", l: "Конвекторы / электрические тёплые полы по комнатам" }],
  extra: [{ v: "none", l: "Только заземление" }, { v: "manual", l: "Заземление + рубильник под генератор" }, { v: "avr", l: "Заземление + АВР с автозапуском" }, { v: "avr-light", l: "Заземление + АВР + свет на участке" }],
};

export default function ElectroCalculator() {
  const [step, setStep] = useState(0);
  const [walls, setWalls] = useState("block");
  const [area, setArea] = useState(100);
  const [entry, setEntry] = useState("sip");
  const [voltage, setVoltage] = useState(3);
  const [heating, setHeating] = useState("boiler-floor");
  const [extra, setExtra] = useState("none");

  const steps = [
    { q: "Из чего стены дома?", opts: Q.walls, val: walls, set: (v: string) => setWalls(v) },
    { q: "Площадь дома", opts: Q.area, val: area, set: (v: number) => setArea(v) },
    { q: "Ввод электричества", opts: Q.entry, val: entry, set: (v: string) => setEntry(v) },
    { q: "Напряжение и щит", opts: Q.voltage, val: voltage, set: (v: number) => setVoltage(v) },
    { q: "Чем греется дом?", opts: Q.heating, val: heating, set: (v: string) => setHeating(v) },
    { q: "Заземление, резерв, улица", opts: Q.extra, val: extra, set: (v: string) => setExtra(v) },
  ] as const;

  const result = useMemo(() => {
    const lines: [string, number][] = [];
    const points = Math.round(area * R.pointsPerM2);
    const rate = walls === "wood" ? R.pointWood : walls === "retro" ? (R.pointRetro || 2500) : walls === "frame" ? R.pointFrame : R.pointBlock;
    const wallName = walls === "wood" ? "брус, металлорукав" : walls === "retro" ? "брус, ретро на изоляторах" : walls === "frame" ? "каркас, скрытая" : "газобетон, скрытая в штробах";
    if (entry === "sip") lines.push(["Ввод СИП от опоры: зажимы, проход в дом", R.entrySip]);
    if (entry === "post") lines.push(["Трубостойка со щитом учёта + СИП от опоры", R.entryPost + R.entrySip]);
    if (entry === "under") lines.push(["Подземный ввод ~20 м: траншея, ПНД, бронированный кабель", 20 * R.entryUnderPerMeter + R.entryPost]);
    lines.push([voltage === 3 ? "Распределительный щит 380 В: реле напряжения по фазам, УЗИП, УЗО, группы" : "Распределительный щит 220 В: реле напряжения, УЗИП, УЗО, группы", voltage === 3 ? R.panel380 : R.panel220]);
    if (area >= 180) lines.push(["Второй щит на этаже / в гараже", R.subPanel]);
    lines.push([`Разводка: ${points} точек — ${wallName}`, points * rate]);
    if (heating === "boiler") lines.push(["Линия на электрокотёл: кабель 5×4–5×6, автомат 3P, контактор", R.boilerLine]);
    if (heating === "boiler-floor") { lines.push(["Линия на электрокотёл: кабель 5×4–5×6, автомат 3P, контактор", R.boilerLine]); lines.push(["Линии на тёплые полы, бойлер, насосы котельной", R.heatingPack]); }
    if (heating === "conv") lines.push(["Линии на конвекторы / электрополы по комнатам с терморегуляторами", R.heatingPack]);
    lines.push(["Заземление модульно-штыревое 6 м, ГЗШ, протокол", R.ground]);
    if (extra === "manual") lines.push(["Перекидной рубильник и розетка под генератор", R.generatorManual]);
    if (extra.startsWith("avr")) lines.push(["АВР с автозапуском генератора (без генератора)", R.generatorAvr]);
    if (extra === "avr-light") lines.push(["Свет на участке: 4 светильника, кабель в земле, датчики", 4 * R.outdoorLight]);
    // v32: минимальная ставка под ключ — от 3 500 ₽/м² (с материалами и работой)
    const sub = lines.reduce((s, l) => s + l[1], 0);
    const minTurnkey = area * (R.turnkeyMinPerM2 || 3500);
    if (sub < minTurnkey) lines.push([`Доведение до ставки под ключ ${rub(R.turnkeyMinPerM2 || 3500)}/м²`, minTurnkey - sub]);
    const total = lines.reduce((s, l) => s + l[1], 0);
    return { lines, total, points, wallName };
  }, [walls, area, entry, voltage, heating, extra]);

  const done = step >= steps.length;
  useEffect(() => { if (done) reachGoal("calculator_complete"); }, [done]);

  const summary = `Калькулятор электрики: стены — ${result.wallName}, ${area} м², ввод: ${Q.entry.find((e) => e.v === entry)?.l}, ${voltage === 3 ? "380 В" : "220 В"}, отопление: ${Q.heating.find((h) => h.v === heating)?.l}, доп.: ${Q.extra.find((e) => e.v === extra)?.l}. Точек ${result.points}. Ориентир: ~${rub(result.total)}.`;

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
            {step === 1 && <p className="mt-2 text-[14px] text-muted">Точек считаем примерно 0,37 на м²: дом 120 м² — около 45 розеток, выключателей и выводов под свет.</p>}
            {step === 4 && <p className="mt-2 text-[14px] text-muted">В Иркутском районе почти все дома греются электричеством — под это считаем щит и линии.</p>}
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
            <p className="mt-2 text-ink/80">Точек — {result.points}. Считаем по точкам и узлам, в договоре смета фиксируется построчно. Розетки и выключатели, светильники, генератор и молниезащита — отдельными строками по желанию.</p>
            <table className="mt-5 w-full text-[15px]">
              <tbody>
                {result.lines.map(([k, v]) => (
                  <tr key={k} className="border-b border-line"><td className="py-2 pr-3">{k}</td><td className="py-2 text-right font-medium whitespace-nowrap">{rub(v)}</td></tr>
                ))}
                <tr><td className="py-3 font-bold">Итого ориентировочно</td><td className="py-3 text-right text-2xl font-extrabold tracking-tight whitespace-nowrap">{rub(result.total)}</td></tr>
              </tbody>
            </table>
            <p className="text-[13px] text-muted mt-2">Электрику удобно считать вместе с отоплением: щит собираем под конкретную котельную. Дом 120 м² в Бурдаковке с тёплым полом и электрокотлом — 470 680 ₽ за отопление под ключ.</p>
            <div className="mt-4 flex flex-wrap gap-2">
              <Link href={EP.object("burdakovka-dom-120")} className="btn-outline">Смотреть объект</Link>
              <button type="button" className="btn-ghost" onClick={() => setStep(0)}>Пересчитать</button>
            </div>
          </div>
        )}
      </div>
      <div className="lg:sticky lg:top-24">
        {done ? (
          <LeadForm source="калькулятор электрики" presetMessage={summary} />
        ) : (
          <div className="card p-6 md:p-8">
            <h3 className="text-xl">Как считаем</h3>
            <ul className="mt-3 text-[15px] text-ink/80 space-y-2 leading-relaxed">
              <li>Разводка — по точкам: розетка, выключатель, вывод под светильник. В точку входят кабель, гофра или металлорукав, подрозетник, работа.</li>
              <li>Щит — по числу групп и напряжению: реле напряжения, УЗИП, УЗО, автоматы.</li>
              <li>Ввод — СИП, трубостойка или кабель в земле по метрам.</li>
              <li>Отопление — отдельные линии на котёл, полы, бойлер; резерв — рубильник или АВР.</li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
