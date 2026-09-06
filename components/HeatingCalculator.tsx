"use client";
import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import heat from "@/content/otoplenie.json";
import LeadForm from "./LeadForm";
import { HP } from "@/lib/content";
import { reachGoal } from "@/components/Analytics";

const R = heat.calculator.rates as Record<string, number>;
const rub = (n: number) => new Intl.NumberFormat("ru-RU").format(n) + " ₽";

const Q = {
  area: [{ v: 60, l: "До 80 м²" }, { v: 110, l: "80–140 м²" }, { v: 170, l: "140–200 м²" }, { v: 260, l: "200–320 м²" }, { v: 400, l: "Больше 320 м²" }],
  floors: [{ v: 1, l: "Один этаж" }, { v: 2, l: "Два этажа" }, { v: 3, l: "Два этажа + цоколь / мансарда" }],
  walls: [{ v: "gas", l: "Газобетон" }, { v: "brick", l: "Кирпич" }, { v: "wood", l: "Брус / бревно" }, { v: "frame", l: "Каркасный" }],
  devices: [{ v: "floor", l: "Только тёплый пол" }, { v: "mix", l: "Тёплый пол внизу, радиаторы наверху" }, { v: "rad", l: "Только радиаторы" }],
  boiler: [{ v: "electric", l: "Электрокотёл" }, { v: "solid", l: "Электро + твердотопливный" }, { v: "pellet", l: "Пеллетный" }, { v: "hp", l: "Тепловой насос + электро" }],
  auto: [{ v: "no", l: "Нет, общий термостат" }, { v: "yes", l: "Да, термостат в каждой комнате" }],
};

