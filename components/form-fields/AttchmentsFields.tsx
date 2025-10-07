import { Controller, Control, FieldValues, Path } from 'react-hook-form';
import { useState } from 'react';
import * as DocumentPicker from 'expo-document-picker';
import { View, Text, Pressable, FlatList } from 'react-native';
import { Feather } from '@expo/vector-icons';
import DocumentCard from '../UI/document/DocumentCard';

export interface AttachmentValue {
  filename: string;
  filetype: string;
  filedata: string; // base64 encoded
  id?: string;
}

interface AttachmentsFieldProps<TFieldValues extends FieldValues = FieldValues> {
  control: Control<any>;
  name: Path<TFieldValues>;
  label?: string;
  accept?: string; // MIME types
  onRemove?: (index: string) => void;
  required?: boolean;
}

async function fileToAttachment(file: DocumentPicker.DocumentPickerAsset): Promise<AttachmentValue> {
  if (file) {
    // Convert to base64
    const response = await fetch(file.uri);
    const buffer = await response.arrayBuffer();
    const bytes = new Uint8Array(buffer);
    let binary = '';
    for (let i = 0; i < bytes.byteLength; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    const base64 = btoa(binary);

    return {
      filename: file.name!,
      filetype: file.mimeType || 'application/octet-stream',
      filedata: base64,
    };
  }
  throw new Error('File selection cancelled');
}

const AttachmentsField = <TFieldValues extends FieldValues = FieldValues>({
  control,
  name,
  label = 'Attachments',
  onRemove,
  required = false,
}: AttachmentsFieldProps<TFieldValues>) => {
  const [error, setError] = useState<string>('');

  const checkFileType = (file: DocumentPicker.DocumentPickerAsset) => {
    if (file) {
      const acceptedTypes = [
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document', // .docx
        'application/vnd.ms-excel',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', // .xlsx
      ];
      const ext = file.name!.substring(file.name!.lastIndexOf('.')).toLowerCase();
      const acceptedExtensions = ['.pdf', '.doc', '.docx', '.xls', '.xlsx'];

      if (!acceptedTypes.includes(file.mimeType!) && !acceptedExtensions.includes(ext)) {
        setError('Upload valid documents.');
        return false;
      }
      setError('');
      return true;
    }
    return false;
  };

  const handleSelectFiles = async (
    fieldValue: AttachmentValue[],
    onChange: (value: AttachmentValue[]) => void
  ) => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: ['application/pdf', 'application/msword', 'application/vnd.ms-excel', '*/*'],
        multiple: true,
      });

      // if single selection, wrap in array
      const files = Array.isArray(result) ? result : [result];

      const validFiles = files.filter(checkFileType);
      if (validFiles.length === 0) return;

      const attachments = await Promise.all(validFiles.map(fileToAttachment));
      onChange([...(fieldValue || []), ...attachments]);
    } catch (err) {
      console.log('File selection error', err);
    }
  };

  const handleRemove = (
    fieldValue: AttachmentValue[],
    onChange: (value: AttachmentValue[]) => void,
    idx: number
  ) => {
    const next = [...fieldValue];
    const removed = next.splice(idx, 1);
    onChange(next);
    if (onRemove && removed[0] && removed[0].id) {
      onRemove(removed[0].id);
    }
  };

  return (
    <View className="w-full">
      {label && (
        <Text className="text-sm font-medium text-gray-700 mb-2">
          {label} {required && <Text className="text-red-500">*</Text>}
        </Text>
      )}

      <Controller
        control={control}
        name={name}
        render={({ field, fieldState }) => {
          const value: AttachmentValue[] = Array.isArray(field.value) ? field.value : [];

          return (
            <View className="space-y-3">
              {/* Upload button */}
              <Pressable
                onPress={() => handleSelectFiles(value, field.onChange)}
                className={`flex flex-row items-center justify-between w-full px-3 py-2 border rounded-md shadow-sm ${
                  fieldState.error ? 'border-red-500' : 'border-gray-300'
                }`}
              >
                <View className="flex flex-row items-center gap-2">
                  <Feather name="upload" size={20} color="#6B7280" />
                  <Text className="text-sm text-gray-600">
                    {value.length > 0
                      ? `${value.length} file${value.length > 1 ? 's' : ''} selected`
                      : 'Click to upload files'}
                  </Text>
                </View>
              </Pressable>

              {fieldState.error && (
                <Text className="text-sm text-red-600">{String(fieldState.error.message)}</Text>
              )}
              {error && <Text className="text-sm text-red-600">{error}</Text>}

              {value.length > 0 && (
                <FlatList
                  data={value}
                  keyExtractor={(_, idx) => idx.toString()}
                  renderItem={({ item, index }) => (
                    <DocumentCard document={item} index={index} onDelete={() => handleRemove(value, field.onChange, index)} />
                  )}
                />
              )}
            </View>
          );
        }}
      />
    </View>
  );
};

export default AttachmentsField;
