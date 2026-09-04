import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import MobileCallBar from "@/components/MobileCallBar";
import JsonLd from "@/components/JsonLd";
import { ldOrganization, ldLocalBusiness } from "@/lib/seo";
import { SITE_URL } from "@/lib/content";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: "Септики и автономная канализация в Иркутске | Фортес", template: "%s" },
  description: "Септики без откачки и станции биологической очистки под ключ в Иркутске.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru">
      <body>
        <JsonLd data={[ldOrganization(), ldLocalBusiness()]} />
        <Header />
        <main>{children}</main>
        <Footer />
        <MobileCallBar />
        {/* Яндекс.Метрика и Google Analytics: вставить код счётчиков здесь, перед закрытием body */}
      </body>
    </html>
  );
}
