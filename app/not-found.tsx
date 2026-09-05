import { P } from "@/lib/content";
import Link from "next/link";
export default function NotFound() {
  return (
    <div className="container-site py-24 text-center">
      <h1>Страницы нет</h1>
      <p className="mt-4 text-muted">Возможно, адрес изменился. Начните с главной или каталога станций.</p>
      <div className="mt-6 flex justify-center gap-2"><Link href="/" className="btn-primary">На главную</Link><Link href={P.stancii} className="btn-outline">Станции</Link></div>
    </div>
  );
}
