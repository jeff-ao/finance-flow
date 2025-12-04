# Finance Flow 💰

Sistema completo de gerenciamento financeiro com backend API REST e frontend Next.js.

## 🚀 Stack Tecnológica

### Backend

- **Express** 5.1.0 com TypeScript (ES modules)
- **PostgreSQL** com Prisma ORM 7.0.1
- **Autenticação**: JWT + bcryptjs
- **Validação**: Zod schemas
- **Documentação**: Swagger UI (OpenAPI 3.0)

### Frontend

- **Next.js** 16.0.7 com React 19.2.0
- **UI**: Shadcn/UI + Radix UI
- **Styling**: Tailwind CSS
- **Forms**: React Hook Form + Zod
- **HTTP Client**: Axios com interceptors
- **Icons**: Lucide React

## 📦 Instalação

### 1. Backend

```bash
cd backend

# Instalar dependências
npm install

# Configurar variáveis de ambiente
cp .env.example .env
# Edite o .env com suas credenciais do PostgreSQL

# Executar migrations
npx prisma migrate dev

# Popular banco com categorias padrão
npm run seed

# Iniciar servidor (porta 3000)
npm run dev
```

### 2. Frontend

```bash
cd frontend

# Instalar dependências
npm install

# Configurar variáveis de ambiente
cp .env.example .env.local
# NEXT_PUBLIC_API_URL já está configurado para http://localhost:3000

# Iniciar aplicação (porta 3001)
npm run dev
```

## 🔑 Funcionalidades

### ✅ Autenticação

- Registro de usuários
- Login com JWT
- Proteção de rotas
- Auto-redirect em caso de token inválido

### 💸 Transações

- **Criar** transações de entrada/saída
- **Listar** com filtros por mês/ano
- **Editar** transações existentes
- **Deletar** (swipe-to-delete no mobile ou botão no modal)
- **Paginação** (padrão: 50 itens, máximo: 100)
- **Status**: Pendente ou Pago

### 🏷️ Categorias

- 15 categorias padrão com ícones Lucide
- Criar categorias personalizadas
- Ícones renderizados dinamicamente

### 🔄 Recorrências

- Criar pagamentos recorrentes
- Configurar frequência (diário, semanal, mensal, anual)
- Número de parcelas
- Geração automática de transações filhas

## 📚 Documentação da API

Acesse a documentação interativa Swagger:

```
http://localhost:3000/api-docs
```

### Principais Endpoints

#### Autenticação

- `POST /users` - Registrar usuário
- `POST /users/login` - Login

#### Transações

- `GET /transactions` - Listar (query: month, year, page, limit)
- `POST /transactions` - Criar
- `PATCH /transactions/:id` - Atualizar (query: scope=single|all)
- `DELETE /transactions/:id` - Deletar

#### Categorias

- `GET /categories` - Listar
- `POST /categories` - Criar

#### Recorrências

- `GET /recurrences` - Listar (query: page, limit)
- `POST /recurrences` - Criar
- `DELETE /recurrences/:id` - Deletar

## 🗄️ Modelo de Dados

### Users

- Autenticação com senha hasheada (bcrypt)
- Email único

### Categories

- Nome + ícone (Lucide icons)
- 15 categorias padrão no seed

### Transactions

- Valor, título, data
- Tipo: `INPUT` (entrada) ou `OUTPUT` (saída)
- Status: `PENDING` ou `PAID`
- Vinculada a categoria e usuário
- Opcional: vinculada a recorrência

### Recurrences

- Título, parcelas, data inicial
- Frequência configurável
- Gera transações automaticamente

### Frequencies

- Intervalo (valor + unidade: dias, semanas, meses, anos)

## 🎨 Interface

### Página de Autenticação

- Tabs alternando entre Login e Cadastro
- Validação com Zod
- Feedback com toast notifications

### Dashboard (Home)

- Filtros por mês/ano
- Modal para criar/editar transações
- Swipe-to-delete em dispositivos móveis
- Botão de deletar no modal
- Loading states e tratamento de erros

## 🔧 Arquitetura

### Backend

```
routes → controllers → services → Prisma
```

- **Routes**: Definição de endpoints com Swagger annotations
- **Controllers**: Tratamento de requisições e respostas
- **Services**: Lógica de negócio (Singleton pattern)
- **Middlewares**: Auth, error handling, success response

### Frontend

```
UI Components → Services → API Client (Axios)
```

- **Pages**: Next.js App Router
- **Components**: Shadcn/UI reutilizáveis
- **Services**: Camada de abstração da API
- **Schemas**: Validação Zod das respostas da API

## 🛡️ Segurança

- Senhas hasheadas com bcrypt (10 rounds)
- JWT tokens com expiração de 7 dias
- Bearer token scheme
- Validação de entrada com Zod em todas as rotas
- Middleware de autenticação
- Auto-logout em caso de 401

## 📝 Variáveis de Ambiente

### Backend (.env)

```env
DATABASE_URL="postgresql://user:password@localhost:5432/finance_flow"
JWT_SECRET="your-secret-key"
PORT=3000
```

### Frontend (.env.local)

```env
NEXT_PUBLIC_API_URL=http://localhost:3000
```

## 🧪 Desenvolvimento

### Comandos Úteis

**Backend:**

```bash
npm run dev          # Iniciar servidor de desenvolvimento
npm run seed         # Popular banco com categorias
npx prisma studio    # Abrir Prisma Studio (GUI do banco)
npx prisma migrate   # Gerenciar migrations
```

**Frontend:**

```bash
npm run dev          # Iniciar Next.js
npm run build        # Build de produção
npm run lint         # Linter
```

## 📄 Licença

MIT
