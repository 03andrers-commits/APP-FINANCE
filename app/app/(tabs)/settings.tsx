/**
 * Tela de configurações do app
 */

import React, { useState } from 'react';
import { ScrollView, Text, View, Pressable, Alert, ActivityIndicator, TextInput, Modal } from 'react-native';
import { ScreenContainer } from '@/components/screen-container';
import { useFinance } from '@/lib/finance-context';
import * as storage from '@/lib/storage';
import * as backup from '@/lib/backup-service';
import * as FileSystem from 'expo-file-system/legacy';
import * as DocumentPicker from 'expo-document-picker';
import * as Sharing from 'expo-sharing';

const COLORS = ['#0066CC', '#FF69B4', '#FFB347', '#4CAF50', '#FF6B6B', '#9C27B0', '#00BCD4', '#FFC107'];

export default function SettingsScreen() {
  const { members, cards, transactions, refreshData } = useFinance();
  const [showDangerZone, setShowDangerZone] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const [showAddMember, setShowAddMember] = useState(false);
  const [newMemberName, setNewMemberName] = useState('');
  const [selectedColor, setSelectedColor] = useState(COLORS[0]);

  const handleExportData = async () => {
    try {
      setIsExporting(true);
      const backupData = await backup.exportData();
      const jsonString = backup.backupToJSON(backupData);
      const filename = backup.generateBackupFilename();
      const fileUri = FileSystem.documentDirectory + filename;

      await FileSystem.writeAsStringAsync(fileUri, jsonString);

      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(fileUri, {
          mimeType: 'application/json',
          dialogTitle: 'Exportar Backup',
        });
      } else {
        Alert.alert('Sucesso', `Backup salvo como: ${filename}`);
      }
    } catch (error) {
      console.error('Erro ao exportar:', error);
      Alert.alert('Erro', 'Falha ao exportar dados');
    } finally {
      setIsExporting(false);
    }
  };

  const handleImportData = async () => {
    try {
      setIsImporting(true);
      const result = await DocumentPicker.getDocumentAsync({
        type: 'application/json',
      });

      if (result.canceled) {
        setIsImporting(false);
        return;
      }

      const fileUri = result.assets[0].uri;
      const jsonString = await FileSystem.readAsStringAsync(fileUri);

      const backupData = backup.jsonToBackup(jsonString);
      const stats = backup.getBackupStats(backupData);

      Alert.alert(
        'Confirmar Importação',
        `Cartões: ${stats.totalCards}\nCompras: ${stats.totalTransactions}\nTotal gasto: R$ ${(stats.totalSpent / 100).toFixed(2)}\n\nDeseja importar estes dados?`,
        [
          { text: 'Cancelar', onPress: () => {} },
          {
            text: 'Importar',
            onPress: async () => {
              try {
                await backup.importData(backupData);
                await refreshData();
                Alert.alert('Sucesso', 'Dados importados com sucesso');
              } catch (error) {
                Alert.alert('Erro', 'Falha ao importar dados');
              }
            },
          },
        ]
      );
    } catch (error) {
      console.error('Erro ao importar:', error);
      Alert.alert('Erro', 'Arquivo inválido ou falha ao importar');
    } finally {
      setIsImporting(false);
    }
  };

  const handleAddMember = async () => {
    if (!newMemberName.trim()) {
      Alert.alert('Erro', 'Digite o nome do membro');
      return;
    }

    try {
      const newMember = {
        id: storage.generateMemberId(),
        name: newMemberName.trim(),
        color: selectedColor,
      };

      await storage.addMember(newMember);
      await refreshData();
      setNewMemberName('');
      setSelectedColor(COLORS[0]);
      setShowAddMember(false);
      Alert.alert('Sucesso', `${newMember.name} foi adicionado à família`);
    } catch (error) {
      console.error('Erro ao adicionar membro:', error);
      Alert.alert('Erro', 'Falha ao adicionar membro');
    }
  };

  const handleRemoveMember = (memberId: string, memberName: string) => {
    if (memberId === 'user') {
      Alert.alert('Erro', 'Não é possível remover você mesmo');
      return;
    }

    Alert.alert(
      'Remover Membro',
      `Tem certeza que deseja remover ${memberName}? Todas as compras associadas também serão removidas.`,
      [
        { text: 'Cancelar', onPress: () => {} },
        {
          text: 'Remover',
          onPress: async () => {
            try {
              await storage.removeMember(memberId);
              await refreshData();
              Alert.alert('Sucesso', `${memberName} foi removido da família`);
            } catch (error) {
              console.error('Erro ao remover membro:', error);
              Alert.alert('Erro', 'Falha ao remover membro');
            }
          },
          style: 'destructive',
        },
      ]
    );
  };

  const handleClearAllData = () => {
    Alert.alert(
      'Limpar Todos os Dados',
      'Esta ação não pode ser desfeita. Todos os cartões, compras e configurações serão deletados.',
      [
        { text: 'Cancelar', onPress: () => {} },
        {
          text: 'Limpar',
          onPress: async () => {
            try {
              await storage.clearAllData();
              await refreshData();
              Alert.alert('Sucesso', 'Todos os dados foram limpos');
            } catch (error) {
              Alert.alert('Erro', 'Falha ao limpar dados');
            }
          },
          style: 'destructive',
        },
      ]
    );
  };

  return (
    <ScreenContainer className="p-0">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        {/* Cabeçalho */}
        <View className="bg-primary px-6 py-6">
          <Text className="text-white text-2xl font-bold">Configurações</Text>
        </View>

        {/* Conteúdo */}
        <View className="px-6 py-6">
          {/* Resumo de dados */}
          <View className="bg-surface rounded-lg p-4 mb-6">
            <Text className="text-foreground font-bold text-lg mb-4">
              Resumo de Dados
            </Text>
            <View className="flex-row justify-between mb-3">
              <Text className="text-muted">Cartões</Text>
              <Text className="text-foreground font-semibold">{cards.length}</Text>
            </View>
            <View className="flex-row justify-between mb-3">
              <Text className="text-muted">Compras</Text>
              <Text className="text-foreground font-semibold">
                {transactions.length}
              </Text>
            </View>
            <View className="flex-row justify-between">
              <Text className="text-muted">Membros da Família</Text>
              <Text className="text-foreground font-semibold">
                {members.length}
              </Text>
            </View>
          </View>

          {/* Gerenciar Membros */}
          <View className="mb-6">
            <View className="flex-row justify-between items-center mb-3">
              <Text className="text-foreground font-bold text-lg">
                Membros da Família
              </Text>
              <Pressable
                onPress={() => setShowAddMember(true)}
                className="bg-primary rounded-lg px-3 py-2 active:opacity-80"
              >
                <Text className="text-white font-semibold text-sm">+ Adicionar</Text>
              </Pressable>
            </View>

            <View className="bg-surface rounded-lg overflow-hidden">
              {members.map((member, index) => (
                <View
                  key={member.id}
                  className={`p-4 flex-row items-center justify-between gap-3 ${
                    index !== members.length - 1 ? 'border-b border-border' : ''
                  }`}
                >
                  <View className="flex-row items-center gap-3 flex-1">
                    <View
                      className="w-4 h-4 rounded-full"
                      style={{ backgroundColor: member.color }}
                    />
                    <Text className="text-foreground font-semibold flex-1">
                      {member.name}
                    </Text>
                  </View>

                  {member.id !== 'user' && (
                    <Pressable
                      onPress={() => handleRemoveMember(member.id, member.name)}
                      className="bg-error bg-opacity-10 rounded px-3 py-1 active:opacity-80"
                    >
                      <Text className="text-error text-xs font-semibold">Remover</Text>
                    </Pressable>
                  )}
                </View>
              ))}
            </View>
          </View>

          {/* Backup e Restauração */}
          <View className="mb-6">
            <Text className="text-foreground font-bold text-lg mb-3">
              Backup e Restauração
            </Text>
            <View className="gap-3">
              <Pressable
                onPress={handleExportData}
                disabled={isExporting}
                className="bg-primary rounded-lg py-3 items-center active:opacity-80 disabled:opacity-50 flex-row justify-center gap-2"
              >
                {isExporting ? (
                  <ActivityIndicator color="white" />
                ) : (
                  <Text className="text-white font-semibold">Exportar Dados</Text>
                )}
              </Pressable>
              <Pressable
                onPress={handleImportData}
                disabled={isImporting}
                className="bg-primary rounded-lg py-3 items-center active:opacity-80 disabled:opacity-50 flex-row justify-center gap-2"
              >
                {isImporting ? (
                  <ActivityIndicator color="white" />
                ) : (
                  <Text className="text-white font-semibold">Importar Dados</Text>
                )}
              </Pressable>
              <Text className="text-muted text-xs text-center mt-2">
                Exporte seus dados para fazer backup no MEGA. Importe para restaurar dados de um backup anterior.
              </Text>
            </View>
          </View>

          {/* Informações do app */}
          <View className="mb-6">
            <Text className="text-foreground font-bold text-lg mb-3">
              Sobre o App
            </Text>
            <View className="bg-surface rounded-lg p-4">
              <View className="flex-row justify-between mb-3">
                <Text className="text-muted">Versão</Text>
                <Text className="text-foreground font-semibold">1.47</Text>
              </View>
              <View className="flex-row justify-between">
                <Text className="text-muted">Desenvolvido por</Text>
                <Text className="text-foreground font-semibold">Manus</Text>
              </View>
            </View>
          </View>

          {/* Zona de perigo */}
          <View className="mb-6">
            <Pressable
              onPress={() => setShowDangerZone(!showDangerZone)}
              className="bg-error bg-opacity-10 border border-error rounded-lg p-4 mb-3 active:opacity-80"
            >
              <Text className="text-error font-semibold">
                {showDangerZone ? 'Zona de Perigo' : 'Zona de Perigo'}
              </Text>
            </Pressable>

            {showDangerZone && (
              <View className="bg-error bg-opacity-10 border border-error rounded-lg p-4">
                <Text className="text-error text-sm mb-4">
                  Estas ações não podem ser desfeitas. Use com cuidado.
                </Text>
                <Pressable
                  onPress={handleClearAllData}
                  className="bg-error rounded-lg py-3 items-center active:opacity-80"
                >
                  <Text className="text-white font-semibold">
                    Limpar Todos os Dados
                  </Text>
                </Pressable>
              </View>
            )}
          </View>

          {/* Footer */}
          <View className="items-center py-6">
            <Text className="text-muted text-xs text-center">
              Controle Financeiro Familiar v1.47
            </Text>
            <Text className="text-muted text-xs text-center mt-2">
              Desenvolvido para gerenciar suas finanças
            </Text>
          </View>
        </View>
      </ScrollView>

      {/* Modal para adicionar novo membro */}
      <Modal
        visible={showAddMember}
        transparent
        animationType="fade"
        onRequestClose={() => setShowAddMember(false)}
      >
        <View className="flex-1 bg-black bg-opacity-50 justify-center items-center p-4">
          <View className="bg-background rounded-lg p-6 w-full max-w-sm">
            <Text className="text-foreground text-xl font-bold mb-4">
              Adicionar Novo Membro
            </Text>

            {/* Input de nome */}
            <TextInput
              placeholder="Nome do membro"
              placeholderTextColor="#999"
              value={newMemberName}
              onChangeText={setNewMemberName}
              className="bg-surface border border-border rounded-lg px-4 py-3 mb-4 text-foreground"
            />

            {/* Seleção de cor */}
            <Text className="text-foreground font-semibold mb-2">Escolha uma cor:</Text>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 24 }}>
              {COLORS.map((color) => (
                <Pressable
                  key={color}
                  onPress={() => setSelectedColor(color)}
                  style={{
                    width: 48,
                    height: 48,
                    borderRadius: 8,
                    backgroundColor: color,
                    borderWidth: 2,
                    borderColor: selectedColor === color ? '#ECEDEE' : 'transparent',
                  }}
                />
              ))}
            </View>

            {/* Botões */}
            <View className="flex-row gap-3">
              <Pressable
                onPress={() => {
                  setShowAddMember(false);
                  setNewMemberName('');
                  setSelectedColor(COLORS[0]);
                }}
                className="flex-1 bg-muted rounded-lg py-3 items-center active:opacity-80"
              >
                <Text className="text-foreground font-semibold">Cancelar</Text>
              </Pressable>
              <Pressable
                onPress={handleAddMember}
                className="flex-1 bg-primary rounded-lg py-3 items-center active:opacity-80"
              >
                <Text className="text-white font-semibold">Adicionar</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </ScreenContainer>
  );
}
