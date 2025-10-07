import { PaginatedVendors, PaginationParams, VendorCreate, VendorOut, VendorUpdate } from '../../types/staffx-types';
import AxiosInstance from './axiosInstance';
import { ok, ApiEnvelope } from './helpers';

export interface VendorContact {
  name: string;
  role: string;
  phone: string;
  email: string;
}

export interface FileValue {
  fileName: string;
  fileType: string;
  fileValue: string; // base64
}

export interface CreateVendor {
  name: string;
  email: string;
  phone: string;
  company: string;
  industry: string;
  logo?: FileValue | null;
  location?: string;
  contacts?: VendorContact[];
}

export interface UpdateVendor extends Partial<CreateVendor> {}

export const vendorsApi = {
  // Core methods (raw)
  getVendors: async (params?: PaginationParams): Promise<PaginatedVendors> => {
    const response = await AxiosInstance.get<PaginatedVendors>('/vendors/', {
      params: {
        page: params?.page ?? 1,
        page_size: params?.page_size ?? 10,
      },
    });
    return response.data;
  },

  createVendor: async (data: VendorCreate): Promise<VendorOut> => {
    const response = await AxiosInstance.post<VendorOut>('/vendors/', data);
    return response.data;
  },

  updateVendor: async (vendorId: string, data: VendorUpdate): Promise<VendorOut> => {
    const response = await AxiosInstance.put<VendorOut>(`/vendors/${vendorId}`, data);
    return response.data;
  },

  // App adapter methods (enveloped)
  async getAll(params?: PaginationParams): Promise<ApiEnvelope<PaginatedVendors>> {
    const data = await vendorsApi.getVendors(params);
    return ok(data);
  },

  async create(payload: VendorCreate): Promise<ApiEnvelope<VendorOut>> {
    const data = await vendorsApi.createVendor(payload);
    return ok(data);
  },

  async update(id: string, payload: VendorUpdate): Promise<ApiEnvelope<VendorOut>> {
    const data = await vendorsApi.updateVendor(id, payload);
    return ok(data);
  },
};

