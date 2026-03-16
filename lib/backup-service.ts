/**
 * Serviço de backup e restauração de dados
 * Permite exportar e importar dados como arquivo JSON
 */

import { Card, Member, Transaction, AppState } from './types';
import * as storage from './storage';

export interface BackupData {
  version: string;
  exportedAt: string;
  members: Member[];
  cards: Card[];
  transactions: Transaction[];
}

/**
 * Exporta todos os dados para um objeto JSON
 */
export async function exportData(): Promise<BackupData> {
  try {
    const [members, cards, transactions] = await Promise.all([
      storage.getMembers(),
      storage.getCards(),
      storage.getTransactions(),
    ]);

    return {
      version: '1.0',
      exportedAt: new Date().toISOString(),
      members,
      cards,
      transactions,
    };
  } catch (error) {
    console.error('Erro ao exportar dados:', error);
    throw new Error('Falha ao exportar dados');
  }
}

/**
 * Importa dados de um objeto JSON
 */
export async function importData(backupData: BackupData): Promise<void> {
  try {
    // Validar estrutura do backup
    if (!backupData.version || !backupData.members || !backupData.cards || !backupData.transactions) {
      throw new Error('Arquivo de backup inválido');
    }

    // Importar membros
    for (const member of backupData.members) {
      await storage.updateMember(member);
    }

    // Importar cartões
    const existingCards = await storage.getCards();
    for (const card of backupData.cards) {
      // Verificar se cartão já existe
      if (!existingCards.find(c => c.id === card.id)) {
        await storage.addCard(card);
      } else {
        await storage.updateCard(card);
      }
    }

    // Importar transações
    const existingTransactions = await storage.getTransactions();
    for (const transaction of backupData.transactions) {
      // Verificar se transação já existe
      if (!existingTransactions.find(t => t.id === transaction.id)) {
        await storage.addTransaction(transaction);
      } else {
        await storage.updateTransaction(transaction);
      }
    }

    console.log('Dados importados com sucesso');
  } catch (error) {
    console.error('Erro ao importar dados:', error);
    throw new Error('Falha ao importar dados');
  }
}

/**
 * Gera um nome de arquivo para o backup
 */
export function generateBackupFilename(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');

  return `finance-backup-${year}${month}${day}-${hours}${minutes}.json`;
}

/**
 * Converte dados de backup para string JSON formatada
 */
export function backupToJSON(backupData: BackupData): string {
  return JSON.stringify(backupData, null, 2);
}

/**
 * Converte string JSON para dados de backup
 */
export function jsonToBackup(jsonString: string): BackupData {
  try {
    const data = JSON.parse(jsonString);
    return data as BackupData;
  } catch (error) {
    throw new Error('Arquivo JSON inválido');
  }
}

/**
 * Calcula estatísticas do backup
 */
export function getBackupStats(backupData: BackupData) {
  const totalCards = backupData.cards.length;
  const totalTransactions = backupData.transactions.length;
  const totalSpent = backupData.transactions.reduce((sum, t) => sum + t.amount, 0);

  return {
    totalCards,
    totalTransactions,
    totalSpent,
    exportedAt: backupData.exportedAt,
  };
}
