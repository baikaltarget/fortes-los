"use client";
import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import site from "@/content/site.json";
import LeadForm from "./LeadForm";
import { P } from "@/lib/content";
import { reachGoal } from "@/components/Analytics";

type P = (typeof site.products)[number];
const products = site.products as P[];
const rub = (n: number) => new Intl.NumberFormat("ru-RU").format(n) + " ₽";
const X = site.calculator.extras;

const Q = {
  people: [{ v: 2, l: "1–2" }, { v: 3, l: "3" }, { v: 4, l: "4" }, { v: 5, l: "5" }, { v: 6, l: "6" }, { v: 8, l: "7–9" }],
  mode: [{ v: "perm", l: "Живём круглый год" }, { v: "season", l: "Дача, сезонно" }, { v: "weekend", l: "Выходные и баня" }],
  soil: [{ v: "sand", l: "Песок, супесь" }, { v: "loam", l: "Суглинок" }, { v: "clay", l: "Глина / вода близко" }, { v: "rock", l: "Скальник" }, { v: "unknown", l: "Не знаю" }],
  depth: [{ v: "std", l: "До 0,8 м" }, { v: "midi", l: "0,8–1,3 м" }, { v: "long", l: "Глубже 1,3 м / цоколь" }, { v: "unknown", l: "Не знаю" }],
  dist: [{ v: 5, l: "До 5 м" }, { v: 10, l: "5–10 м" }, { v: 20, l: "10–20 м" }, { v: 30, l: "Больше 20 м" }],
  service: [{ v: "any", l: "Не важно" }, { v: "rare", l: "Как можно реже" }],
};

function pick(people: number, mode: string, service: string): P {
  const order = ["novo-eko-3", "zorde-4", "novo-eko-5", "zorde-7", "novo-eko-8", "kolo-vesi-8"];
  if (service === "rare") {
    if (people <= 5) return products.find((p) => p.slug === "zorde-4")!;
    if (people <= 8) return products.find((p) => p.slug === "zorde-7")!;
  }
  if (mode !== "perm" && people <= 4) return products.find((p) => p.slug === "novo-eko-3")!;
  if (people <= 3) return products.find((p) => p.slug === "novo-eko-3")!;
  if (people <= 6) return products.find((p) => p.slug === "novo-eko-5")!;
  if (people <= 9) return products.find((p) => p.slug === "novo-eko-8")!;
  return products.find((p) => p.slug === order[order.length - 1])!;
}

