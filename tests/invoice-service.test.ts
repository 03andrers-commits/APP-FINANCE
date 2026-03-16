import { describe, it, expect } from 'vitest';
import {
  calculateInvoicesByMonth,
  calculateTotalInvoices,
  formatInvoice,
} from '../lib/invoice-service';
import { Transaction, Card } from '../lib/types';


describe('Invoice Service', () => {
  const mockCards: Card[] = [
    {
      id: 'card1',
      name: 'Visa',
      brand: 'visa',
      limit: 500000,
      dueDate: 10,
      lastFourDigits: '1234',
      createdAt: Date.now(),
    },
    {
      id: 'card2',
      name: 'Mastercard',
      brand: 'mastercard',
      limit: 300000,
      dueDate: 15,
      lastFourDigits: '5678',
      createdAt: Date.now(),
    },
  ];

  const mockTransactions: Transaction[] = [
    {
      id: 't1',
      cardId: 'card1',
      memberId: 'user',
      amount: 10000,
      description: 'Compra 1',
      category: 'shopping',
      date: new Date(2026, 2, 5).getTime(), // Março
      createdAt: Date.now(),
    },
    {
      id: 't2',
      cardId: 'card1',
      memberId: 'user',
      amount: 15000,
      description: 'Compra 2',
      category: 'food',
      date: new Date(2026, 2, 10).getTime(), // Março
      createdAt: Date.now(),
    },
    {
      id: 't3',
      cardId: 'card2',
      memberId: 'user',
      amount: 5000,
      description: 'Compra 3',
      category: 'transport',
      date: new Date(2026, 2, 15).getTime(), // Março
      createdAt: Date.now(),
    },
    {
      id: 't4',
      cardId: 'card1',
      memberId: 'user',
      amount: 20000,
      description: 'Compra 4',
      category: 'shopping',
      date: new Date(2026, 1, 20).getTime(), // Fevereiro
      createdAt: Date.now(),
    },
  ];

  it('deve calcular faturas por mês corretamente', () => {
    const invoices = calculateInvoicesByMonth(mockTransactions, mockCards);

    expect(invoices).toHaveLength(2);
    expect(invoices[0].month).toBe(2); // Março (mais recente)
    expect(invoices[1].month).toBe(1); // Fevereiro
  });

  it('deve calcular total de fatura do mês corretamente', () => {
    const invoices = calculateInvoicesByMonth(mockTransactions, mockCards);
    const marchInvoice = invoices.find(i => i.month === 2);

    expect(marchInvoice?.totalAmount).toBe(30000); // 10000 + 15000 + 5000
  });

  it('deve fazer breakdown por cartão corretamente', () => {
    const invoices = calculateInvoicesByMonth(mockTransactions, mockCards);
    const marchInvoice = invoices.find(i => i.month === 2);

    expect(marchInvoice?.cardBreakdown).toHaveLength(2);
    expect(marchInvoice?.cardBreakdown[0].amount).toBe(25000); // Visa: 10000 + 15000
    expect(marchInvoice?.cardBreakdown[1].amount).toBe(5000); // Mastercard: 5000
  });

  it('deve calcular total de todas as faturas', () => {
    const invoices = calculateInvoicesByMonth(mockTransactions, mockCards);
    const total = calculateTotalInvoices(invoices);

    expect(total).toBe(50000); // 10000 + 15000 + 5000 + 20000
  });

  it('deve formatar fatura corretamente', () => {
    const invoices = calculateInvoicesByMonth(mockTransactions, mockCards);
    const marchInvoice = invoices.find(i => i.month === 2);

    if (marchInvoice) {
      const formatted = formatInvoice(marchInvoice);
      expect(formatted).toContain('Março de 2026');
      expect(formatted).toContain('300.00');
    }
  });

  it('deve retornar array vazio se não houver transações', () => {
    const invoices = calculateInvoicesByMonth([], mockCards);

    expect(invoices).toHaveLength(0);
  });

  it('deve ordenar faturas por data (mais recente primeiro)', () => {
    const invoices = calculateInvoicesByMonth(mockTransactions, mockCards);

    expect(invoices[0].year).toBeGreaterThanOrEqual(invoices[1].year);
    if (invoices[0].year === invoices[1].year) {
      expect(invoices[0].month).toBeGreaterThan(invoices[1].month);
    }
  });
});
