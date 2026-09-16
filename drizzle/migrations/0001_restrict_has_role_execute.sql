-- Move the SECURITY DEFINER role-check helper out of the public (API-exposed) schema
create schema if not exists app_private;

revoke all on schema app_private from public;
revoke usage on schema app_private from anon;
grant usage on schema app_private to authenticated, service_role;

alter function public.has_role(uuid, public.app_role) set schema app_private;

revoke all on function app_private.has_role(uuid, public.app_role) from public;
revoke all on function app_private.has_role(uuid, public.app_role) from anon;
grant execute on function app_private.has_role(uuid, public.app_role) to authenticated, service_role;