interface EnvConfig {
  supabaseUrl: string;
  supabaseAnonKey: string;
}

function validateEnv(): EnvConfig {
  const missing: string[] = [];

  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
  const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

  if (!supabaseUrl) missing.push('VITE_SUPABASE_URL');
  if (!supabaseAnonKey) missing.push('VITE_SUPABASE_ANON_KEY');

  if (missing.length > 0) {
    throw new Error(`Variáveis de ambiente ausentes: ${missing.join(', ')}`);
  }

  return {
    supabaseUrl: supabaseUrl as string,
    supabaseAnonKey: supabaseAnonKey as string,
  };
}

export const env: Readonly<EnvConfig> = Object.freeze(validateEnv());
