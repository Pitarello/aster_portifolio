# Documentação do Sistema: ASTER

## Sobre o Projeto

A **ASTER** é uma plataforma social profissional puramente frontend, voltada para a Geração Z. Ela oferece:

- Trilhas de cursos gamificadas.
- Criação e exibição de portfólios.
- Networking entre profissionais.
- Estado persistente local (via `localStorage`).
- Seção "Sobre Nós" focada na democratização do conhecimento.
- Área para parceiros (empresas/criadores) se inscreverem, contratarem talentos e publicarem conteúdos.

## Funcionalidades e Rotas

- **Landing Page (`/`)**: Página inicial dinâmica, apresentando a plataforma, a seção "Sobre Nós" e benefícios para parceiros.
- **Login (`/login`)**: Acesso à plataforma.
- **Cadastro (`/register`)**: Criação de novas contas.
- **Feed (`/feed`)**: Área principal após o login, onde o usuário interage com o conteúdo.
- **Parceiros (`/partner`)**: Formulário e informações para se tornar um parceiro.

## Rodando a Aplicação

Para rodar o teste do sistema na web de forma autônoma (após o build/exportação do código), abra o arquivo principal gerado:

👉 [**Executar a Aplicação Web (index.html)**](./index.html)

---

_Nota: Durante o ambiente de desenvolvimento local, utilize o servidor embutido (`npm run dev`) para garantir o funcionamento correto de importações de módulos e rotas dinâmicas do React._
