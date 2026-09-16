# Primeiro Reino Burger

Aplicação completa para o Primeiro Reino Burger, importada do projeto Lovable e organizada como uma aplicação full-stack com React, TanStack Start, Tailwind CSS e Supabase.

## O que já está incluído

- site público com identidade visual do restaurante;
- cardápio organizado por categorias;
- carrinho de compras e fechamento de pedido pelo WhatsApp;
- páginas de localização, galeria, funcionamento e informações da casa;
- autenticação de equipe;
- painel protegido para cadastrar, editar, ocultar e excluir produtos;
- persistência de produtos e pedidos no Supabase;
- migrations Drizzle/Supabase para produtos, permissões administrativas e pedidos.
- proteção de sessão com logout automático após 30 minutos sem atividade ou 8 horas de duração;
- opção de encerrar a sessão em todos os dispositivos pelo Supabase.

## Desenvolvimento local

Requisitos: Node.js ou Bun e um projeto Supabase configurado.

```sh
npm install
npm run dev
```

Copie `.env.example` para `.env` e preencha as credenciais do Supabase. O arquivo `.env` original do export não foi copiado para este repositório.

## Rotas principais

- `/` — site público e cardápio;
- `/auth` — login e criação de conta;
- `/painel` — painel administrativo protegido;
- `/pedidos` — consulta dos pedidos recebidos.
- `/minha-conta` — cadastro/login do cliente, acompanhamento e histórico de pedidos.

## Liberar o administrador

1. Inicie o projeto com `npm run dev`.
2. Abra `http://localhost:3000/auth`.
3. Crie a conta usando o e-mail `nmoraes75@gmail.com`.
4. No Supabase, abra **SQL Editor**, cole o conteúdo de `supabase/promote_admin.sql` e clique em **Run**.
5. Volte para `http://localhost:3000/painel`, saia da conta e entre novamente.

O script interrompe com uma mensagem explicativa se a conta ainda não tiver sido criada.

## Pedidos de clientes

Depois de aplicar as migrations anteriores, execute também `drizzle/migrations/0003_customer_orders.sql`. A partir dela, o cliente precisa estar logado para finalizar um pedido. Cada pedido fica vinculado à conta autenticada e aparece em `/minha-conta`, com atualização automática de status.

## Segurança de sessão

O navegador encerra a sessão local após 30 minutos sem atividade ou 8 horas desde o início da sessão. As áreas autenticadas também oferecem **Sair de todos os dispositivos**, que revoga as sessões do usuário no Supabase. A autorização administrativa continua sendo validada no servidor e pelas políticas RLS do banco; esses controles não dependem do frontend.
