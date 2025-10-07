import { ClientCreate, ClientOut, ClientUpdate, PaginatedClients, PaginationParams } from '../../types/staffx-types';
import AxiosInstance from './axiosInstance';
import { ok, ApiEnvelope } from './helpers';

export interface CreateClient {
  name: string;
  email: string;
  phone: string;
  company: string;
  industry: string;
  contacts: Contact[];
}

export interface Contact {
  id: string;
  name: string;
  role: string;
  phone: string;
  email: string;
}

export interface UpdateClient extends Partial<CreateClient> {}

export const clientsApi = {
  // Core methods (raw)
  getClients: async (params?: PaginationParams): Promise<PaginatedClients> => {
    const response = await AxiosInstance.get<PaginatedClients>('/clients/', {
      params: {
        page: params?.page ?? 1,
        page_size: params?.page_size ?? 10,
      },
    });
    return response.data;
  },

  getClientById: async (clientId: string): Promise<ClientOut> => {
    const response = await AxiosInstance.get<ClientOut>(`/clients/${clientId}`);
    return response.data;
  },

  createClient: async (data: ClientCreate): Promise<ClientOut> => {
    const response = await AxiosInstance.post<ClientOut>('/clients/', data);
    return response.data;
  },

  updateClient: async (clientId: string, data: ClientUpdate): Promise<ClientOut> => {
    const response = await AxiosInstance.put<ClientOut>(`/clients/${clientId}`, data);
    return response.data;
  },

  // App adapter methods (enveloped) to match useApi expectations
  async getAll(params?: PaginationParams): Promise<ApiEnvelope<PaginatedClients>> {
    const data = await clientsApi.getClients(params);
    return ok(data);
  },

  async getClient(clientId: string): Promise<ApiEnvelope<ClientOut>> {
    const data = await clientsApi.getClientById(clientId);
    return ok(data);
  },

  async create(payload: ClientCreate): Promise<ApiEnvelope<ClientOut>> {
    const data = await clientsApi.createClient(payload);
    return ok(data);
  },

  async update(clientId: string, payload: ClientUpdate): Promise<ApiEnvelope<ClientOut>> {
    const data = await clientsApi.updateClient(clientId, payload);
    return ok(data);
  },
};

