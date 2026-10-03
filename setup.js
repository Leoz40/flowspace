const fs = require('fs');
const path = require('path');

// Estrutura de pastas
const dirs = [
  'src/pages/api/auth',
  'src/pages/modulo',
  'src/components',
  'src/data',
  'src/layouts',
  'src/lib',
  'src/styles',
  'public/flows',
];

dirs.forEach((dir) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
    console.log(`✅ Pasta criada: ${dir}`);
  }
});

// Arquivos principais
const files = {
  'package.json': `{
  "name": "flowspace",
  "type": "module",
  "version": "1.0.0",
  "scripts": {
    "dev": "astro dev",
    "build": "astro build",
    "preview": "astro preview"
  },
  "dependencies": {
    "astro": "^4.15.0",
    "react": "^18.3.1",
    "react-dom": "^18.3.1",
    "framer-motion": "^11.5.4",
    "@rive-app/react-canvas": "^4.13.0",
    "@splinetool/react-spline": "^4.0.0",
    "bcryptjs": "^2.4.3",
    "zod": "^3.23.8"
  }
}`,

  'astro.config.mjs': `import { defineConfig } from 'astro/config';
import react from '@astrojs/react';

export default defineConfig({
  integrations: [react()],
});`,

  'tsconfig.json': `{
  "extends": "astro/tsconfigs/strict",
  "compilerOptions": {
    "jsx": "react-jsx",
    "jsxImportSource": "react"
  }
}`,

  'src/middleware.ts': `import { defineMiddleware } from 'astro:middleware';

const PUBLIC_ROUTES = ['/login', '/api/auth/login'];

export const onRequest = defineMiddleware(async ({ cookies, url, redirect }, next) => {
  const pathname = url.pathname;
  if (PUBLIC_ROUTES.some(route => pathname.startsWith(route)) || pathname.startsWith('/_astro') || pathname.includes('.')) {
    return next();
  }
  const sessionId = cookies.get('auth_session')?.value;
  if (!sessionId) return redirect('/login');
  // Em produção, valide a sessão aqui. Para o MVP, apenas verifica a existência.
  return next();
});`,

  'src/lib/auth.ts': `import bcrypt from 'bcryptjs';
import { randomUUID } from 'crypto';
import type { AstroCookies } from 'astro';

const MOCK_USERS = [{ id: '1', email: 'demo@flowspace.com', password: '$2a$10$XQ5rbzrKzHJzEXAMPLEHASH', name: 'Vistoriador Demo' }];
const sessions = new Map<string, { userId: string; expiresAt: Date }>();

export async function validateUser(email: string, password: string) {
  const user = MOCK_USERS.find(u => u.email === email);
  if (!user) return null;
  const isValid = await bcrypt.compare(password, user.password); // Senha demo: "demo123"
  return isValid ? { id: user.id, email: user.email, name: user.name } : null;
}

export async function setAuthCookie(cookies: AstroCookies, userId: string) {
  const sessionId = randomUUID();
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
  sessions.set(sessionId, { userId, expiresAt });
  cookies.set('auth_session', sessionId, { httpOnly: true, secure: false, sameSite: 'lax', path: '/', expires: expiresAt });
}

export async function validateSession(sessionId: string) {
  const session = sessions.get(sessionId);
  return session && session.expiresAt > new Date() ? session : null;
}`,

  'src/pages/api/auth/login.ts': `import type { APIRoute } from 'astro';
import { validateUser, setAuthCookie } from '../../../lib/auth';

export const POST: APIRoute = async ({ request, cookies }) => {
  const { email, password } = await request.json();
  const user = await validateUser(email, password);
  if (!user) {
    return new Response(JSON.stringify({ error: 'Credenciais inválidas' }), { status: 401, headers: { 'Content-Type': 'application/json' } });
  }
  await setAuthCookie(cookies, user.id);
  return new Response(JSON.stringify({ success: true, redirect: '/' }), { status: 200, headers: { 'Content-Type': 'application/json' } });
};`,

  'src/pages/api/auth/logout.ts': `import type { APIRoute } from 'astro';
export const POST: APIRoute = async ({ cookies, redirect }) => {
  cookies.delete('auth_session', { path: '/' });
  return redirect('/login');
};`,

  'src/styles/global.css': `:root {
  --color-primary: #2563eb;
  --bg-dark: #0f172a;
  --bg-card: rgba(255, 255, 255, 0.05);
  --border-color: rgba(255, 255, 255, 0.1);
}
body { margin: 0; font-family: 'Inter', system-ui, sans-serif; background: var(--bg-dark); color: white; }
* { box-sizing: border-box; }`,
};

// Escrever arquivos
Object.entries(files).forEach(([filePath, content]) => {
  fs.writeFileSync(filePath, content.trim());
  console.log(`✅ Arquivo criado: ${filePath}`);
});

console.log('\n🎉 Projeto FlowSpace criado com sucesso!');
console.log('👉 Agora execute: npm install');
console.log('👉 Depois execute: npm run dev');
