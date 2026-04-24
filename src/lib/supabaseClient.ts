import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { env } from './env';

let instance: SupabaseClient | null = null;

export function getSupabaseClient(): SupabaseClient {
  if (!instance) {
    instance = createClient(env.supabaseUrl, env.supabaseAnonKey);
  }
  return instance;
}

export interface SupabaseError {
  code: string;
  message: string;
  timestamp: string; // ISO 8601
}

export async function safeQuery<T>(
  fn: () => Promise<{ data: T | null; error: unknown }>
): Promise<{ data: T | null; error: SupabaseError | null }> {
  try {
    const { data, error } = await fn();

    if (error) {
      return { data: null, error: classifyError(error) };
    }

    return { data, error: null };
  } catch (err) {
    return { data: null, error: classifyError(err) };
  }
}

function classifyError(err: unknown): SupabaseError {
  const timestamp = new Date().toISOString();

  if (isNetworkError(err)) {
    return { code: 'NETWORK_ERROR', message: 'Falha na conexão. Tente novamente.', timestamp };
  }

  if (isAuthError(err)) {
    return { code: 'AUTH_ERROR', message: 'Sessão expirada. Faça login novamente.', timestamp };
  }

  return { code: 'UNKNOWN_ERROR', message: 'Ocorreu um erro inesperado.', timestamp };
}

function isNetworkError(err: unknown): boolean {
  if (err instanceof TypeError && /fetch|network|failed to fetch/i.test(err.message)) {
    return true;
  }
  if (isSupabaseErrorObject(err)) {
    const code = (err as { code?: string }).code;
    return code === 'PGRST301' || /network|connection/i.test((err as { message?: string }).message ?? '');
  }
  return false;
}

function isAuthError(err: unknown): boolean {
  if (isSupabaseErrorObject(err)) {
    const status = (err as { status?: number }).status;
    const code = (err as { code?: string }).code;
    if (status === 401 || status === 403) return true;
    if (code === 'PGRST301' || /jwt|auth|token|unauthorized|forbidden/i.test((err as { message?: string }).message ?? '')) {
      return true;
    }
  }
  if (err instanceof Error && /jwt|auth|token|unauthorized|forbidden/i.test(err.message)) {
    return true;
  }
  return false;
}

function isSupabaseErrorObject(err: unknown): boolean {
  return typeof err === 'object' && err !== null && 'message' in err;
}
