import { Instagram } from "lucide-react";
import { GALLERY, INFO } from "@/data/menu";

const spans = [
  "sm:col-span-2 sm:row-span-2 sm:aspect-square",
  "sm:col-span-2 aspect-[4/3]",
  "aspect-square",
  "aspect-square",
  "sm:col-span-4 aspect-[16/9] sm:aspect-[21/9]",
];

export function Gallery() {
  return (
    <section className="section-pad">
      <div className="mx-auto max-w-7xl px-4 md:px-8">
        <div className="grid grid-cols-[minmax(0,1fr)_auto] items-end gap-4">
          <div className="min-w-0">
            <p className="text-xs font-bold uppercase tracking-[0.3em] text-gold">Experiência</p>
            <h2 className="mt-3 text-5xl text-cream md:text-6xl">O reino por dentro</h2>
          </div>
          <a
            href={INFO.instagram}
            target="_blank"
            rel="noreferrer noopener"
            className="hidden shrink-0 items-center gap-2 rounded-full border border-gold/40 px-5 py-3 text-sm font-bold uppercase tracking-wider text-gold transition-colors hover:bg-secondary sm:inline-flex"
          >
            <Instagram className="h-4 w-4" aria-hidden="true" /> Seguir no Instagram
          </a>
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-4">
          {GALLERY.map((img, i) => (
            <img
              key={img.src}
              src={img.src}
              alt={img.alt}
              loading="lazy"
              className={`h-full w-full rounded-3xl object-cover ${spans[i] ?? "aspect-square"}`}
            />
          ))}
        </div>

        <a
          href={INFO.instagram}
          target="_blank"
          rel="noreferrer noopener"
          className="mt-6 inline-flex items-center gap-2 rounded-full border border-gold/40 px-5 py-3 text-sm font-bold uppercase tracking-wider text-gold sm:hidden"
        >
          <Instagram className="h-4 w-4" aria-hidden="true" /> Seguir no Instagram
        </a>
      </div>
    </section>
  );
}
