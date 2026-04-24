# Requirements Document

## Introduction

A plataforma ASTER atualmente utiliza dados mockados para gerenciar usuários, contagens e avatares. Toda a persistência é feita via `localStorage` e o `AppContext` mantém um array em memória com usuários fictícios. O objetivo desta feature é substituir esses dados mockados por dados reais provenientes do Supabase, cobrindo três eixos principais:

1. **Criação de usuário no Supabase** durante o cadastro (Register)
2. **Contagens reais** exibidas nas páginas (Landing, AdminDashboard, etc.) refletindo os usuários cadastrados no banco
3. **Remoção de avatares mockados** — substituição por placeholder genérico quando o usuário não tiver foto real

O projeto usa React + TypeScript + Vite. O cliente Supabase já está configurado em `src/lib/supabaseClient.ts`. A autenticação do Supabase (`supabase.auth`) será usada para criar e autenticar usuários. Um perfil complementar será armazenado em uma tabela `profiles` no Supabase.

---

## Glossary

- **Supabase_Auth**: Serviço de autenticação do Supabase (`supabase.auth`), responsável por criar e autenticar usuários com email e senha.
- **Profiles_Table**: Tabela `profiles` no banco de dados Supabase que armazena dados complementares do usuário (nome, área, bio, avatar_url, etc.).
- **AppContext**: Contexto React global (`src/app/context/AppContext.tsx`) que provê estado e métodos de autenticação e dados para toda a aplicação.
- **Register_Page**: Página de cadastro (`src/app/pages/Register.tsx`) onde novos usuários criam suas contas.
- **Landing_Page**: Página pública (`src/app/pages/Landing.tsx`) que exibe contagens de usuários e trilhas.
- **AdminDashboard**: Painel administrativo (`src/app/pages/AdminDashboard.tsx`) que exibe métricas reais da plataforma.
- **Avatar_Placeholder**: Imagem genérica exibida quando o usuário não possui foto de perfil real. Deve ser gerada a partir das iniciais do nome do usuário (ex: componente `AvatarFallback` do shadcn/ui).
- **Mock_User**: Usuário fictício definido estaticamente no código-fonte, sem correspondência no banco de dados.
- **Real_User**: Usuário criado via Supabase_Auth com registro persistido na Profiles_Table.
- **User_Count**: Número total de usuários cadastrados na Profiles_Table, excluindo o usuário administrador.

---

## Requirements

### Requirement 1: Criação de Usuário Real no Supabase

**User Story:** Como um visitante, quero criar uma conta na plataforma ASTER, para que meu cadastro seja persistido de forma real no banco de dados e não se perca ao limpar o navegador.

#### Acceptance Criteria

1. WHEN o usuário submete o formulário de cadastro com nome, email, senha e área de atuação válidos, THE Register_Page SHALL chamar `supabase.auth.signUp` com o email e a senha fornecidos.
2. WHEN o `supabase.auth.signUp` retorna com sucesso, THE AppContext SHALL inserir um registro na Profiles_Table contendo o `id` do usuário autenticado, nome, área, `avatar_url` nulo, `bio` vazia, `professional_score` igual a 100 e `role` igual a `'user'`.
3. IF o `supabase.auth.signUp` retornar um erro, THEN THE Register_Page SHALL exibir uma mensagem de erro descritiva ao usuário sem redirecionar para o feed.
4. IF o email informado já estiver cadastrado no Supabase_Auth, THEN THE Register_Page SHALL exibir a mensagem "Este e-mail já está em uso. Tente fazer login." sem criar um novo registro.
5. WHEN o cadastro for concluído com sucesso, THE AppContext SHALL definir o `currentUser` com os dados retornados da Profiles_Table e redirecionar o usuário para `/feed`.
6. THE Register_Page SHALL validar que a senha possui no mínimo 6 caracteres antes de chamar o Supabase_Auth, exibindo mensagem de erro inline caso a validação falhe.

---

### Requirement 2: Autenticação Real via Supabase

**User Story:** Como um usuário cadastrado, quero fazer login com meu email e senha reais, para que minha sessão seja gerenciada pelo Supabase e não dependa do `localStorage` manual.

#### Acceptance Criteria

