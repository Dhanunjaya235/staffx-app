import AxiosInstance from './axiosInstance';
import { ApiEnvelope } from './helpers';

export interface LoginPayload { email: string; password: string; }

export const authApi = {
  async login(payload: LoginPayload) {
    const res = await AxiosInstance.post<ApiEnvelope<{ accessToken: string }>>('/api/auth/login', payload);
    return res.data;
  },
  async logout() {
    const res = await AxiosInstance.post<ApiEnvelope<null>>('/api/auth/logout', {});
    return res.data;
  },
  async me() {
    const res = await AxiosInstance.get<any>('/api/auth/me');
    return res.data;
  },
};

