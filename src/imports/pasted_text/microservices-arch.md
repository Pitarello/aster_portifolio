# DOCUMENTAÇÃO TÉCNICA - ARQUITETURA DE MICROSSERVIÇOS

## 1. INTRODUÇÃO

Este documento descreve a arquitetura técnica de um sistema distribuído baseado em microserviços, projetado para alta escalabilidade, resiliência e manutenção independente.

---

## 2. VISÃO ARQUITETURAL

A arquitetura segue os princípios:

- Separação por domínio (DDD - Domain Driven Design)
- Comunicação híbrida (REST + Event-driven)
- Escalabilidade horizontal
- Baixo acoplamento

---

## 3. COMPONENTES PRINCIPAIS

### 3.1 Frontend
- Tecnologia: React (Vite)
- Responsabilidade:
  - Interface do usuário
  - Consumo de APIs
  - Gerenciamento de estado (React Query)

---

### 3.2 API Gateway
- Responsável por:
  - Roteamento de requisições
  - Autenticação (JWT)
  - Rate limiting
  - Logging

---

### 3.3 Auth Service
- Funções:
  - Registro de usuários
  - Login
  - Geração e validação de JWT
- Banco: auth_db

---

### 3.4 User Service
- Funções:
  - Gerenciamento de perfil
  - Sistema de seguidores
- Banco: user_db

---

### 3.5 Post Service
- Funções:
  - Criação de posts
  - Likes
  - Comentários
- Banco: post_db

---

### 3.6 Feed Service
- Funções:
  - Montagem do feed
  - Ordenação e ranking
  - Cache
- Banco: feed_db
- Cache: Redis

---

### 3.7 Message Broker
- Tecnologia recomendada: RabbitMQ ou Kafka
- Responsável por:
  - Comunicação assíncrona
  - Processamento de eventos

Eventos principais:
- POST_CREATED
- POST_LIKED
- USER_FOLLOWED

---

### 3.8 Storage
- Cloudinary ou AWS S3
- Armazenamento de imagens e mídia

---

## 4. FLUXOS PRINCIPAIS

### 4.1 Login

1. Usuário envia credenciais
2. API Gateway encaminha para Auth Service
3. Auth valida e retorna JWT
4. Frontend armazena token

---

### 4.2 Criação de Post

1. Upload da imagem no Storage
2. Envio do post ao Post Service
3. Persistência no banco
4. Publicação do evento POST_CREATED
5. Feed Service consome evento e atualiza feed

---

### 4.3 Consulta de Feed

1. Frontend requisita feed
2. Feed Service consulta Redis
3. Caso miss, consulta banco
4. Retorna dados otimizados

---

## 5. SEGURANÇA

- Autenticação via JWT
- Middleware no Gateway
- Validação de token em serviços críticos
- HTTPS obrigatório

---

## 6. ESCALABILIDADE

- Escala horizontal por serviço
- Balanceamento de carga
- Cache com Redis
- CDN para mídia

---

## 7. OBSERVABILIDADE

- Logs centralizados (ELK Stack)
- Métricas (Prometheus + Grafana)
- Tracing distribuído (Jaeger)

---

## 8. PADRÕES UTILIZADOS

- Microservices Architecture
- Event-Driven Architecture
- CQRS (Command Query Responsibility Segregation)
- API Gateway Pattern

---

## 9. ESTRATÉGIA DE DEPLOY

- Frontend: Vercel
- Backend: Docker + Kubernetes (ou Render/Railway)
- Banco: PostgreSQL (Supabase/Neon)

---

## 10. CONSIDERAÇÕES FINAIS

Esta arquitetura permite:

- Alta escalabilidade
- Evolução independente de serviços
- Alta disponibilidade
- Facilidade de manutenção

Recomenda-se iniciar com um monólito modular e evoluir para microserviços conforme a necessidade de escala.