export default function HeatingCalculator() {
  const [step, setStep] = useState(0);
  const [area, setArea] = useState(110);
  const [floors, setFloors] = useState(2);
  const [walls, setWalls] = useState("gas");
  const [devices, setDevices] = useState("mix");
  const [boiler, setBoiler] = useState("electric");
  const [auto, setAuto] = useState("no");

  const steps = [
    { q: "Отапливаемая площадь дома", opts: Q.area, val: area, set: (v: number) => setArea(v) },
    { q: "Сколько этажей?", opts: Q.floors, val: floors, set: (v: number) => setFloors(v) },
    { q: "Из чего стены?", opts: Q.walls, val: walls, set: (v: string) => setWalls(v) },
    { q: "Чем греть комнаты?", opts: Q.devices, val: devices, set: (v: string) => setDevices(v) },
    { q: "Какой котёл?", opts: Q.boiler, val: boiler, set: (v: string) => setBoiler(v) },
    { q: "Нужна ли своя температура в каждой комнате?", opts: Q.auto, val: auto, set: (v: string) => setAuto(v) },
  ] as const;

  const result = useMemo(() => {
    const lines: [string, number][] = [];
    // площадь под тёплый пол и число радиаторов
    const floorShare = devices === "floor" ? 1 : devices === "mix" ? (floors === 1 ? 0.7 : 1 / floors) : 0;
    const floorArea = Math.round(area * floorShare);
    const rooms = Math.max(3, Math.round(area / 18));
    const radiators = devices === "rad" ? rooms : devices === "mix" ? Math.round(rooms * (1 - floorShare)) : 0;
    // теплопотери: кВт по материалу стен, для подбора котла
    const wPerM2 = walls === "brick" ? 110 : walls === "wood" ? 100 : walls === "gas" ? 85 : 75;
    const kw = Math.ceil((area * wPerM2) / 1000);
    if (floorArea > 0) {
      lines.push([`Водяной тёплый пол ~${floorArea} м² (труба, маты, коллекторы, монтаж)`, floorArea * R.floorPerM2]);
      lines.push([`Полусухая стяжка ~${floorArea} м²`, floorArea * R.screedPerM2]);
    }
    if (radiators > 0) lines.push([`Радиаторы RoyalThermo с разводкой, ${radiators} шт.`, radiators * R.radiatorPoint]);
    const boilerBase = boiler === "electric" ? R.boilerElectric : boiler === "solid" ? R.boilerSolid : boiler === "pellet" ? R.boilerPellet : R.boilerHeatPump;
    const boilerScale = kw <= 12 ? 1 : kw <= 24 ? 1.3 : 1.7;
    const boilerName = boiler === "electric" ? `Котельная на электрокотле ~${kw} кВт` : boiler === "solid" ? `Котельная: электрокотёл ~${kw} кВт + ТТ-котёл, дымоход` : boiler === "pellet" ? `Котельная с пеллетным котлом ~${kw} кВт, бункер, дымоход` : `Тепловой насос + электрокотёл ~${kw} кВт, буферная ёмкость`;
    lines.push([boilerName, Math.round(boilerBase * boilerScale)]);
    if (boiler === "solid") lines.push(["Теплоаккумулятор для ТТ-котла", R.buffer]);
    if (auto === "yes") lines.push([`Термостаты и сервоприводы, ${rooms} комнат`, rooms * R.automationPerRoom]);
    const total = lines.reduce((s, l) => s + l[1], 0);
    return { lines, total, kw, floorArea, radiators };
  }, [area, floors, walls, devices, boiler, auto]);

  const done = step >= steps.length;
  useEffect(() => { if (done) reachGoal("calculator_complete"); }, [done]);

  const summary = `Калькулятор отопления: ~${area} м², ${Q.floors.find((f) => f.v === floors)?.l}, стены: ${Q.walls.find((w) => w.v === walls)?.l}, приборы: ${Q.devices.find((d) => d.v === devices)?.l}, котёл: ${Q.boiler.find((b) => b.v === boiler)?.l}, автоматика по комнатам: ${auto === "yes" ? "да" : "нет"}. Ориентир: ~${rub(result.total)} под ключ, котёл ~${result.kw} кВт.`;

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
            <div className="text-[13px] text-muted">Ориентировочно под ключ</div>
            <h3 className="text-3xl mt-1">{rub(result.total)}</h3>
            <p className="mt-2 text-ink/80">Теплопотери дома ~{result.kw} кВт при −36 °C{result.kw > 15 ? " — больше типового лимита 15 кВт: инженер проверит выделенную мощность и предложит резерв." : " — укладывается в типовой лимит 15 кВт."}</p>
            <table className="mt-5 w-full text-[15px]">
              <tbody>
                {result.lines.map(([k, v]) => (
                  <tr key={k} className="border-b border-line"><td className="py-2 pr-3">{k}</td><td className="py-2 text-right font-medium whitespace-nowrap">{rub(v)}</td></tr>
                ))}
                <tr><td className="py-3 font-bold">Итого ориентировочно</td><td className="py-3 text-right text-2xl font-extrabold tracking-tight whitespace-nowrap">{rub(result.total)}</td></tr>
              </tbody>
            </table>
            <p className="text-[13px] text-muted mt-2">Расчёт ориентировочный по средним ставкам наших смет. Для сравнения: дом 120 м² в Бурдаковке с тёплым полом и котельной — 470 680 ₽. Точную смету с проектом инженер составит бесплатно.</p>
            <div className="mt-4 flex flex-wrap gap-2">
              <Link href={HP.object("burdakovka-dom-120")} className="btn-outline">Смотреть смету 120 м²</Link>
              <button type="button" className="btn-ghost" onClick={() => setStep(0)}>Пересчитать</button>
            </div>
          </div>
        )}
      </div>
      <div className="lg:sticky lg:top-24">
        {done ? (
          <LeadForm source="калькулятор отопления" presetMessage={summary} />
        ) : (
          <div className="card p-6 md:p-8">
            <h3 className="text-xl">Как считаем</h3>
            <ul className="mt-3 text-[15px] text-ink/80 space-y-2 leading-relaxed">
              <li>Теплопотери — по площади и материалу стен для расчётной температуры Иркутска −36 °C.</li>
              <li>Тёплый пол — с трубой, матами, коллекторами и полусухой стяжкой.</li>
              <li>Радиаторы — по числу комнат с лучевой разводкой.</li>
              <li>Котельная — с группой безопасности, баком, насосами и запуском; мощность по теплопотерям.</li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
