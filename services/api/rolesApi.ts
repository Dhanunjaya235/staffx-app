import { EmployeeRoleMappingBulkResponse, EmployeeRoleMappingCreate, EmployeeRoleMappingDetailOut, EmployeeRoleMappingUpdate, PaginatedEmployeeRoleMappings, PaginationParams } from '../../types/staffx-types';
import AxiosInstance from './axiosInstance';
import { ok, ApiEnvelope } from './helpers';

export interface CreateRole {
  name: string;
  department: string;
  level: string;
  skillsRequired: string[];
  experienceMin: number;
  experienceMax: number;
  description?: string;
}

export interface UpdateRole extends Partial<CreateRole> {}

export const rolesApi = {
  
  getEmployeeRoleMappings: async (params?: PaginationParams): Promise<PaginatedEmployeeRoleMappings> => {
    const response = await AxiosInstance.get<PaginatedEmployeeRoleMappings>('/employee-role-mappings/', {
      params: {
        page: params?.page ?? 1,
        page_size: params?.page_size ?? 100,
      },
    });
    return response.data;
  },

  getEmployeeRoleMapping: async (mappingId: string): Promise<EmployeeRoleMappingDetailOut> => {
    const response = await AxiosInstance.get<EmployeeRoleMappingDetailOut>(
      `/employee-role-mappings/${mappingId}`
    );
    return response.data;
  },

  createEmployeeRoleMapping: async (data: EmployeeRoleMappingCreate): Promise<EmployeeRoleMappingBulkResponse> => {
    const response = await AxiosInstance.post<EmployeeRoleMappingBulkResponse>(
      '/employee-role-mappings/',
      data
    );
    return response.data;
  },

  updateEmployeeRoleMappings: async (data: EmployeeRoleMappingUpdate): Promise<EmployeeRoleMappingBulkResponse> => {
    const response = await AxiosInstance.put<EmployeeRoleMappingBulkResponse>(
      '/employee-role-mappings/',
      data
    );
    return response.data;
  },
  async list(params?: PaginationParams): Promise<ApiEnvelope<PaginatedEmployeeRoleMappings>> {
    const data = await rolesApi.getEmployeeRoleMappings(params);
    return ok(data);
  },

  async get(mappingId: string): Promise<ApiEnvelope<EmployeeRoleMappingDetailOut>> {
    const data = await rolesApi.getEmployeeRoleMapping(mappingId);
    return ok(data);
  },

  async create(payload: EmployeeRoleMappingCreate): Promise<ApiEnvelope<EmployeeRoleMappingBulkResponse>> {
    const data = await rolesApi.createEmployeeRoleMapping(payload);
    return ok(data);
  },

  async update(payload: EmployeeRoleMappingUpdate): Promise<ApiEnvelope<EmployeeRoleMappingBulkResponse>> {
    const data = await rolesApi.updateEmployeeRoleMappings(payload);
    return ok(data);
  },
};

