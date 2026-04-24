# Implementation Plan: system-deployment-database-connection

## Overview

Implementação incremental do processo de deploy em produção e conexão ao Supabase. As tarefas cobrem: validação de variáveis de ambiente, cliente Supabase singleton, tratamento de erros estruturado, hardening da Edge Function, script de validação de build e pipeline CI/CD.

## Tasks

- [x] 1. Criar módulo de validação de variáveis de ambiente (`src/lib/env.ts`)
  - Criar o arquivo `src/lib/env.ts` com a interface `EnvConfig` e a função `validateEnv()`
  - A função deve ler `import.meta.env.VITE_SUPABASE_URL` e `import.meta.env.VITE_SUPABASE_ANON_KEY`
  - Lançar `Error` descritivo listando todas as variáveis ausentes se alguma não estiver definida
  - Exportar objeto imutável `env` com as configurações validadas
  - _Requirements: 2.1, 2.2, 2.3_

  - [ ]* 1.1 Escrever property test para `validateEnv` — Property 1: leitura de credenciais
    - Instalar `fast-check` como devDependency (`npm install --save-dev fast-check`)
    - Criar `src/lib/__tests__/env.test.ts`
    - Gerar pares aleatórios `(url, anonKey)` com `fc.string()`, mockar `import.meta.env`, verificar que `validateEnv()` retorna exatamente esses valores
    - Rodar mínimo de 100 iterações
    - **Property 1: Leitura de credenciais a partir de variáveis de ambiente**
    - **Validates: Requirements 2.1**

  - [ ]* 1.2 Escrever property test para `validateEnv` — Property 2: variáveis ausentes
    - No mesmo arquivo `src/lib/__tests__/env.test.ts`
    - Gerar subconjuntos aleatórios das variáveis obrigatórias para omitir com `fc.subarray()`
    - Verificar que o erro lançado menciona explicitamente o nome de cada variável ausente
    - **Property 2: Validação de variáveis ausentes**
    - **Validates: Requirements 2.2, 2.3**

- [x] 2. Criar cliente Supabase singleton (`src/lib/supabaseClient.ts`)
  - Instalar `@supabase/supabase-js` como dependência (`npm install @supabase/supabase-js`)
  - Criar `src/lib/supabaseClient.ts` com padrão singleton usando variável de módulo `instance`
  - Implementar `getSupabaseClient()` que cria o cliente na primeira chamada e reutiliza nas subsequentes
  - Usar as credenciais retornadas por `validateEnv()` do módulo `env.ts`
  - _Requirements: 3.1, 3.4_

  - [ ]* 2.1 Escrever property test para `getSupabaseClient` — Property 4: singleton
    - Criar `src/lib/__tests__/supabaseClient.test.ts`
    - Gerar número aleatório de chamadas (1–100) com `fc.integer({ min: 1, max: 100 })`
    - Verificar que todas as chamadas retornam `===` a mesma referência de objeto
    - **Property 4: Singleton do cliente Supabase**
    - **Validates: Requirements 3.4**

- [x] 3. Implementar wrapper de queries com tratamento de erros estruturado (`src/lib/supabaseClient.ts`)
  - Definir a interface `SupabaseError` com campos `code`, `message` e `timestamp`
  - Implementar a função `safeQuery<T>()` que encapsula chamadas ao Supabase
  - Mapear erros de rede para `{ code: "NETWORK_ERROR", message: "Falha na conexão. Tente novamente." }`
  - Mapear erros de autenticação para `{ code: "AUTH_ERROR", message: "Sessão expirada. Faça login novamente." }`
  - Mapear erros genéricos para `{ code: "UNKNOWN_ERROR", message: "Ocorreu um erro inesperado." }`
  - Garantir que stack traces e mensagens internas do Supabase nunca sejam expostos
  - _Requirements: 3.3_

  - [ ]* 3.1 Escrever property test para `safeQuery` — Property 3: erros sanitizados
    - No arquivo `src/lib/__tests__/supabaseClient.test.ts`
    - Gerar erros aleatórios (mensagens, stack traces, objetos de erro do Supabase) com `fc.record()`
    - Verificar que o resultado é sempre um `SupabaseError` sem dados internos (sem stack trace, sem mensagens do Supabase)
    - **Property 3: Tratamento de erros do cliente Supabase**
    - **Validates: Requirements 3.3**

