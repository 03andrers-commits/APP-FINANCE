/**
 * Componente que exibe um cartão de crédito
 */

import React from 'react';
import { View, Text, TouchableOpacity, ImageBackground } from 'react-native';
import { Card } from '@/lib/types';
import { formatCurrency } from '@/lib/calculations';
import { cn } from '@/lib/utils';

interface CardItemProps {
  card: Card;
  totalSpent: number;
  onPress: () => void;
  onLongPress?: () => void;
}

export function CardItem({ card, totalSpent, onPress, onLongPress }: CardItemProps) {
  const availableLimit = card.limit - totalSpent;
  const usagePercentage = (totalSpent / card.limit) * 100;

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
    if (usagePercentage >= 90) return 'bg-error';
    if (usagePercentage >= 70) return 'bg-warning';
    return 'bg-success';
  };

  const cardContent = (
    <View className="rounded-2xl p-4 shadow-sm flex-1" style={{ backgroundColor: 'rgba(0, 0, 0, 0.3)' }}>
      {/* Cabeçalho do cartão */}
      <View className="flex-row justify-between items-start mb-4">
        <View>
          <Text className="text-white text-xs opacity-75 mb-1">
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

      {/* Limite Disponível e Total lado a lado */}
      <View className="flex-row gap-3 mb-4">
        <View className="flex-1 p-3 rounded-lg" style={{ backgroundColor: 'rgba(34, 197, 94, 0.2)' }}>
          <Text className="text-white text-xs opacity-75 mb-1">
            Disponível
          </Text>
          <Text className="text-success text-lg font-bold">
            {formatCurrency(availableLimit)}
          </Text>
        </View>
        <View className="flex-1 p-3 rounded-lg" style={{ backgroundColor: 'rgba(255, 255, 255, 0.1)' }}>
          <Text className="text-white text-xs opacity-75 mb-1">
            Total
          </Text>
          <Text className="text-white text-lg font-semibold">
            {formatCurrency(card.limit)}
          </Text>
        </View>
      </View>

      {/* Barra de progresso */}
      <View className="mb-3">
        <View className="h-1.5 bg-white opacity-20 rounded-full overflow-hidden">
          <View
            className={cn('h-full rounded-full', getStatusColor())}
            style={{ width: `${Math.min(usagePercentage, 100)}%` }}
          />
        </View>
      </View>

      {/* Gasto e Percentual */}
      <View className="flex-row justify-between items-center">
        <Text className="text-white text-xs opacity-60">
          Gasto: {formatCurrency(totalSpent)}
        </Text>
        <Text className="text-white text-sm font-semibold">
          {usagePercentage.toFixed(0)}%
        </Text>
      </View>
    </View>
  );

  return (
    <TouchableOpacity
      onPress={onPress}
      onLongPress={onLongPress}
      activeOpacity={0.8}
      className="mb-4"
    >
      {card.photo ? (
        <ImageBackground
          source={{ uri: card.photo }}
          style={{ borderRadius: 16, overflow: 'hidden', minHeight: 200 }}
          className="shadow-sm"
        >
          {cardContent}
        </ImageBackground>
      ) : (
        <View
          className="rounded-2xl p-6 shadow-sm"
          style={{ backgroundColor: getBrandColor(card.brand), minHeight: 200 }}
        >
          {cardContent}
        </View>
      )}
    </TouchableOpacity>
  );
}
