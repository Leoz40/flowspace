const fs = require('fs');
const path = require('path');

// Lista completa de arquivos esperados conforme o projeto FlowSpace
const arquivosEsperados = [
  // Configuração
  'package.json',
  'astro.config.mjs',
  'tsconfig.json',

  // Middleware e Libs
  'src/middleware.ts',
  'src/lib/auth.ts',
  'src/lib/progress-tracker.ts',

  // Base de Conhecimento (Os 20 módulos)
  'src/data/knowledge-base.ts',
  'src/data/knowledge-base-extended.ts',
  'src/data/knowledge-base-v2.ts',
  'src/data/knowledge-base-v3.ts',
  'src/data/module-categories.ts',
  'src/data/related-modules.ts',

  // Componentes React
  'src/components/ImmersiveBackground.jsx',
  'src/components/LoginForm.jsx',
  'src/components/ModuleSelector.jsx',
  'src/components/InteractiveFlow.jsx',
  'src/components/ProgressIndicator.jsx',
  'src/components/RelatedModules.jsx',
  'src/components/ResolutionFilter.jsx',

  // Páginas Astro
  'src/layouts/Layout.astro',
  'src/pages/login.astro',
  'src/pages/index.astro',
  'src/pages/modulo/[moduleId].astro',

  // APIs de Autenticação
  'src/pages/api/auth/login.ts',
  'src/pages/api/auth/logout.ts',

  // Estilos
  'src/styles/global.css',
  'src/styles/animations.css',
  'src/styles/components.css',
];

console.log('🔍 Verificando estrutura do projeto FlowSpace...\n');

let presentes = 0;
let ausentes = [];

arquivosEsperados.forEach((arquivo) => {
  const caminhoCompleto = path.join(__dirname, arquivo);
  if (fs.existsSync(caminhoCompleto)) {
    console.log(`✅ ${arquivo}`);
    presentes++;
  } else {
    console.log(`❌ ${arquivo}  [FALTANDO]`);
    ausentes.push(arquivo);
  }
});

console.log('\n' + '='.repeat(50));
console.log(`📊 Resumo: ${presentes}/${arquivosEsperados.length} arquivos encontrados.`);

if (ausentes.length > 0) {
  console.log('\n⚠️  Arquivos que ainda precisam ser criados:');
  ausentes.forEach((arq) => console.log(`   - ${arq}`));
  console.log('\n💡 Dica: Peça para a IA gerar o código dos arquivos marcados com ❌');
} else {
  console.log('\n🎉 Parabéns! Todos os arquivos do projeto estão presentes!');
}
console.log('='.repeat(50));
