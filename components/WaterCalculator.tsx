"use client";
import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import voda from "@/content/vodosnabzhenie.json";
import LeadForm from "./LeadForm";
import { VP } from "@/lib/content";
import { reachGoal } from "@/components/Analytics";

const R = voda.calculator.rates as Record<string, number>;
const rub = (n: number) => new Intl.NumberFormat("ru-RU").format(n) + " ₽";

/** Точек воды / канализации на типовой санузел и кухню */
const BATH_W = 3, BATH_S = 3, KITCHEN_W = 2, KITCHEN_S = 2;

const Q = {
  baths: [{ v: 1, l: "1 санузел — дача, баня, небольшой дом" }, { v: 2, l: "2 санузла — дом 100–150 м²" }, { v: 3, l: "3 санузла — дом от 150 м²" }, { v: 4, l: "4 и больше" }],
  extra: [{ v: 0, l: "Нет" }, { v: 1, l: "Кухня" }, { v: 2, l: "Кухня и постирочная" }, { v: 3, l: "Кухня, постирочная, полив и баня" }],
  material: [{ v: "pp", l: "Полипропилен, тройниковая схема — дешевле" }, { v: "pex", l: "Сшитый полиэтилен, коллекторная — стандарт для дома" }],
  entry: [{ v: 0, l: "Ввод уже есть" }, { v: 8, l: "До 10 м от кессона / колодца / сети" }, { v: 20, l: "10–30 м" }, { v: 40, l: "Больше 30 м" }],
  sewer: [{ v: "none", l: "Канализация уже есть" }, { v: "in", l: "Только внутри дома, вывод есть" }, { v: "out", l: "Внутри дома и труба до септика" }],
  equip: [{ v: "none", l: "Без оборудования" }, { v: "storage", l: "Накопительный водонагреватель" }, { v: "indirect", l: "Бойлер косвенного нагрева от котла" }, { v: "indirect-hydro", l: "Косвенный бойлер + гидроаккумулятор" }],
};

