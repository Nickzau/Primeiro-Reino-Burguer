import logo from "@/assets/logo-primeiro-reino.jpg";

export function Logo({ className = "h-11 w-11" }: { className?: string }) {
  return (
    <img
      src={logo}
      alt="Logo Primeiro Reino Burger"
      className={`${className} rounded-full object-contain`}
      width={120}
      height={120}
    />
  );
}
