export function validarDestinoDemo(env: Record<string, string | undefined>) {
  if (env.NODE_ENV === 'production') throw new Error('DEMO prohibido en producción');
  if (env.DEMO_BASE_AISLADA !== 'SI') throw new Error('Se requiere DEMO_BASE_AISLADA=SI para escrituras');
  let url: URL;
  try { url = new URL(env.DATABASE_URL || ''); } catch { throw new Error('DATABASE_URL inválida'); }
  if (!['postgres:', 'postgresql:'].includes(url.protocol) || !['localhost', '127.0.0.1', '[::1]'].includes(url.hostname)) throw new Error('DEMO sólo permite PostgreSQL local aislado');
  if (url.searchParams.has('host') || url.searchParams.has('hostaddr') || url.searchParams.has('service')) throw new Error('No se permiten destinos PostgreSQL alternativos en query');
  if (url.pathname === '/pblindadas_finanzas') throw new Error('La base activa pblindadas_finanzas está expresamente prohibida para datos ficticios');
  if (!/^\/[a-z0-9_]*(?:_demo|_test|_validacion(?:_[0-9_]+)?)$/.test(url.pathname)) throw new Error('La base debe terminar en _demo, _test o _validacion[_fecha]');
  return true;
}
