export function Logo({ className = "h-11 w-11" }: { className?: string }) {
  return (
    <img
      src="/logo-primeiro-reino.png"
      alt="Logo Primeiro Reino Burger"
      className={`${className} rounded-full object-contain`}
      width={120}
      height={120}
    />
  );
}
