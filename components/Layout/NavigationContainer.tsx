import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import { useEmployeeRoles } from '../../hooks/useEmployee';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { SafeAreaView } from 'react-native-safe-area-context';
import { UserCheck, Handshake, ListTodo, Shield, LogOut } from 'lucide-react-native';
import { useMicrosoftAuth } from 'auth/microsoft';

type RootTabParamList = {
  Clients: undefined;
  Vendors: undefined;
  Jobs: undefined;
  RoleAssignment: undefined;
};

export const CustomBottomNavBar: React.FC<BottomTabBarProps> = ({ state, navigation }) => {
  const activeRouteName = state.routes[state.index]?.name as keyof RootTabParamList | undefined;
  const { dashboard } = useSelector((state: RootState) => state.employee);
  const { isAdmin, isAccountManager, isRecruiter, isSalesManager } = useEmployeeRoles();

  const menuItems = [
    {
      name: 'Clients',
      screenName: 'Clients' as keyof RootTabParamList,
      icon: UserCheck,
      display: isAdmin || isAccountManager || isSalesManager,
    },
    {
      name: 'Vendors',
      screenName: 'Vendors' as keyof RootTabParamList,
      icon: Handshake,
      display: isAdmin || isRecruiter,
    },
    {
      name: 'Requirements',
      screenName: 'Jobs' as keyof RootTabParamList,
      icon: ListTodo,
      display: true,
    },
    {
      name: 'Role Assignment',
      screenName: 'RoleAssignment' as keyof RootTabParamList,
      icon: Shield,
      display: isAdmin,
    },
  ];

  const handleNavigation = (screenName: keyof RootTabParamList) => {
    navigation.navigate(screenName as never);
  };

  const {logout} = useMicrosoftAuth();

  return (
    <SafeAreaView edges={['bottom']} style={styles.container}>
      {menuItems.filter(item => item.display).map(item => {
        const Icon = item.icon;
        const isActive = item.screenName === activeRouteName;
        return (
          <TouchableOpacity
            key={item.screenName}
            style={styles.iconButton}
            onPress={() => handleNavigation(item.screenName)}
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
      <LogOut onPress={() =>{
        console.log("Logging out...");
        logout();
      }} />
    </SafeAreaView>
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
export default CustomBottomNavBar;