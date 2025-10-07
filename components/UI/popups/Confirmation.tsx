import React, { FC } from "react";
import { Modal, View, Text, TouchableOpacity } from "react-native";

export interface ConfirmationPopupProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
}

const ConfirmationPopup: FC<ConfirmationPopupProps> = ({
  open,
  onClose,
  onConfirm,
  title,
}) => {
  return (
    <Modal
      visible={open}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View className="flex-1 bg-black/40 justify-center items-center">
        <View className="bg-white rounded-2xl p-6 w-11/12 max-w-md shadow-lg">
          <Text className="text-lg font-semibold text-gray-800 mb-4">
            {title}
          </Text>

          <View className="flex-row justify-end space-x-3">
            <TouchableOpacity
              onPress={onClose}
              className="px-4 py-2 rounded-lg bg-gray-200"
            >
              <Text className="text-gray-800 text-center">Close</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={onConfirm}
              className="px-4 py-2 rounded-lg bg-red-600"
            >
              <Text className="text-white text-center">Delete</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default ConfirmationPopup;