export default function WaterCalculator() {
  const [step, setStep] = useState(0);
  const [baths, setBaths] = useState(2);
  const [extra, setExtra] = useState(1);
  const [material, setMaterial] = useState("pex");
  const [entry, setEntry] = useState(8);
  const [sewer, setSewer] = useState("out");
  const [equip, setEquip] = useState("indirect");

  const steps = [
    { q: "Сколько санузлов в доме?", opts: Q.baths, val: baths, set: (v: number) => setBaths(v) },
    { q: "Что ещё, кроме санузлов?", opts: Q.extra, val: extra, set: (v: number) => setExtra(v) },
    { q: "Трубы и схема разводки", opts: Q.material, val: material, set: (v: string) => setMaterial(v) },
    { q: "Ввод воды в дом — длина трассы", opts: Q.entry, val: entry, set: (v: number) => setEntry(v) },
    { q: "Канализация", opts: Q.sewer, val: sewer, set: (v: string) => setSewer(v) },
    { q: "Горячая вода и оборудование", opts: Q.equip, val: equip, set: (v: string) => setEquip(v) },
  ] as const;

  const result = useMemo(() => {
    const lines: [string, number][] = [];
    const extraW = extra === 0 ? 0 : extra === 1 ? KITCHEN_W : extra === 2 ? KITCHEN_W + 1 : KITCHEN_W + 3;
    const extraS = extra === 0 ? 0 : extra === 1 ? KITCHEN_S : extra === 2 ? KITCHEN_S + 1 : KITCHEN_S + 2;
    const pw = baths * BATH_W + extraW;
    const ps = baths * BATH_S + extraS;
    const rate = material === "pex" ? R.pointWaterPEX : R.pointWaterPP;
    const matName = material === "pex" ? "сшитый полиэтилен, коллекторная схема" : "полипропилен, тройниковая схема";
    if (entry > 0) {
      lines.push([`Ввод воды в дом ~${entry} м: траншея, ПНД в гильзе, утепление, проход фундамента`, entry * R.entryPerMeter + R.entryFixed]);
      lines.push(["Узел ввода: кран, фильтр, обратный клапан, редуктор", R.entryUnit]);
    }
    if (material === "pex") lines.push([`Коллекторный узел ХВС/ГВС${baths >= 3 ? " × 2 этажа" : ""}`, R.collector * (baths >= 3 ? 2 : 1)]);
    lines.push([`Разводка воды: ${pw} точек ХВС+ГВС, ${matName}`, pw * rate]);
    if (sewer !== "none") {
      lines.push([`Внутренняя канализация: ${ps} точек, уклоны, ревизии`, ps * R.pointSewer]);
      lines.push([`Фановый стояк${baths >= 3 ? " × 2" : ""}`, R.fanStack * (baths >= 3 ? 2 : 1)]);
    }
    if (sewer === "out") {
      lines.push(["Вывод канализации из дома через фундамент", R.sewerOutlet]);
      lines.push(["Наружная труба до септика ~10 м", 10 * R.sewerPerMeter]);
    }
    if (equip === "storage") lines.push(["Подключение накопительного водонагревателя", R.boilerStorage]);
    if (equip.startsWith("indirect")) lines.push(["Обвязка бойлера косвенного нагрева", R.boilerIndirect]);
    if (equip === "indirect-hydro") lines.push(["Гидроаккумулятор, реле давления, защита", R.hydroTank]);
    const total = lines.reduce((s, l) => s + l[1], 0);
    return { lines, total, pw, ps, matName };
  }, [baths, extra, material, entry, sewer, equip]);

  const done = step >= steps.length;
  useEffect(() => { if (done) reachGoal("calculator_complete"); }, [done]);

  const summary = `Калькулятор воды и канализации: ${baths} санузл., доп.: ${Q.extra.find((e) => e.v === extra)?.l}, ${result.matName}, ввод: ${Q.entry.find((e) => e.v === entry)?.l}, канализация: ${Q.sewer.find((s) => s.v === sewer)?.l}, оборудование: ${Q.equip.find((e) => e.v === equip)?.l}. Точек воды ${result.pw}, канализации ${result.ps}. Ориентир: ~${rub(result.total)}.`;

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
            {step === 0 && <p className="mt-2 text-[14px] text-muted">Санузел считаем как 3 точки воды и 3 канализации: раковина, унитаз, душ или ванна.</p>}
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
            <p className="mt-2 text-ink/80">Точек воды — {result.pw}, канализации — {result.ps}. Считаем по точкам и метрам трасс, в договоре смета фиксируется построчно. Сантехника, водоочистка, скважина и септик — отдельными строками по желанию.</p>
            <table className="mt-5 w-full text-[15px]">
              <tbody>
                {result.lines.map(([k, v]) => (
                  <tr key={k} className="border-b border-line"><td className="py-2 pr-3">{k}</td><td className="py-2 text-right font-medium whitespace-nowrap">{rub(v)}</td></tr>
                ))}
                <tr><td className="py-3 font-bold">Итого ориентировочно</td><td className="py-3 text-right text-2xl font-extrabold tracking-tight whitespace-nowrap">{rub(result.total)}</td></tr>
              </tbody>
            </table>
            <p className="text-[13px] text-muted mt-2">Для сравнения: баня 60 м² с водой, канализацией, бойлером и тёплым полом в «Ангарском Береге» — 473 030 ₽ под ключ; кессон с вводом 4 м в Хайрюзовке — 90 957 ₽.</p>
            <div className="mt-4 flex flex-wrap gap-2">
              <Link href={VP.object("angarskij-bereg-banya-60")} className="btn-outline">Смотреть объект</Link>
              <button type="button" className="btn-ghost" onClick={() => setStep(0)}>Пересчитать</button>
            </div>
          </div>
        )}
      </div>
      <div className="lg:sticky lg:top-24">
        {done ? (
          <LeadForm source="калькулятор водоснабжения" presetMessage={summary} />
        ) : (
          <div className="card p-6 md:p-8">
            <h3 className="text-xl">Как считаем</h3>
            <ul className="mt-3 text-[15px] text-ink/80 space-y-2 leading-relaxed">
              <li>Вода — по точкам: раковина, унитаз, душ, машины, полив. В точку входят труба, фитинги, водорозетка, работа.</li>
              <li>Канализация — по точкам плюс фановый стояк, вывод из дома и труба до септика по метрам.</li>
              <li>Ввод — по метрам трассы с гильзой, утеплением и проходом фундамента, плюс узел ввода.</li>
              <li>Оборудование — обвязка бойлера, гидроаккумулятор с автоматикой.</li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
