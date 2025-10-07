import { FC } from 'react';
import { Feather, Entypo, AntDesign , MaterialIcons  } from '@expo/vector-icons';
import { useDispatch } from 'react-redux';
import { setFileData } from '../../../store/slices/uiSlice';
import { View, Text, Pressable } from 'react-native';
import { AttachmentValue } from 'components/form-fields/AttchmentsFields';

export interface DocumentCardProps {
  document: AttachmentValue;
  index: number;
  onDelete?: (index: number) => void;
}

const DocumentCard: FC<DocumentCardProps> = ({ document, index, onDelete }) => {
  const dispatch = useDispatch();

  // Placeholder for download in React Native
  const handleDownload = () => {
    console.log('Download requested for', document.filename);
    // Optionally use expo-file-system to save the file
  };

  return (
    <View
      key={`${document.filename}-${index}`}
      className="flex-row items-center p-2 border rounded-md bg-white shadow-sm"
    >
      <View className="mr-3 text-blue-600">
        <AntDesign name="filetext1" size={24} color="black" />
      </View>

      <View className="flex-1 min-w-0">
        <Text className="text-sm font-medium text-gray-900 truncate">
          {document.filename}
        </Text>
        <Text className="text-xs text-gray-500">{document.filetype}</Text>
      </View>

      <View className="flex-row items-center space-x-2 ml-3">
        <Pressable
          onPress={() =>
            dispatch(
              setFileData({
                filename: document.filename,
                filetype: document.filetype,
                filedata: document.filedata,
              })
            )
          }
          className="p-2 rounded"
        >
          <Entypo name="eye" size={16} color="#6B7280" />
        </Pressable>

        <Pressable onPress={handleDownload} className="p-2 rounded">
          <Feather  name="download" size={16} color="#6B7280" />
        </Pressable>

        {onDelete && (
          <Pressable
            onPress={() => onDelete(index)}
            className="p-2 rounded"
          >
            <MaterialIcons name="delete" size={16} color="#EF4444" />
          </Pressable>
        )}
      </View>
    </View>
  );
};

export default DocumentCard;
