import React from 'react';
import { Controller, Control } from 'react-hook-form';
import { View, Text, Pressable } from 'react-native';

interface MultiSelectFieldProps {
  control: Control<any>;
  name: string;
  label: string;
  options: string[];
  placeholder?: string;
  required?: boolean;
}

const MultiSelectField: React.FC<MultiSelectFieldProps> = ({
  control,
  name,
  label,
  options,
  required = true,
}) => {
  return (
    <View className="w-full mb-4">
      {label && (
        <Text className="text-sm font-medium text-gray-700 mb-2">
          {label} {required && <Text className="text-red-500">*</Text>}
        </Text>
      )}

      <Controller
        control={control}
        name={name}
        render={({ field, fieldState }) => {
          const values: string[] = Array.isArray(field.value) ? field.value : [];

          const toggle = (value: string) => {
            const next = values.includes(value)
              ? values.filter(v => v !== value)
              : [...values, value];
            field.onChange(next);
          };

          return (
            <View className={`w-full px-3 py-2 border rounded-md ${fieldState.error ? 'border-red-500' : 'border-gray-300'}`}>
              {/* Selected values */}
              <View className="flex-row flex-wrap gap-2 mb-2">
                {values.map(v => (
                  <Pressable
                    key={v}
                    className="flex-row items-center px-2 py-1 bg-blue-100 rounded"
                    onPress={() => toggle(v)}
                  >
                    <Text className="text-xs text-blue-800">{v}</Text>
                    <Text className="ml-1 text-blue-800">×</Text>
                  </Pressable>
                ))}
              </View>

              {/* Options list */}
              <View className="flex-row flex-wrap gap-2">
                {options.map(opt => {
                  const selected = values.includes(opt);
                  return (
                    <Pressable
                      key={opt}
                      className="flex-row items-center gap-2 px-2 py-1 border rounded-md"
                      onPress={() => toggle(opt)}
                    >
                      <View
                        className={`w-4 h-4 border rounded-sm ${selected ? 'bg-blue-500 border-blue-500' : 'border-gray-400'}`}
                      />
                      <Text className="text-sm">{opt}</Text>
                    </Pressable>
                  );
                })}
              </View>

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

export default MultiSelectField;
