import React, { useState, useMemo, useRef } from 'react';
import { Controller, Control } from 'react-hook-form';
import { View, Text, TextInput, Pressable, ScrollView } from 'react-native';
import { ChevronDown, X, Check } from 'lucide-react-native';

interface SelectFieldProps<T = any> {
  control: Control<any>;
  name: string;
  label: string;
  options: T[];
  displayKey?: keyof T;
  valueKey?: keyof T;
  placeholder?: string;
  multiple?: boolean;
  onRemove?: (value: string | number) => void;
  onChange?: () => void;
  required?: boolean;
}

function getOptionLabel<T>(option: T, displayKey?: keyof T) {
  if (!displayKey) return String(option);
  return String(option[displayKey]);
}

function getOptionValue<T>(option: T, valueKey?: keyof T): string | number {
  if (!valueKey) return String(option as any);
  return option[valueKey] as string | number;
}

const SelectField = <T extends any>({
  control,
  name,
  label,
  options,
  displayKey,
  valueKey,
  placeholder,
  multiple = false,
  onRemove,
  required = true,
  onChange,
}: SelectFieldProps<T>) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredOptions = useMemo(() => {
    if (!searchTerm) return options;
    const lower = searchTerm.toLowerCase();
    return options.filter(opt =>
      getOptionLabel(opt, displayKey).toLowerCase().includes(lower)
    );
  }, [options, searchTerm, displayKey]);

  return (
    <View className="w-full mb-4">
      {label && (
        <Text className="text-sm font-medium text-gray-700 mb-1">
          {label} {required && <Text className="text-red-500">*</Text>}
        </Text>
      )}

      <Controller
        control={control}
        name={name}
        render={({ field, fieldState }) => {
          const hasValue = multiple
            ? Array.isArray(field.value) && field.value.length > 0
            : field.value !== null && field.value !== undefined && field.value !== '';
          const hasMultipleValues = multiple && Array.isArray(field.value) && field.value.length > 0;

          const selectedOption = !multiple && hasValue
            ? options.find(opt => String(getOptionValue(opt, valueKey)) === String(field.value))
            : undefined;

          const selectedOptions = multiple && hasMultipleValues
            ? options.filter(opt => field.value.includes(getOptionValue(opt, valueKey)))
            : [];

          const inputDisplayValue = !isOpen && !multiple && selectedOption
            ? getOptionLabel(selectedOption, displayKey)
            : searchTerm;

          const handleSelect = (opt: T) => {
            if (onChange) onChange();
            if (multiple) {
              const optValue = getOptionValue(opt, valueKey);
              const currentValues = Array.isArray(field.value) ? field.value : [];
              const newValues = currentValues.includes(optValue)
                ? currentValues.filter(v => v !== optValue)
                : [...currentValues, optValue];
              field.onChange(newValues);
            } else {
              field.onChange(getOptionValue(opt, valueKey));
              setIsOpen(false);
              setSearchTerm('');
            }
          };

          const handleClear = () => {
            field.onChange(multiple ? [] : '');
            setSearchTerm('');
          };

          const handleRemoveChip = (valueToRemove: string | number) => {
            if (multiple && Array.isArray(field.value)) {
              if (onRemove) onRemove(valueToRemove);
              const newValues = field.value.filter(v => v !== valueToRemove);
              field.onChange(newValues);
            }
          };

          const isOptionSelected = (opt: T) => {
            const optValue = getOptionValue(opt, valueKey);
            if (multiple && Array.isArray(field.value)) {
              return field.value.includes(optValue);
            }
            return selectedOption
              ? String(getOptionValue(opt, valueKey)) === String(getOptionValue(selectedOption, valueKey))
              : false;
          };

          return (
            <View className="relative">
              <Pressable
                className={`min-h-[56px] border rounded-lg bg-white px-3 py-2 justify-center ${fieldState.error ? 'border-red-500' : isOpen ? 'border-blue-500' : 'border-gray-300'}`}
                onPress={() => setIsOpen(!isOpen)}
              >
                <View className="flex-row items-center flex-wrap">
                  {multiple && hasMultipleValues && (
                    <View className="flex-row flex-wrap gap-1 mr-2">
                      {selectedOptions.map(opt => (
                        <Pressable
                          key={getOptionValue(opt, valueKey)}
                          className="flex-row items-center px-2 py-1 bg-blue-100 rounded-full mr-1 mb-1"
                          onPress={() => handleRemoveChip(getOptionValue(opt, valueKey))}
                        >
                          <Text className="text-xs text-blue-800">{getOptionLabel(opt, displayKey)}</Text>
                          <Text className="ml-1 text-blue-800">×</Text>
                        </Pressable>
                      ))}
                    </View>
                  )}
                  {!multiple && <TextInput
                    className="flex-1 text-gray-900"
                    placeholder={hasValue ? '' : (placeholder || 'Select option...')}
                    value={inputDisplayValue}
                    onChangeText={text => {
                      setSearchTerm(text);
                      if (!isOpen) setIsOpen(true);
                    }}
                  />}
                  {(hasValue || hasMultipleValues) && (
                    <Pressable onPress={handleClear} className="ml-2">
                      <X className="w-4 h-4 text-gray-400" />
                    </Pressable>
                  )}
                  <ChevronDown className={`w-4 h-4 text-gray-400 ${isOpen ? 'rotate-180' : ''}`} />
                </View>
              </Pressable>

              {isOpen && (
                <ScrollView className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-300 rounded-lg max-h-60 z-50">
                  {filteredOptions.length === 0 ? (
                    <Text className="px-3 py-2 text-gray-500 text-sm">No options available</Text>
                  ) : (
                    filteredOptions.map((opt, idx) => {
                      const selected = isOptionSelected(opt);
                      return (
                        <Pressable
                          key={idx}
                          className={`flex-row items-center px-3 py-2 ${selected ? 'bg-blue-50' : ''}`}
                          onPress={() => handleSelect(opt)}
                        >
                          {multiple && (
                            <View className={`w-4 h-4 border rounded-sm mr-2 ${selected ? 'bg-blue-500 border-blue-500' : 'border-gray-400'}`} />
                          )}
                          <Text className="flex-1">{getOptionLabel(opt, displayKey)}</Text>
                          {!multiple && selected && <Check className="w-4 h-4 text-blue-600" />}
                        </Pressable>
                      );
                    })
                  )}
                </ScrollView>
              )}

              {fieldState.error && (
                <Text className="mt-1 text-sm text-red-600">{fieldState.error.message as string}</Text>
              )}
            </View>
          );
        }}
      />
    </View>
  );
};

export default SelectField;
