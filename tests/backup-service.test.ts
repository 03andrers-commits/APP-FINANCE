import { describe, it, expect, beforeEach, vi } from 'vitest';
import * as backup from '../lib/backup-service';
import * as storage from '../lib/storage';
import { Card, Member, Transaction } from '../lib/types';

// Mock do storage
vi.mock('../lib/storage', () => ({
  getMembers: vi.fn(),
  getCards: vi.fn(),
  getTransactions: vi.fn(),
  updateMember: vi.fn(),
  addCard: vi.fn(),
  updateCard: vi.fn(),
  addTransaction: vi.fn(),
  updateTransaction: vi.fn(),
}));

describe('Backup Service', () => {
  const mockMembers: Member[] = [
    { id: 'user', name: 'Você', color: '#0066CC' },
    { id: 'spouse', name: 'Esposa', color: '#FF69B4' },
  ];

  const mockCards: Card[] = [
    {
      id: 'card-1',
      name: 'Visa',
      brand: 'visa',
      limit: 5000,
      lastFourDigits: '1234',
      dueDate: 15,
      createdAt: Date.now(),
    },
  ];

  const mockTransactions: Transaction[] = [
    {
      id: 'trans-1',
      cardId: 'card-1',
      memberId: 'user',
      amount: 100,
      description: 'Compra teste',
      category: 'food',
      date: Date.now(),
      createdAt: Date.now(),
    },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('exportData', () => {
    it('deve exportar todos os dados corretamente', async () => {
      vi.mocked(storage.getMembers).mockResolvedValue(mockMembers);
      vi.mocked(storage.getCards).mockResolvedValue(mockCards);
      vi.mocked(storage.getTransactions).mockResolvedValue(mockTransactions);

      const result = await backup.exportData();

      expect(result.version).toBe('1.0');
      expect(result.members).toEqual(mockMembers);
      expect(result.cards).toEqual(mockCards);
      expect(result.transactions).toEqual(mockTransactions);
      expect(result.exportedAt).toBeDefined();
    });

    it('deve incluir timestamp de exportação', async () => {
      vi.mocked(storage.getMembers).mockResolvedValue([]);
      vi.mocked(storage.getCards).mockResolvedValue([]);
      vi.mocked(storage.getTransactions).mockResolvedValue([]);

      const result = await backup.exportData();
      const exportDate = new Date(result.exportedAt);

      expect(exportDate.getTime()).toBeLessThanOrEqual(Date.now());
      expect(exportDate.getTime()).toBeGreaterThan(Date.now() - 5000);
    });
  });

  describe('backupToJSON', () => {
    it('deve converter backup para JSON formatado', () => {
      const backupData = {
        version: '1.0',
        exportedAt: '2026-03-12T12:00:00Z',
        members: mockMembers,
        cards: mockCards,
        transactions: mockTransactions,
      };

      const json = backup.backupToJSON(backupData);

      expect(json).toContain('"version": "1.0"');
      expect(json).toContain('"members"');
      expect(json).toContain('"cards"');
      expect(json).toContain('"transactions"');
    });

    it('deve gerar JSON válido', () => {
      const backupData = {
        version: '1.0',
        exportedAt: '2026-03-12T12:00:00Z',
        members: mockMembers,
        cards: mockCards,
        transactions: mockTransactions,
      };

      const json = backup.backupToJSON(backupData);
      const parsed = JSON.parse(json);

      expect(parsed.version).toBe('1.0');
      expect(parsed.members).toHaveLength(2);
    });
  });

  describe('jsonToBackup', () => {
    it('deve converter JSON válido para backup', () => {
      const backupData = {
        version: '1.0',
        exportedAt: '2026-03-12T12:00:00Z',
        members: mockMembers,
        cards: mockCards,
        transactions: mockTransactions,
      };

      const json = backup.backupToJSON(backupData);
      const parsed = backup.jsonToBackup(json);

      expect(parsed.version).toBe('1.0');
      expect(parsed.members).toEqual(mockMembers);
      expect(parsed.cards).toEqual(mockCards);
      expect(parsed.transactions).toEqual(mockTransactions);
    });

    it('deve lançar erro para JSON inválido', () => {
      expect(() => {
        backup.jsonToBackup('{ invalid json }');
      }).toThrow();
    });
  });

  describe('generateBackupFilename', () => {
    it('deve gerar nome de arquivo com timestamp', () => {
      const filename = backup.generateBackupFilename();

      expect(filename).toMatch(/^finance-backup-\d{8}-\d{4}\.json$/);
    });

    it('deve incluir data e hora no nome', () => {
      const filename = backup.generateBackupFilename();
      const now = new Date();
      const year = now.getFullYear();

      expect(filename).toContain(`${year}`);
      expect(filename).toContain('finance-backup');
      expect(filename).toContain('.json');
    });
  });

  describe('getBackupStats', () => {
    it('deve calcular estatísticas corretas', () => {
      const backupData = {
        version: '1.0',
        exportedAt: '2026-03-12T12:00:00Z',
        members: mockMembers,
        cards: mockCards,
        transactions: mockTransactions,
      };

      const stats = backup.getBackupStats(backupData);

      expect(stats.totalCards).toBe(1);
      expect(stats.totalTransactions).toBe(1);
      expect(stats.totalSpent).toBe(100);
      expect(stats.exportedAt).toBe('2026-03-12T12:00:00Z');
    });

    it('deve somar corretamente múltiplas transações', () => {
      const multiTransactions: Transaction[] = [
        {
          id: 'trans-1',
          cardId: 'card-1',
          memberId: 'user',
          amount: 100,
          description: 'Compra 1',
          category: 'food',
          date: Date.now(),
          createdAt: Date.now(),
        },
        {
          id: 'trans-2',
          cardId: 'card-1',
          memberId: 'spouse',
          amount: 200,
          description: 'Compra 2',
          category: 'shopping',
          date: Date.now(),
          createdAt: Date.now(),
        },
      ];

      const backupData = {
        version: '1.0',
        exportedAt: '2026-03-12T12:00:00Z',
        members: mockMembers,
        cards: mockCards,
        transactions: multiTransactions,
      };

      const stats = backup.getBackupStats(backupData);

      expect(stats.totalSpent).toBe(300);
      expect(stats.totalTransactions).toBe(2);
    });
  });
});
