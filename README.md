# Finance Family App - Controle Financeiro Familiar

Um app mobile para controlar gastos e cartões de crédito em família. Desenvolvido com **React Native**, **Expo**, **Supabase** e **Render**.

---

## 🎯 O Que É?

Finance Family App é um aplicativo que permite:

- ✅ **Controlar cartões de crédito** - Adicione, edite e delete cartões
- ✅ **Rastrear gastos** - Registre compras e parcelas
- ✅ **Gerenciar membros** - Adicione membros da família
- ✅ **Visualizar relatórios** - Veja gastos por mês, cartão e membro
- ✅ **Marcar como pago** - Indique quando uma fatura foi paga
- ✅ **Fazer backup** - Exporte seus dados

---

## 🚀 Começar Rápido

### Para Usuários (Testar no iPhone)

1. Instale **Expo Go** na App Store
2. Escaneie o QR code do projeto
3. O app abre no seu iPhone!

### Para Desenvolvedores (Modificar o Código)

1. Clone o repositório:
   ```bash
   git clone https://github.com/seu-usuario/finance-family-app.git
   cd finance-family-app
   ```

2. Instale dependências:
   ```bash
   pnpm install
   ```

3. Inicie o servidor:
   ```bash
   pnpm dev
   ```

4. Escaneie o QR code com Expo Go

---

## 📱 Telas do App

| Tela | O que faz |
|------|-----------|
| **Home** | Mostra gastos do mês, cartões e status de pagamento |
| **Cartões** | Lista de cartões com opção de adicionar/editar |
| **Relatórios** | Gráficos e análises de gastos |
| **Configurações** | Backup, restauração, preferências |

---

## 🏗️ Arquitetura

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

---

## 🛠️ Tech Stack

| Tecnologia | Uso |
|-----------|-----|
| **React Native** | Framework mobile |
| **Expo** | Plataforma de desenvolvimento |
| **TypeScript** | Linguagem tipada |
| **React 19** | Biblioteca UI |
| **NativeWind** | Tailwind CSS para React Native |
| **tRPC** | API type-safe |
| **Supabase** | Banco de dados PostgreSQL |
| **Render** | Servidor backend |
| **Vitest** | Testes unitários |

---

## 📁 Estrutura do Projeto

```
finance-family-app/
├── app/                    # Código do app (Expo Router)
│   ├── (tabs)/            # Telas com tab bar
│   ├── oauth/             # Callbacks de autenticação
│   └── _layout.tsx        # Layout raiz
├── server/                # Código do servidor (Express + tRPC)
│   ├── _core/            # Núcleo do servidor
│   ├── routers.ts        # Rotas da API
│   └── db.ts             # Conexão com banco
├── lib/                   # Código compartilhado
│   ├── storage.ts        # AsyncStorage local
│   ├── types.ts          # Tipos TypeScript
│   ├── calculations.ts   # Cálculos financeiros
│   └── ...
├── components/            # Componentes React Native
│   ├── screen-container.tsx
│   ├── ui/
│   └── ...
├── assets/                # Imagens e ícones
├── hooks/                 # React hooks customizados
├── constants/             # Constantes e configurações
├── tests/                 # Testes unitários
├── Dockerfile             # Containerização
├── render.yaml            # Configuração Render
├── app.config.ts          # Configuração Expo
├── package.json           # Dependências
└── README.md              # Este arquivo
```

---

## 🔧 Configuração

### Variáveis de Ambiente

Crie um arquivo `.env` na raiz do projeto:

```env
# Supabase
SUPABASE_URL=https://seu-projeto.supabase.co
SUPABASE_ANON_KEY=sua-chave-anonima
SUPABASE_SERVICE_ROLE_KEY=sua-chave-privada

# API
EXPO_PUBLIC_API_URL=https://finance-family-app-api.onrender.com

# Node
NODE_ENV=development
PORT=3000
```

### Instalar Dependências

```bash
# Com pnpm (recomendado)
pnpm install

# Ou com npm
npm install

# Ou com yarn
yarn install
```

---

## 🚀 Deployment

### Deploy no Render

1. Faça push do código para GitHub
2. Acesse [render.com](https://render.com)
3. Clique em **New +** → **Web Service**
4. Conecte seu repositório GitHub
5. Configure as variáveis de ambiente
6. Clique em **Create Web Service**

Render vai fazer deploy automaticamente!

**Leia:** [DEPLOYMENT.md](./DEPLOYMENT.md) para instruções completas.

---

## 📚 Documentação

- **[SETUP_GUIDE.md](./SETUP_GUIDE.md)** - Guia completo de setup (Supabase, Render, GitHub)
- **[SETUP_IPHONE_ONLY.md](./SETUP_IPHONE_ONLY.md)** - Guia APENAS para iPhone (sem computador)
- **[DEPLOYMENT.md](./DEPLOYMENT.md)** - Como fazer deploy
- **[GITHUB_QUICK_SETUP.md](./GITHUB_QUICK_SETUP.md)** - O que fazer na tela Quick Setup do GitHub
- **[UPLOAD_EM_LOTES.md](./UPLOAD_EM_LOTES.md)** - Como fazer upload em lotes (menos de 100 arquivos)
- **[design.md](./design.md)** - Design e UX do app
- **[todo.md](./todo.md)** - Lista de tarefas e features

---

## ✅ Testes

Executar testes:

```bash
npm test
```

Testes incluem:
- ✅ 55+ testes unitários
- ✅ Testes de storage
- ✅ Testes de cálculos financeiros
- ✅ Testes de serviços
- ✅ Testes de configuração Supabase

---

## 🐛 Troubleshooting

### "Erro ao conectar com Supabase"
- Verifique se as credenciais estão corretas
- Certifique-se de que o projeto Supabase está ativo

### "Render não faz deploy"
- Verifique os logs no Render
- Certifique-se de que o `Dockerfile` está correto
- Verifique se as variáveis de ambiente estão preenchidas

### "Expo Go não conecta"
- Certifique-se de que seu iPhone está na mesma rede WiFi
- Tente recarregar o app (shake do iPhone)
- Use Expo Snack em vez de QR code local

---

## 🤝 Contribuindo

1. Faça um fork do repositório
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

---

## 📝 Licença

Este projeto está sob a licença MIT. Veja o arquivo LICENSE para mais detalhes.

---

## 👨‍💻 Desenvolvido com

- React Native + Expo
- TypeScript
- Supabase
- Render
- GitHub

---

## 📞 Suporte

- [Documentação Expo](https://docs.expo.dev)
- [Documentação Supabase](https://supabase.com/docs)
- [Documentação Render](https://render.com/docs)
- [Documentação React Native](https://reactnative.dev)

---

## 🎉 Agradecimentos

Obrigado por usar Finance Family App! Se gostou, deixe uma ⭐ no repositório!

---

**Última atualização:** Março 2026

**Versão:** 2.0.0
