import React from 'react';
import { View, Text, ActivityIndicator, Modal } from 'react-native';
import { useSelector } from 'react-redux';
import { RootState } from '../../../store';

const GlobalLoader: React.FC = () => {
  const { globalLoading } = useSelector((state: RootState) => state.ui);

  if (!globalLoading) return null;

  return (
    <Modal transparent visible={globalLoading} animationType="fade">
      <View className="flex-1 bg-black/60 justify-center items-center">
        <View className="bg-white rounded-lg p-8 shadow-lg w-72">
          <View className="flex-row items-center space-x-4">
            <ActivityIndicator size="large" color="#394253" />
            <View className="flex-1">
              <Text className="text-lg font-semibold text-gray-900">
                Processing...
              </Text>
              <Text className="text-gray-600">
                Please wait while we handle your request
              </Text>
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default GlobalLoader;
