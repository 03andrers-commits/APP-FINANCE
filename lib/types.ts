/**
 * Tipos e interfaces para o app de controle financeiro familiar
 */

export type FamilyMember = string; // Permite IDs dinâmicos para novos membros

export interface Member {
  id: FamilyMember;
  name: string;
  color: string;
}

export interface Card {
  id: string;
  name: string;
  brand: 'visa' | 'mastercard' | 'elo' | 'amex' | 'other';
  limit: number;
  lastFourDigits: string;
  dueDate: number; // dia do mês (1-31)
  photo?: string; // base64 encoded image
  isActive?: boolean;
  isPaid?: boolean; // se a fatura do mês atual está paga
  createdAt: number;
}

export type TransactionCategory = 
  | 'food' 
  | 'transport' 
  | 'health' 
  | 'entertainment' 
  | 'shopping' 
  | 'utilities' 
  | 'other';

export interface Transaction {
  id: string;
  cardId: string;
  memberId: FamilyMember;
  amount: number;
  description: string;
  category: TransactionCategory;
  date: number; // timestamp
  createdAt: number;
  // Parcelamento
  installments?: number; // número de parcelas (1 = sem parcelamento)
  installmentNumber?: number; // qual parcela é esta (1, 2, 3...)
  parentTransactionId?: string; // ID da compra original (para parcelas)
  interestRate?: number; // taxa de juros (em %)
}

export interface CardSummary {
  card: Card;
  totalSpent: number;
  availableLimit: number;
  usagePercentage: number;
  transactionCount: number;
}

export interface MemberSummary {
  member: Member;
  totalSpent: number;
  transactionCount: number;
  cardBreakdown: {
    cardId: string;
    cardName: string;
    amount: number;
  }[];
}

export interface MonthlyReport {
  month: number;
  year: number;
  totalSpent: number;
  byMember: {
    memberId: FamilyMember;
    memberName: string;
    amount: number;
    percentage: number;
  }[];
  byCategory: {
    category: TransactionCategory;
    amount: number;
    percentage: number;
  }[];
  byCard: {
    cardId: string;
    cardName: string;
    amount: number;
    percentage: number;
  }[];
}

export interface PaymentStatus {
  cardId: string;
  month: number;
  year: number;
  isPaid: boolean;
}

export interface AppState {
  members: Member[];
  cards: Card[];
  transactions: Transaction[];
  paymentStatus?: PaymentStatus[];
}
