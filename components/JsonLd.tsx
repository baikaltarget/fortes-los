export default function JsonLd({ data }: { data: unknown | unknown[] }) {
  const arr = (Array.isArray(data) ? data : [data]).filter(Boolean);
  return (
    <>
      {arr.map((d, i) => (
        <script key={i} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(d) }} />
      ))}
    </>
  );
}
