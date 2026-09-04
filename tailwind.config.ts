import type { Config } from "tailwindcss";

// ДИЗАЙН: палитра и шрифты. Контент здесь не живёт — он в content/site.json
const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./lib/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#24262F",        // основной текст (как на teplo.fortes-dom.ru)
        muted: "#6B6E78",      // вторичный текст
        line: "#E3DFDF",       // границы
        page: "#F8F8F8",       // фон страницы
        card: "#FFFFFF",       // карточки
        brand: "#D90406",      // красный Фортес
        brandDark: "#B00305",  // hover
        ok: "#05A50F",         // зелёная галочка
        frost: "#EEF3F8",      // холодный подтон для блока «зима/Сибирь»
      },
      borderRadius: { card: "20px", btn: "10px" },
      fontFamily: { sans: ["Inter Tight", "Arial", "sans-serif"] },
      maxWidth: { site: "1200px" },
      boxShadow: { card: "0 1px 2px rgba(36,38,47,.04), 0 8px 24px -12px rgba(36,38,47,.12)" },
    },
  },
  plugins: [],
};
export default config;
