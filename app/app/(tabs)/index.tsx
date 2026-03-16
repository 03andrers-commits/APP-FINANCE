/**
 * Tela Home - Dashboard com faturas de todos os meses com filtro
 */

import React, { useCallback, useState, useMemo, useEffect } from 'react';
import { ScrollView, Text, View, Pressable, Modal } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { ScreenContainer } from '@/components/screen-container';
import { useFinance } from '@/lib/finance-context';
import { formatCurrency } from '@/lib/calculations';
import { calculateInvoicesByMonth } from '@/lib/invoice-service';
import { router } from 'expo-router';
import * as storage from '@/lib/storage';

type PaymentAction = 'mark' | 'unmark';

export default function HomeScreen() {
  const { cards, transactions, isLoading, refreshData } = useFinance();
  const [selectedMonth, setSelectedMonth] = useState<number>(new Date().getMonth());
  const [selectedYear, setSelectedYear] = useState<number>(new Date().getFullYear());
  const [confirmPaymentModal, setConfirmPaymentModal] = useState<{ cardId: string; cardName: string; action: PaymentAction } | null>(null);
  const [paymentStatuses, setPaymentStatuses] = useState<Record<string, boolean>>({});

  useFocusEffect(
    useCallback(() => {
      refreshData();
      loadPaymentStatuses();
    }, [refreshData])
  );

  // Recarrega status de pagamento quando mês muda
  useEffect(() => {
    loadPaymentStatuses();
  }, [selectedMonth, selectedYear]);

  const loadPaymentStatuses = async () => {
    const statuses = await storage.getPaymentStatus();
    const statusMap: Record<string, boolean> = {};
    statuses.forEach(s => {
      statusMap[`${s.cardId}-${s.month}-${s.year}`] = s.isPaid;
    });
    setPaymentStatuses(statusMap);
  };

  // Calcula faturas por mês
  const allInvoices = useMemo(() => {
    return calculateInvoicesByMonth(transactions, cards);
  }, [transactions, cards]);

  // Encontra a fatura do mês selecionado
  const currentInvoice = useMemo(() => {
    return allInvoices.find(
      invoice => invoice.month === selectedMonth && invoice.year === selectedYear
    );
  }, [allInvoices, selectedMonth, selectedYear]);

  // Gera lista de meses disponíveis (passados e futuros)
  const availableMonths = useMemo(() => {
    const months = [];
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth();

    // Adiciona 12 meses anteriores
    for (let i = 12; i > 0; i--) {
      let month = currentMonth - i;
      let year = currentYear;
      if (month < 0) {
        month += 12;
        year -= 1;
      }
      months.push({ month, year });
    }

    // Adiciona mês atual
    months.push({ month: currentMonth, year: currentYear });

    // Adiciona 6 meses futuros
    for (let i = 1; i <= 6; i++) {
      let month = currentMonth + i;
      let year = currentYear;
      if (month > 11) {
        month -= 12;
        year += 1;
      }
      months.push({ month, year });
    }

    return months;
  }, []);

  const handlePreviousMonth = () => {
    const currentIndex = availableMonths.findIndex(
      m => m.month === selectedMonth && m.year === selectedYear
    );
    if (currentIndex > 0) {
      const prev = availableMonths[currentIndex - 1];
      setSelectedMonth(prev.month);
      setSelectedYear(prev.year);
    }
  };

  const handleNextMonth = () => {
    const currentIndex = availableMonths.findIndex(
      m => m.month === selectedMonth && m.year === selectedYear
    );
    if (currentIndex < availableMonths.length - 1) {
      const next = availableMonths[currentIndex + 1];
      setSelectedMonth(next.month);
      setSelectedYear(next.year);
    }
  };

  const getMonthName = (month: number, year: number) => {
    const months = [
      'Janeiro',
      'Fevereiro',
      'Março',
      'Abril',
      'Maio',
      'Junho',
      'Julho',
      'Agosto',
      'Setembro',
      'Outubro',
      'Novembro',
      'Dezembro',
    ];
    return `${months[month]} de ${year}`;
  };

  const isCurrentMonth = () => {
    const now = new Date();
    return selectedMonth === now.getMonth() && selectedYear === now.getFullYear();
  };

  const getPaymentStatusForCard = (cardId: string): boolean => {
    const key = `${cardId}-${selectedMonth}-${selectedYear}`;
    return paymentStatuses[key] ?? false;
  };

  if (isLoading) {
    return (
      <ScreenContainer className="items-center justify-center">
        <Text className="text-foreground">Carregando...</Text>
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer className="p-0">
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Cabeçalho com navegação de mês */}
        <View className="bg-primary px-6 pt-6 pb-4">
          {/* Seletor de mês */}
          <View className="flex-row justify-between items-center mb-6">
            <Pressable
              onPress={handlePreviousMonth}
              className="p-2"
              style={({ pressed }) => [pressed && { opacity: 0.6 }]}
            >
              <Text className="text-white text-xl font-bold">←</Text>
            </Pressable>

            <View className="flex-1 items-center">
              <Text className="text-white text-sm opacity-75 mb-1">
                {isCurrentMonth() ? 'Mês Atual' : 'Mês Selecionado'}
              </Text>
              <Text className="text-white text-xl font-bold">
                {getMonthName(selectedMonth, selectedYear)}
              </Text>
            </View>

            <Pressable
              onPress={handleNextMonth}
              className="p-2"
              style={({ pressed }) => [pressed && { opacity: 0.6 }]}
            >
              <Text className="text-white text-xl font-bold">→</Text>
            </Pressable>
          </View>

          {/* Total do mês */}
          <View className="bg-white rounded-lg p-6 mt-4">
            <Text className="text-primary text-xs opacity-60 mb-3">
              SOMA DE FATURAS DO MÊS
            </Text>
            <Text className="text-primary text-4xl font-bold">
              {currentInvoice
                ? formatCurrency(currentInvoice.totalAmount)
                : formatCurrency(0)}
            </Text>
          </View>
        </View>

        {/* Breakdown por cartão */}
        <View className="px-4 pt-6 pb-6">
          {!currentInvoice || currentInvoice.cardBreakdown.length === 0 ? (
            <View className="items-center justify-center py-12">
              <Text className="text-muted text-center">
                Nenhuma fatura registrada para este mês
              </Text>
            </View>
          ) : (
            <View>
              <Text className="text-foreground text-sm font-semibold mb-3 opacity-75">
                Detalhamento por Cartão
              </Text>
              <View className="bg-surface rounded-lg p-4 border border-border">
                {currentInvoice.cardBreakdown.map((card, index) => {
                  const isPaid = getPaymentStatusForCard(card.cardId);
                  return (
                    <Pressable
                      key={card.cardId}
                      onPress={() => {
                        setConfirmPaymentModal({
                          cardId: card.cardId,
                          cardName: card.cardName,
                          action: isPaid ? 'unmark' : 'mark',
                        });
                      }}
                      style={({ pressed }) => [pressed && { opacity: 0.7 }]}
                    >
                      <View
                        className={`flex-row justify-between items-center py-3 px-3 rounded-lg ${
                          index < currentInvoice.cardBreakdown.length - 1
                            ? 'border-b border-border'
                            : ''
                        } ${
                          isPaid ? 'bg-green-500 bg-opacity-10' : ''
                        }`}
                      >
                        <Text className={`text-sm font-semibold ${
                          isPaid ? 'text-green-700' : 'text-foreground'
                        }`}>
                          {card.cardName}
                        </Text>
                        <View className="flex-row items-center gap-2">
                          <Text className={`font-semibold ${
                            isPaid ? 'text-green-700' : 'text-foreground'
                          }`}>
                            {formatCurrency(card.amount)}
                          </Text>
                          {isPaid && (
                            <Text className="text-green-700 text-xs font-bold">✓ PAGO</Text>
                          )}
                        </View>
                      </View>
                    </Pressable>
                  );
                })}
              </View>
            </View>
          )}
        </View>

        {/* Botão para adicionar cartão */}
        {cards.length === 0 && (
          <View className="px-4 pb-6">
            <Pressable
              onPress={() => router.push('/add-card' as any)}
              className="bg-primary rounded-lg py-4 items-center"
              style={({ pressed }) => [pressed && { opacity: 0.8 }]}
            >
              <Text className="text-white font-semibold">
                + Adicionar Cartão
              </Text>
            </Pressable>
          </View>
        )}
      </ScrollView>

      {/* Modal de Confirmação de Pagamento */}
      <Modal
        visible={confirmPaymentModal !== null}
        transparent
        animationType="fade"
        onRequestClose={() => setConfirmPaymentModal(null)}
      >
        <View className="flex-1 bg-black bg-opacity-50 flex items-center justify-center">
          <View className="bg-surface rounded-2xl p-6 w-4/5 max-w-sm">
            <Text className="text-foreground text-lg font-bold mb-2">
              {confirmPaymentModal?.action === 'mark' ? 'Marcar como Pago?' : 'Desmarcar Pagamento?'}
            </Text>
            <Text className="text-muted text-sm mb-6">
              {confirmPaymentModal?.action === 'mark'
                ? `Deseja marcar a fatura de ${confirmPaymentModal?.cardName} como paga?`
                : `Deseja desmarcar a fatura de ${confirmPaymentModal?.cardName}?`}
            </Text>
            <View className="flex-row gap-3">
              <Pressable
                onPress={() => setConfirmPaymentModal(null)}
                className="flex-1 bg-border rounded-lg py-3"
                style={({ pressed }) => [pressed && { opacity: 0.7 }]}
              >
                <Text className="text-foreground text-center font-semibold">
                  Cancelar
                </Text>
              </Pressable>
              <Pressable
                onPress={async () => {
                  if (confirmPaymentModal) {
                    const isPaidStatus = confirmPaymentModal.action === 'mark';
                    await storage.updatePaymentStatus(
                      confirmPaymentModal.cardId,
                      selectedMonth,
                      selectedYear,
                      isPaidStatus
                    );
                    // Recarrega apenas o status do mês atual
                    const updatedStatuses = await storage.getPaymentStatus();
                    const statusMap: Record<string, boolean> = {};
                    updatedStatuses.forEach(s => {
                      statusMap[`${s.cardId}-${s.month}-${s.year}`] = s.isPaid;
                    });
                    setPaymentStatuses(statusMap);
                    setConfirmPaymentModal(null);
                  }
                }}
                className={`flex-1 rounded-lg py-3 ${
                  confirmPaymentModal?.action === 'mark' ? 'bg-green-600' : 'bg-red-600'
                }`}
                style={({ pressed }) => [pressed && { opacity: 0.7 }]}
              >
                <Text className="text-white text-center font-semibold">
                  {confirmPaymentModal?.action === 'mark' ? 'Confirmar' : 'Desmarcar'}
                </Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </ScreenContainer>
  );
}
