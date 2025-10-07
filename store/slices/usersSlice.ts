import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { type AssignedRole } from '../../pages/RoleAssignment';
import { EmployeeWithPractices } from '../../types/staffx-types';

export interface Role {
  id: string;
  name: string;
  display_name?: string;
  department?: string;
  level?: string;
  skillsRequired?: string[];
  experienceMin?: number;
  experienceMax?: number;
  description?: string;
  created_at?: string;
  updated_at?: string;
}

export interface Employee {
  id: string;
  employee_id: number;
  name: string;
  email: string;
  department?: string;
  position?: string;
  created_at?: string;
  updated_at?: string;
}

interface UsersState {
  users: AssignedRole[];
  roles: Role[];
  employees: Employee[];
  loading: boolean;
  error: string | null;
  employees_with_practices: EmployeeWithPractices[];
  
}

const initialState: UsersState = {
  users: [],
  roles: [],
  employees: [],
  loading: false,
  error: null,
  employees_with_practices:[]
};

const usersSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    setUsers: (state, action: PayloadAction<AssignedRole[]>) => {
      state.users = action.payload;
    },
    addUser: (state, action: PayloadAction<AssignedRole>) => {
      state.users.push(action.payload);
    },
    updateUser: (state, action: PayloadAction<AssignedRole>) => {
      const index = state.users.findIndex(u => u.id === action.payload.id);
      if (index !== -1) {
        state.users[index] = action.payload;
      }
    },
    deleteUser: (state, action: PayloadAction<string>) => {
      state.users = state.users.filter(u => u.id !== action.payload);
    },
    // New reducers for roles
    setRoles: (state, action: PayloadAction<Role[]>) => {
      state.roles = action.payload;
    },
    addRole: (state, action: PayloadAction<Role>) => {
      state.roles.push(action.payload);
    },
    updateRole: (state, action: PayloadAction<Role>) => {
      const index = state.roles.findIndex(r => r.id === action.payload.id);
      if (index !== -1) {
        state.roles[index] = action.payload;
      }
    },
    deleteRole: (state, action: PayloadAction<string>) => {
      state.roles = state.roles.filter(r => r.id !== action.payload);
    },
    // New reducers for employees
    setEmployees: (state, action: PayloadAction<Employee[]>) => {
      state.employees = action.payload;
    },
    addEmployee: (state, action: PayloadAction<Employee>) => {
      state.employees.push(action.payload);
    },
    updateEmployee: (state, action: PayloadAction<Employee>) => {
      const index = state.employees.findIndex(e => e.id === action.payload.id);
      if (index !== -1) {
        state.employees[index] = action.payload;
      }
    },
    deleteEmployee: (state, action: PayloadAction<string>) => {
      state.employees = state.employees.filter(e => e.id !== action.payload);
    },
    assignRole: (state, action: PayloadAction<{ userId: string; role: 'Admin' | 'Job Manager' | 'Recruiter' }>) => {
      const user = state.users.find(u => u.id === action.payload.userId);
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    setEmployeesPractices: (state,action:PayloadAction<EmployeeWithPractices[]>) => {
      state.employees_with_practices = action.payload
    }
  },
});

export const { 
  setUsers, 
  addUser, 
  updateUser, 
  deleteUser, 
  setRoles,
  addRole,
  updateRole,
  deleteRole,
  setEmployees,
  addEmployee,
  updateEmployee,
  deleteEmployee,
  assignRole, 
  setLoading, 
  setError,
  setEmployeesPractices 
} = usersSlice.actions;

export default usersSlice.reducer;