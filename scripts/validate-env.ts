const REQUIRED_VARS = ['VITE_SUPABASE_URL', 'VITE_SUPABASE_ANON_KEY'];

function validateBuildEnv(): void {
  const missing = REQUIRED_VARS.filter((varName) => !process.env[varName]);

  if (missing.length > 0) {
    console.error(
      `\n❌ Build abortado: as seguintes variáveis de ambiente obrigatórias estão ausentes:\n` +
        missing.map((v) => `  - ${v}`).join('\n') +
        `\n\nDefina essas variáveis antes de executar o build.\n`
    );
    process.exit(1);
  }

  console.log('✅ Variáveis de ambiente validadas com sucesso.');
}

validateBuildEnv();
