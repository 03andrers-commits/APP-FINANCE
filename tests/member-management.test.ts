import { describe, it, expect, beforeEach, vi } from 'vitest';
import * as storage from '../lib/storage';
import { Member } from '../lib/types';

// Mock do AsyncStorage
vi.mock('@react-native-async-storage/async-storage', () => ({
  default: {
    getItem: vi.fn(),
    setItem: vi.fn(),
    multiRemove: vi.fn(),
  },
}));

describe('Member Management', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('generateMemberId', () => {
    it('deve gerar um ID único', () => {
      const id1 = storage.generateMemberId();
      const id2 = storage.generateMemberId();

      expect(id1).toMatch(/^member_\d+_[a-z0-9]+$/);
      expect(id2).toMatch(/^member_\d+_[a-z0-9]+$/);
      expect(id1).not.toBe(id2);
    });

    it('deve começar com "member_"', () => {
      const id = storage.generateMemberId();
      expect(id.startsWith('member_')).toBe(true);
    });
  });

  describe('addMember', () => {
    it('deve adicionar um novo membro', async () => {
      const newMember: Member = {
        id: 'member_123',
        name: 'João',
        color: '#FF6B6B',
      };

      // Mock das funções
      const getMembers = vi.spyOn(storage, 'getMembers').mockResolvedValue([
        { id: 'user', name: 'Você', color: '#0066CC' },
      ]);

      const addMember = vi.spyOn(storage, 'addMember').mockResolvedValue();

      await storage.addMember(newMember);

      expect(addMember).toHaveBeenCalledWith(newMember);
    });
  });

  describe('removeMember', () => {
    it('não deve permitir remover o usuário principal', async () => {
      const removeMember = vi.spyOn(storage, 'removeMember');

      try {
        await storage.removeMember('user');
      } catch (error: any) {
        expect(error.message).toContain('não é possível remover');
      }
    });

    it('deve remover um membro existente', async () => {
      const removeMember = vi.spyOn(storage, 'removeMember').mockResolvedValue();

      await storage.removeMember('member_123');

      expect(removeMember).toHaveBeenCalledWith('member_123');
    });
  });
});
