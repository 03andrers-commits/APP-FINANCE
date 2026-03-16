import { describe, it, expect } from 'vitest';
import * as installmentService from '../lib/installment-service';
import { Transaction } from '../lib/types';

describe('Installment Service', () => {
  const baseTransaction: Transaction = {
    id: 'test-123',
    cardId: 'card-1',
    memberId: 'user',
    amount: 60000, // R$ 600.00
    description: 'Compra teste',
    category: 'shopping',
    date: Date.now(),
    createdAt: Date.now(),
  };

  describe('calculateInstallmentPlan', () => {
    it('deve calcular plano de parcelamento', () => {
      const plan = installmentService.calculateInstallmentPlan(60000, 6);

      expect(plan.installments).toBe(6);
      expect(plan.monthlyAmount).toBe(10000); // 600 / 6 = 100
      expect(plan.totalAmount).toBe(60000);
    });

    it('deve lançar erro para parcelamento inválido', () => {
      expect(() => {
        installmentService.calculateInstallmentPlan(60000, 0);
      }).toThrow();
    });
  });

  describe('generateInstallmentTransactions', () => {
    it('deve gerar transações de parcelas', () => {
      const transactions = installmentService.generateInstallmentTransactions(
        baseTransaction,
        6,
        new Date('2026-01-15').getTime()
      );

      expect(transactions).toHaveLength(6);
      expect(transactions[0].installmentNumber).toBe(1);
      expect(transactions[5].installmentNumber).toBe(6);
      expect(transactions[0].amount).toBe(10000);
    });

    it('deve retornar transação única para parcelamento 1x', () => {
      const transactions = installmentService.generateInstallmentTransactions(
        baseTransaction,
        1
      );

      expect(transactions).toHaveLength(1);
      expect(transactions[0].id).toBe(baseTransaction.id);
    });

    it('deve distribuir parcelas em meses diferentes', () => {
      const startDate = new Date('2026-01-15').getTime();
      const transactions = installmentService.generateInstallmentTransactions(
        baseTransaction,
        3,
        startDate
      );

      const dates = transactions.map(t => new Date(t.date).getMonth());
      expect(dates[0]).toBe(0); // Janeiro
      expect(dates[1]).toBe(1); // Fevereiro
      expect(dates[2]).toBe(2); // Março
    });
  });

  describe('getInstallmentsForTransaction', () => {
    it('deve retornar todas as parcelas de uma transação', () => {
      const transactions = installmentService.generateInstallmentTransactions(
        baseTransaction,
        3
      );

      const installments = installmentService.getInstallmentsForTransaction(
        transactions,
        baseTransaction.id
      );

      expect(installments).toHaveLength(3);
    });
  });

  describe('getTotalForParcelledTransaction', () => {
    it('deve calcular o total gasto em parcelamento', () => {
      const transactions = installmentService.generateInstallmentTransactions(
        baseTransaction,
        6
      );

      const total = installmentService.getTotalForParcelledTransaction(
        transactions,
        baseTransaction.id
      );

      expect(total).toBe(60000);
    });
  });

  describe('getInstallmentProgress', () => {
    it('deve calcular progresso de parcelamento', () => {
      const startDate = new Date('2026-01-15').getTime();
      const transactions = installmentService.generateInstallmentTransactions(
        baseTransaction,
        6,
        startDate
      );

      // Até março (3 meses depois)
      const marchDate = new Date('2026-03-15').getTime();
      const progress = installmentService.getInstallmentProgress(
        transactions,
        baseTransaction.id,
        marchDate
      );

      expect(progress.paid).toBe(3);
      expect(progress.total).toBe(6);
      expect(progress.percentage).toBe(50);
      expect(progress.remainingAmount).toBe(30000); // 3 parcelas restantes
    });
  });

  describe('formatInstallmentPlan', () => {
    it('deve formatar plano de parcelamento', () => {
      const plan = installmentService.calculateInstallmentPlan(60000, 6);
      const formatted = installmentService.formatInstallmentPlan(plan);

      expect(formatted).toContain('6x');
      expect(formatted).toContain('R$ 100.00');
      expect(formatted).toContain('Total');
    });
  });
});
