import React from 'react';
import { View, Text, TextInput } from 'react-native';
import { Controller, Control, FieldValues, Path } from 'react-hook-form';

interface TextAreaFieldProps<TFieldValues extends FieldValues> {
  control: Control<any>;
  name: Path<TFieldValues>;
  label: string;
  rows?: number;
  placeholder?: string;
  disabled?: boolean;
  required?: boolean;
}

function TextAreaField<TFieldValues extends FieldValues>({
  control,
  name,
  label,
  rows = 4,
  placeholder,
  disabled,
  required = true,
}: TextAreaFieldProps<TFieldValues>) {
  return (
    <View className="mb-3">
      <Text className="text-gray-700 text-sm mb-1">
        {label} {required && <Text className="text-red-500">*</Text>}
      </Text>

      <Controller
        control={control}
        name={name}
        render={({ field, fieldState }) => (
          <>
            <TextInput
              {...field}
              multiline
              numberOfLines={rows}
              placeholder={placeholder}
              editable={!disabled}
              className={`w-full px-3 py-2 border rounded-md bg-white ${
                fieldState.error ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {fieldState.error && (
              <Text className="mt-1 text-sm text-red-600">
                {fieldState.error.message as string}
              </Text>
            )}
          </>
        )}
      />
    </View>
  );
}

export default TextAreaField;
