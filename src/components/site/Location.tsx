import { Clock, Instagram, MapPin, MessageCircle, Music2 } from "lucide-react";
import { INFO, WHATSAPP_LINK } from "@/data/menu";

export function Location() {
  return (
    <section id="localizacao" className="section-pad scroll-mt-20">
      <div className="mx-auto max-w-7xl px-4 md:px-8">
        <div className="grid gap-8 lg:grid-cols-[1fr_1.1fr] lg:items-center">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.3em] text-gold">Localização</p>
            <h2 className="mt-3 text-5xl text-cream md:text-6xl">Venha até o reino</h2>

            <p className="mt-6 flex items-start gap-3 text-lg text-cream">
              <MapPin className="mt-1 h-5 w-5 shrink-0 text-gold" aria-hidden="true" />
              {INFO.address}
            </p>
            <p className="mt-3 flex items-center gap-3 text-muted-foreground">
              <Clock className="h-5 w-5 shrink-0 text-gold" aria-hidden="true" />
              {INFO.hoursNote}
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <a
                href={INFO.mapsUrl}
                target="_blank"
                rel="noreferrer noopener"
                className="inline-flex items-center gap-2 rounded-full bg-gold-gradient px-6 py-3.5 font-display text-xl tracking-wide text-primary-foreground transition-transform hover:scale-[1.03]"
              >
                <MapPin className="h-5 w-5" aria-hidden="true" /> Abrir no Google Maps
              </a>
              <a
                href={WHATSAPP_LINK}
                target="_blank"
                rel="noreferrer noopener"
                className="inline-flex items-center gap-2 rounded-full border border-border bg-surface px-6 py-3.5 font-display text-xl tracking-wide text-cream transition-colors hover:border-gold hover:text-gold"
              >
                <MessageCircle className="h-5 w-5" aria-hidden="true" /> Falar no WhatsApp
              </a>
            </div>

            <div className="mt-6 flex gap-3">
              <a
                href={INFO.instagram}
                target="_blank"
                rel="noreferrer noopener"
                aria-label="Instagram do Primeiro Reino Burger"
                className="grid h-12 w-12 place-items-center rounded-full border border-border text-cream transition-colors hover:border-gold hover:text-gold"
              >
                <Instagram className="h-5 w-5" />
              </a>
              <a
                href={INFO.tiktok}
                target="_blank"
                rel="noreferrer noopener"
                aria-label="TikTok do Primeiro Reino Burger"
                className="grid h-12 w-12 place-items-center rounded-full border border-border text-cream transition-colors hover:border-gold hover:text-gold"
              >
                <Music2 className="h-5 w-5" />
              </a>
            </div>
          </div>

          <div className="overflow-hidden rounded-3xl border border-border shadow-royal">
            <iframe
              title="Mapa com a localização do Primeiro Reino Burger"
              src={INFO.mapsEmbed}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="h-[22rem] w-full border-0 md:h-[26rem]"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
