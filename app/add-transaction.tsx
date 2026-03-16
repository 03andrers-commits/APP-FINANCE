/**
 * Tela para adicionar uma nova transação/compra
 */

import React, { useState } from 'react';
import { ScrollView, Text, View, TextInput, Pressable, Alert } from 'react-native';
import { ScreenContainer } from '@/components/screen-container';
import { DatePickerModal } from '@/components/date-picker-modal';
import { useFinance } from '@/lib/finance-context';
import { generateId, getCategoryName, getCategoryIcon } from '@/lib/calculations';
import { Transaction, TransactionCategory, FamilyMember } from '@/lib/types';
import { router } from 'expo-router';
import * as installmentService from '@/lib/installment-service';

const CATEGORIES: { label: string; value: TransactionCategory; icon: string }[] = [
  { label: 'Alimentação', value: 'food', icon: '🍔' },
  { label: 'Transporte', value: 'transport', icon: '🚗' },
  { label: 'Saúde', value: 'health', icon: '🏥' },
  { label: 'Entretenimento', value: 'entertainment', icon: '🎬' },
  { label: 'Compras', value: 'shopping', icon: '🛍️' },
  { label: 'Utilidades', value: 'utilities', icon: '💡' },
  { label: 'Outros', value: 'other', icon: '📌' },
];

