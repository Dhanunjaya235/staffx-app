import React from 'react';
import { View, TouchableOpacity, StyleSheet, Text } from 'react-native';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import { useEmployeeRoles } from '../../hooks/useEmployee';
import { UserCheck, Handshake, ListTodo, Shield } from 'lucide-react-native'; // or react-native-vector-icons

interface BottomNavBarProps {
  onNavigate?: (path: string) => void;
  activePath?: string;
}

const BottomNavBar: React.FC<BottomNavBarProps> = ({ onNavigate, activePath }) => {
  const { dashboard } = useSelector((state: RootState) => state.employee);
  const { isAdmin, isAccountManager, isRecruiter, isSalesManager } = useEmployeeRoles();

  const menuItems = [
    {
      name: 'Clients',
      path: 'Clients',
      icon: UserCheck,
      display: isAdmin || isAccountManager || isSalesManager,
    },
    {
      name: 'Vendors',
      path: 'Vendors',
      icon: Handshake,
      display: isAdmin || isRecruiter,
    },
    {
      name: 'Requirements',
      path: 'Jobs',
      icon: ListTodo,
      display: true,
    },
    {
      name: 'Role Assignment',
      path: 'RoleAssignment',
      icon: Shield,
      display: isAdmin,
    },
  ];

  return (
    <View style={styles.container}>
      {menuItems.filter(item => item.display).map(item => {
        const Icon = item.icon;
        const isActive = item.path === activePath;
        return (
          <TouchableOpacity
            key={item.path}
            style={styles.iconButton}
            onPress={() => onNavigate?.(item.path)}
            className='flex items-center flex-row justify-center'
          >
            <Icon
              width={24}
              height={24}
              color={isActive ? '#3498db' : '#888'}
            />
            <Text style={{ color: isActive ? '#3498db' : '#888', fontSize: 12 }}>
              {item.name}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    height: 60,
    borderTopWidth: 1,
    borderTopColor: '#ccc',
    backgroundColor: '#fff',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  iconButton: {
    padding: 10,
  },
});

export default BottomNavBar;
