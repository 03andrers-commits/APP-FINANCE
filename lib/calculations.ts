/**
 * Utilitários para cálculos financeiros e geração de relatórios
 */

import { Card, Transaction, CardSummary, MemberSummary, MonthlyReport, Member } from './types';

/**
 * Calcula o resumo de um cartão
 */
export function calculateCardSummary(card: Card, transactions: Transaction[]): CardSummary {
  const cardTransactions = transactions.filter(t => t.cardId === card.id);
  const totalSpent = cardTransactions.reduce((sum, t) => sum + t.amount, 0);
  const availableLimit = card.limit - totalSpent;
  const usagePercentage = (totalSpent / card.limit) * 100;

  return {
    card,
    totalSpent,
    availableLimit: Math.max(0, availableLimit),
    usagePercentage: Math.min(100, usagePercentage),
    transactionCount: cardTransactions.length,
  };
}

/**
 * Calcula o resumo de um membro
 */
export function calculateMemberSummary(
  memberId: string,
  members: Member[],
  cards: Card[],
  transactions: Transaction[]
): MemberSummary {
  const member = members.find(m => m.id === memberId);
  if (!member) {
    throw new Error(`Membro ${memberId} não encontrado`);
  }

  const memberTransactions = transactions.filter(t => t.memberId === memberId);
  const totalSpent = memberTransactions.reduce((sum, t) => sum + t.amount, 0);

  const cardBreakdown = cards.map(card => {
    const cardTransactions = memberTransactions.filter(t => t.cardId === card.id);
    const amount = cardTransactions.reduce((sum, t) => sum + t.amount, 0);
    return {
      cardId: card.id,
      cardName: card.name,
      amount,
    };
  }).filter(item => item.amount > 0);

  return {
    member,
    totalSpent,
    transactionCount: memberTransactions.length,
    cardBreakdown,
  };
}

/**
 * Calcula o relatório mensal
 */
export function calculateMonthlyReport(
  month: number,
  year: number,
  members: Member[],
  cards: Card[],
  transactions: Transaction[]
): MonthlyReport {
  const monthTransactions = transactions.filter(t => {
    const date = new Date(t.date);
    return date.getMonth() === month && date.getFullYear() === year;
  });

  const totalSpent = monthTransactions.reduce((sum, t) => sum + t.amount, 0);

  // Gastos por membro
  const byMember = members.map(member => {
    const memberTransactions = monthTransactions.filter(t => t.memberId === member.id);
    const amount = memberTransactions.reduce((sum, t) => sum + t.amount, 0);
    const percentage = totalSpent > 0 ? (amount / totalSpent) * 100 : 0;
    return {
      memberId: member.id,
      memberName: member.name,
      amount,
      percentage,
    };
  }).filter(item => item.amount > 0);

  // Gastos por categoria
  const categoryMap = new Map<string, number>();
  monthTransactions.forEach(t => {
    const current = categoryMap.get(t.category) || 0;
    categoryMap.set(t.category, current + t.amount);
  });

  const byCategory = Array.from(categoryMap.entries())
    .map(([category, amount]) => ({
      category: category as any,
      amount,
      percentage: totalSpent > 0 ? (amount / totalSpent) * 100 : 0,
    }))
    .sort((a, b) => b.amount - a.amount);

  // Gastos por cartão
  const byCard = cards.map(card => {
    const cardTransactions = monthTransactions.filter(t => t.cardId === card.id);
    const amount = cardTransactions.reduce((sum, t) => sum + t.amount, 0);
    const percentage = totalSpent > 0 ? (amount / totalSpent) * 100 : 0;
    return {
      cardId: card.id,
      cardName: card.name,
      amount,
      percentage,
    };
  }).filter(item => item.amount > 0);

  return {
    month,
    year,
    totalSpent,
    byMember,
    byCategory,
    byCard,
  };
}

/**
 * Formata um valor em moeda brasileira
 * @param value Valor em centavos (ex: 10000 = R$ 100,00)
 */
export function formatCurrency(value: number): string {
  // Converter centavos para reais
  const valueInReais = value / 100;
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(valueInReais);
}

/**
 * Formata uma data
 */
export function formatDate(timestamp: number): string {
  const date = new Date(timestamp);
  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(date);
}

/**
 * Formata uma data com hora
 */
export function formatDateTime(timestamp: number): string {
  const date = new Date(timestamp);
  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
}

/**
 * Obtém o nome do mês
 */
export function getMonthName(month: number): string {
  const months = [
    'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro',
  ];
  return months[month] || '';
}

/**
 * Obtém o nome da categoria
 */
export function getCategoryName(category: string): string {
  const categories: Record<string, string> = {
    food: 'Alimentação',
    transport: 'Transporte',
    health: 'Saúde',
    entertainment: 'Entretenimento',
    shopping: 'Compras',
    utilities: 'Utilidades',
    other: 'Outros',
  };
  return categories[category] || 'Outros';
}

/**
 * Obtém o ícone da categoria
 */
export function getCategoryIcon(category: string): string {
  const icons: Record<string, string> = {
    food: '🍔',
    transport: '🚗',
    health: '🏥',
    entertainment: '🎬',
    shopping: '🛍️',
    utilities: '💡',
    other: '📌',
  };
  return icons[category] || '📌';
}

/**
 * Gera um ID único
 */
export function generateId(): string {
  return `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Obtém o primeiro dia do mês
 */
export function getFirstDayOfMonth(month: number, year: number): Date {
  return new Date(year, month, 1);
}

/**
 * Obtém o último dia do mês
 */
export function getLastDayOfMonth(month: number, year: number): Date {
  return new Date(year, month + 1, 0);
}

/**
 * Calcula o mês anterior
 */
export function getPreviousMonth(month: number, year: number): [number, number] {
  if (month === 0) {
    return [11, year - 1];
  }
  return [month - 1, year];
}

/**
 * Calcula o próximo mês
 */
export function getNextMonth(month: number, year: number): [number, number] {
  if (month === 11) {
    return [0, year + 1];
  }
  return [month + 1, year];
}
