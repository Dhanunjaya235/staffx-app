import { PaginatedResources, ResourceCreate, ResourceOut, ResourcesQueryParams, ResourceUpdate } from '../../types/staffx-types';
import AxiosInstance from './axiosInstance';
import { ok, ApiEnvelope } from './helpers';

export interface FileValue {
  fileName: string;
  fileType: string;
  fileValue: string;
}

export interface AttachmentValue {
  filename: string;
  filetype: string;
  filedata: string;
}

export type ResourceType = 'Cognine'|'Vendor'|'Consultant';

export interface CreateResourceCommon {
  name: string;
  email: string;
  phone: string;
  jobId: string;
  clientId: string;
  resourceType: ResourceType;
  skills: string[];
  experience: number;
  resume?: FileValue | null;
  attachments?: AttachmentValue[];
}

export interface CreateVendorResource extends CreateResourceCommon {
  vendorId: string;
}

export type CreateResource = CreateResourceCommon | CreateVendorResource;

export interface UpdateResource extends Partial<CreateResourceCommon> {}

// Resources API
export const resourcesApi = {
  // Core methods (raw)
  getResources: async (params?: ResourcesQueryParams): Promise<PaginatedResources> => {
    const response = await AxiosInstance.get<PaginatedResources>('/resources/', {
      params: {
        ...params,
        job_id: params?.job_id, // required
        page: params?.page ?? 1,
        page_size: params?.page_size ?? 10,
        resource_status: params?.resource_status, // optional, add to ResourcesQueryParams if not present
      },
      // If you need to send authorization header:
      // headers: { authorization: params?.authorization }
    });
    return response.data;
  },

  getResourceById: async (resourceId: string): Promise<ResourceOut> => {
    const response = await AxiosInstance.get<ResourceOut>(`/resources/${resourceId}`);
    return response.data;
  },

  createResource: async (data: ResourceCreate): Promise<ResourceOut> => {
    const response = await AxiosInstance.post<ResourceOut>('/resources/', data);
    return response.data;
  },

  updateResource: async (resourceId: string, data: ResourceUpdate): Promise<ResourceOut> => {
    const response = await AxiosInstance.put<ResourceOut>(`/resources/${resourceId}`, data);
    return response.data;
  },

  // App adapter methods (enveloped)
  async getAll(params?: ResourcesQueryParams): Promise<ApiEnvelope<PaginatedResources>> {
    const data = await resourcesApi.getResources(params);
    return ok(data);
  },

  async getResource(resourceId: string): Promise<ApiEnvelope<ResourceOut>> {
    const data = await resourcesApi.getResourceById(resourceId);
    return ok(data);
  },

  async create(payload: ResourceCreate): Promise<ApiEnvelope<ResourceOut>> {
    const data = await resourcesApi.createResource(payload);
    return ok(data);
  },

  async update(resourceId: string, payload: ResourceUpdate): Promise<ApiEnvelope<ResourceOut>> {
    const data = await resourcesApi.updateResource(resourceId, payload);
    return ok(data);
  },
};

