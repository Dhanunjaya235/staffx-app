import React, { useState } from 'react';
import { View, Text, TextInput, Platform, TouchableOpacity } from 'react-native';
import { Controller, Control } from 'react-hook-form';
import DateTimePicker from '@react-native-community/datetimepicker';
import { staffXDateFormat, staffXDateTimeFormat } from '../../utils';

interface TextFieldProps {
  control: Control<any>;
  name: string;
  label: string;
  type?: 'text' | 'date' | 'time' | 'datetime-local';
  placeholder?: string;
  required?: boolean;
}

const TextField: React.FC<TextFieldProps> = ({
  control,
  name,
  label,
  type = 'text',
  placeholder,
  required = false,
}) => {
  const [showPicker, setShowPicker] = useState(false);

  return (
    <View className="mb-3">
      <Text className="text-gray-700 text-sm mb-1">
        {label} {required && <Text className="text-red-500">*</Text>}
      </Text>

      <Controller
        control={control}
        name={name}
        render={({ field, fieldState }) => {
          const displayValue = (() => {
            if (!field.value) return '';
            if (type === 'date') return staffXDateFormat(field.value);
            if (type === 'datetime-local') return staffXDateTimeFormat(Number(field.value));
            if (type === 'time') {
              const d = new Date(Number(field.value));
              const hh = String(d.getHours()).padStart(2, '0');
              const mm = String(d.getMinutes()).padStart(2, '0');
              return `${hh}:${mm}`;
            }
            return field.value;
          })();

          const handleChange = (val: string | number) => {
            if (type === 'time') {
              const [hh, mm] = (val as string).split(':');
              const d = new Date();
              d.setHours(Number(hh), Number(mm), 0, 0);
              field.onChange(d.getTime());
            } else if (type === 'date' || type === 'datetime-local') {
              field.onChange(val);
            } else {
              field.onChange(val);
            }
          };

          return (
            <>
              {type === 'text' ? (
                <TextInput
                  placeholder={placeholder}
                  value={displayValue}
                  onChangeText={handleChange}
                  className={`w-full px-3 py-2 border rounded-md bg-white ${
                    fieldState.error ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
              ) : (
                <>
                  <TouchableOpacity
                    className={`w-full px-3 py-2 border rounded-md bg-white ${
                      fieldState.error ? 'border-red-500' : 'border-gray-300'
                    }`}
                    onPress={() => setShowPicker(true)}
                  >
                    <Text className={`${displayValue ? 'text-gray-900' : 'text-gray-400'}`}>
                      {displayValue || placeholder || 'Select...'}
                    </Text>
                  </TouchableOpacity>
                  {showPicker && (
                    <DateTimePicker
                      value={
                        field.value
                          ? new Date(type === 'time' ? Number(field.value) : field.value)
                          : new Date()
                      }
                      mode={type === 'date' ? 'date' : type === 'time' ? 'time' : 'datetime'}
                      display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                      onChange={(event, date) => {
                        setShowPicker(Platform.OS === 'ios');
                        if (date) {
                          if (type === 'time' || type === 'datetime-local') {
                            handleChange(date.getTime());
                          } else {
                            handleChange(date.toISOString().split('T')[0]);
                          }
                        }
                      }}
                    />
                  )}
                </>
              )}

              {fieldState.error && (
                <Text className="mt-1 text-sm text-red-600">{fieldState.error.message as string}</Text>
              )}
            </>
          );
        }}
      />
    </View>
  );
};

export default TextField;
