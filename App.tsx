import React, { FC, useMemo, useEffect } from "react";
import { Provider, useSelector } from "react-redux";
import { RootState, store } from "./store";
import RoleAssignment from "./pages/RoleAssignment";
import Clients from "./pages/Clients";
import Vendors from "./pages/Vendors";
import Jobs from "./pages/Jobs";
import GlobalLoader from "./components/UI/GlobalLoader/GlobalLoader";
import Toaster from "./components/UI/Toaster/Toaster";
import { useApi } from "./hooks/useApi";
import { rolesApi } from "./services/api/rolesApi";
import { Employee, setEmployees, setEmployeesPractices, setUsers } from "./store/slices/usersSlice";
import { useEmployeeRoles } from "./hooks/useEmployee";

// React Navigation
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { View, StyleSheet, Text } from "react-native";
import CustomBottomNavBar from "./components/Layout/NavigationContainer";
import { DrawerProvider } from "components/UI/Drawer/DrawerProvider";
import { fetchEmployeeDashboard } from "store/slices/employeeSlice";

export const BASENAME = "/staffx/";

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function App() {
  console.log("App Rendered");
  return (
    <Provider store={store}>
      <DrawerProvider>
      <Bootstrap>
        <GlobalLoader />
        <Toaster />
        <NavigationContainer>
          <MainNavigator />
        </NavigationContainer>
      </Bootstrap>
      </DrawerProvider>
    </Provider>
  );
}

/** ------------------- Bootstrap ------------------- */
const Bootstrap: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const getMappings = useApi(async (params: any) => ({
    success: true,
    data: await rolesApi.getEmployeeRoleMappings(params),
  }));
  const dispatch = store.dispatch;
    useEffect(() => {
    dispatch(fetchEmployeeDashboard());
  }, []);

  useEffect(() => {
    (async () => {
      try {
        const res = await getMappings.execute({ page: 1, page_size: 200 } as any);
        if (Array.isArray((res as any).items)) {
          store.dispatch(setUsers((res as any).items));
          store.dispatch(setEmployees(res.employees as Employee[]));
          store.dispatch(setEmployeesPractices(res.employees_with_practices));
        }
      } catch (e) {
        console.error("Error fetching role mappings:", e);
      }
    })();
  }, []);

  return <>{children}</>;
};

/** ------------------- Tab Navigator ------------------- */
const TabNavigator: FC = () => {
  const { isAdmin, isSalesManager, isAccountManager, isRecruiter } = useEmployeeRoles();

  const initialRoute = useMemo(() => {
    if (isAdmin || isSalesManager || isAccountManager) return "Clients";
    return "Jobs";
  }, [isAdmin, isSalesManager, isAccountManager]);

  console.warn("Initial Route:", initialRoute);

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: { display: 'flex' },
      }}
      tabBar={(props) => <CustomBottomNavBar {...props} />}
      initialRouteName={initialRoute}
    >
      {(isAdmin || isSalesManager || isAccountManager) && (
        <Tab.Screen name="Clients" component={Clients} />
      )}
      {(isAdmin || isRecruiter) && (
        <Tab.Screen name="Vendors" component={Vendors} />
      )}
      <Tab.Screen name="Jobs" component={Jobs} />
      {isAdmin && (
        <Tab.Screen name="RoleAssignment" component={RoleAssignment} />
      )}
    </Tab.Navigator>
  );
};

/** ------------------- Main Navigator ------------------- */
const MainNavigator: FC = () => {
  const { loggedInEmployeeLoading } = useEmployeeRoles();
  console.warn("LoggedInEmployeeLoading:", loggedInEmployeeLoading);

  if (loggedInEmployeeLoading) {
    return <Text className="flex items-center justify-center h-screen">Loading Employee Data...</Text>;
  }

  return <TabContainer />;
};

/** ------------------- Tab Container with Custom Bottom Nav ------------------- */
const TabContainer: FC = () => {
  return <TabNavigator />;
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default App;
