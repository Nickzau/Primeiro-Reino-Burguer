import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";
import { Logo } from "@/components/site/Logo";
import { Loader2 } from "lucide-react";

export function AuthPage({ audience }: { audience: "customer" | "owner" }) {
  const isOwner = audience === "owner";
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setError(null);
    setMessage(null);
    setLoading(true);
    try {
      if (mode === "login") {
        const { error: signInError } = await supabase.auth.signInWithPassword({ email, password });
        if (signInError) throw signInError;
        window.location.replace(isOwner ? "/painel" : "/?abrirCarrinho=1");
        return;
      }

      const redirectUrl = `${window.location.origin}/${isOwner ? "auth" : "cliente"}`;
      const { data, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: { emailRedirectTo: redirectUrl },
      });
      if (signUpError) throw signUpError;
      if (data.session) {
        window.location.replace(isOwner ? "/painel" : "/?abrirCarrinho=1");
        return;
      }
      setMessage("Conta criada! Confirme o e-mail que enviamos para liberar o acesso.");
    } catch (err) {
      const raw = err instanceof Error ? err.message : "Não foi possível continuar.";
      setError(
        /email rate limit exceeded/i.test(raw)
          ? "O limite de envio de e-mails foi atingido. Aguarde alguns minutos ou confirme esta conta pelo painel do Supabase."
          : /invalid login credentials/i.test(raw)
            ? "E-mail ou senha incorretos."
            : /already registered/i.test(raw)
              ? "Este e-mail já tem conta. Faça login."
              : raw,
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-4 py-16">
      <div className="w-full max-w-md rounded-3xl border border-border bg-card p-8 shadow-royal">
        <div className="flex flex-col items-center text-center">
          <Logo className="h-16 w-16" />
          <h1 className="mt-4 font-display text-3xl tracking-wide text-cream">
            {isOwner ? "Área dos donos" : "Área do cliente"}
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            {isOwner
              ? "Acesso restrito para administrar produtos e pedidos."
              : "Entre ou crie sua conta para salvar e acompanhar seus pedidos."}
          </p>
        </div>
        <div className="mt-6 grid grid-cols-2 gap-2 rounded-full border border-border bg-surface p-1">
          {(["login", "signup"] as const).map((m) => (
            <button
              key={m}
              type="button"
              onClick={() => {
                setMode(m);
                setError(null);
                setMessage(null);
              }}
              aria-pressed={mode === m}
              className={`rounded-full px-4 py-2 text-sm font-bold uppercase tracking-wider ${mode === m ? "bg-gold-gradient text-primary-foreground" : "text-muted-foreground"}`}
            >
              {m === "login" ? "Entrar" : "Criar conta"}
            </button>
          ))}
        </div>
        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <label className="block text-xs font-bold uppercase tracking-widest text-gold">
            E-mail
            <input
              type="email"
              required
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-2 w-full rounded-xl border border-border bg-surface px-4 py-3 text-cream outline-none focus:border-gold"
            />
          </label>
          <label className="block text-xs font-bold uppercase tracking-widest text-gold">
            Senha
            <input
              type="password"
              required
              minLength={6}
              autoComplete={mode === "login" ? "current-password" : "new-password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-2 w-full rounded-xl border border-border bg-surface px-4 py-3 text-cream outline-none focus:border-gold"
            />
          </label>
          {error && (
            <p
              role="alert"
              className="rounded-xl bg-destructive/15 px-4 py-3 text-sm text-destructive"
            >
              {error}
            </p>
          )}
          {message && (
            <p className="rounded-xl bg-accent/15 px-4 py-3 text-sm text-accent">{message}</p>
          )}
          <button
            type="submit"
            disabled={loading}
            className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-gold-gradient px-6 py-3.5 font-display text-xl tracking-wide text-primary-foreground disabled:opacity-60"
          >
            {loading && <Loader2 className="h-5 w-5 animate-spin" aria-hidden="true" />}
            {mode === "login" ? "Entrar" : "Criar minha conta"}
          </button>
        </form>
        <p className="mt-6 text-center text-xs text-muted-foreground">
          <Link to={isOwner ? "/cliente" : "/auth"} className="text-gold hover:underline">
            {isOwner ? "Sou cliente" : "Sou dono ou faço parte da equipe"}
          </Link>
          {" · "}
          <Link to="/" className="text-gold hover:underline">
            Voltar ao site
          </Link>
        </p>
      </div>
    </main>
  );
}
