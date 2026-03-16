# Design do App de Controle Financeiro Familiar

## Visão Geral

Aplicativo iOS de controle financeiro para gerenciar múltiplos cartões de crédito (até 15), rastrear limites, lançar compras categorizadas por membro da família e visualizar relatórios detalhados.

## Telas Principais

1. **Home (Dashboard)** - Visão geral do status financeiro
2. **Cartões** - Listagem e gestão de cartões
3. **Adicionar/Editar Cartão** - Formulário para cadastro
4. **Lançar Compra** - Registro de transações
5. **Relatórios** - Visualização de gastos por membro e cartão
6. **Detalhes do Cartão** - Informações e transações de um cartão específico
7. **Configurações** - Gerenciamento de membros da família

## Estrutura de Dados

### Membros da Família
- **ID** (único)
- **Nome** (você, esposa, filha)
- **Cor de Identificação** (para visual rápido)

### Cartões
- **ID** (único)
- **Nome** (ex: "Nubank", "Bradesco Black")
- **Bandeira** (Visa, Mastercard, Elo, etc.)
- **Limite Total**
- **Data de Vencimento**
- **Últimas 4 dígitos**
- **Ativo/Inativo**

### Compras/Transações
- **ID** (único)
- **Cartão ID** (qual cartão foi usado)
- **Membro ID** (quem fez a compra)
- **Valor**
- **Descrição/Categoria**
- **Data da Compra**
- **Categoria** (Alimentação, Transporte, Saúde, Lazer, Outros)

## Fluxos Principais

### Fluxo 1: Adicionar Cartão
1. Usuário toca em "Adicionar Cartão" na tela de Cartões
2. Preenche formulário (nome, bandeira, limite, vencimento, últimos 4 dígitos)
3. Confirma e cartão aparece na lista

### Fluxo 2: Lançar Compra
1. Usuário toca em "Nova Compra"
2. Seleciona membro da família (você, esposa, filha)
3. Seleciona cartão usado
4. Insere valor, descrição e categoria
5. Confirma e compra é registrada

### Fluxo 3: Visualizar Relatórios
1. Usuário acessa aba "Relatórios"
2. Pode filtrar por período (mês, período customizado)
3. Visualiza gastos totais e por membro
4. Vê detalhamento por cartão
5. Pode exportar ou compartilhar relatório

## Cores da Marca

- **Primária**: #0066CC (Azul profissional)
- **Secundária**: #00A86B (Verde para sucesso/saldo disponível)
- **Alerta**: #FF6B6B (Vermelho para limite próximo)
- **Fundo**: #FFFFFF (Claro) / #0F0F0F (Escuro)
- **Texto**: #1A1A1A (Claro) / #ECECEC (Escuro)
- **Muted**: #808080 (Cinza para textos secundários)

### Cores dos Membros
- **Você**: #0066CC (Azul)
- **Esposa**: #FF69B4 (Rosa)
- **Filha**: #FFB347 (Laranja)

## Componentes de UI

- **Card de Cartão**: Mostra nome, bandeira, limite disponível, percentual de uso
- **Lista de Transações**: Mostra data, descrição, valor, membro, categoria
- **Gráfico de Gastos**: Pizza ou barras para visualizar distribuição por membro
- **Badge de Membro**: Círculo colorido com inicial do nome
- **Botão Flutuante**: Para ações rápidas (nova compra, novo cartão)

## Navegação

- **Bottom Tab Bar** com 4 abas:
  1. Home (Dashboard)
  2. Cartões
  3. Relatórios
  4. Configurações

## Considerações de Design

- **Orientação**: Portrait (9:16) para uso com uma mão
- **Segurança**: Não armazenar números completos de cartão
- **Performance**: Listas com scroll infinito para muitas transações
- **Acessibilidade**: Contraste adequado, tamanho de fonte mínimo 16pt
- **Feedback**: Haptic feedback em ações importantes (adicionar compra, limpar limite)
