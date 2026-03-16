/**
 * Tela de relatórios e análises financeiras\n */

import React, { useState, useCallback } from 'react';
import { ScrollView, Text, View, Pressable, FlatList } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { ScreenContainer } from '@/components/screen-container';
import { useFinance } from '@/lib/finance-context';
import {
  formatCurrency,
  calculateMonthlyReport,
  getMonthName,
  getPreviousMonth,
  getNextMonth,
  getCategoryIcon,
  getCategoryName,
} from '@/lib/calculations';

export default function ReportsScreen() {
  const { cards, transactions, members, isLoading, refreshData } = useFinance();
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());

  useFocusEffect(
    useCallback(() => {
      refreshData();
    }, [refreshData])
  );

  const monthlyReport = calculateMonthlyReport(currentMonth, currentYear, members, cards, transactions);

  const handlePreviousMonth = () => {
    const [month, year] = getPreviousMonth(currentMonth, currentYear);
    setCurrentMonth(month);
    setCurrentYear(year);
  };

  const handleNextMonth = () => {
    const [month, year] = getNextMonth(currentMonth, currentYear);
    setCurrentMonth(month);
    setCurrentYear(year);
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
        {/* Cabeçalho */}
        <View className="bg-primary px-6 py-6">
          <Text className="text-white text-sm opacity-75 mb-4">
            Relatórios Financeiros
          </Text>

          {/* Navegação de mês */}
          <View className="flex-row justify-between items-center mb-6">
            <Pressable onPress={handlePreviousMonth} className="p-2">
              <Text className="text-white text-xl">←</Text>
            </Pressable>
            <View className="items-center">
              <Text className="text-white text-2xl font-bold">
                {getMonthName(currentMonth)}
              </Text>
              <Text className="text-white text-sm opacity-75">
                {currentYear}
              </Text>
            </View>
            <Pressable onPress={handleNextMonth} className="p-2">
              <Text className="text-white text-xl">→</Text>
            </Pressable>
          </View>

          {/* Total gasto */}
          <View className="bg-white bg-opacity-10 rounded-lg p-4">
            <Text className="text-white text-sm opacity-75 mb-1">
              Total Gasto
            </Text>
            <Text className="text-white text-3xl font-bold">
              {formatCurrency(monthlyReport.totalSpent)}
            </Text>
          </View>
        </View>

        {/* Conteúdo */}
        <View className="px-6 py-6">
          {monthlyReport.totalSpent === 0 ? (
            <View className="bg-surface rounded-lg p-6 items-center">
              <Text className="text-muted text-center">
                Nenhuma transação neste período
              </Text>
            </View>
          ) : (
            <>
              {/* Gastos por membro */}
              {monthlyReport.byMember.length > 0 && (
                <View className="mb-8">
                  <Text className="text-foreground font-bold text-lg mb-4">
                    Gastos por Membro
                  </Text>
                  <View className="bg-surface rounded-lg overflow-hidden">
                    {monthlyReport.byMember.map((item, index) => (
                      <View
                        key={item.memberId}
                        className={`p-4 ${
                          index !== monthlyReport.byMember.length - 1
                            ? 'border-b border-border'
                            : ''
                        }`}
                      >
                        <View className="flex-row justify-between items-center mb-2">
                          <Text className="text-foreground font-semibold">
                            {item.memberName}
                          </Text>
                          <Text className="text-foreground font-bold">
                            {formatCurrency(item.amount)}
                          </Text>
                        </View>
                        <View className="flex-row justify-between items-center">
                          <View className="flex-1 h-2 bg-border rounded-full overflow-hidden mr-3">
                            <View
                              className="h-full bg-primary rounded-full"
                              style={{ width: `${item.percentage}%` }}
                            />
                          </View>
                          <Text className="text-muted text-sm">
                            {item.percentage.toFixed(1)}%
                          </Text>
                        </View>
                      </View>
                    ))}
                  </View>
                </View>
              )}

              {/* Gastos por categoria */}
              {monthlyReport.byCategory.length > 0 && (
                <View className="mb-8">
                  <Text className="text-foreground font-bold text-lg mb-4">
                    Gastos por Categoria
                  </Text>
                  <View className="bg-surface rounded-lg overflow-hidden">
                    {monthlyReport.byCategory.map((item, index) => (
                      <View
                        key={item.category}
                        className={`p-4 ${
                          index !== monthlyReport.byCategory.length - 1
                            ? 'border-b border-border'
                            : ''
                        }`}
                      >
                        <View className="flex-row justify-between items-center mb-2">
                          <View className="flex-row items-center gap-2 flex-1">
                            <Text className="text-xl">
                              {getCategoryIcon(item.category)}
                            </Text>
                            <Text className="text-foreground font-semibold flex-1">
                              {getCategoryName(item.category)}
                            </Text>
                          </View>
                          <Text className="text-foreground font-bold">
                            {formatCurrency(item.amount)}
                          </Text>
                        </View>
                        <View className="flex-row justify-between items-center">
                          <View className="flex-1 h-2 bg-border rounded-full overflow-hidden mr-3">
                            <View
                              className="h-full bg-success rounded-full"
                              style={{ width: `${item.percentage}%` }}
                            />
                          </View>
                          <Text className="text-muted text-sm">
                            {item.percentage.toFixed(1)}%
                          </Text>
                        </View>
                      </View>
                    ))}
                  </View>
                </View>
              )}

              {/* Gastos por cartão */}
              {monthlyReport.byCard.length > 0 && (
                <View className="mb-8">
                  <Text className="text-foreground font-bold text-lg mb-4">
                    Gastos por Cartão
                  </Text>
                  <View className="bg-surface rounded-lg overflow-hidden">
                    {monthlyReport.byCard.map((item, index) => (
                      <View
                        key={item.cardId}
                        className={`p-4 ${
                          index !== monthlyReport.byCard.length - 1
                            ? 'border-b border-border'
                            : ''
                        }`}
                      >
                        <View className="flex-row justify-between items-center mb-2">
                          <Text className="text-foreground font-semibold">
                            {item.cardName}
                          </Text>
                          <Text className="text-foreground font-bold">
                            {formatCurrency(item.amount)}
                          </Text>
                        </View>
                        <View className="flex-row justify-between items-center">
                          <View className="flex-1 h-2 bg-border rounded-full overflow-hidden mr-3">
                            <View
                              className="h-full bg-warning rounded-full"
                              style={{ width: `${item.percentage}%` }}
                            />
                          </View>
                          <Text className="text-muted text-sm">
                            {item.percentage.toFixed(1)}%
                          </Text>
                        </View>
                      </View>
                    ))}
                  </View>
                </View>
              )}
            </>
          )}
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
