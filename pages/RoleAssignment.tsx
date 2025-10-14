import React, { useEffect, useMemo } from 'react';
import { View, Text, ScrollView } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store';
import { setUsers, setRoles, setEmployees, setEmployeesPractices } from '../store/slices/usersSlice';
import { useDrawer } from '../components/UI/Drawer/DrawerProvider';
import Button from '../components/UI/Button/Button';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import SelectField from '../components/form-fields/SelectField';
import { ROLE_DISPLAY_NAMES } from '../constants';
import { Edit, Shield } from 'lucide-react-native';
import { rolesApi } from '../services/api/rolesApi';
import { useApi } from '../hooks/useApi';
import { useEmployeeRoles } from '../hooks/useEmployee';
import { useNavigation } from '@react-navigation/native';
import { FlatList, TouchableOpacity } from 'react-native';
import { CardList } from '../components/Card/CardList';
import type { Extractors, FieldConfig } from '../types/card';
import { ROLE_PERMISSIONS } from '../constants';

export interface EmployeeWithRoles {
  employee_id: number;
  employee_name: string;
  employee_email: string;
  roles: string[];
  practices: string[];
}

export interface AssignedRole {
  id: string;
  employee_id: number;
  employee_name: string;
  employee_email: string;
  role_id: string;
  role_name: string;
  role_display_name: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

const RoleAssignment: React.FC = () => {
  const dispatch = useDispatch();
  const { users, employees_with_practices } = useSelector((state: RootState) => state.users);
  const { openDrawer } = useDrawer();

  const getRoleMappings = useApi(rolesApi.list);
  const { isAdmin } = useEmployeeRoles();
  const navigation = useNavigation<any>();

  useEffect(() => {
    if (!isAdmin) {
      navigation.navigate('Clients');
    }
  }, [isAdmin]);

  useEffect(() => {
    getRoleMappings.execute()
      .then(response => {
        dispatch(setUsers(response.items));
        dispatch(setEmployeesPractices(response.employees_with_practices));
        if (response.roles && Array.isArray(response.roles)) dispatch(setRoles(response.roles));
        if (response.employees && Array.isArray(response.employees)) dispatch(setEmployees(response.employees));
      })
      .catch(console.error);
  }, [dispatch]);

  const employeesWithRoles = useMemo<EmployeeWithRoles[]>(() => {
    const grouped = new Map<number, EmployeeWithRoles>();
    employees_with_practices.forEach(emp => {
      grouped.set(emp.employee_id, {
        employee_id: emp.employee_id,
        employee_name: emp.employee_name,
        employee_email: emp.employee_email,
        practices: emp.practices.map(p => p.practice_name),
        roles: [],
      });
    });

    users.forEach(role => {
      if (!grouped.has(role.employee_id)) {
        grouped.set(role.employee_id, {
          employee_id: role.employee_id,
          employee_name: role.employee_name,
          employee_email: role.employee_email,
          practices: [],
          roles: [],
        });
      }
      grouped.get(role.employee_id)!.roles.push(role.role_name);
    });

    return Array.from(grouped.values()).sort((a, b) => (b.roles.length > 0 ? 1 : 0) - (a.roles.length > 0 ? 1 : 0));
  }, [users, employees_with_practices]);

  const roleDisplayList = Object.values(ROLE_DISPLAY_NAMES);

  const openAssignRoleDrawer = (user?: any, mode?: string) => {
    openDrawer({
      title: user ? `Edit Roles for - ${user.employee_name}` : 'Assign Role',
      content: <AssignRoleForm user={user} allRoles={users} mode={mode || 'create'} />,
      onClose: () => {},
    });
  };

  const renderItem = ({ item }: { item: EmployeeWithRoles }) => (
    <View className="p-3 border-b border-gray-200">
      <Text className="font-semibold">{item.employee_name}</Text>
      <Text className="text-gray-700">{item.employee_email}</Text>

      <View className="flex-row flex-wrap gap-2 mt-1">
        {item.roles.map(r => (
          <View key={r} className="px-2 py-1 rounded-[5px] bg-blue-100">
            <Text className="text-blue-800 text-xs">{ROLE_DISPLAY_NAMES[r] || r}</Text>
          </View>
        ))}
        {item.practices.length > 0 && (
          <View className="px-2 py-1 rounded-[5px] bg-yellow-100">
            <Text className="text-yellow-800 text-xs">Practice Lead</Text>
          </View>
        )}
      </View>

      {item.roles.length > 0 && (
        <Button
          size="sm"
          variant="secondary"
          onPress={() => openAssignRoleDrawer(item, 'edit')}
        >
          <Edit className="w-4 h-4" />
        </Button>
      )}
    </View>
  );

  return (
    <ScrollView className="p-6">
      <View className="flex-row justify-between items-center mb-6">
        <Text className="text-2xl font-bold text-gray-900">Role Assignment</Text>
        <Button
          onPress={() => openAssignRoleDrawer()}
          icon={Shield}
          iconPosition="left"
          variant="primary"
        >
          Assign Role
        </Button>
      </View>

      <RoleAssignmentsCardList items={employeesWithRoles} />
    </ScrollView>
  );
};

// AssignRoleForm RN version
interface AssignRoleFormProps {
  user?: any;
  allRoles?: AssignedRole[];
  mode?: string;
}

export const AssignRoleForm: React.FC<AssignRoleFormProps> = ({ user, allRoles, mode = 'create' }) => {
  const dispatch = useDispatch();
  const { roles, employees } = useSelector((state: RootState) => state.users);
  const { closeAllDrawers } = useDrawer();

  const schema = yup.object({
    employeeId: yup.string().required('Employee is required'),
    roleIds: yup
      .array(yup.string())
      .when([], {
        is: () => mode === 'create',
        then: schema => schema.min(1, 'Select at least one role').required('Roles are required'),
        otherwise: schema => schema.notRequired(),
      }),
  });

  const { control, handleSubmit } = useForm({
    defaultValues: {
      employeeId: user?.employee_id?.toString() || '',
      roleIds: user?.roles ? roles.filter(r => user.roles.includes(r.name)).map(r => r.id.toString()) : [],
    },
    resolver: yupResolver(schema),
  });

  const createRoleMappings = useApi(rolesApi.create);
  const updateRoleMappings = useApi(rolesApi.update);
  const getRoleMappings = useApi(rolesApi.list);

  const onSubmit = async (values: any) => {
    try {
      const employeeIdNum = Number(values.employeeId);
      const selectedRoleIds: string[] = values.roleIds as string[];

      if (user && user.employee_id) {
        const previousRoleIds: string[] = Array.isArray(user.roles)
          ? roles.filter(r => user.roles.includes(r.name)).map(r => r.id)
          : [];

        const prevSet = new Set(previousRoleIds.map(String));
        const nextSet = new Set(selectedRoleIds.map(String));

        const new_roles = selectedRoleIds.filter(id => !prevSet.has(String(id)));
        const removed_roles = previousRoleIds.filter(id => !nextSet.has(String(id)));

        await updateRoleMappings.execute({
          employee_id: employeeIdNum,
          new_roles: new_roles.length ? new_roles : undefined,
          removed_roles: removed_roles.length ? removed_roles : undefined,
        });
      } else {
        await createRoleMappings.execute({
          employee_id: employeeIdNum,
          role_ids: selectedRoleIds,
        });
      }

      const refreshed = await getRoleMappings.execute();
      dispatch(setUsers(refreshed.items));
      if (Array.isArray(refreshed.roles)) dispatch(setRoles(refreshed.roles));
      if (Array.isArray(refreshed.employees)) dispatch(setEmployees(refreshed.employees));
      if (Array.isArray(refreshed.employees_with_practices)) dispatch(setEmployeesPractices(refreshed.employees_with_practices));

      closeAllDrawers();
    } catch (error) {
      console.error('Error assigning roles:', error);
    }
  };

  const employeeOptions = useMemo(() => {
    const allEmployeesWithRoles = (allRoles || []).map(role => role.employee_id);
    return employees?.filter(emp => !allEmployeesWithRoles.includes(emp.employee_id)).map(emp => ({
      id: emp.employee_id.toString(),
      name: emp.name,
    }));
  }, [employees, allRoles]);

  const roleOptions = roles.map(role => ({
    id: role.id,
    name: role.display_name || role.name,
  }));

  return (
    <ScrollView className="p-6 space-y-6">
      {!user && (
        <SelectField
          control={control}
          name="employeeId"
          label="Select Employee"
          options={employeeOptions}
          displayKey="name"
          valueKey="id"
          placeholder="Select employee"
        />
      )}

      <SelectField
        control={control}
        name="roleIds"
        label="Select Roles"
        options={roleOptions}
        displayKey="name"
        valueKey="id"
        multiple
        placeholder="Select roles"
      />

      <View className="flex-row justify-end space-x-3">
        <Button onPress={handleSubmit(onSubmit)} variant="primary">
          {user ? 'Update Roles' : 'Assign Roles'}
        </Button>
      </View>

      <View className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4 mt-4">
        {Object.entries(ROLE_PERMISSIONS).map(([role, permissions]) => (
          <View
            key={role}
            className="bg-white shadow-sm rounded-xl border border-gray-200"
          >
            <View className="bg-[#394253] px-4 py-2 rounded-t-xl">
              <Text className="text-white font-normal text-base">{role}</Text>
            </View>
            <View className="p-4">
              {permissions.map((perm, i) => (
                <View key={i} className="flex-row items-start gap-2 mb-1">
                  <Text className="text-blue-600">•</Text>
                  <Text className="flex-shrink">{perm}</Text>
                </View>
              ))}
            </View>
          </View>
        ))}
      </View>
    </ScrollView>
  );
};

export default RoleAssignment;

const RoleAssignmentsCardList: React.FC<{ items: EmployeeWithRoles[] }> = ({ items }) => {
	const extractors: Extractors<EmployeeWithRoles> = {
		getId: (i) => String(i.employee_id),
		getTitle: (i) => i.employee_name,
		getSubtitle: (i) => i.employee_email,
		getAvatarText: (i) => i.employee_name,
		getMetaPill: (i) => ({ text: String(i.roles.length), tone: i.roles.length ? 'info' : 'neutral' }),
	};

	const fields: FieldConfig<EmployeeWithRoles>[] = [
		{ key: 'roles', label: 'Roles', render: (v) => Array.isArray(v) && v.length ? (v as string[]).join(', ') : '—', numberOfLines: 2 },
		{ key: 'practices', label: 'Practices', render: (v) => Array.isArray(v) && v.length ? (v as string[]).join(', ') : '—', numberOfLines: 2 },
	];

	return (
		<CardList
			data={items}
			extractors={extractors}
			fields={fields}
			testID="roleassign-card-list"
		/>
	);
};
