/**
 * Serviço para cálculo e formatação de faturas por mês
 */

import { Transaction, Card } from './types';

export interface MonthlyInvoice {
  year: number;
  month: number;
  monthName: string;
  totalAmount: number;
  cardBreakdown: Array<{
    cardId: string;
    cardName: string;
    amount: number;
  }>;
}

export interface InvoicesByMonth {
  [key: string]: MonthlyInvoice;
}

/**
 * Calcula as faturas por mês
 */
export function calculateInvoicesByMonth(
  transactions: Transaction[],
  cards: Card[]
): MonthlyInvoice[] {
  const invoices: { [key: string]: MonthlyInvoice } = {};

  // Agrupar transações por mês
  transactions.forEach(transaction => {
    const date = new Date(transaction.date);
    const year = date.getFullYear();
    const month = date.getMonth();
    const key = `${year}-${month}`;

    if (!invoices[key]) {
      invoices[key] = {
        year,
        month,
        monthName: getMonthName(month, year),
        totalAmount: 0,
        cardBreakdown: [],
      };
    }

    // Adicionar ao total
    invoices[key].totalAmount += transaction.amount;

    // Adicionar ao breakdown do cartão
    const cardBreakdown = invoices[key].cardBreakdown.find(
      c => c.cardId === transaction.cardId
    );

    if (cardBreakdown) {
      cardBreakdown.amount += transaction.amount;
    } else {
      const card = cards.find(c => c.id === transaction.cardId);
      invoices[key].cardBreakdown.push({
        cardId: transaction.cardId,
        cardName: card?.name || 'Cartão Desconhecido',
        amount: transaction.amount,
      });
    }
  });

  // Converter para array e ordenar por data (mais recente primeiro)
  return Object.values(invoices)
    .sort((a, b) => {
      if (a.year !== b.year) return b.year - a.year;
      return b.month - a.month;
    });
}

/**
 * Retorna o nome do mês
 */
function getMonthName(month: number, year: number): string {
  const months = [
    'Janeiro',
    'Fevereiro',
    'Março',
    'Abril',
    'Maio',
    'Junho',
    'Julho',
    'Agosto',
    'Setembro',
    'Outubro',
    'Novembro',
    'Dezembro',
  ];

  return `${months[month]} de ${year}`;
}

/**
 * Calcula o total de todas as faturas
 */
export function calculateTotalInvoices(invoices: MonthlyInvoice[]): number {
  return invoices.reduce((sum, invoice) => sum + invoice.totalAmount, 0);
}

/**
 * Formata uma fatura para exibição
 */
export function formatInvoice(invoice: MonthlyInvoice): string {
  return `${invoice.monthName}: R$ ${(invoice.totalAmount / 100).toFixed(2)}`;
}
