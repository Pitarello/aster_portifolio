# Requirements Document

## Introduction

Esta feature cobre o processo de publicação (deploy) da aplicação React + Vite em produção e a conexão ao banco de dados Supabase (PostgreSQL), incluindo as Edge Functions hospedadas no Supabase. O objetivo é garantir que o frontend seja servido de forma estável e segura, que as variáveis de ambiente de conexão ao Supabase sejam gerenciadas corretamente, e que as Edge Functions estejam acessíveis e funcionando em produção.

## Glossary

- **Application**: O frontend React + TypeScript + Vite do projeto.
- **Build**: O artefato estático gerado pelo comando `vite build`, pronto para ser servido em produção.
- **Supabase_Client**: A instância do cliente Supabase utilizada pelo frontend para se comunicar com o banco de dados e as Edge Functions.
- **Edge_Function**: Função serverless hospedada no Supabase (Deno), localizada em `supabase/functions/server/`.
- **Environment_Variable**: Variável de configuração sensível (ex.: URL do projeto Supabase, chave anon) que não deve ser exposta no código-fonte versionado.
- **Deploy_Platform**: Plataforma de hospedagem do frontend estático (ex.: Vercel, Netlify, GitHub Pages, Supabase Hosting).
- **CI_CD_Pipeline**: Processo automatizado de build e deploy acionado por eventos de versionamento (ex.: push na branch principal).
- **Health_Check**: Endpoint `/make-server-53751a2b/health` da Edge Function que retorna `{ status: "ok" }` quando o serviço está operacional.

---

## Requirements

### Requirement 1: Build de Produção do Frontend

**User Story:** Como desenvolvedor, quero gerar o build de produção da aplicação, para que o artefato estático otimizado e ofuscado esteja pronto para ser publicado.

#### Acceptance Criteria

1. WHEN o comando de build é executado, THE Application SHALL gerar os artefatos estáticos na pasta `dist/` sem erros de compilação.
2. WHEN o build é gerado em modo produção, THE Application SHALL aplicar ofuscação de código conforme configurado no `vite.config.ts`.
3. WHEN o build é gerado, THE Application SHALL produzir arquivos sem source maps expostos publicamente.
4. IF o build falhar por erro de dependência ou compilação, THEN THE Application SHALL exibir mensagem de erro descritiva no console de build.

---

### Requirement 2: Gerenciamento de Variáveis de Ambiente

**User Story:** Como desenvolvedor, quero configurar as credenciais do Supabase via variáveis de ambiente, para que informações sensíveis não sejam expostas no código-fonte versionado.

#### Acceptance Criteria

1. THE Application SHALL ler a URL do projeto Supabase e a chave anon exclusivamente a partir de variáveis de ambiente definidas na plataforma de deploy.
2. WHEN o build é executado sem as variáveis de ambiente obrigatórias definidas, THE Application SHALL interromper o processo e exibir um erro indicando quais variáveis estão ausentes.
3. IF uma variável de ambiente obrigatória estiver ausente em tempo de execução, THEN THE Supabase_Client SHALL lançar um erro descritivo antes de tentar qualquer conexão.
4. THE Application SHALL garantir que nenhuma chave secreta do Supabase seja incluída diretamente em arquivos versionados no repositório.

---

### Requirement 3: Conexão do Frontend ao Supabase

**User Story:** Como usuário, quero que o frontend se conecte corretamente ao banco de dados Supabase em produção, para que todas as funcionalidades dependentes de dados funcionem normalmente.

#### Acceptance Criteria

1. WHEN a aplicação é carregada em produção, THE Supabase_Client SHALL estabelecer conexão com o projeto Supabase utilizando as credenciais fornecidas pelas variáveis de ambiente.
2. WHEN uma requisição ao banco de dados é realizada, THE Supabase_Client SHALL retornar os dados esperados em até 5 segundos em condições normais de rede.
3. IF a conexão com o Supabase falhar, THEN THE Supabase_Client SHALL retornar um objeto de erro estruturado sem expor detalhes internos ao usuário final.
4. WHILE a aplicação está em execução, THE Supabase_Client SHALL reutilizar a mesma instância de conexão para todas as requisições (singleton).

---

### Requirement 4: Deploy e Disponibilidade das Edge Functions

**User Story:** Como desenvolvedor, quero que as Edge Functions do Supabase estejam publicadas e acessíveis em produção, para que o backend serverless responda corretamente às chamadas do frontend.

#### Acceptance Criteria

1. WHEN o deploy das Edge Functions é executado, THE Edge_Function SHALL ser publicada no projeto Supabase sem erros.
2. WHEN o endpoint de health check é chamado via GET, THE Edge_Function SHALL retornar `{ "status": "ok" }` com HTTP 200.
3. WHEN o frontend realiza uma chamada à Edge Function em produção, THE Edge_Function SHALL responder com os headers CORS corretos permitindo a origem do frontend publicado.
4. IF a Edge Function retornar um erro HTTP 5xx, THEN THE Edge_Function SHALL incluir uma mensagem de erro descritiva no corpo da resposta em formato JSON.

---

### Requirement 5: Pipeline de Deploy Automatizado

**User Story:** Como desenvolvedor, quero um processo automatizado de build e deploy, para que novas versões sejam publicadas de forma consistente e sem intervenção manual repetitiva.

#### Acceptance Criteria

1. WHEN um push é realizado na branch principal do repositório, THE CI_CD_Pipeline SHALL executar o build da aplicação automaticamente.
2. WHEN o build é concluído com sucesso, THE CI_CD_Pipeline SHALL publicar os artefatos na Deploy_Platform sem intervenção manual.
3. IF o build falhar durante o pipeline, THEN THE CI_CD_Pipeline SHALL interromper o deploy e notificar o desenvolvedor com o log de erro.
4. THE CI_CD_Pipeline SHALL injetar as variáveis de ambiente de produção durante o processo de build sem expô-las nos logs públicos.

---

### Requirement 6: Verificação Pós-Deploy

**User Story:** Como desenvolvedor, quero verificar que o sistema está funcionando corretamente após o deploy, para que problemas de integração sejam detectados antes de impactar os usuários.

#### Acceptance Criteria

1. WHEN o deploy é concluído, THE Application SHALL estar acessível via URL pública e retornar HTTP 200 na rota raiz.
2. WHEN a verificação pós-deploy é executada, THE Health_Check SHALL retornar `{ "status": "ok" }` confirmando que a Edge Function está operacional.
3. WHEN a aplicação é acessada em produção, THE Supabase_Client SHALL completar a inicialização de conexão sem erros registrados no console.
4. IF qualquer verificação pós-deploy falhar, THEN THE CI_CD_Pipeline SHALL marcar o deploy como falho e manter a versão anterior em produção (rollback).
