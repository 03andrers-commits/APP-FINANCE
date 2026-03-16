/**
 * Testes para cálculos financeiros
 */

import { describe, it, expect } from 'vitest';
import {
  calculateCardSummary,
  calculateMemberSummary,
  calculateMonthlyReport,
  formatCurrency,
  formatDate,
  getCategoryName,
  generateId,
} from './calculations';
import { Card, Transaction, Member } from './types';

describe('Calculations', () => {
  const mockCard: Card = {
    id: 'card1',
    name: 'Nubank',
    brand: 'visa',
    limit: 5000,
    lastFourDigits: '1234',
    dueDate: 10,
    isActive: true,
    createdAt: Date.now(),
  };

  const mockMembers: Member[] = [
    { id: 'user', name: 'Voce', color: '#0066CC' },
    { id: 'spouse', name: 'Esposa', color: '#FF69B4' },
    { id: 'daughter', name: 'Filha', color: '#FFB347' },
  ];

  const mockTransactions: Transaction[] = [
    {
      id: 'trans1',
      cardId: 'card1',
      memberId: 'user',
      amount: 100,
      description: 'Supermercado',
      category: 'food',
      date: Date.now(),
      createdAt: Date.now(),
    },
    {
      id: 'trans2',
      cardId: 'card1',
      memberId: 'spouse',
      amount: 200,
      description: 'Restaurante',
      category: 'food',
      date: Date.now(),
      createdAt: Date.now(),
    },
  ];

  describe('Card Summary', () => {
    it('should calculate card summary correctly', () => {
      const summary = calculateCardSummary(mockCard, mockTransactions);
      expect(summary.totalSpent).toBe(300);
      expect(summary.availableLimit).toBe(4700);
      expect(summary.usagePercentage).toBe(6);
      expect(summary.transactionCount).toBe(2);
    });

    it('should handle cards with no transactions', () => {
      const summary = calculateCardSummary(mockCard, []);
      expect(summary.totalSpent).toBe(0);
      expect(summary.availableLimit).toBe(5000);
      expect(summary.usagePercentage).toBe(0);
      expect(summary.transactionCount).toBe(0);
    });
  });

  describe('Member Summary', () => {
    it('should calculate member summary correctly', () => {
      const summary = calculateMemberSummary('user', mockMembers, [mockCard], mockTransactions);
      expect(summary.member.name).toBe('Voce');
      expect(summary.totalSpent).toBe(100);
      expect(summary.transactionCount).toBe(1);
    });

    it('should throw error for non-existent member', () => {
      expect(() => {
        calculateMemberSummary('invalid', mockMembers, [mockCard], mockTransactions);
      }).toThrow();
    });
  });

  describe('Monthly Report', () => {
    it('should calculate monthly report correctly', () => {
      const now = new Date();
      const report = calculateMonthlyReport(
        now.getMonth(),
        now.getFullYear(),
        mockMembers,
        [mockCard],
        mockTransactions
      );
      expect(report.totalSpent).toBe(300);
      expect(report.byMember.length).toBe(2);
      expect(report.byCategory.length).toBe(1);
      expect(report.byCard.length).toBe(1);
    });
  });

  describe('Formatting', () => {
    it('should format currency correctly', () => {
      const formatted = formatCurrency(1000); // 1000 centavos = R$ 10,00
      expect(formatted).toContain('10');
      expect(formatted).toContain('R$');
    });

    it('should format currency with correct decimal places', () => {
      const formatted = formatCurrency(30000); // 30000 centavos = R$ 300,00
      expect(formatted).toContain('300');
      expect(formatted).toContain('R$');
    });

    it('should format date correctly', () => {
      const timestamp = new Date('2026-03-11').getTime();
      const formatted = formatDate(timestamp);
      expect(formatted).toContain('10');
      expect(formatted).toContain('03');
      expect(formatted).toContain('2026');
    });

    it('should get category name correctly', () => {
      expect(getCategoryName('food')).toBe('Alimentação');
      expect(getCategoryName('transport')).toBe('Transporte');
      expect(getCategoryName('health')).toBe('Saúde');
      expect(getCategoryName('entertainment')).toBe('Entretenimento');
      expect(getCategoryName('shopping')).toBe('Compras');
      expect(getCategoryName('utilities')).toBe('Utilidades');
      expect(getCategoryName('other')).toBe('Outros');
    });
  });

  describe('ID Generation', () => {
    it('should generate unique IDs', () => {
      const id1 = generateId();
      const id2 = generateId();
      expect(id1).not.toBe(id2);
      expect(id1).toMatch(/^\d+_[a-z0-9]+$/);
    });
  });
});
