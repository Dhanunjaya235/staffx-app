import React, { useEffect, useState } from 'react';
import { View, SafeAreaView, StyleSheet, Modal } from 'react-native';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../../store';
import { fetchEmployeeDashboard } from '../../store/slices/employeeSlice';
import BottomNavBar from './BottomNavBar';
import { DrawerProvider } from 'components/UI/Drawer/DrawerProvider';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const dispatch = useDispatch<AppDispatch>();
  const [activePath, setActivePath] = useState<string>('ClientsScreen');
  const [isPreviewVisible, setPreviewVisible] = useState(false);

  useEffect(() => {
    dispatch(fetchEmployeeDashboard());
  }, []);

  const handleNavigate = (path: string) => {
    console.warn("Navigating to:", path);
    setActivePath(path);
    // You can also integrate React Navigation here if you want
  };

  return (
    <DrawerProvider>
    
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>{children}</View>

      {/* Bottom Navigation */}
      <BottomNavBar activePath={activePath} onNavigate={handleNavigate} />
    </SafeAreaView>
    </DrawerProvider>

  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f3f4f6', // gray-50
  },
  content: {
    flex: 1,
  },
});

export default Layout;
