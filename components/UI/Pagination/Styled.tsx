import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Picker } from "@react-native-picker/picker";
import { styled } from "nativewind";

interface PaginationProps {
  page: number;
  total: number;
  pageSize: number;
  onPageChange: (page: number, pageSize?: number) => void;
}

const StyledButton = styled(TouchableOpacity);
const StyledText = styled(Text);

const StyledPagination: React.FC<PaginationProps> = ({
  page,
  total,
  pageSize,
  onPageChange,
}) => {
  const pageSizes = [5, 10, 20, 50, 100];

  const totalPages = React.useMemo(() => {
    if (!total || !pageSize) return 1;
    return Math.max(1, Math.ceil(total / pageSize));
  }, [total, pageSize]);

  const handlePrev = () => {
    if (page > 1) onPageChange(page - 1, pageSize);
  };

  const handleNext = () => {
    if (page < totalPages) onPageChange(page + 1, pageSize);
  };

  return (
    <View className="flex flex-col items-center p-4 bg-white rounded-xl shadow-md border border-gray-200 mb-1 mx-5">
      {/* Navigation */}
      <View className="flex-row items-center mb-4">
        <StyledButton
          className="px-4 py-2 mx-1 bg-gray-200 rounded-full active:bg-gray-300"
          onPress={handlePrev}
          disabled={page === 1}
        >
          <StyledText className="text-gray-700 font-semibold">Prev</StyledText>
        </StyledButton>

        <StyledText className="text-gray-700 font-semibold mx-2">
          Page {page} / {totalPages}
        </StyledText>

        <StyledButton
          className="px-4 py-2 mx-1 bg-gray-200 rounded-full active:bg-gray-300"
          onPress={handleNext}
          disabled={page === totalPages}
        >
          <StyledText className="text-gray-700 font-semibold">Next</StyledText>
        </StyledButton>
      </View>

      {/* Rows Per Page */}
      <View className="flex-row items-center mb-4">
        <StyledText className="text-gray-600 mr-2">Rows per page:</StyledText>
        <View className="border border-gray-300 rounded-full bg-gray-50 ">
          <Picker
            selectedValue={pageSize}
            style={{ width: 110, height: 50, color: "#374151", padding:0}}
            onValueChange={(value) => onPageChange(1, value)}
            dropdownIconColor="#374151"
          >
            {pageSizes.map((size) => (
              <Picker.Item key={size} label={`${size}`} value={size} />
            ))}
          </Picker>
        </View>
      </View>

      {/* Jump To Page */}
      <View className="flex-row items-center">
        <StyledText className="text-gray-600 mr-2">Jump to page:</StyledText>
        <View className="border border-gray-300 rounded-full bg-gray-50 px-2">
          <Picker
            selectedValue={page}
            style={{ width: 100, height: 50, color: "#374151" , padding:0}}
            onValueChange={(value) => onPageChange(value, pageSize)}
            dropdownIconColor="#374151"
          >
            {Array.from({ length: totalPages }).map((_, i) => (
              <Picker.Item key={i + 1} label={`${i + 1}`} value={i + 1} />
            ))}
          </Picker>
        </View>
      </View>
    </View>
  );
};

export default StyledPagination;