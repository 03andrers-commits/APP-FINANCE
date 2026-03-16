/**
 * Serviço de parcelamento de compras
 */

import { Transaction } from './types';

export interface InstallmentPlan {
  installments: number;
  monthlyAmount: number;
  totalAmount: number;
}

/**
 * Calcula o plano de parcelamento
 */
export function calculateInstallmentPlan(
  totalAmount: number,
  installments: number
): InstallmentPlan {
  if (installments < 1) {
    throw new Error('Número de parcelas deve ser pelo menos 1');
  }

  const monthlyAmount = totalAmount / installments;

  return {
    installments,
    monthlyAmount: Math.round(monthlyAmount),
    totalAmount,
  };
}

/**
 * Gera as transações de parcelas
 */
export function generateInstallmentTransactions(
  baseTransaction: Transaction,
  installments: number,
  startDate: number = Date.now()
): Transaction[] {
  if (installments <= 1) {
    // Sem parcelamento
    return [baseTransaction];
  }

  const plan = calculateInstallmentPlan(baseTransaction.amount, installments);
  const transactions: Transaction[] = [];
  const parentId = baseTransaction.id;

  // Gerar cada parcela
  for (let i = 1; i <= installments; i++) {
    const date = new Date(startDate);
    date.setMonth(date.getMonth() + (i - 1)); // Adiciona meses

    const transaction: Transaction = {
      ...baseTransaction,
      id: `${parentId}_inst_${i}`, // ID único para cada parcela
      amount: plan.monthlyAmount,
      date: date.getTime(),
      installments,
      installmentNumber: i,
      parentTransactionId: parentId,
      description: `${baseTransaction.description} (${i}/${installments})`,
    };

    transactions.push(transaction);
  }

  return transactions;
}

/**
 * Obtém todas as parcelas de uma compra
 */
export function getInstallmentsForTransaction(
  transactions: Transaction[],
  transactionId: string
): Transaction[] {
  return transactions.filter(
    (t) => t.parentTransactionId === transactionId || t.id === transactionId
  );
}

/**
 * Calcula o total gasto em uma compra com parcelamento
 */
export function getTotalForParcelledTransaction(
  transactions: Transaction[],
  transactionId: string
): number {
  const installments = getInstallmentsForTransaction(transactions, transactionId);
  return installments.reduce((sum, t) => sum + t.amount, 0);
}

/**
 * Obtém as parcelas pagas até uma data
 */
export function getPaidInstallments(
  transactions: Transaction[],
  transactionId: string,
  untilDate: number
): Transaction[] {
  return getInstallmentsForTransaction(transactions, transactionId).filter(
    (t) => t.date <= untilDate
  );
}

/**
 * Obtém as parcelas pendentes a partir de uma data
 */
export function getPendingInstallments(
  transactions: Transaction[],
  transactionId: string,
  fromDate: number
): Transaction[] {
  return getInstallmentsForTransaction(transactions, transactionId).filter(
    (t) => t.date > fromDate
  );
}

/**
 * Calcula o progresso de parcelamento (quanto já foi pago)
 */
export function getInstallmentProgress(
  transactions: Transaction[],
  transactionId: string,
  currentDate: number = Date.now()
): {
  paid: number;
  total: number;
  percentage: number;
  remainingAmount: number;
} {
  const allInstallments = getInstallmentsForTransaction(transactions, transactionId);
  const paidInstallments = getPaidInstallments(transactions, transactionId, currentDate);

  const paid = paidInstallments.length;
  const total = allInstallments.length;
  const percentage = total > 0 ? (paid / total) * 100 : 0;
  const remainingAmount = allInstallments
    .slice(paid)
    .reduce((sum, t) => sum + t.amount, 0);

  return {
    paid,
    total,
    percentage: Math.round(percentage),
    remainingAmount,
  };
}

/**
 * Formata o plano de parcelamento para exibição
 */
export function formatInstallmentPlan(plan: InstallmentPlan): string {
  const monthly = `R$ ${(plan.monthlyAmount / 100).toFixed(2)}`;
  const total = `R$ ${(plan.totalAmount / 100).toFixed(2)}`;

  return `${plan.installments}x de ${monthly} (Total: ${total})`;
}
