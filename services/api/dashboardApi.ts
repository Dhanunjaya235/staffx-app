import AxiosInstance from "./axiosInstance";
import { ApiEnvelope, ok } from './helpers';
import { DashboardOut } from '../../types/staffx-types';

export const dashboardApi = {
  // Core
  async getEmployeeDashboardRaw(): Promise<DashboardOut> {
    const response = await AxiosInstance.get<DashboardOut>('/dashboard');
    return response.data;
  },

  // App adapter (enveloped)
  async getEmployeeDashboard(): Promise<ApiEnvelope<DashboardOut>> {
    const data = await dashboardApi.getEmployeeDashboardRaw();
    return ok(data);
  },
};