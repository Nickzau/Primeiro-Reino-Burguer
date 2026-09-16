import logo from "@/assets/logo.png.asset.json";

export function Logo({ className = "h-11 w-11" }: { className?: string }) {
  return (
    <img
      src={logo.url}
      alt="Logo Primeiro Reino Burger"
      className={`${className} rounded-full object-contain`}
      width={120}
      height={120}
    />
  );
}
