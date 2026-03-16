/**
 * Tela de detalhes de um cartão específico
 */

import React, { useState, useCallback } from 'react';
import { ScrollView, Text, View, TouchableOpacity, FlatList, Alert, ImageBackground } from 'react-native';
import { useFocusEffect, useLocalSearchParams } from 'expo-router';
import { ScreenContainer } from '@/components/screen-container';
import { useFinance } from '@/lib/finance-context';
import { formatCurrency, formatDate, getCategoryIcon, getCategoryName } from '@/lib/calculations';
import { router } from 'expo-router';

export default function CardDetailsScreen() {
  const { cardId } = useLocalSearchParams<{ cardId: string }>();
  const { cards, transactions, members, deleteCard, deleteTransaction, refreshData } = useFinance();
  const [isLoading, setIsLoading] = useState(false);

  const card = cards.find(c => c.id === cardId);
  const cardTransactions = transactions
    .filter(t => t.cardId === cardId)
    .sort((a, b) => b.date - a.date);

  useFocusEffect(
    useCallback(() => {
      refreshData();
    }, [refreshData])
  );

  if (!card) {
    return (
      <ScreenContainer className="items-center justify-center">
        <Text className="text-foreground">Cartão não encontrado</Text>
      </ScreenContainer>
    );
  }

  const totalSpent = cardTransactions.reduce((sum, t) => sum + t.amount, 0);
  const availableLimit = card.limit - totalSpent;
  const usagePercentage = (totalSpent / card.limit) * 100;

  const handleDeleteCard = () => {
    Alert.alert(
      'Deletar Cartão',
      'Tem certeza que deseja deletar este cartão? Todas as transações associadas também serão removidas.',
      [
        { text: 'Cancelar', onPress: () => {} },
        {
          text: 'Deletar',
          onPress: async () => {
            try {
              setIsLoading(true);
              await deleteCard(card.id);
              Alert.alert('Sucesso', 'Cartão deletado com sucesso!');
              router.back();
            } catch (error) {
              Alert.alert('Erro', 'Falha ao deletar cartão');
            } finally {
              setIsLoading(false);
            }
          },
          style: 'destructive',
        },
      ]
    );
  };

  const handleDeleteTransaction = (transactionId: string) => {
    Alert.alert(
      'Deletar Transação',
      'Tem certeza que deseja deletar esta transação?',
      [
        { text: 'Cancelar', onPress: () => {} },
        {
          text: 'Deletar',
          onPress: async () => {
            try {
              await deleteTransaction(transactionId);
              Alert.alert('Sucesso', 'Transação deletada com sucesso!');
            } catch (error) {
              Alert.alert('Erro', 'Falha ao deletar transação');
            }
          },
          style: 'destructive',
        },
      ]
    );
  };

  const getBrandColor = (brand: string) => {
    const colors: Record<string, string> = {
      visa: '#1A1F71',
      mastercard: '#FF5F00',
      elo: '#624B9E',
      amex: '#006FCF',
      other: '#6B7280',
    };
    return colors[brand] || colors.other;
  };

  const getStatusColor = () => {
    if (usagePercentage >= 90) return 'text-error';
    if (usagePercentage >= 70) return 'text-warning';
    return 'text-success';
  };

  const cardContent = (
    <View className="rounded-2xl p-6 flex-1" style={{ backgroundColor: 'rgba(0, 0, 0, 0.3)' }}>
      <View className="flex-row justify-between items-start mb-8">
        <View>
          <Text className="text-white text-sm opacity-75 mb-1">
            {card.name}
          </Text>
          <Text className="text-white text-xs opacity-60">
            •••• {card.lastFourDigits}
          </Text>
        </View>
        <Text className="text-white text-xs opacity-60">
          Vence: {card.dueDate}
        </Text>
      </View>

      <View className="mb-6">
        <View className="flex-row justify-between items-center mb-2">
          <Text className="text-white text-sm opacity-75">Limite</Text>
          <Text className="text-white text-sm font-semibold">
            {formatCurrency(availableLimit)} de {formatCurrency(card.limit)}
          </Text>
        </View>
        <View className="h-2 bg-white opacity-20 rounded-full overflow-hidden">
          <View
            className={`h-full rounded-full ${getStatusColor()}`}
            style={{ width: `${Math.min(usagePercentage, 100)}%` }}
          />
        </View>
      </View>

      <View className="flex-row justify-between items-center">
        <Text className="text-white text-xs opacity-60">
          Gasto: {formatCurrency(totalSpent)}
        </Text>
        <Text className={`text-white text-sm font-semibold ${getStatusColor()}`}>
          {usagePercentage.toFixed(0)}%
        </Text>
      </View>
    </View>
  );

  return (
    <ScreenContainer className="p-0">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        {/* Cabeçalho */}
        <View className="bg-primary px-6 py-6">
          <TouchableOpacity onPress={() => router.back()} activeOpacity={0.8} className="mb-4">
            <Text className="text-white text-base">← Voltar</Text>
          </TouchableOpacity>
          <Text className="text-white text-2xl font-bold">Detalhes do Cartão</Text>
        </View>

        {/* Card visual */}
        <View className="px-6 py-6">
          {card.photo ? (
            <ImageBackground
              source={{ uri: card.photo }}
              style={{ borderRadius: 16, overflow: 'hidden', minHeight: 220 }}
              className="mb-6 shadow-sm"
            >
              {cardContent}
            </ImageBackground>
          ) : (
            <View
              className="rounded-2xl p-6 mb-6"
              style={{ backgroundColor: getBrandColor(card.brand), minHeight: 220 }}
            >
              {cardContent}
            </View>
          )}

          {/* Botões de ação */}
          <View className="flex-row gap-3 mb-6">
            <TouchableOpacity
              onPress={() => router.push({
                pathname: '/add-transaction',
                params: { cardId: card.id }
              })}
              activeOpacity={0.8}
              style={{ flex: 1 }}
            >
              <View className="bg-primary rounded-lg py-3 items-center">
                <Text className="text-white font-semibold">+ Compra</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={handleDeleteCard}
              disabled={isLoading}
              activeOpacity={0.8}
              style={{ flex: 1 }}
            >
              <View className="bg-error rounded-lg py-3 items-center">
                <Text className="text-white font-semibold">
                  {isLoading ? 'Deletando...' : 'Deletar'}
                </Text>
              </View>
            </TouchableOpacity>
          </View>

          {/* Transações */}
          <View>
            <Text className="text-foreground text-lg font-bold mb-4">
              Transações ({cardTransactions.length})
            </Text>

            {cardTransactions.length === 0 ? (
              <View className="bg-surface rounded-lg p-4 items-center">
                <Text className="text-muted">Nenhuma transação registrada</Text>
              </View>
            ) : (
              <FlatList
                data={cardTransactions}
                keyExtractor={item => item.id}
                scrollEnabled={false}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    onPress={() => handleDeleteTransaction(item.id)}
                    activeOpacity={0.7}
                  >
                    <View className="bg-surface rounded-lg p-4 mb-3 flex-row justify-between items-center">
                      <View className="flex-1">
                        <Text className="text-foreground font-semibold">
                          {item.description}
                        </Text>
                        <Text className="text-muted text-sm">
                          {getCategoryName(item.category)} • {formatDate(item.date)}
                        </Text>
                        <Text className="text-muted text-xs mt-1">
                          {members.find(m => m.id === item.memberId)?.name || 'Desconhecido'}
                        </Text>
                      </View>
                      <Text className="text-foreground font-bold">
                        {formatCurrency(item.amount)}
                      </Text>
                    </View>
                  </TouchableOpacity>
                )}
              />
            )}
          </View>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
