-- Confirma e promove a conta do Primeiro Reino Burger para administradora.
-- Execute no Supabase SQL Editor depois de criar a conta em /auth.
-- Útil em desenvolvimento quando o e-mail de confirmação não chega.

do $$
declare
  admin_user_id uuid;
begin
  select id
    into admin_user_id
    from auth.users
   where lower(email) = lower('nmoraes75@gmail.com')
   limit 1;

  if admin_user_id is null then
    raise exception
      'Usuário nmoraes75@gmail.com não encontrado. Crie essa conta em /auth e execute novamente.';
  end if;

  update auth.users
     set email_confirmed_at = coalesce(email_confirmed_at, now())
   where id = admin_user_id;

  insert into public.user_roles (user_id, role)
  values (admin_user_id, 'admin'::public.app_role)
  on conflict (user_id, role) do nothing;
end
$$;

-- Confirma o resultado:
select u.email, r.role
  from auth.users u
  join public.user_roles r on r.user_id = u.id
 where lower(u.email) = lower('nmoraes75@gmail.com');

 update auth.users
set email_confirmed_at = coalesce(email_confirmed_at, now())
