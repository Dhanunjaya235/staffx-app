// employeeSlice.ts
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import AxiosInstance from '../../services/api/axiosInstance';
import { RootState } from '../index';
import { DashboardOut } from '../../types/staffx-types';
import { setPartialClients } from "./clientsSlice"; // adjust path
import { setPartialVendors } from './vendorsSlice';
import { Roles, RoleValue } from '../../constants';

// ====== Slice State ======
export interface EmployeeState {
  dashboard: DashboardOut | null;
  roles: RoleValue[];
  isAdmin: boolean;
  isAccountManager: boolean;
  isRecruiter: boolean;
  isDeliveryManager: boolean;
  isPracticeLead: boolean;
  isSalesManager: boolean;
  loading: boolean;
  error: string | null;
  loggedInEmployeeLoading: boolean;
}

const initialState: EmployeeState = {
  dashboard: null,
  roles: [],
  isAdmin: false,
  isAccountManager: false,
  isRecruiter: false,
  isDeliveryManager: false,
  isPracticeLead: false,
  isSalesManager: false,
  loading: false,
  loggedInEmployeeLoading:true,
  error: null,
};

// ====== Async Thunk ======
export const fetchEmployeeDashboard = createAsyncThunk(
  'employee/fetchEmployeeDashboard',
  async (_, { rejectWithValue,dispatch }) => {
    try {
      const res = await AxiosInstance.get<DashboardOut>('/dashboard');
      if (res.data?.clients) {
        dispatch(setPartialClients(res.data.clients));
      }
      if(res.data?.vendors) {
        dispatch(setPartialVendors(res.data.vendors));
      }
      return res.data;
    } catch (err: any) {
      return rejectWithValue(err?.response?.data?.message || 'Failed to fetch employee dashboard');
    }
  }
);

// ====== Helper ======
function deriveBooleans(roles: RoleValue[]): Pick<
  EmployeeState,
  | 'isAdmin'
  | 'isAccountManager'
  | 'isRecruiter'
  | 'isDeliveryManager'
  | 'isPracticeLead'
  | 'isSalesManager'
> {
  const has = (r: RoleValue) => roles.includes(r);
  return {
    isAdmin: has(Roles.ADMIN),
    isAccountManager: has(Roles.ACCOUNT_MANAGER),
    isRecruiter: has(Roles.RECRUITER),
    isDeliveryManager: has(Roles.DELIVERY_MANAGER),
    isPracticeLead: has(Roles.PRACTICE_LEAD),
    isSalesManager: has(Roles.SALES_MANAGER),
  };
}

// ====== Slice ======
const employeeSlice = createSlice({
  name: 'employee',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(fetchEmployeeDashboard.pending, state => {
        console.log("Fetching Employee Dashboard...");
        state.loading = true;
        state.loggedInEmployeeLoading = true;
        state.error = null;
      })
      .addCase(fetchEmployeeDashboard.fulfilled, (state, action) => {
        console.log("Fetched Employee Dashboard:", action.payload);
        state.loading = false;
        state.dashboard = action.payload;
        state.loggedInEmployeeLoading = false;

        // Extract roles
        const roleValues: RoleValue[] = (action.payload?.assigned_roles ?? [])
          .map(r => r.role_name)
          .filter(Boolean) as RoleValue[];

        state.roles = roleValues;

        // Derived role booleans
        const derived = deriveBooleans(roleValues);
        Object.assign(state, derived);
      })
      .addCase(fetchEmployeeDashboard.rejected, (state, action) => {
        state.loading = false;
        state.loggedInEmployeeLoading = false;
        state.error = (action.payload as string) || 'Failed to fetch employee dashboard';
      });
  },
});

export default employeeSlice.reducer;

// ====== Selectors ======
export const selectDashboard = (state: RootState) => state.employee.dashboard;
export const selectEmployee = (state: RootState) => state.employee.dashboard?.employee || null;
export const selectAssignedRoles = (state: RootState) => state.employee.dashboard?.assigned_roles || [];
export const selectPractices = (state: RootState) => state.employee.dashboard?.practices || [];
export const selectConstants = (state: RootState) => state.employee.dashboard?.constants || null;

export const selectEmployeeRoles = (state: RootState) => state.employee.roles;
export const selectEmployeeLoading = (state: RootState) => state.employee.loading;
export const selectEmployeeError = (state: RootState) => state.employee.error;

export const selectIsAdmin = (state: RootState) => state.employee.isAdmin;
export const selectIsAccountManager = (state: RootState) => state.employee.isAccountManager;
export const selectIsRecruiter = (state: RootState) => state.employee.isRecruiter;
export const selectIsDeliveryManager = (state: RootState) => state.employee.isDeliveryManager;
export const selectIsPracticeLead = (state: RootState) => state.employee.isPracticeLead;
export const selectIsSalesManager = (state: RootState) => state.employee.isSalesManager;

export const selectEmployeePermissions = (state: RootState) => ({
  isAdmin: state.employee.isAdmin,
  isAccountManager: state.employee.isAccountManager,
  isRecruiter: state.employee.isRecruiter,
  isDeliveryManager: state.employee.isDeliveryManager,
  isPracticeLead: state.employee.isPracticeLead,
  isSalesManager: state.employee.isSalesManager,
  loggedInEmployeeLoading: state.employee.loggedInEmployeeLoading
});
