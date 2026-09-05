"use client";
import { useEffect, useState } from "react";

const KEY = "fortes_cookie_consent";

export default function CookieBar() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    try {
      if (!localStorage.getItem(KEY)) setVisible(true);
    } catch {
      // localStorage недоступен (приватный режим и т.п.) — не показываем плашку
    }
  }, []);

  function accept() {
    try {
      localStorage.setItem(KEY, "1");
    } catch {}
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <div className="fixed inset-x-0 bottom-16 md:bottom-0 z-50 p-3 md:p-4">
      <div className="container-site">
        <div className="rounded-card bg-ink text-white shadow-card p-4 md:p-5 flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-5">
          <p className="text-[13px] md:text-[14px] leading-relaxed text-white/85 flex-1">
            Сайт использует файлы cookie для аналитики и удобной работы сайта. Продолжая пользоваться сайтом, вы соглашаетесь с{" "}
            <a href="/politika/" className="underline text-white hover:text-white/70">политикой конфиденциальности</a>.
          </p>
          <button type="button" onClick={accept} className="btn-primary shrink-0 h-11 px-6">
            Понятно
          </button>
        </div>
      </div>
    </div>
  );
}
