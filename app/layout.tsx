import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import MobileCallBar from "@/components/MobileCallBar";
import CookieBar from "@/components/CookieBar";
import Analytics from "@/components/Analytics";
import JsonLd from "@/components/JsonLd";
import { ldOrganization, ldLocalBusinessAll } from "@/lib/seo";
import { SITE_URL, company } from "@/lib/content";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: "Инженерные системы для дома в Иркутске | Фортес", template: "%s" },
  description: "Отопление, бурение скважин, водоснабжение, канализация и электрика в частном доме под ключ в Иркутске и районе.",
  verification: { other: { "yandex-verification": company.yandexVerification } },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru">
      <body>
        {/* Yandex.Metrika — счётчик №{company.yandexMetrikaId}, цели описаны в README */}
        <Script id="yandex-metrika" strategy="afterInteractive" dangerouslySetInnerHTML={{
          __html: `(function(m,e,t,r,i,k,a){
        m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};
        m[i].l=1*new Date();
        for (var j = 0; j < document.scripts.length; j++) {if (document.scripts[j].src === r) { return; }}
        k=e.createElement(t),a=e.getElementsByTagName(t)[0],k.async=1,k.src=r,a.parentNode.insertBefore(k,a)
    })(window, document,'script','https://mc.yandex.ru/metrika/tag.js', 'ym');
    ym(${company.yandexMetrikaId}, 'init', {webvisor:true, clickmap:true, referrer: document.referrer, url: location.href, accurateTrackBounce:true, trackLinks:true});`,
        }} />
        <noscript>
          <div><img src={`https://mc.yandex.ru/watch/${company.yandexMetrikaId}`} style={{ position: "absolute", left: "-9999px" }} alt="" /></div>
        </noscript>

        <JsonLd data={[ldOrganization(), ...ldLocalBusinessAll()]} />
        <Header />
        <main>{children}</main>
        <Footer />
        <MobileCallBar />
        <CookieBar />
        <Analytics />
        {/* Google Analytics: добавить сюда же, если понадобится */}
      </body>
    </html>
  );
}
