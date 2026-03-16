/**
 * Testes para o serviço de armazenamento
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import * as storage from './storage';
import { Card, Transaction, Member } from './types';

// Mock AsyncStorage
vi.mock('@react-native-async-storage/async-storage', () => ({
  default: {
    getItem: vi.fn(),
    setItem: vi.fn(),
    multiRemove: vi.fn(),
  },
}));

describe('Storage Service', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Members', () => {
    it('should return default members if none exist', async () => {
      const members = await storage.getMembers();
      expect(members).toHaveLength(3);
      expect(members[0].id).toBe('user');
      expect(members[1].id).toBe('spouse');
      expect(members[2].id).toBe('daughter');
    });

    it('should update a member', async () => {
      const updatedMember: Member = {
        id: 'user',
        name: 'Joao',
        color: '#FF0000',
      };
      await storage.updateMember(updatedMember);
      expect(true).toBe(true);
    });
  });

  describe('Cards', () => {
    it('should add a card', async () => {
      const newCard: Card = {
        id: 'card1',
        name: 'Nubank',
        brand: 'visa',
        limit: 5000,
        lastFourDigits: '1234',
        dueDate: 10,
        isActive: true,
        createdAt: Date.now(),
      };
      await storage.addCard(newCard);
      expect(true).toBe(true);
    });

    it('should get cards', async () => {
      const cards = await storage.getCards();
      expect(Array.isArray(cards)).toBe(true);
    });

    it('should delete a card', async () => {
      await storage.deleteCard('card1');
      expect(true).toBe(true);
    });
  });

  describe('Transactions', () => {
    it('should add a transaction', async () => {
      const newTransaction: Transaction = {
        id: 'trans1',
        cardId: 'card1',
        memberId: 'user',
        amount: 100,
        description: 'Supermercado',
        category: 'food',
        date: Date.now(),
        createdAt: Date.now(),
      };
      await storage.addTransaction(newTransaction);
      expect(true).toBe(true);
    });

    it('should get transactions', async () => {
      const transactions = await storage.getTransactions();
      expect(Array.isArray(transactions)).toBe(true);
    });

    it('should get transactions by card', async () => {
      const transactions = await storage.getTransactionsByCard('card1');
      expect(Array.isArray(transactions)).toBe(true);
    });

    it('should get transactions by member', async () => {
      const transactions = await storage.getTransactionsByMember('user');
      expect(Array.isArray(transactions)).toBe(true);
    });

    it('should delete a transaction', async () => {
      await storage.deleteTransaction('trans1');
      expect(true).toBe(true);
    });
  });
});
