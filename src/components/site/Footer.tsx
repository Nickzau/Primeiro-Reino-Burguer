import { Instagram, MessageCircle, Music2 } from "lucide-react";
import { INFO, WHATSAPP_LINK } from "@/data/menu";
import { Logo } from "./Logo";

export function Footer() {
  return (
    <footer className="border-t border-border bg-surface">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-14 md:grid-cols-3 md:px-8">
        <div>
          <div className="flex items-center gap-3">
            <Logo className="h-12 w-12" />
            <div>
              <p className="font-display text-2xl leading-none text-cream">Primeiro Reino</p>
              <p className="text-[0.65rem] font-semibold uppercase tracking-[0.28em] text-gold">
                Burger · Porto Alegre
              </p>
            </div>
          </div>
          <p className="mt-4 max-w-xs text-sm text-muted-foreground">
            Hambúrgueres artesanais que valem cada mordida, com entrega em Porto Alegre.
          </p>
        </div>

        <div>
          <h2 className="font-display text-xl tracking-wide text-cream">Contato</h2>
          <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
            <li>{INFO.address}</li>
            <li>
              <a href={WHATSAPP_LINK} target="_blank" rel="noreferrer noopener" className="hover:text-gold">
                WhatsApp: +55 51 99582-8342
              </a>
            </li>
            <li>{INFO.hoursNote}</li>
          </ul>
        </div>

        <div>
          <h2 className="font-display text-xl tracking-wide text-cream">Redes</h2>
          <div className="mt-4 flex gap-3">
            <a
              href={INFO.instagram}
              target="_blank"
              rel="noreferrer noopener"
              aria-label="Instagram"
              className="grid h-11 w-11 place-items-center rounded-full border border-border text-cream hover:border-gold hover:text-gold"
            >
              <Instagram className="h-5 w-5" />
            </a>
            <a
              href={INFO.tiktok}
              target="_blank"
              rel="noreferrer noopener"
              aria-label="TikTok"
              className="grid h-11 w-11 place-items-center rounded-full border border-border text-cream hover:border-gold hover:text-gold"
            >
              <Music2 className="h-5 w-5" />
            </a>
            <a
              href={WHATSAPP_LINK}
              target="_blank"
              rel="noreferrer noopener"
              aria-label="WhatsApp"
              className="grid h-11 w-11 place-items-center rounded-full border border-border text-cream hover:border-gold hover:text-gold"
            >
              <MessageCircle className="h-5 w-5" />
            </a>
          </div>
        </div>
      </div>

      <div className="border-t border-border px-4 py-6 text-center text-xs text-muted-foreground md:px-8">
        © {new Date().getFullYear()} Primeiro Reino Burger. Todos os direitos reservados. Preços "a
        partir de" conforme o cardápio oficial; adicionais e taxa de entrega são confirmados no
        WhatsApp.
      </div>
    </footer>
  );
}