- [x] 4. Checkpoint — Garantir que todos os testes passam
  - Garantir que todos os testes passam, perguntar ao usuário se houver dúvidas.

- [x] 5. Adicionar tratamento global de erros e CORS restrito à Edge Function (`supabase/functions/server/index.tsx`)
  - Adicionar `app.onError()` com middleware global que retorna JSON `{ error: string }` com status 500
  - Atualizar a configuração de CORS para aceitar a URL de produção do frontend (via variável de ambiente `FRONTEND_URL`) em vez de `origin: "*"`
  - Manter `origin: "*"` como fallback para ambiente de desenvolvimento
  - _Requirements: 4.3, 4.4_

  - [ ]* 5.1 Escrever property test para Edge Function — Property 5: headers CORS
    - Criar `supabase/functions/server/__tests__/server.test.ts`
    - Gerar origens válidas do frontend com `fc.webUrl()` ou `fc.string()`
    - Verificar que a resposta contém `Access-Control-Allow-Origin` adequado para origens permitidas
    - **Property 5: Headers CORS para origens do frontend**
    - **Validates: Requirements 4.3**

  - [ ]* 5.2 Escrever property test para Edge Function — Property 6: erros 5xx em JSON
    - No mesmo arquivo de testes da Edge Function
    - Simular erros internos aleatórios com `fc.string()` para mensagens de erro
    - Verificar que a resposta é JSON válido com campo `error` não-vazio
    - **Property 6: Erros 5xx da Edge Function em formato JSON**
    - **Validates: Requirements 4.4**

  - [ ]* 5.3 Escrever teste de exemplo para health check
    - Verificar que `GET /make-server-53751a2b/health` retorna `{ status: "ok" }` com HTTP 200
    - **Validates: Requirements 4.2, 6.2**

- [x] 6. Criar script de validação de variáveis de ambiente para pré-build (`scripts/validate-env.ts`)
  - Criar o arquivo `scripts/validate-env.ts`
  - Definir array `REQUIRED_VARS = ['VITE_SUPABASE_URL', 'VITE_SUPABASE_ANON_KEY']`
  - Implementar `validateBuildEnv()` que verifica `process.env` e encerra com `process.exit(1)` e mensagem descritiva se alguma variável estiver ausente
  - Adicionar script `"prebuild": "tsx scripts/validate-env.ts"` no `package.json`
  - Instalar `tsx` como devDependency se necessário (`npm install --save-dev tsx`)
  - _Requirements: 2.2, 2.4_

- [x] 7. Criar arquivo de variáveis de ambiente de exemplo (`.env.example`)
  - Criar `.env.example` na raiz do projeto com as variáveis obrigatórias sem valores reais
  - Garantir que `.env.production` e `.env.local` estão listados no `.gitignore`
  - Verificar que nenhuma chave real do Supabase está em arquivos versionados
  - _Requirements: 2.4_

- [x] 8. Criar pipeline CI/CD com GitHub Actions (`.github/workflows/deploy.yml`)
  - Criar o arquivo `.github/workflows/deploy.yml`
  - Configurar trigger em `push` na branch `main`
  - Job `build`: `npm ci` → `npm run build` (inclui validação de env vars via prebuild)
  - Job `deploy-frontend`: publicar `dist/` na plataforma de deploy (Vercel ou Netlify) usando token via secret
  - Job `deploy-functions`: executar `supabase functions deploy server` usando `SUPABASE_ACCESS_TOKEN` via secret
  - Job `health-check`: `curl` no endpoint `GET /make-server-53751a2b/health` e verificar resposta `{ "status": "ok" }`
  - Configurar rollback no job `health-check` em caso de falha (acionar rollback da plataforma de deploy)
  - Garantir que todos os secrets são injetados via `${{ secrets.* }}` sem exposição nos logs
  - _Requirements: 5.1, 5.2, 5.3, 5.4, 6.4_

- [x] 9. Checkpoint final — Garantir que todos os testes passam
  - Garantir que todos os testes passam, perguntar ao usuário se houver dúvidas.

## Notes

- Tarefas marcadas com `*` são opcionais e podem ser puladas para um MVP mais rápido
- Cada tarefa referencia requisitos específicos para rastreabilidade
- Os property tests usam `fast-check` com mínimo de 100 iterações cada
- Os testes de propriedade validam lógica pura; testes de integração com Supabase real devem ser executados com credenciais de staging no CI
- O script `validate-env.ts` garante fail-fast no build antes de qualquer tentativa de conexão
