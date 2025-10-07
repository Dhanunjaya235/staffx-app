import AxiosInstance from './axiosInstance';
import { ApiEnvelope, ok } from './helpers';

export const usersApi = {
  // Core
  async getUsersRaw() {
    const res = await AxiosInstance.get<any[]>('/users/');
    return res.data;
  },
  async assignRoleRaw(userId: string, roleId: string) {
    const res = await AxiosInstance.post<any>(`/users/${userId}/assign-role`, { roleId });
    return res.data;
  },

  // App adapters (enveloped)
  async getAll(): Promise<ApiEnvelope<any[]>> {
    const data = await usersApi.getUsersRaw();
    return ok(data);
  },
  async assignRole(userId: string, roleId: string): Promise<ApiEnvelope<any>> {
    const data = await usersApi.assignRoleRaw(userId, roleId);
    return ok(data);
  },
};

