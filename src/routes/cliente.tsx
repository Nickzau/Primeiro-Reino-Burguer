import { createFileRoute } from "@tanstack/react-router";
import { AuthPage } from "@/components/auth/AuthPage";

export const Route = createFileRoute("/cliente")({
  head: () => ({ meta: [{ title: "Área do cliente | Primeiro Reino Burger" }] }),
  component: () => <AuthPage audience="customer" />,
});
