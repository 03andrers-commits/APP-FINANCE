import React, { useState, useEffect } from 'react';
import { View, Text, Pressable, Modal, Platform } from 'react-native';
import { useColors } from '@/hooks/use-colors';

interface DatePickerModalProps {
  visible: boolean;
  selectedDate: Date;
  onDateChange: (date: Date) => void;
  onClose: () => void;
}

export function DatePickerModal({
  visible,
  selectedDate,
  onDateChange,
  onClose,
}: DatePickerModalProps) {
  const colors = useColors();
  const [internalDate, setInternalDate] = useState(selectedDate);

  useEffect(() => {
    if (visible) {
      setInternalDate(selectedDate);
    }
  }, [visible, selectedDate]);

  const handleQuickDate = (type: 'today' | 'yesterday' | 'thisMonth' | number) => {
    const date = new Date();
    
    if (type === 'today') {
      setInternalDate(date);
    } else if (type === 'yesterday') {
      date.setDate(date.getDate() - 1);
      setInternalDate(date);
    } else if (type === 'thisMonth') {
      date.setDate(1);
      setInternalDate(date);
    } else if (typeof type === 'number') {
      // Meses retroativos
      date.setMonth(date.getMonth() - type);
      date.setDate(1);
      setInternalDate(date);
    }
  };

  const handleConfirm = () => {
    onDateChange(internalDate);
    onClose();
  };

  const isDateSelected = (type: 'today' | 'yesterday' | 'thisMonth' | number): boolean => {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    const thisMonthStart = new Date(today.getFullYear(), today.getMonth(), 1);

    if (type === 'today') {
      return (
        internalDate.getDate() === today.getDate() &&
        internalDate.getMonth() === today.getMonth() &&
        internalDate.getFullYear() === today.getFullYear()
      );
    } else if (type === 'yesterday') {
      return (
        internalDate.getDate() === yesterday.getDate() &&
        internalDate.getMonth() === yesterday.getMonth() &&
        internalDate.getFullYear() === yesterday.getFullYear()
      );
    } else if (type === 'thisMonth') {
      return (
        internalDate.getDate() === 1 &&
        internalDate.getMonth() === thisMonthStart.getMonth() &&
        internalDate.getFullYear() === thisMonthStart.getFullYear()
      );
    } else if (typeof type === 'number') {
      const targetDate = new Date();
      targetDate.setMonth(targetDate.getMonth() - type);
      targetDate.setDate(1);
      return (
        internalDate.getDate() === 1 &&
        internalDate.getMonth() === targetDate.getMonth() &&
        internalDate.getFullYear() === targetDate.getFullYear()
      );
    }
    return false;
  };

  // Formatar data para input type="date"
  const formatDateForInput = (date: Date): string => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const handleDateInputChange = (dateString: string) => {
    const [year, month, day] = dateString.split('-');
    const date = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
    setInternalDate(date);
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View
        style={{
          flex: 1,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          justifyContent: 'flex-end',
        }}
      >
        <View
          style={{
            backgroundColor: colors.background,
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20,
            paddingHorizontal: 24,
            paddingTop: 24,
            paddingBottom: 32,
          }}
        >
          {/* Cabeçalho */}
          <View style={{ marginBottom: 24 }}>
            <Text
              style={{
                fontSize: 20,
                fontWeight: 'bold',
                color: colors.foreground,
                marginBottom: 8,
              }}
            >
              Quando foi a compra?
            </Text>
            <Text style={{ color: colors.muted, fontSize: 14 }}>
              Escolha uma data ou use as opções rápidas
            </Text>
          </View>

          {/* Opções Rápidas */}
          <View style={{ marginBottom: 24 }}>
            <Text
              style={{
                color: colors.foreground,
                fontWeight: '600',
                marginBottom: 12,
                fontSize: 12,
              }}
            >
              Mês da compra
            </Text>
            <View
              style={{
                flexDirection: 'row',
                flexWrap: 'wrap',
                gap: 8,
              }}
            >
              {/* Hoje */}
              <Pressable
                onPress={() => handleQuickDate('today')}
                style={{
                  paddingVertical: 10,
                  paddingHorizontal: 12,
                  borderRadius: 8,
                  borderWidth: 2,
                  borderColor: isDateSelected('today')
                    ? colors.primary
                    : colors.border,
                  backgroundColor: isDateSelected('today')
                    ? colors.primary
                    : colors.surface,
                }}
              >
                <Text
                  style={{
                    color: isDateSelected('today')
                      ? '#fff'
                      : colors.foreground,
                    fontSize: 12,
                    fontWeight: '600',
                  }}
                >
                  Hoje
                </Text>
              </Pressable>

              {/* Ontem */}
              <Pressable
                onPress={() => handleQuickDate('yesterday')}
                style={{
                  paddingVertical: 10,
                  paddingHorizontal: 12,
                  borderRadius: 8,
                  borderWidth: 2,
                  borderColor: isDateSelected('yesterday')
                    ? colors.primary
                    : colors.border,
                  backgroundColor: isDateSelected('yesterday')
                    ? colors.primary
                    : colors.surface,
                }}
              >
                <Text
                  style={{
                    color: isDateSelected('yesterday')
                      ? '#fff'
                      : colors.foreground,
                    fontSize: 12,
                    fontWeight: '600',
                  }}
                >
                  Ontem
                </Text>
              </Pressable>

              {/* Este Mês e 11 meses retroativos */}
              {['Este mês', ...Array.from({ length: 11 }, (_, i) => {
                const date = new Date();
                date.setMonth(date.getMonth() - (i + 1));
                return date.toLocaleDateString('pt-BR', { month: 'short', year: '2-digit' });
              })].map((label, index) => {
                const monthsBack = index === 0 ? 'thisMonth' : index;
                return (
                  <Pressable
                    key={label}
                    onPress={() => handleQuickDate(monthsBack)}
                    style={{
                      paddingVertical: 10,
                      paddingHorizontal: 12,
                      borderRadius: 8,
                      borderWidth: 2,
                      borderColor: isDateSelected(monthsBack)
                        ? colors.primary
                        : colors.border,
                      backgroundColor: isDateSelected(monthsBack)
                        ? colors.primary
                        : colors.surface,
                    }}
                  >
                    <Text
                      style={{
                        color: isDateSelected(monthsBack)
                          ? '#fff'
                          : colors.foreground,
                        fontSize: 12,
                        fontWeight: '600',
                      }}
                    >
                      {label}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          </View>

          {/* Input de Data (compatível com web) */}
          <View style={{ marginBottom: 24 }}>
            <Text
              style={{
                color: colors.foreground,
                fontWeight: '600',
                marginBottom: 12,
                fontSize: 12,
              }}
            >
              Ou escolha uma data específica
            </Text>
            {Platform.OS === 'web' ? (
              // Fallback para web usando input HTML
              <input
                type="date"
                value={formatDateForInput(internalDate)}
                onChange={(e) => handleDateInputChange(e.target.value)}
                max={formatDateForInput(new Date())}
                style={{
                  width: '100%',
                  padding: '12px',
                  borderRadius: '8px',
                  border: `1px solid ${colors.border}`,
                  backgroundColor: colors.surface,
                  color: colors.foreground,
                  fontSize: '16px',
                  fontFamily: 'inherit',
                  boxSizing: 'border-box',
                }}
              />
            ) : (
              // Fallback simples para mobile sem DatePicker nativo
              <View
                style={{
                  backgroundColor: colors.surface,
                  borderRadius: 12,
                  padding: 16,
                  alignItems: 'center',
                }}
              >
                <Text style={{ color: colors.foreground, fontSize: 16, fontWeight: '600' }}>
                  {internalDate.toLocaleDateString('pt-BR', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </Text>
              </View>
            )}
          </View>

          {/* Data Selecionada */}
          <View
            style={{
              backgroundColor: colors.surface,
              borderRadius: 12,
              padding: 16,
              marginBottom: 24,
            }}
          >
            <Text
              style={{
                color: colors.muted,
                fontSize: 12,
                marginBottom: 4,
              }}
            >
              Data selecionada
            </Text>
            <Text
              style={{
                color: colors.foreground,
                fontSize: 16,
                fontWeight: '600',
              }}
            >
              {internalDate.toLocaleDateString('pt-BR', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </Text>
          </View>

          {/* Botões */}
          <View
            style={{
              flexDirection: 'row',
              gap: 12,
            }}
          >
            <Pressable
              onPress={onClose}
              style={{
                flex: 1,
                paddingVertical: 12,
                borderRadius: 8,
                borderWidth: 1,
                borderColor: colors.border,
                alignItems: 'center',
              }}
            >
              <Text style={{ color: colors.foreground, fontWeight: '600' }}>
                Cancelar
              </Text>
            </Pressable>

            <Pressable
              onPress={handleConfirm}
              style={{
                flex: 1,
                paddingVertical: 12,
                borderRadius: 8,
                backgroundColor: colors.primary,
                alignItems: 'center',
              }}
            >
              <Text style={{ color: '#fff', fontWeight: '600' }}>
                Confirmar
              </Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}
