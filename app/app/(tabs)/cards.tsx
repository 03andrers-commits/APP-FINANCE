/**
 * Tela de listagem e gestão de cartões
 */

import React, { useState, useCallback } from 'react';
import { ScrollView, Text, View, Pressable, FlatList } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { ScreenContainer } from '@/components/screen-container';
import { CardItem } from '@/components/card-item';
import { useFinance } from '@/lib/finance-context';
import { formatCurrency } from '@/lib/calculations';
import { router } from 'expo-router';

export default function CardsScreen() {
  const { cards, transactions, isLoading, refreshData } = useFinance();
  const [selectedCardId, setSelectedCardId] = useState<string | null>(null);

  useFocusEffect(
    useCallback(() => {
      refreshData();
    }, [refreshData])
  );

  const getCardTotal = (cardId: string) => {
    return transactions
      .filter(t => t.cardId === cardId)
      .reduce((sum, t) => sum + t.amount, 0);
  };

  const getTotalSpent = () => {
    return transactions.reduce((sum, t) => sum + t.amount, 0);
  };

  const getTotalLimit = () => {
    return cards.reduce((sum, c) => sum + c.limit, 0);
  };

  const handleAddCard = () => {
    router.push('/add-card' as any);
  };

  const handleCardPress = (cardId: string) => {
    router.push({
      pathname: '/card-details' as any,
      params: { cardId },
    });
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
        {/* Cabeçalho com resumo */}
        <View className="bg-primary px-6 pt-6 pb-4">
          <Text className="text-white text-sm opacity-75 mb-1">
            Resumo de Cartões
          </Text>
          <View className="flex-row justify-between items-baseline mb-6">
            <View>
              <Text className="text-white text-3xl font-bold">
                {cards.length}
              </Text>
              <Text className="text-white text-xs opacity-60 mt-1">
                cartões ativos
              </Text>
            </View>
            <View className="items-end">
              <Text className="text-white text-sm opacity-75 mb-1">
                Limite Total
              </Text>
              <Text className="text-white text-xl font-semibold">
                {formatCurrency(getTotalLimit())}
              </Text>
            </View>
          </View>

          {/* Card branco com total disponível */}
          <View className="bg-white rounded-lg p-6 items-center justify-center">
            <Text className="text-primary text-xs opacity-75 mb-2">
              TOTAL DISPONÍVEL
            </Text>
            <Text className="text-primary text-4xl font-bold">
              {formatCurrency(getTotalLimit() - getTotalSpent())}
            </Text>
          </View>
        </View>

        {/* Lista de cartões */}
        <View className="px-6 pt-6 pb-6">
          {cards.length === 0 ? (
            <View className="items-center justify-center py-12">
              <Text className="text-muted text-center mb-4">
                Nenhum cartão cadastrado
              </Text>
              <Pressable
                onPress={handleAddCard}
                className="bg-primary px-6 py-3 rounded-full active:opacity-80"
              >
                <Text className="text-white font-semibold">
                  Adicionar Cartão
                </Text>
              </Pressable>
            </View>
          ) : (
            <View>
              <FlatList
                data={cards}
                keyExtractor={card => card.id}
                scrollEnabled={false}
                renderItem={({ item }) => (
                  <CardItem
                    card={item}
                    totalSpent={getCardTotal(item.id)}
                    onPress={() => handleCardPress(item.id)}
                  />
                )}
              />

              {/* Botão flutuante para adicionar cartão */}
              <Pressable
                onPress={handleAddCard}
                className="mt-6 bg-primary px-6 py-3 rounded-full items-center active:opacity-80"
              >
                <Text className="text-white font-semibold">
                  + Adicionar Cartão
                </Text>
              </Pressable>
            </View>
          )}
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
