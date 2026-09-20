import { createFileRoute } from "@tanstack/react-router";
import { AuthPage } from "@/components/auth/AuthPage";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: "Área dos donos | Primeiro Reino Burger" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: () => <AuthPage audience="owner" />,
});
