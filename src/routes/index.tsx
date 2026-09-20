import { createFileRoute } from "@tanstack/react-router";
import { useEffect } from "react";
import { CartProvider, useCart } from "@/lib/cart";
import { Header } from "@/components/site/Header";
import { Hero } from "@/components/site/Hero";
import { MenuSection } from "@/components/site/MenuSection";
import { Features } from "@/components/site/Features";
import { Gallery } from "@/components/site/Gallery";
import { HowItWorks } from "@/components/site/HowItWorks";
import { Location } from "@/components/site/Location";
import { Footer } from "@/components/site/Footer";
import { CartDrawer } from "@/components/site/CartDrawer";
import { ShoppingBag } from "lucide-react";
import { formatBRL } from "@/data/menu";

const title = "Primeiro Reino Burger | Hambúrgueres artesanais em Porto Alegre";
const description =
  "Hambúrgueres artesanais, fritas crocantes e molhos marcantes com delivery em Porto Alegre. Monte seu pedido e finalize pelo WhatsApp.";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

function MobileCartBar() {
  const { count, subtotal, open, isOpen } = useCart();
  if (count === 0 || isOpen) return null;
  return (
    <button
      type="button"
      onClick={open}
      className="fixed inset-x-4 bottom-4 z-30 flex items-center justify-between gap-3 rounded-full bg-gold-gradient px-6 py-4 font-display text-xl tracking-wide text-primary-foreground shadow-royal sm:hidden"
    >
      <span className="flex items-center gap-2">
        <ShoppingBag className="h-5 w-5" aria-hidden="true" />
        Ver pedido ({count})
      </span>
      <span>{formatBRL(subtotal)}</span>
    </button>
  );
}

function Index() {
  return (
    <CartProvider>
      <IndexContent />
    </CartProvider>
  );
}

function IndexContent() {
  const { open } = useCart();

  useEffect(() => {
    if (new URLSearchParams(window.location.search).get("abrirCarrinho") === "1") {
      open();
      window.history.replaceState({}, "", "/");
    }
  }, [open]);

  return (
    <>
      <Header />
      <main>
        <Hero />
        <MenuSection />
        <Features />
        <Gallery />
        <HowItWorks />
        <Location />
      </main>
      <Footer />
      <CartDrawer />
      <MobileCartBar />
    </>
  );
}
