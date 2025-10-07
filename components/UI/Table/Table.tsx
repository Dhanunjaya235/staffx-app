import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Modal } from 'react-native';
import { Filter } from 'lucide-react-native';
import SimpleSelect from '../../form-fields/SimpleSelect';

export interface Column<T> {
  key: keyof T | string;
  label: string;
  render?: (value: any, item: T) => React.ReactNode;
  filterable?: boolean;
  filterOptions?: string[];
  onFilterChange?: (value: string) => void;
  filterValue?: string | null;
}

interface TableProps<T> {
  data: T[];
  columns: Column<T>[];
  loading?: boolean;
  emptyMessage?: string;
  page?: number;
  pageSize?: number;
  total?: number;
  onPageChange?: (page: number, pageSize?: number) => void;
}

const Table = <T extends Record<string, any>>({
  data,
  columns,
  loading = false,
  emptyMessage = 'No data available',
  page,
  pageSize,
  total,
  onPageChange,
}: TableProps<T>) => {
  const [filters, setFilters] = useState<Record<string, string>>({});
  const [activeFilterColumn, setActiveFilterColumn] = useState<Column<T> | null>(null);

  const totalPages = React.useMemo(() => {
    if (!total || !pageSize) return 1;
    return Math.max(1, Math.ceil(total / pageSize));
  }, [total, pageSize]);

  const openFilter = (column: Column<T>) => {
    setActiveFilterColumn(column);
  };

  const closeFilter = () => {
    setActiveFilterColumn(null);
  };

  if (loading) {
    return (
      <View className="bg-white rounded-lg shadow p-8 items-center justify-center">
        <View className="animate-spin w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full" />
        <Text className="mt-4 text-gray-500">Loading...</Text>
      </View>
    );
  }

  return (
    <View className="bg-white rounded-lg shadow overflow-hidden flex-1">
      <ScrollView horizontal>
        <View className="min-w-full">
          {/* Table Header */}
          <View className="bg-gray-50 flex-row">
            {columns.map((col) => (
              <View key={col.key.toString()} className="px-3 py-3 flex-1 relative">
                <View className="flex-row justify-between items-center">
                  <Text className="text-xs font-medium text-gray-500 uppercase">{col.label}</Text>
                  {col.filterable && (
                    <TouchableOpacity
                      onPress={() => openFilter(col)}
                      className={`p-1 rounded ${
                        filters[col.key.toString()] ? 'bg-blue-100' : 'bg-gray-100'
                      }`}
                    >
                      <Filter className="w-4 h-4 text-gray-600" />
                    </TouchableOpacity>
                  )}
                </View>
              </View>
            ))}
          </View>

          {/* Table Body */}
          {data.length === 0 ? (
            <View className="px-6 py-12 items-center">
              <Text className="text-gray-400 text-lg mb-2">No results found</Text>
              <Text className="text-sm">{emptyMessage}</Text>
            </View>
          ) : (
            data.map((item, rowIndex) => (
              <View key={rowIndex} className="flex-row border-b border-gray-200">
                {columns.map((column, colIndex) => (
                  <View key={colIndex} className="px-3 py-2 flex-1">
                    {column.render
                      ? column.render(item[column.key.toString()], item)
                      : <Text>{item[column.key.toString()]}</Text>}
                  </View>
                ))}
              </View>
            ))
          )}
        </View>
      </ScrollView>

      {/* Pagination */}
      {typeof page === 'number' &&
        typeof pageSize === 'number' &&
        typeof total === 'number' &&
        onPageChange && (
          <View className="px-4 py-1 border-t border-gray-200 flex-row justify-between items-center">
            <Text className="text-sm text-gray-600">
              Page {page} of {totalPages} • Showing {data.length} of {total} items
            </Text>
            <View className="flex-row items-center space-x-2">
              <SimpleSelect
                label="Rows per page:"
                value={pageSize}
                options={[5, 10, 20, 50, 100]}
                onChange={(val:number) => onPageChange(1, val)}
              />
              <SimpleSelect
                label="Jump to:"
                value={page}
                options={Array.from({ length: totalPages }, (_, i) => i + 1)}
                onChange={(val:number) => onPageChange(val)}
              />
              <TouchableOpacity
                onPress={() => onPageChange(Math.max(1, page - 1))}
                disabled={page <= 1}
                className="px-3 py-1 border rounded disabled:opacity-50"
              >
                <Text>Previous</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => onPageChange(Math.min(totalPages, page + 1))}
                disabled={page >= totalPages}
                className="px-3 py-1 border rounded disabled:opacity-50"
              >
                <Text>Next</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

      {/* Bottom Sheet Filter */}
      <Modal visible={!!activeFilterColumn} transparent animationType="slide">
        <View className="flex-1 justify-end bg-black/40">
          <View className="bg-white rounded-t-3xl max-h-1/2 p-4">
            <Text className="text-lg font-semibold mb-2">{activeFilterColumn?.label} Filter</Text>
            <ScrollView>
              <TouchableOpacity
                onPress={() => {
                  activeFilterColumn?.onFilterChange?.('');
                  setFilters((prev) => ({
                    ...prev,
                    [activeFilterColumn.key.toString()]: '',
                  }));
                  closeFilter();
                }}
                className={`px-3 py-2 ${!filters?.[activeFilterColumn?.key.toString()!] ? 'bg-blue-100' : ''}`}
              >
                <Text>All</Text>
              </TouchableOpacity>

              {activeFilterColumn?.filterOptions?.map((option) => (
                <TouchableOpacity
                  key={option}
                  onPress={() => {
                    activeFilterColumn.onFilterChange?.(option);
                    setFilters((prev) => ({
                      ...prev,
                      [activeFilterColumn.key.toString()]: option,
                    }));
                    closeFilter();
                  }}
                  className={`px-3 py-2 ${
                    filters?.[activeFilterColumn.key.toString()] === option ? 'bg-blue-100' : ''
                  }`}
                >
                  <Text>{option}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
            <TouchableOpacity onPress={closeFilter} className="mt-4 px-3 py-2 bg-gray-200 rounded-lg items-center">
              <Text>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default Table;