1. WHEN o usuário submete o formulário de login com email e senha, THE AppContext SHALL chamar `supabase.auth.signInWithPassword` com as credenciais fornecidas.
2. WHEN o `supabase.auth.signInWithPassword` retorna com sucesso, THE AppContext SHALL buscar o perfil correspondente na Profiles_Table usando o `id` do usuário autenticado e definir o `currentUser`.
3. IF o `supabase.auth.signInWithPassword` retornar erro de credenciais inválidas, THEN THE AppContext SHALL retornar `false` para que a página de login exiba a mensagem "Email ou senha incorretos.".
4. WHEN o usuário clica em "Sair", THE AppContext SHALL chamar `supabase.auth.signOut` e limpar o `currentUser`.
5. WHEN a aplicação é inicializada, THE AppContext SHALL chamar `supabase.auth.getSession` para restaurar a sessão ativa do usuário sem exigir novo login.

---

### Requirement 3: Contagens Reais de Usuários nas Páginas

**User Story:** Como um visitante da Landing Page, quero ver o número real de usuários cadastrados na plataforma, para que os dados exibidos reflitam a comunidade genuína e não valores fictícios.

#### Acceptance Criteria

1. WHEN a Landing_Page é renderizada, THE AppContext SHALL buscar o User_Count na Profiles_Table via query `SELECT COUNT(*)` e expor esse valor através de uma propriedade `userCount`.
2. THE Landing_Page SHALL exibir o valor de `userCount` no lugar de qualquer contagem hardcoded ou derivada de dados mockados.
3. WHEN o AdminDashboard é renderizado, THE AppContext SHALL fornecer a lista completa de usuários reais da Profiles_Table através do método `getAllUsers`.
4. THE AdminDashboard SHALL calcular `totalUsers`, distribuição por área e top usuários exclusivamente a partir dos dados retornados pela Profiles_Table.
5. IF a query de contagem falhar, THEN THE Landing_Page SHALL exibir `0` como valor de fallback sem quebrar a renderização da página.
6. WHILE os dados de contagem estão sendo carregados do Supabase, THE Landing_Page SHALL exibir um indicador de carregamento no lugar do número.

---

### Requirement 4: Remoção de Avatares Mockados

**User Story:** Como um usuário da plataforma, quero que as fotos de perfil exibidas sejam reais ou um placeholder neutro, para que não haja imagens falsas de pessoas que não são os usuários reais.

#### Acceptance Criteria

1. THE AppContext SHALL inicializar o campo `avatar` de todo novo usuário criado via Supabase como `null` ou string vazia, sem atribuir nenhuma URL de imagem externa mockada.
2. WHEN um componente exibe o avatar de um usuário e o campo `avatar_url` na Profiles_Table for nulo ou vazio, THE componente SHALL renderizar o `AvatarFallback` do shadcn/ui com as iniciais do nome do usuário.
3. THE Register_Page SHALL criar o usuário sem atribuir nenhuma URL de avatar mockada (ex: URLs do Unsplash hardcoded).
4. THE AppContext SHALL remover a atribuição da URL `https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200` (ou qualquer outra URL mockada) da função `register`.
5. WHEN o usuário faz upload de uma foto de perfil real, THE AppContext SHALL armazenar a URL pública da imagem no campo `avatar_url` da Profiles_Table e atualizar o `currentUser`.
6. WHERE o usuário administrador (`admin_1`) for exibido em listagens, THE AdminDashboard SHALL renderizar o `AvatarFallback` caso o administrador não possua `avatar_url` real cadastrado.

---

### Requirement 5: Sincronização do Perfil com o Supabase

**User Story:** Como um usuário autenticado, quero que as atualizações do meu perfil (bio, habilidades, experiências) sejam salvas no Supabase, para que meus dados não se percam ao trocar de dispositivo ou limpar o cache do navegador.

#### Acceptance Criteria

1. WHEN o usuário chama `updateProfile` com novos dados, THE AppContext SHALL executar um `UPDATE` na Profiles_Table para o registro correspondente ao `currentUser.id`.
2. WHEN o `UPDATE` na Profiles_Table for concluído com sucesso, THE AppContext SHALL atualizar o estado local `currentUser` com os novos dados.
3. IF o `UPDATE` na Profiles_Table falhar, THEN THE AppContext SHALL manter o estado local anterior e exibir uma notificação de erro ao usuário via `toast`.
4. THE AppContext SHALL remover a dependência de `localStorage` para persistência de dados de perfil de usuário, utilizando exclusivamente a Profiles_Table como fonte de verdade.
5. WHEN o usuário acessa a página de perfil de outro usuário, THE AppContext SHALL buscar os dados desse usuário na Profiles_Table via `getUserById` em vez de filtrar o array em memória de usuários mockados.
