import type { APIRoute } from 'astro';
import { validateUser, setAuthCookie } from '../../../lib/auth';

export const POST: APIRoute = async ({ request, cookies }) => {
  const { email, password } = await request.json();
  const user = await validateUser(email, password);
  if (!user) {
    return new Response(JSON.stringify({ error: 'Credenciais inválidas' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' },
    });
  }
  await setAuthCookie(cookies, user.id);
  return new Response(JSON.stringify({ success: true, redirect: '/' }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
};
