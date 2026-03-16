# Guia Completo: Setup Supabase + Render + GitHub + Expo Go

Este é um guia passo a passo para colocar seu app em produção.

---

## 📋 Índice

1. [Supabase (Banco de Dados)](#supabase)
2. [GitHub (Repositório)](#github)
3. [Render (Backend)](#render)
4. [Expo Go Service (App Mobile)](#expo-go)

---

## 🗄️ Supabase

### O que é Supabase?
Supabase é um banco de dados PostgreSQL na nuvem. Ele substitui o banco de dados local que você tinha.

### Passo 1: Criar Conta

1. Acesse [supabase.com](https://supabase.com)
2. Clique em **Sign Up**
3. Use email ou GitHub para criar conta
4. Confirme seu email

### Passo 2: Criar Projeto

1. Clique em **New Project**
2. Preencha:
   - **Name**: `finance-family-app`
   - **Database Password**: Crie uma senha forte (guarde bem!)
   - **Region**: Escolha a região mais próxima (ex: `South America - São Paulo`)
3. Clique em **Create new project**
4. Aguarde 2-3 minutos para o banco ser criado

### Passo 3: Obter Credenciais

1. Vá em **Project Settings** (engrenagem no canto inferior esquerdo)
2. Clique em **API**
3. Copie e guarde em um lugar seguro:
   - **Project URL**: `https://seu-projeto.supabase.co`
   - **anon public**: Sua chave pública
   - **service_role**: Sua chave privada (⚠️ NUNCA compartilhe!)

### Passo 4: Criar Tabelas (Opcional)

Se quiser, você pode criar as tabelas manualmente:

1. Vá em **SQL Editor**
2. Clique em **New Query**
3. Cole este SQL:

```sql
-- Tabela de membros
CREATE TABLE members (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de cartões
CREATE TABLE cards (
  id SERIAL PRIMARY KEY,
  member_id INTEGER REFERENCES members(id),
  name VARCHAR(255) NOT NULL,
  limit DECIMAL(10, 2),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de transações
CREATE TABLE transactions (
  id SERIAL PRIMARY KEY,
  card_id INTEGER REFERENCES cards(id),
  amount DECIMAL(10, 2) NOT NULL,
  description VARCHAR(255),
  date DATE NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

4. Clique em **Run**

---

## 🐙 GitHub

### O que é GitHub?
GitHub é onde você armazena seu código. Render vai fazer deploy automaticamente quando você fizer push.

### Passo 1: Criar Conta

1. Acesse [github.com](https://github.com)
2. Clique em **Sign up**
3. Preencha email, senha e username
4. Confirme seu email

### Passo 2: Criar Repositório

1. Clique no **+** no canto superior direito
2. Selecione **New repository**
3. Preencha:
   - **Repository name**: `finance-family-app`
   - **Description**: `Controle Financeiro Familiar`
   - **Public** ou **Private** (sua escolha)
4. Clique em **Create repository**

### Passo 3: Fazer Push do Código

No seu computador, abra o terminal na pasta do projeto:

```bash
# Inicializar Git (se ainda não fez)
git init

# Adicionar arquivo remoto
git remote add origin https://github.com/seu-usuario/finance-family-app.git

# Adicionar todos os arquivos
git add .

# Fazer commit
git commit -m "Initial commit: Finance Family App v2.0"

# Fazer push para GitHub
git branch -M main
git push -u origin main
```

✅ Pronto! Seu código está no GitHub.

---

## 🚀 Render

### O que é Render?
Render é um servidor na nuvem onde seu backend (API) vai rodar.

### Passo 1: Criar Conta

1. Acesse [render.com](https://render.com)
2. Clique em **Sign up**
3. Use GitHub para fazer login (recomendado)
4. Autorize o Render a acessar sua conta GitHub

### Passo 2: Conectar Repositório

1. Clique em **New +**
2. Selecione **Web Service**
3. Clique em **Connect a repository**
4. Selecione seu repositório `finance-family-app`
5. Clique em **Connect**

### Passo 3: Configurar Deploy

Preencha os campos:

- **Name**: `finance-family-app-api`
- **Environment**: `Docker`
- **Region**: `São Paulo` (ou mais próximo)
- **Branch**: `main`
- **Build Command**: Deixe vazio (vai usar Dockerfile)
- **Start Command**: Deixe vazio (vai usar Dockerfile)

### Passo 4: Adicionar Variáveis de Ambiente

Clique em **Environment** e adicione:

```
SUPABASE_URL = https://seu-projeto.supabase.co
SUPABASE_ANON_KEY = sua-chave-anonima-aqui
SUPABASE_SERVICE_ROLE_KEY = sua-chave-privada-aqui
NODE_ENV = production
PORT = 3000
```

### Passo 5: Deploy

1. Clique em **Create Web Service**
2. Render vai começar a fazer build
3. Aguarde 5-10 minutos
4. Quando terminar, você terá uma URL como: `https://finance-family-app-api.onrender.com`

✅ Seu backend está no ar!

### Passo 6: Atualizar URL da API

Agora você precisa atualizar a URL da API no seu app:

1. Abra `.env` no seu projeto
2. Atualize:
   ```
   EXPO_PUBLIC_API_URL=https://finance-family-app-api.onrender.com
   ```
3. Faça commit e push:
   ```bash
   git add .env
   git commit -m "Update API URL to Render"
   git push
   ```

Render vai fazer deploy automático!

---

## 📱 Expo Go Service

### O que é Expo Go?
Expo Go é um app que você instala no seu celular para testar o app sem fazer build.

### Passo 1: Instalar Expo Go

- **iOS**: Procure por "Expo Go" na App Store
- **Android**: Procure por "Expo Go" no Google Play

### Passo 2: Rodar App Localmente

No seu computador:

```bash
# Instalar dependências
pnpm install

# Iniciar o app
pnpm dev:metro
```

Você vai ver um QR code no terminal.

### Passo 3: Escanear QR Code

1. Abra o Expo Go no seu celular
2. Clique em **Scan QR Code**
3. Aponte a câmera para o QR code
4. O app vai abrir no seu celular!

### Passo 4: Usar Expo Go Service (Produção)

Para testar em produção (com Render):

1. Crie um arquivo `eas.json` na raiz do projeto:

```json
{
  "build": {
    "preview": {
      "android": {
        "buildType": "apk"
      },
      "ios": {
        "buildType": "simulator"
      }
    },
    "preview2": {
      "android": {
        "buildType": "apk"
      }
    },
    "preview3": {
      "android": {
        "buildType": "apk"
      }
    },
    "production": {}
  }
}
```

2. Instale EAS CLI:
```bash
npm install -g eas-cli
```

3. Faça login:
```bash
eas login
```

4. Build para preview:
```bash
eas build --platform ios --profile preview
eas build --platform android --profile preview
```

5. Escaneie o QR code do build com Expo Go

---

## 🔗 Fluxo Completo

```
Seu Computador
    ↓
    ├─→ GitHub (código)
    │
    └─→ Render (backend)
            ↓
            └─→ Supabase (banco de dados)

Seu Celular
    ↓
    └─→ Expo Go (app)
            ↓
            └─→ Render API
                    ↓
                    └─→ Supabase
```

---

## ✅ Checklist Final

- [ ] Conta Supabase criada
- [ ] Projeto Supabase criado
- [ ] Credenciais Supabase copiadas
- [ ] Conta GitHub criada
- [ ] Repositório GitHub criado
- [ ] Código feito push para GitHub
- [ ] Conta Render criada
- [ ] Web Service criado no Render
- [ ] Variáveis de ambiente configuradas
- [ ] Deploy concluído (status: "Live")
- [ ] URL da API atualizada no `.env`
- [ ] Expo Go instalado no celular
- [ ] App testado no Expo Go

---

## 🆘 Troubleshooting

### "Erro ao conectar com Supabase"
- Verifique se as credenciais estão corretas
- Certifique-se de que o projeto Supabase está ativo

### "Render não faz deploy"
- Verifique os logs no Render
- Certifique-se de que o `Dockerfile` está correto
- Verifique se as variáveis de ambiente estão preenchidas

### "Expo Go não conecta"
- Certifique-se de que seu celular está na mesma rede WiFi
- Tente recarregar o app (shake do celular)
- Verifique se a porta 8081 não está bloqueada

### "Erro de CORS"
- Adicione a URL do seu celular em CORS no Render
- Ou configure CORS para aceitar todas as origens (desenvolvimento)

---

## 📚 Próximos Passos

1. **Migrar dados** - Exporte dados locais e importe no Supabase
2. **Autenticação** - Implemente login/registro de usuários
3. **Notificações** - Configure push notifications
4. **CI/CD** - Configure testes automáticos no GitHub

---

## 📞 Suporte

- [Documentação Supabase](https://supabase.com/docs)
- [Documentação Render](https://render.com/docs)
- [Documentação Expo](https://docs.expo.dev)
- [Documentação GitHub](https://docs.github.com)

Boa sorte! 🚀