export default function AddTransactionScreen() {
  const { addTransaction, members, cards } = useFinance();
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<TransactionCategory>('shopping');
  const [memberId, setMemberId] = useState<FamilyMember>('user');
  const [cardId, setCardId] = useState(cards[0]?.id || '');
  const [isLoading, setIsLoading] = useState(false);
  const [installments, setInstallments] = useState(1);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);

  const handleAddTransaction = async () => {
    if (!amount.trim() || isNaN(parseFloat(amount))) {
      Alert.alert('Erro', 'Digite um valor válido');
      return;
    }

    if (!description.trim()) {
      Alert.alert('Erro', 'Digite uma descrição para a compra');
      return;
    }

    if (!cardId) {
      Alert.alert('Erro', 'Selecione um cartão');
      return;
    }

    try {
      setIsLoading(true);
      const baseTransaction: Transaction = {
        id: generateId(),
        cardId,
        memberId,
        amount: Math.round(parseFloat(amount) * 100),
        description: description.trim(),
        category,
        date: selectedDate.getTime(),
        createdAt: Date.now(),
      };

      if (installments > 1) {
        const transactions = installmentService.generateInstallmentTransactions(
          baseTransaction,
          installments,
          selectedDate.getTime()
        );

        for (const transaction of transactions) {
          await addTransaction(transaction);
        }
      } else {
        await addTransaction(baseTransaction);
      }

      Alert.alert(
        'Sucesso',
        installments > 1
          ? `Compra parcelada em ${installments}x registrada!`
          : 'Compra registrada com sucesso!'
      );
      router.back();
    } catch (error) {
      Alert.alert('Erro', 'Falha ao registrar compra');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ScreenContainer className="p-0">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        {/* Cabeçalho */}
        <View className="bg-primary px-6 py-6">
          <Pressable onPress={() => router.back()} className="mb-4">
            <Text className="text-white text-base">← Voltar</Text>
          </Pressable>
          <Text className="text-white text-2xl font-bold">Nova Compra</Text>
        </View>

        {/* Formulário */}
        <View className="px-6 py-6 flex-1">
          {/* Valor */}
          <View className="mb-6">
            <Text className="text-foreground font-semibold mb-2">
              Valor (R$)
            </Text>
            <TextInput
              placeholder="0.00"
              value={amount}
              onChangeText={setAmount}
              keyboardType="decimal-pad"
              className="border border-border rounded-lg px-4 py-3 text-foreground text-lg"
              placeholderTextColor="#999"
            />
          </View>

          {/* Descrição */}
          <View className="mb-6">
            <Text className="text-foreground font-semibold mb-2">
              Descrição
            </Text>
            <TextInput
              placeholder="Ex: Supermercado, Gasolina, Restaurante"
              value={description}
              onChangeText={setDescription}
              className="border border-border rounded-lg px-4 py-3 text-foreground"
              placeholderTextColor="#999"
            />
          </View>

          {/* Membro da família */}
          <View className="mb-6">
            <Text className="text-foreground font-semibold mb-2">
              Quem fez a compra?
            </Text>
            <View className="flex-row gap-2">
              {members.map(member => (
                <Pressable
                  key={member.id}
                  onPress={() => setMemberId(member.id as FamilyMember)}
                  className={`flex-1 px-3 py-2 rounded-lg border ${
                    memberId === member.id
                      ? 'bg-primary border-primary'
                      : 'bg-surface border-border'
                  }`}
                >
                  <Text
                    className={`font-semibold text-center ${
                      memberId === member.id ? 'text-white' : 'text-foreground'
                    }`}
                  >
                    {member.name}
                  </Text>
                </Pressable>
              ))}
            </View>
          </View>

          {/* Cartão */}
          <View className="mb-6">
            <Text className="text-foreground font-semibold mb-2">
              Cartão
            </Text>
            <View className="border border-border rounded-lg overflow-hidden">
              {cards.length === 0 ? (
                <View className="px-4 py-3 bg-surface">
                  <Text className="text-muted">Nenhum cartão cadastrado</Text>
                </View>
              ) : (
                cards.map(card => (
                  <Pressable
                    key={card.id}
                    onPress={() => setCardId(card.id)}
                    className={`px-4 py-3 border-b border-border last:border-b-0 ${
                      cardId === card.id ? 'bg-primary' : 'bg-surface'
                    }`}
                  >
                    <Text
                      className={`font-semibold ${
                        cardId === card.id ? 'text-white' : 'text-foreground'
                      }`}
                    >
                      {card.name} (•••• {card.lastFourDigits})
                    </Text>
                  </Pressable>
                ))
              )}
            </View>
          </View>

          {/* Categoria */}
          <View className="mb-6">
            <Text className="text-foreground font-semibold mb-2">
              Categoria
            </Text>
            <View className="flex-row flex-wrap gap-2">
              {CATEGORIES.map(cat => (
                <Pressable
                  key={cat.value}
                  onPress={() => setCategory(cat.value)}
                  className={`px-3 py-2 rounded-lg border ${
                    category === cat.value
                      ? 'bg-primary border-primary'
                      : 'bg-surface border-border'
                  }`}
                >
                  <Text
                    className={`font-semibold text-sm ${
                      category === cat.value ? 'text-white' : 'text-foreground'
                    }`}
                  >
                    {cat.icon} {cat.label}
                  </Text>
                </Pressable>
              ))}
            </View>
          </View>

          {/* Data da Compra */}
          <View className="mb-6">
            <Text className="text-foreground font-semibold mb-2">
              Data da Compra
            </Text>
            <Pressable
              onPress={() => setShowDatePicker(true)}
              className="border border-border rounded-lg px-4 py-3 bg-surface"
            >
              <Text className="text-foreground font-medium">
                {selectedDate.toLocaleDateString('pt-BR', {
                  weekday: 'short',
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric',
                })}
              </Text>
            </Pressable>
          </View>

          {/* Parcelamento */}
          <View className="mb-6">
            <Text className="text-foreground font-semibold mb-2">
              Parcelamento
            </Text>
            <Text className="text-muted text-sm mb-3">
              Dividir em quantas vezes?
            </Text>
            <View className="flex-row gap-2 flex-wrap">
              {[1, 2, 3, 4, 5, 6, 9, 12].map(num => (
                <Pressable
                  key={num}
                  onPress={() => setInstallments(num)}
                  className={`px-4 py-2 rounded-lg border ${
                    installments === num
                      ? 'bg-primary border-primary'
                      : 'bg-surface border-border'
                  }`}
                >
                  <Text
                    className={`font-semibold ${
                      installments === num ? 'text-white' : 'text-foreground'
                    }`}
                  >
                    {num}x
                  </Text>
                </Pressable>
              ))}
            </View>

            {installments > 1 && (
              <View className="mt-4 bg-surface rounded-lg p-4">
                <Text className="text-foreground text-sm font-semibold mb-2">
                  Valor da parcela: R$ {(parseInt(amount || '0') / installments).toFixed(2)}
                </Text>
                <Text className="text-muted text-xs mt-1">
                  Primeira parcela em {selectedDate.toLocaleDateString('pt-BR', {
                    month: 'long',
                    year: 'numeric',
                  })}
                </Text>
              </View>
            )}
          </View>

          {/* Botões */}
          <View className="flex-row gap-3 mt-8">
            <Pressable
              onPress={() => router.back()}
              className="flex-1 border border-border rounded-lg py-3 items-center active:opacity-80"
            >
              <Text className="text-foreground font-semibold">Cancelar</Text>
            </Pressable>

            <Pressable
              onPress={handleAddTransaction}
              disabled={isLoading || cards.length === 0}
              className="flex-1 bg-primary rounded-lg py-3 items-center active:opacity-80"
            >
              <Text className="text-white font-semibold">
                {isLoading ? 'Registrando...' : 'Registrar'}
              </Text>
            </Pressable>
          </View>
        </View>
      </ScrollView>

      {/* Date Picker Modal */}
      <DatePickerModal
        visible={showDatePicker}
        selectedDate={selectedDate}
        onDateChange={setSelectedDate}
        onClose={() => setShowDatePicker(false)}
      />
    </ScreenContainer>
  );
}
