/**
 * Serviço de armazenamento de dados usando AsyncStorage
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import { AppState, Card, Member, Transaction, FamilyMember, PaymentStatus } from './types';

const STORAGE_KEY = 'finance_family_app_state';
const MEMBERS_KEY = 'finance_family_app_members';
const CARDS_KEY = 'finance_family_app_cards';
const TRANSACTIONS_KEY = 'finance_family_app_transactions';
const PAYMENT_STATUS_KEY = 'finance_family_app_payment_status';

// Dados padrão
const DEFAULT_MEMBERS: Member[] = [
  { id: 'user', name: 'Você', color: '#0066CC' },
  { id: 'spouse', name: 'Esposa', color: '#FF69B4' },
  { id: 'daughter', name: 'Filha', color: '#FFB347' },
];

/**
 * Inicializa o armazenamento com dados padrão se vazio
 */
export async function initializeStorage(): Promise<void> {
  try {
    const existingMembers = await AsyncStorage.getItem(MEMBERS_KEY);
    if (!existingMembers) {
      await AsyncStorage.setItem(MEMBERS_KEY, JSON.stringify(DEFAULT_MEMBERS));
    }

    const existingCards = await AsyncStorage.getItem(CARDS_KEY);
    if (!existingCards) {
      await AsyncStorage.setItem(CARDS_KEY, JSON.stringify([]));
    }

    const existingTransactions = await AsyncStorage.getItem(TRANSACTIONS_KEY);
    if (!existingTransactions) {
      await AsyncStorage.setItem(TRANSACTIONS_KEY, JSON.stringify([]));
    }

    const existingPaymentStatus = await AsyncStorage.getItem(PAYMENT_STATUS_KEY);
    if (!existingPaymentStatus) {
      await AsyncStorage.setItem(PAYMENT_STATUS_KEY, JSON.stringify([]));
    }
  } catch (error) {
    console.error('Erro ao inicializar armazenamento:', error);
  }
}

/**
 * Obtém todos os membros da família
 */
export async function getMembers(): Promise<Member[]> {
  try {
    const data = await AsyncStorage.getItem(MEMBERS_KEY);
    return data ? JSON.parse(data) : DEFAULT_MEMBERS;
  } catch (error) {
    console.error('Erro ao obter membros:', error);
    return DEFAULT_MEMBERS;
  }
}

/**
 * Atualiza um membro
 */
export async function updateMember(member: Member): Promise<void> {
  try {
    const members = await getMembers();
    const index = members.findIndex(m => m.id === member.id);
    if (index !== -1) {
      members[index] = member;
      await AsyncStorage.setItem(MEMBERS_KEY, JSON.stringify(members));
    }
  } catch (error) {
    console.error('Erro ao atualizar membro:', error);
  }
}

/**
 * Adiciona um novo membro da família
 */
export async function addMember(member: Member): Promise<void> {
  try {
    const members = await getMembers();
    // Sempre adiciona o novo membro (ID é único com timestamp)
    members.push(member);
    await AsyncStorage.setItem(MEMBERS_KEY, JSON.stringify(members));
  } catch (error) {
    console.error('Erro ao adicionar membro:', error);
    throw error;
  }
}

/**
 * Remove um membro da família
 */
export async function removeMember(memberId: string): Promise<void> {
  try {
    // Não permitir remover o usuário principal
    if (memberId === 'user') {
      throw new Error('Não é possível remover o usuário principal');
    }

    const members = await getMembers();
    const filtered = members.filter(m => m.id !== memberId);
    await AsyncStorage.setItem(MEMBERS_KEY, JSON.stringify(filtered));

    // Remover também as transações associadas ao membro
    const transactions = await getTransactions();
    const filteredTransactions = transactions.filter(t => t.memberId !== memberId);
    await AsyncStorage.setItem(TRANSACTIONS_KEY, JSON.stringify(filteredTransactions));
  } catch (error) {
    console.error('Erro ao remover membro:', error);
  }
}

/**
 * Gera um ID único para novo membro
 */
export function generateMemberId(): string {
  return 'member_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
}

/**
 * Obtém todos os cartões
 */
