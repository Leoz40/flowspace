import type { APIRoute } from 'astro';
export const POST: APIRoute = async ({ cookies, redirect }) => {
  cookies.delete('auth_session', { path: '/' });
  return redirect('/login');
};
