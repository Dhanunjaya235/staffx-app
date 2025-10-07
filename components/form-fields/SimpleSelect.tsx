import React, { useState, useRef, useEffect } from 'react';
import { View, Text, Pressable, ScrollView, StyleSheet, TouchableWithoutFeedback } from 'react-native';
import { ChevronDown } from 'lucide-react-native';

interface SimpleSelectProps<T = string | number> {
  value: T;
  options: T[];
  onChange: (value: T) => void;
  label?: string;
  className?: string; // NativeWind doesn't fully support string className, optional
  required?: boolean;
}

const SimpleSelect = <T extends string | number>({
  value,
  options,
  onChange,
  label,
  required = true,
}: SimpleSelectProps<T>) => {
  const [isOpen, setIsOpen] = useState(false);

  // Close dropdown when tapping outside
  const dropdownRef = useRef<View>(null);

  useEffect(() => {
    // For RN, outside click handling is usually handled with a TouchableWithoutFeedback at parent
  }, []);

  return (
    <View className="mb-3">
      {label && (
        <Text className="text-gray-600 mb-1">
          {label} {required && <Text className="text-red-500">*</Text>}
        </Text>
      )}

      <Pressable
        className="flex-row justify-between items-center border rounded px-3 py-2 bg-white min-w-[80px]"
        onPress={() => setIsOpen(!isOpen)}
      >
        <Text className="text-gray-900">{value}</Text>
        <ChevronDown className={`w-4 h-4 text-gray-500 ${isOpen ? 'rotate-180' : ''}`} />
      </Pressable>

      {isOpen && (
        <View className="absolute bg-white border rounded shadow-lg z-50 mt-1 max-h-60">
          <ScrollView>
            {options.map((opt, idx) => (
              <Pressable
                key={idx}
                className={`px-3 py-2 ${
                  value === opt ? 'bg-blue-50 text-blue-600' : 'text-gray-700'
                }`}
                onPress={() => {
                  onChange(opt);
                  setIsOpen(false);
                }}
              >
                <Text className={value === opt ? 'text-blue-600 font-medium' : 'text-gray-700'}>
                  {opt}
                </Text>
              </Pressable>
            ))}
          </ScrollView>
        </View>
      )}
    </View>
  );
};

export default SimpleSelect;
