/**
 * Contexto global para gerenciar o estado financeiro do app
 */

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { Card, Member, Transaction } from './types';
import * as storage from './storage';

interface FinanceContextType {
  // Estado
  members: Member[];
  cards: Card[];
  transactions: Transaction[];
  isLoading: boolean;
  error: string | null;

  // Operações de membros
  updateMember: (member: Member) => Promise<void>;

  // Operações de cartões
  addCard: (card: Card) => Promise<void>;
  updateCard: (card: Card) => Promise<void>;
  deleteCard: (cardId: string) => Promise<void>;

  // Operações de transações
  addTransaction: (transaction: Transaction) => Promise<void>;
  updateTransaction: (transaction: Transaction) => Promise<void>;
  deleteTransaction: (transactionId: string) => Promise<void>;

  // Consultas
  getTransactionsByCard: (cardId: string) => Promise<Transaction[]>;
  getTransactionsByMember: (memberId: string) => Promise<Transaction[]>;
  getTransactionsByPeriod: (month: number, year: number) => Promise<Transaction[]>;

  // Refresh
  refreshData: () => Promise<void>;
}

const FinanceContext = createContext<FinanceContextType | undefined>(undefined);

export function FinanceProvider({ children }: { children: React.ReactNode }) {
  const [members, setMembers] = useState<Member[]>([]);
  const [cards, setCards] = useState<Card[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Carrega dados iniciais
  useEffect(() => {
    loadData();
  }, []);

  const loadData = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      await storage.initializeStorage();
      const [loadedMembers, loadedCards, loadedTransactions] = await Promise.all([
        storage.getMembers(),
        storage.getCards(),
        storage.getTransactions(),
      ]);
      setMembers(loadedMembers);
      setCards(loadedCards);
      setTransactions(loadedTransactions);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar dados');
      console.error('Erro ao carregar dados:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const refreshData = useCallback(async () => {
    await loadData();
  }, [loadData]);

  // Operações de membros
  const updateMember = useCallback(async (member: Member) => {
    try {
      await storage.updateMember(member);
      setMembers(prev => prev.map(m => m.id === member.id ? member : m));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao atualizar membro');
      throw err;
    }
  }, []);

  // Operações de cartões
  const addCard = useCallback(async (card: Card) => {
    try {
      await storage.addCard(card);
      setCards(prev => [...prev, card]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao adicionar cartão');
      throw err;
    }
  }, []);

  const updateCard = useCallback(async (card: Card) => {
    try {
      await storage.updateCard(card);
      setCards(prev => prev.map(c => c.id === card.id ? card : c));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao atualizar cartão');
      throw err;
    }
  }, []);

  const deleteCard = useCallback(async (cardId: string) => {
    try {
      await storage.deleteCard(cardId);
      setCards(prev => prev.filter(c => c.id !== cardId));
      setTransactions(prev => prev.filter(t => t.cardId !== cardId));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao deletar cartão');
      throw err;
    }
  }, []);

  // Operações de transações
  const addTransaction = useCallback(async (transaction: Transaction) => {
    try {
      await storage.addTransaction(transaction);
      setTransactions(prev => [...prev, transaction]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao adicionar transação');
      throw err;
    }
  }, []);

  const updateTransaction = useCallback(async (transaction: Transaction) => {
    try {
      await storage.updateTransaction(transaction);
      setTransactions(prev => prev.map(t => t.id === transaction.id ? transaction : t));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao atualizar transação');
      throw err;
    }
  }, []);

  const deleteTransaction = useCallback(async (transactionId: string) => {
    try {
      await storage.deleteTransaction(transactionId);
      setTransactions(prev => prev.filter(t => t.id !== transactionId));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao deletar transação');
      throw err;
    }
  }, []);

  // Consultas
  const getTransactionsByCard = useCallback(async (cardId: string) => {
    return storage.getTransactionsByCard(cardId);
  }, []);

  const getTransactionsByMember = useCallback(async (memberId: string) => {
    return storage.getTransactionsByMember(memberId as any);
  }, []);

  const getTransactionsByPeriod = useCallback(async (month: number, year: number) => {
    return storage.getTransactionsByPeriod(month, year);
  }, []);

  const value: FinanceContextType = {
    members,
    cards,
    transactions,
    isLoading,
    error,
    updateMember,
    addCard,
    updateCard,
    deleteCard,
    addTransaction,
    updateTransaction,
    deleteTransaction,
    getTransactionsByCard,
    getTransactionsByMember,
    getTransactionsByPeriod,
    refreshData,
  };

  return (
    <FinanceContext.Provider value={value}>
      {children}
    </FinanceContext.Provider>
  );
}

export function useFinance() {
  const context = useContext(FinanceContext);
  if (!context) {
    throw new Error('useFinance deve ser usado dentro de FinanceProvider');
  }
  return context;
}
