# Deployment Guide - Finance Family App

Este guia explica como fazer deploy da aplicação usando **Render** (backend), **Supabase** (banco de dados) e **Expo Go** (app mobile).

## Pré-requisitos

- Conta no [Render](https://render.com)
- Conta no [Supabase](https://supabase.com)
- Conta no [GitHub](https://github.com)
- Node.js 20+ instalado localmente

## Passo 1: Preparar Repositório GitHub

```bash
# Inicializar repositório Git
git init
git add .
git commit -m "Initial commit: Finance Family App"

# Criar repositório no GitHub e fazer push
git remote add origin https://github.com/seu-usuario/finance-family-app.git
git branch -M main
git push -u origin main
```

## Passo 2: Configurar Supabase

1. Acesse [supabase.com](https://supabase.com)
2. Crie um novo projeto
3. Vá em **Project Settings > API**
4. Copie:
   - **Project URL** (ex: `https://seu-projeto.supabase.co`)
   - **anon public key** (chave pública)
   - **service_role key** (chave privada - guarde com segurança)

## Passo 3: Deploy no Render

### Opção A: Usando render.yaml (Recomendado)

1. Acesse [render.com](https://render.com)
2. Clique em **New +** > **Blueprint**
3. Conecte seu repositório GitHub
4. Selecione o repositório `finance-family-app`
5. Render vai ler o arquivo `render.yaml` automaticamente
6. Configure as variáveis de ambiente:
   - `SUPABASE_URL`: URL do seu projeto Supabase
   - `SUPABASE_ANON_KEY`: Chave anônima do Supabase
   - `SUPABASE_SERVICE_ROLE_KEY`: Chave de serviço (privada)
   - `NODE_ENV`: `production`

7. Clique em **Deploy**

### Opção B: Deployment Manual

1. Crie um novo **Web Service** no Render
2. Conecte seu repositório GitHub
3. Configure:
   - **Name**: `finance-family-app-api`
   - **Runtime**: `Docker`
   - **Build Command**: `npm run build`
   - **Start Command**: `npm start`
   - **Port**: `3000`

4. Adicione as variáveis de ambiente (veja acima)
5. Clique em **Create Web Service**

## Passo 4: Configurar Variáveis de Ambiente

Após o deploy, atualize o arquivo `.env` local com:

```env
# Supabase
SUPABASE_URL=https://seu-projeto.supabase.co
SUPABASE_ANON_KEY=sua-chave-anonima
SUPABASE_SERVICE_ROLE_KEY=sua-chave-privada

# API
EXPO_PUBLIC_API_URL=https://finance-family-app.onrender.com
```

## Passo 5: Rodar o App com Expo Go

### Desenvolvimento Local

```bash
# Instalar dependências
pnpm install

# Iniciar servidor + app
pnpm dev

# Ou separadamente:
pnpm dev:server    # Terminal 1
pnpm dev:metro     # Terminal 2
```

### Rodar em Dispositivo Real

1. Instale o **Expo Go** no seu celular (iOS ou Android)
2. No terminal, execute:
   ```bash
   pnpm dev:metro
   ```
3. Escaneie o QR code com o Expo Go
4. O app abrirá no seu celular

### Build para Produção

```bash
# Build do app
eas build --platform ios
eas build --platform android

# Ou use o Expo Go Service para testar
```

## Arquitetura

```
┌─────────────────┐
│   Expo Go App   │
│  (iOS/Android)  │
└────────┬────────┘
         │
         │ HTTP/REST (tRPC)
         │
┌────────▼──────────────┐
│  Render Backend API   │
│  (Node.js + Express)  │
└────────┬──────────────┘
         │
         │ PostgreSQL
         │
┌────────▼──────────────┐
│   Supabase Database   │
│   (PostgreSQL Cloud)  │
└───────────────────────┘
```

## Troubleshooting

### Erro: "Cannot connect to API"
- Verifique se a URL do Render está correta em `EXPO_PUBLIC_API_URL`
- Certifique-se de que o Render está rodando (verifique os logs)

### Erro: "Supabase connection failed"
- Verifique as credenciais do Supabase
- Certifique-se de que o banco de dados está ativo

### Erro: "Port already in use"
- Mude a porta em `.env`: `PORT=3001`

## Próximos Passos

1. Migrar dados do banco de dados local para Supabase
2. Configurar autenticação de usuários
3. Implementar notificações push
4. Configurar CI/CD automático

## Suporte

Para mais informações:
- [Documentação Render](https://render.com/docs)
- [Documentação Supabase](https://supabase.com/docs)
- [Documentação Expo](https://docs.expo.dev)
