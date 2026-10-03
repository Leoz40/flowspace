import { defineMiddleware } from 'astro:middleware';

const PUBLIC_ROUTES = ['/login', '/api/auth/login'];

export const onRequest = defineMiddleware(async ({ cookies, url, redirect }, next) => {
  const pathname = url.pathname;
  if (
    PUBLIC_ROUTES.some((route) => pathname.startsWith(route)) ||
    pathname.startsWith('/_astro') ||
    pathname.includes('.')
  ) {
    return next();
  }
  const sessionId = cookies.get('auth_session')?.value;
  if (!sessionId) return redirect('/login');
  // Em produção, valide a sessão aqui. Para o MVP, apenas verifica a existência.
  return next();
});
