import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import SimpleSelect from "../../form-fields/SimpleSelect"; // ✅ Direct import

interface PaginationProps {
  page: number;
  total: number;
  pageSize: number;
  onPageChange: (page: number, pageSize?: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({
  page,
  total,
  pageSize,
  onPageChange,
}) => {
  const totalPages = React.useMemo(() => {
    if (!total || !pageSize) return 1;
    return Math.max(1, Math.ceil(total / pageSize));
  }, [total, pageSize]);
  console.log("Pagination Props - page:", page, "total:", total, "pageSize:", pageSize, "totalPages:", totalPages);
  return (
    <View className="px-4 py-2 border-t border-gray-200 flex flex-col items-start justify-between mb-10">
      <Text className="text-sm text-gray-600">
        Page {page} of {totalPages} • Showing {pageSize} of{" "}
        {total } items
      </Text>

      <View className="flex flex-row items-center space-x-2">
        <SimpleSelect
          label="Rows per page:"
          value={pageSize}
          options={[5, 10, 20, 50, 100]}
          onChange={(val) => onPageChange(1, val)}
        />

        <SimpleSelect
          label="Jump to:"
          value={page}
          options={Array.from({ length: totalPages }, (_, i) => i + 1)}
          onChange={(val) => onPageChange(val)}
        />

        <TouchableOpacity
          className="px-3 py-1 border rounded disabled:opacity-50"
          onPress={() => onPageChange(Math.max(1, page - 1))}
          disabled={page <= 1}
        >
          <Text className="text-sm">Previous</Text>
        </TouchableOpacity>

        <TouchableOpacity
          className="px-3 py-1 border rounded disabled:opacity-50"
          onPress={() => onPageChange(Math.min(totalPages, page + 1))}
          disabled={page >= totalPages}
        >
          <Text className="text-sm">Next</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Pagination;