export async function getCards(): Promise<Card[]> {
  try {
    const data = await AsyncStorage.getItem(CARDS_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Erro ao obter cartões:', error);
    return [];
  }
}

/**
 * Adiciona um novo cartão
 */
export async function addCard(card: Card): Promise<void> {
  try {
    const cards = await getCards();
    cards.push(card);
    await AsyncStorage.setItem(CARDS_KEY, JSON.stringify(cards));
  } catch (error) {
    console.error('Erro ao adicionar cartão:', error);
  }
}

/**
 * Atualiza um cartão existente
 */
export async function updateCard(card: Card): Promise<void> {
  try {
    const cards = await getCards();
    const index = cards.findIndex(c => c.id === card.id);
    if (index !== -1) {
      cards[index] = card;
      await AsyncStorage.setItem(CARDS_KEY, JSON.stringify(cards));
    }
  } catch (error) {
    console.error('Erro ao atualizar cartão:', error);
  }
}

/**
 * Deleta um cartão
 */
export async function deleteCard(cardId: string): Promise<void> {
  try {
    const cards = await getCards();
    const filtered = cards.filter(c => c.id !== cardId);
    await AsyncStorage.setItem(CARDS_KEY, JSON.stringify(filtered));
    
    // Remove também as transações associadas
    const transactions = await getTransactions();
    const filteredTransactions = transactions.filter(t => t.cardId !== cardId);
    await AsyncStorage.setItem(TRANSACTIONS_KEY, JSON.stringify(filteredTransactions));
  } catch (error) {
    console.error('Erro ao deletar cartão:', error);
  }
}

/**
 * Obtém todas as transações
 */
export async function getTransactions(): Promise<Transaction[]> {
  try {
    const data = await AsyncStorage.getItem(TRANSACTIONS_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Erro ao obter transações:', error);
    return [];
  }
}

/**
 * Adiciona uma nova transação
 */
export async function addTransaction(transaction: Transaction): Promise<void> {
  try {
    const transactions = await getTransactions();
    transactions.push(transaction);
    await AsyncStorage.setItem(TRANSACTIONS_KEY, JSON.stringify(transactions));
  } catch (error) {
    console.error('Erro ao adicionar transação:', error);
  }
}

/**
 * Atualiza uma transação existente
 */
export async function updateTransaction(transaction: Transaction): Promise<void> {
  try {
    const transactions = await getTransactions();
    const index = transactions.findIndex(t => t.id === transaction.id);
    if (index !== -1) {
      transactions[index] = transaction;
      await AsyncStorage.setItem(TRANSACTIONS_KEY, JSON.stringify(transactions));
    }
  } catch (error) {
    console.error('Erro ao atualizar transação:', error);
  }
}

/**
 * Deleta uma transação
 */
export async function deleteTransaction(transactionId: string): Promise<void> {
  try {
    const transactions = await getTransactions();
    const filtered = transactions.filter(t => t.id !== transactionId);
    await AsyncStorage.setItem(TRANSACTIONS_KEY, JSON.stringify(filtered));
  } catch (error) {
    console.error('Erro ao deletar transação:', error);
  }
}

/**
 * Obtém transações por cartão
 */
export async function getTransactionsByCard(cardId: string): Promise<Transaction[]> {
  try {
    const transactions = await getTransactions();
    return transactions.filter(t => t.cardId === cardId).sort((a, b) => b.date - a.date);
  } catch (error) {
    console.error('Erro ao obter transações do cartão:', error);
    return [];
  }
}

/**
 * Obtém transações por membro
 */
export async function getTransactionsByMember(memberId: FamilyMember): Promise<Transaction[]> {
  try {
    const transactions = await getTransactions();
    return transactions.filter(t => t.memberId === memberId).sort((a, b) => b.date - a.date);
  } catch (error) {
    console.error('Erro ao obter transações do membro:', error);
    return [];
  }
}

/**
 * Obtém transações em um período (mês/ano)
 */
export async function getTransactionsByPeriod(month: number, year: number): Promise<Transaction[]> {
  try {
    const transactions = await getTransactions();
    return transactions.filter(t => {
      const date = new Date(t.date);
      return date.getMonth() === month && date.getFullYear() === year;
    }).sort((a, b) => b.date - a.date);
  } catch (error) {
    console.error('Erro ao obter transações do período:', error);
    return [];
  }
}

/**
 * Obtém status de pagamento armazenado
 */
export async function getPaymentStatus(): Promise<PaymentStatus[]> {
  try {
    const data = await AsyncStorage.getItem(PAYMENT_STATUS_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Erro ao obter status de pagamento:', error);
    return [];
  }
}

/**
 * Atualiza status de pagamento para um cartão em um mês específico
 */
export async function updatePaymentStatus(cardId: string, month: number, year: number, isPaid: boolean): Promise<void> {
  try {
    const statuses = await getPaymentStatus();
    const index = statuses.findIndex(s => s.cardId === cardId && s.month === month && s.year === year);
    
    if (index !== -1) {
      statuses[index].isPaid = isPaid;
    } else {
      statuses.push({ cardId, month, year, isPaid });
    }
    
    await AsyncStorage.setItem(PAYMENT_STATUS_KEY, JSON.stringify(statuses));
  } catch (error) {
    console.error('Erro ao atualizar status de pagamento:', error);
  }
}

/**
 * Obtém status de pagamento para um cartão em um mês específico
 */
export async function getCardPaymentStatus(cardId: string, month: number, year: number): Promise<boolean> {
  try {
    const statuses = await getPaymentStatus();
    const status = statuses.find(s => s.cardId === cardId && s.month === month && s.year === year);
    return status?.isPaid ?? false;
  } catch (error) {
    console.error('Erro ao obter status de pagamento do cartão:', error);
    return false;
  }
}

/**
 * Limpa todos os dados (para testes)
 */
export async function clearAllData(): Promise<void> {
  try {
    await AsyncStorage.multiRemove([MEMBERS_KEY, CARDS_KEY, TRANSACTIONS_KEY, PAYMENT_STATUS_KEY]);
    await initializeStorage();
  } catch (error) {
    console.error('Erro ao limpar dados:', error);
  }
}
