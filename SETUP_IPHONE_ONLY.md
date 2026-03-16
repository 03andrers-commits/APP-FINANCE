# Guia de Setup APENAS para iPhone (SEM Computador)

Este guia é para você que só tem iPhone. Você vai fazer TUDO pelo celular!

---

## 📱 Apps que você vai precisar

1. **GitHub Mobile** - Para gerenciar código
2. **Expo Go** - Para testar o app
3. **Supabase** - Gerenciar banco de dados
4. **Safari** - Navegador padrão

Instale todos na App Store.

---

## 🗄️ Passo 1: Supabase (Banco de Dados)

### 1.1 Criar Conta

1. Abra Safari
2. Vá para [supabase.com](https://supabase.com)
3. Clique em **Sign Up**
4. Use email ou GitHub
5. Confirme seu email

### 1.2 Criar Projeto

1. Clique em **New Project**
2. Preencha:
   - **Name**: `finance-family-app`
   - **Database Password**: Crie uma senha forte (salve no Notes)
   - **Region**: `South America - São Paulo`
3. Clique em **Create new project**
4. Aguarde 2-3 minutos

### 1.3 Obter Credenciais

1. Vá em **Project Settings** (engrenagem)
2. Clique em **API**
3. **COPIE E SALVE** no Notes do iPhone:
   - **Project URL**: `https://seu-projeto.supabase.co`
   - **anon public key**: (a chave pública)
   - **service_role key**: (a chave privada - GUARDE BEM!)

Exemplo:
```
SUPABASE_URL=https://hayqzhnolaoumgfnqmri.supabase.co
SUPABASE_ANON_KEY=sb_publishable_w5FOYhbnLowW_uiS42AoXQ_Xq1-c0jN
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

✅ Supabase pronto!

---

## 🐙 Passo 2: GitHub (Repositório)

### 2.1 Criar Conta

1. Abra Safari
2. Vá para [github.com](https://github.com)
3. Clique em **Sign up**
4. Preencha email, senha, username
5. Confirme seu email

### 2.2 Criar Repositório

1. Abra **GitHub Mobile**
2. Faça login
3. Clique no **+** (canto inferior)
4. Selecione **Create repository**
5. Preencha:
   - **Name**: `finance-family-app`
   - **Description**: `Controle Financeiro Familiar`
   - **Public** (deixe público)
6. Clique em **Create**

### 2.3 Fazer Upload do Código

Como você não tem computador, você pode:

**Opção A: Usar GitHub Web**
1. Abra Safari
2. Vá para seu repositório no GitHub
3. Clique em **Add file** → **Upload files**
4. Selecione os arquivos do projeto
5. Clique em **Commit changes**

**Opção B: Usar GitHub Mobile**
1. Abra GitHub Mobile
2. Vá para seu repositório
3. Clique em **...** (menu)
4. Selecione **Upload files**
5. Escolha os arquivos
6. Clique em **Commit**

⚠️ **Importante**: Não faça upload da pasta `node_modules` (muito grande!)

✅ Código no GitHub!

---

## 🚀 Passo 3: Render (Backend)

### 3.1 Criar Conta

1. Abra Safari
2. Vá para [render.com](https://render.com)
3. Clique em **Sign up**
4. Use GitHub para fazer login (mais fácil)
5. Autorize o Render

### 3.2 Conectar GitHub

1. Clique em **New +**
2. Selecione **Web Service**
3. Clique em **Connect a repository**
4. Selecione `finance-family-app`
5. Clique em **Connect**

### 3.3 Configurar Deploy

Preencha os campos:

- **Name**: `finance-family-app-api`
- **Environment**: `Docker`
- **Region**: `São Paulo`
- **Branch**: `main`

### 3.4 Adicionar Variáveis de Ambiente

Clique em **Environment** e adicione:

```
SUPABASE_URL = https://seu-projeto.supabase.co
SUPABASE_ANON_KEY = sua-chave-anonima
SUPABASE_SERVICE_ROLE_KEY = sua-chave-privada
NODE_ENV = production
PORT = 3000
```

(Use os valores que você salvou no Notes!)

### 3.5 Fazer Deploy

1. Clique em **Create Web Service**
2. Render vai começar o build
3. Aguarde 5-10 minutos
4. Quando terminar, você terá uma URL como:
   ```
   https://finance-family-app-api.onrender.com
   ```

✅ Backend no ar!

---

## 📱 Passo 4: Expo Go (Testar App)

### 4.1 Instalar Expo Go

1. Abra App Store
2. Procure por **Expo Go**
3. Instale

### 4.2 Conectar ao App

Como você não tem computador, você precisa usar o **Expo Snack**:

1. Abra Safari
2. Vá para [snack.expo.dev](https://snack.expo.dev)
3. Clique em **Sign in** (use GitHub)
4. Clique em **New Snack**
5. Copie o código do seu projeto e cole lá
6. Clique em **My Device**
7. Escaneie o QR code com Expo Go

**OU** (mais fácil):

1. Abra Expo Go no iPhone
2. Clique em **Scan QR Code**
3. Aponte para o QR code do Snack
4. Pronto! O app abre

✅ App testando no iPhone!

---

## 🔄 Fluxo Completo (iPhone)

```
Safari → Supabase (criar banco)
    ↓
GitHub Mobile → Fazer upload do código
    ↓
Safari → Render (fazer deploy)
    ↓
Expo Go → Testar app no iPhone
```

---

## ✅ Checklist iPhone

- [ ] Supabase: Conta criada
- [ ] Supabase: Projeto criado
- [ ] Supabase: Credenciais copiadas no Notes
- [ ] GitHub: Conta criada
- [ ] GitHub: Repositório criado
- [ ] GitHub: Código enviado
- [ ] Render: Conta criada
- [ ] Render: Web Service criado
- [ ] Render: Variáveis de ambiente configuradas
- [ ] Render: Deploy concluído
- [ ] Expo Go: Instalado
- [ ] Expo Go: App testado

---

## 🆘 Troubleshooting iPhone

### "Não consigo fazer upload do código no GitHub"

**Solução:**
1. Abra Safari
2. Vá para seu repositório no GitHub
3. Clique em **Add file** → **Create new file**
4. Cole o código de um arquivo por vez
5. Clique em **Commit changes**

(É mais lento, mas funciona!)

### "Render não faz deploy"

**Solução:**
1. Verifique se o repositório está público
2. Verifique se as variáveis de ambiente estão corretas
3. Clique em **Manual Deploy** no Render

### "Expo Go não conecta"

**Solução:**
1. Certifique-se de que está usando WiFi
2. Tente recarregar (shake do iPhone)
3. Use Expo Snack em vez de QR code local

---

## 📲 Apps Recomendados para iPhone

| App | Função |
|-----|--------|
| **GitHub Mobile** | Gerenciar código |
| **Expo Go** | Testar app |
| **Notes** | Guardar credenciais |
| **Safari** | Navegador |
| **1Password** | Guardar senhas (opcional) |

---

## 🎯 Resumo Rápido

1. **Supabase**: Crie conta → projeto → copie credenciais
2. **GitHub**: Crie conta → repositório → faça upload do código
3. **Render**: Crie conta → conecte GitHub → configure variáveis → deploy
4. **Expo Go**: Instale → use Snack → teste o app

**Tudo pelo iPhone! 🎉**

---

## 📞 Dúvidas?

Se tiver dúvida em algum passo, me chama! Vou ajudar a resolver.

Boa sorte! 🚀
