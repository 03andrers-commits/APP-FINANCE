/**
 * Tela para adicionar um novo cartão
 */

import React, { useState } from 'react';
import { ScrollView, Text, View, TextInput, Pressable, Alert, TouchableOpacity, Image } from 'react-native';
import { ScreenContainer } from '@/components/screen-container';
import { useFinance } from '@/lib/finance-context';
import { generateId } from '@/lib/calculations';
import { Card } from '@/lib/types';
import { router } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';

type CardBrand = 'visa' | 'mastercard' | 'elo' | 'amex' | 'other';

const BRANDS: { label: string; value: CardBrand }[] = [
  { label: 'Visa', value: 'visa' },
  { label: 'Mastercard', value: 'mastercard' },
  { label: 'Elo', value: 'elo' },
  { label: 'American Express', value: 'amex' },
  { label: 'Outro', value: 'other' },
];

export default function AddCardScreen() {
  const { addCard } = useFinance();
  const [name, setName] = useState('');
  const [brand, setBrand] = useState<CardBrand>('visa');
  const [limit, setLimit] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [lastFourDigits, setLastFourDigits] = useState('');
  const [cardPhoto, setCardPhoto] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handlePickImage = async (useCamera: boolean) => {
    try {
      let result;

      if (useCamera) {
        const permission = await ImagePicker.requestCameraPermissionsAsync();
        if (!permission.granted) {
          Alert.alert('Permissão negada', 'Precisamos de acesso à câmera');
          return;
        }

        result = await ImagePicker.launchCameraAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
          allowsEditing: true,
          aspect: [16, 10],
          quality: 0.8,
          base64: true,
        });
      } else {
        const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (!permission.granted) {
          Alert.alert('Permissão negada', 'Precisamos de acesso à galeria');
          return;
        }

        result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
          allowsEditing: true,
          aspect: [16, 10],
          quality: 0.8,
          base64: true,
        });
      }

      if (!result.canceled && result.assets[0].base64) {
        setCardPhoto(`data:image/jpeg;base64,${result.assets[0].base64}`);
      }
    } catch (error) {
      Alert.alert('Erro', 'Falha ao selecionar imagem');
      console.error(error);
    }
  };

  const handleAddCard = async () => {
    if (!name.trim()) {
      Alert.alert('Erro', 'Digite o nome do cartão');
      return;
    }

    if (!limit.trim() || isNaN(parseFloat(limit))) {
      Alert.alert('Erro', 'Digite um limite válido');
      return;
    }

    if (!dueDate.trim() || isNaN(parseInt(dueDate))) {
      Alert.alert('Erro', 'Digite um dia de vencimento válido (1-31)');
      return;
    }

    const dueDateNum = parseInt(dueDate);
    if (dueDateNum < 1 || dueDateNum > 31) {
      Alert.alert('Erro', 'Dia de vencimento deve estar entre 1 e 31');
      return;
    }

    try {
      setIsLoading(true);

      const newCard: Card = {
        id: generateId(),
        name: name.trim(),
        brand,
        limit: Math.round(parseFloat(limit) * 100), // Converter para centavos
        dueDate: dueDateNum,
        lastFourDigits: lastFourDigits.trim() || '****',
        photo: cardPhoto || undefined,
        createdAt: Date.now(),
      };

      await addCard(newCard);
      Alert.alert('Sucesso', 'Cartão adicionado com sucesso!');
      router.back();
    } catch (error) {
      Alert.alert('Erro', 'Falha ao adicionar cartão');
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
          <TouchableOpacity onPress={() => router.back()} activeOpacity={0.8}>
            <Text className="text-white text-base mb-4">← Voltar</Text>
          </TouchableOpacity>
          <Text className="text-white text-2xl font-bold">Adicionar Cartão</Text>
        </View>

        {/* Formulário */}
        <View className="px-6 py-6 flex-1">
          {/* Nome do cartão */}
          <View className="mb-6">
            <Text className="text-foreground font-semibold mb-2">
              Nome do Cartão
            </Text>
            <TextInput
              placeholder="Ex: Nubank, Bradesco Black"
              value={name}
              onChangeText={setName}
              className="border border-border rounded-lg px-4 py-3 text-foreground"
              placeholderTextColor="#999"
            />
          </View>

          {/* Bandeira */}
          <View className="mb-6">
            <Text className="text-foreground font-semibold mb-2">
              Bandeira
            </Text>
            <View className="flex-row flex-wrap gap-2">
              {BRANDS.map(b => (
                <TouchableOpacity
                  key={b.value}
                  onPress={() => setBrand(b.value)}
                  activeOpacity={0.8}
                >
                  <View className={`px-4 py-2 rounded-lg border ${
                    brand === b.value
                      ? 'bg-primary border-primary'
                      : 'bg-surface border-border'
                  }`}>
                    <Text
                      className={`font-semibold ${
                        brand === b.value ? 'text-white' : 'text-foreground'
                      }`}
                    >
                      {b.label}
                    </Text>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Limite */}
          <View className="mb-6">
            <Text className="text-foreground font-semibold mb-2">
              Limite de Crédito (R$)
            </Text>
            <TextInput
              placeholder="Ex: 5000.00"
              value={limit}
              onChangeText={setLimit}
              keyboardType="decimal-pad"
              className="border border-border rounded-lg px-4 py-3 text-foreground"
              placeholderTextColor="#999"
            />
          </View>

          {/* Dia de vencimento */}
          <View className="mb-6">
            <Text className="text-foreground font-semibold mb-2">
              Dia de Vencimento (1-31)
            </Text>
            <TextInput
              placeholder="Ex: 10"
              value={dueDate}
              onChangeText={setDueDate}
              keyboardType="number-pad"
              maxLength={2}
              className="border border-border rounded-lg px-4 py-3 text-foreground"
              placeholderTextColor="#999"
            />
          </View>

          {/* Últimos 4 dígitos */}
          <View className="mb-6">
            <Text className="text-foreground font-semibold mb-2">
              Últimos 4 Dígitos
            </Text>
            <TextInput
              placeholder="Ex: 1234"
              value={lastFourDigits}
              onChangeText={setLastFourDigits}
              keyboardType="number-pad"
              maxLength={4}
              className="border border-border rounded-lg px-4 py-3 text-foreground"
              placeholderTextColor="#999"
            />
          </View>

          {/* Foto do Cartão */}
          <View className="mb-6">
            <Text className="text-foreground font-semibold mb-3">
              Foto do Cartão (Opcional)
            </Text>

            {cardPhoto && (
              <View className="mb-4 rounded-lg overflow-hidden bg-surface">
                <Image
                  source={{ uri: cardPhoto }}
                  style={{ width: '100%', height: 200 }}
                  resizeMode="cover"
                />
              </View>
            )}

            <View className="flex-row gap-2">
              <TouchableOpacity
                onPress={() => handlePickImage(true)}
                activeOpacity={0.8}
                style={{ flex: 1 }}
              >
                <View className="bg-surface rounded-lg py-3 items-center border border-border">
                  <Text className="text-foreground font-semibold">📷 Câmera</Text>
                </View>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => handlePickImage(false)}
                activeOpacity={0.8}
                style={{ flex: 1 }}
              >
                <View className="bg-surface rounded-lg py-3 items-center border border-border">
                  <Text className="text-foreground font-semibold">🖼️ Galeria</Text>
                </View>
              </TouchableOpacity>

              {cardPhoto && (
                <TouchableOpacity
                  onPress={() => setCardPhoto(null)}
                  activeOpacity={0.8}
                  style={{ flex: 1 }}
                >
                  <View className="bg-error rounded-lg py-3 items-center">
                    <Text className="text-white font-semibold">✕ Remover</Text>
                  </View>
                </TouchableOpacity>
              )}
            </View>
          </View>

          {/* Botões */}
          <View className="flex-row gap-3 mt-8">
            <TouchableOpacity
              onPress={() => router.back()}
              activeOpacity={0.8}
              style={{ flex: 1 }}
            >
              <View className="border border-border rounded-lg py-3 items-center">
                <Text className="text-foreground font-semibold">Cancelar</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={handleAddCard}
              disabled={isLoading}
              activeOpacity={0.8}
              style={{ flex: 1 }}
            >
              <View className="bg-primary rounded-lg py-3 items-center">
                <Text className="text-white font-semibold">
                  {isLoading ? 'Adicionando...' : 'Adicionar'}
                </Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
