import React, { createContext, useContext, useState, ReactNode } from 'react';
import { View, Text, TouchableOpacity, Modal, ScrollView, Dimensions } from 'react-native';
import { X as XIcon } from 'lucide-react-native';

interface DrawerItem {
  id: string;
  title: string;
  content: ReactNode;
  onClose?: () => void;
}

interface DrawerContextType {
  drawers: DrawerItem[];
  openDrawer: (drawer: Omit<DrawerItem, 'id'> & Partial<Pick<DrawerItem, 'id'>>) => string;
  closeDrawer: (id: string) => void;
  closeAllDrawers: () => void;
}

const DrawerContext = createContext<DrawerContextType | undefined>(undefined);

export const useDrawer = () => {
  const context = useContext(DrawerContext);
  if (!context) throw new Error('useDrawer must be used within a DrawerProvider');
  return context;
};

interface DrawerProviderProps {
  children: ReactNode;
}

export const DrawerProvider: React.FC<DrawerProviderProps> = ({ children }) => {
  const [drawers, setDrawers] = useState<DrawerItem[]>([]);

  const openDrawer = (drawer: Omit<DrawerItem, 'id'> & Partial<Pick<DrawerItem, 'id'>>) => {
    const id = drawer?.id || Date.now().toString();
    const newDrawer = { ...drawer, id };
    setDrawers(prev => [...prev, newDrawer]);
    return id;
  };

  const closeDrawer = (id: string) => {
    setDrawers(prev => prev.filter(d => d.id !== id));
  };

  const closeAllDrawers = () => {
    setDrawers([]);
  };

  return (
    <DrawerContext.Provider value={{ drawers, openDrawer, closeDrawer, closeAllDrawers }}>
      {children}
      {drawers.map((drawer, index) => (
        <DrawerOverlay
          key={drawer.id}
          drawer={drawer}
          zIndex={1000 + index}
          onClose={() => {
            closeDrawer(drawer.id);
            drawer.onClose?.();
          }}
        />
      ))}
    </DrawerContext.Provider>
  );
};

interface DrawerOverlayProps {
  drawer: DrawerItem;
  zIndex: number;
  onClose: () => void;
}

const DrawerOverlay: React.FC<DrawerOverlayProps> = ({ drawer, zIndex, onClose }) => {
  const width = Dimensions.get('window').width * 0.8;

  return (
    <Modal transparent animationType="slide" visible>
      <View className="flex-1 bg-black bg-opacity-50" style={{ zIndex }}>
        <TouchableOpacity style={{ flex: 1 }} onPress={onClose} activeOpacity={1} />
        <View className="bg-white shadow-xl" style={{ width, height: '100%', position: 'absolute', right: 0 }}>
          <View className="flex-row justify-between items-center px-4 py-3 border-b border-gray-200">
            <Text className="text-lg font-semibold text-gray-900">{drawer.title}</Text>
            <TouchableOpacity onPress={onClose}>
              <XIcon width={24} height={24} color="#374151" />
            </TouchableOpacity>
          </View>
          <ScrollView contentContainerStyle={{ flexGrow: 1, padding: 16 }}>
            {drawer.content}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};