export default function Calculator() {
  const [step, setStep] = useState(0);
  const [people, setPeople] = useState(4);
  const [mode, setMode] = useState("perm");
  const [soil, setSoil] = useState("loam");
  const [depth, setDepth] = useState("std");
  const [dist, setDist] = useState(10);
  const [service, setService] = useState("any");

  const steps = [
    { q: "Сколько человек будет пользоваться?", opts: Q.people, val: people, set: (v: number) => setPeople(v) },
    { q: "Как живёте в доме?", opts: Q.mode, val: mode, set: (v: string) => setMode(v) },
    { q: "Какой грунт на участке?", opts: Q.soil, val: soil, set: (v: string) => setSoil(v) },
    { q: "На какой глубине выходит труба из дома?", opts: Q.depth, val: depth, set: (v: string) => setDepth(v) },
    { q: "Расстояние от дома до места станции", opts: Q.dist, val: dist, set: (v: number) => setDist(v) },
    { q: "Как часто готовы обслуживать?", opts: Q.service, val: service, set: (v: string) => setService(v) },
  ] as const;

  const result = useMemo(() => {
    const p = pick(people, mode, service);
    let station = p.price;
    let variant = p.name;
    const lines: [string, number][] = [];
    if (depth === "long") { station = p.priceLong; variant = p.name + " Long"; }
    else if (depth === "midi") { station = p.priceMidi; variant = p.name + " Midi"; }
    lines.push([`Станция ${variant}`, station]);
    const base = (p.turnkeyFrom ?? p.price + p.installFrom) - p.price;
    let install = base - 32000 - 15000 - 30000; // доставка, труба до 10 м и дренаж выделены отдельными строками
    if (soil === "clay") install += X.clay;
    if (soil === "rock") install += X.clay * 2;
    if (depth === "long") install += X.long;
    if (depth === "midi") install += X.midi;
    lines.push(["Доставка до участка", 32000]);
    lines.push(["Монтаж: котлован, подушка, засыпка", install]);
    const pipe = 15000 + Math.max(0, dist - 10) * X.distanceStep;
    lines.push([`Труба от дома ~${dist} м, кабель`, pipe]);
    const prinud = soil === "clay" || soil === "rock";
    lines.push([prinud ? "Принудительный отвод (насос)" : "Дренажный колодец", prinud ? X.prinud : 30000]);
    const total = lines.reduce((s, l) => s + l[1], 0);
    return { p, variant, lines, total, prinud };
  }, [people, mode, soil, depth, dist, service]);

  const done = step >= steps.length;

  useEffect(() => {
    if (done) reachGoal("calculator_complete");
  }, [done]);
  const summary = `Калькулятор: ${people} чел., ${Q.mode.find((m) => m.v === mode)?.l}, грунт: ${Q.soil.find((s) => s.v === soil)?.l}, глубина: ${Q.depth.find((d) => d.v === depth)?.l}, трасса ~${dist} м, сервис: ${Q.service.find((s) => s.v === service)?.l}. Рекомендация: ${result.variant}, ~${rub(result.total)} под ключ.`;

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
                  <button
                    key={String(o.v)}
                    type="button"
                    onClick={() => { (steps[step].set as (v: never) => void)(o.v as never); setStep(step + 1); }}
                    className={`text-left rounded-btn border-2 px-4 py-3 font-medium transition-colors ${active ? "border-ink bg-ink text-white" : "border-line bg-white hover:border-ink"}`}
                  >
                    {o.l}
                  </button>
                );
              })}
            </div>
          </div>
        ) : (
          <div className="mt-6">
            <div className="text-[13px] text-muted">Рекомендуем</div>
            <h3 className="text-3xl mt-1">{result.variant}</h3>
            <p className="mt-2 text-ink/80">{result.p.bestFor}. {result.prinud ? "На вашем грунте вода не впитается — закладываем принудительный отвод." : "Грунт впитывает — достаточно дренажного колодца."}</p>
            <table className="mt-5 w-full text-[15px]">
              <tbody>
                {result.lines.map(([k, v]) => (
                  <tr key={k} className="border-b border-line"><td className="py-2 pr-3">{k}</td><td className="py-2 text-right font-medium whitespace-nowrap">{rub(v)}</td></tr>
                ))}
                <tr><td className="py-3 font-bold">Ориентировочно под ключ</td><td className="py-3 text-right text-2xl font-extrabold tracking-tight whitespace-nowrap">{rub(result.total)}</td></tr>
              </tbody>
            </table>
            <p className="text-[13px] text-muted mt-2">Расчёт ориентировочный: цены станций — рекомендованные заводом, работы зависят от участка. Точную смету инженер составит бесплатно.</p>
            <div className="mt-4 flex flex-wrap gap-2">
              <Link href={P.product(result.p.slug)} className="btn-outline">Про {result.p.shortName}</Link>
              <button type="button" className="btn-ghost" onClick={() => setStep(0)}>Пересчитать</button>
            </div>
          </div>
        )}
      </div>
      <div className="lg:sticky lg:top-24">
        {done ? (
          <LeadForm source="калькулятор" presetMessage={summary} />
        ) : (
          <div className="card p-6 md:p-8">
            <h3 className="text-xl">Как считаем</h3>
            <ul className="mt-3 text-[15px] text-ink/80 space-y-2 leading-relaxed">
              <li>200 литров стоков на человека в сутки — норма для подбора станции.</li>
              <li>Глина и высокая вода — принудительный отвод и усиленная засыпка.</li>
              <li>Глубокий выход трубы — версии Midi или Long с надставной горловиной.</li>
              <li>Обслуживание раз в два года — линейка Zörde.</li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
