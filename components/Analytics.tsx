"use client";
import { useEffect } from "react";
import { company } from "@/lib/content";

declare global {
  interface Window {
    ym?: (...args: unknown[]) => void;
  }
}

function goal(name: string) {
  if (typeof window !== "undefined" && typeof window.ym === "function") {
    window.ym(company.yandexMetrikaId, "reachGoal", name);
  }
}

/**
 * Единый обработчик кликов на весь сайт — отправляет цели в Яндекс.Метрику
 * по ссылкам звонка/мессенджеров/отзывов, без правки каждой кнопки отдельно.
 * Список целей и их описание — в README.
 */
export default function Analytics() {
  useEffect(() => {
    function onClick(e: MouseEvent) {
      const el = (e.target as HTMLElement)?.closest("a");
      if (!el) return;
      const href = el.getAttribute("href") || "";
      if (!href) return;

      if (href.startsWith("tel:")) goal("call_click");
      else if (href.startsWith("mailto:")) goal("email_click");
      else if (company.telegramUrl && href === company.telegramUrl) goal("telegram_click");
      else if (company.maxUrl && href === company.maxUrl) goal("max_click");
      else if (href.includes("2gis.ru")) goal("reviews_2gis_click");
      else if (company.yandexMapsUrl && href === company.yandexMapsUrl) goal("reviews_yandex_click");
    }
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, []);

  return null;
}

export { goal as reachGoal };
