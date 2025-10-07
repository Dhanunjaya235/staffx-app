import { JobCreate, JobOut, JobsQueryParams, JobUpdate, PaginatedJobs } from '../../types/staffx-types';
import AxiosInstance from './axiosInstance';
import { ok, ApiEnvelope } from './helpers';

export interface AttachmentValue {
  filename: string;
  filetype: string;
  filedata: string;
}

export interface CreateJob {
  title: string;
  clientId: string;
  roleId: string;
  description: string;
  status?: string;
  deadline?: string | null;
  attachments?: AttachmentValue[];
}

export interface UpdateJob extends Partial<CreateJob> {}

export const jobsApi = {
  // Core methods (raw)
  getJobs: async (params?: JobsQueryParams): Promise<PaginatedJobs> => {
    const response = await AxiosInstance.get<PaginatedJobs>('/jobs/', {
      params: {
        ...params
      },
    });
    return response.data;
  },

  getJob: async (jobId: string): Promise<JobOut> => {
    const response = await AxiosInstance.get<JobOut>(`/jobs/${jobId}`);
    return response.data;
  },

  createJob: async (data: JobCreate): Promise<JobOut> => {
    const response = await AxiosInstance.post<JobOut>('/jobs/', data);
    return response.data;
  },

  updateJob: async (jobId: string, data: JobUpdate): Promise<JobOut> => {
    const response = await AxiosInstance.put<JobOut>(`/jobs/${jobId}`, data);
    return response.data;
  },

  async getJobById(jobId: string): Promise<ApiEnvelope<JobOut>> {
    const data = await jobsApi.getJob(jobId);
    return ok(data);
  },
  // App adapter methods (enveloped)
  async getAll(params?: JobsQueryParams): Promise<ApiEnvelope<PaginatedJobs>> {
    const data = await jobsApi.getJobs(params);
    return ok(data);
  },

  async create(payload: JobCreate): Promise<ApiEnvelope<JobOut>> {
    const data = await jobsApi.createJob(payload);
    return ok(data);
  },

  async update(id: string, payload: JobUpdate): Promise<ApiEnvelope<JobOut>> {
    const data = await jobsApi.updateJob(id, payload);
    return ok(data);
  },
};

