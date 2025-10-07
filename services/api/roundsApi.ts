import { RoundCreate, RoundOut, RoundUpdate } from '../../types/staffx-types';
import AxiosInstance from './axiosInstance';
import { ok, ApiEnvelope } from './helpers';

export interface AttachmentValue {
  filename: string;
  filetype: string;
  filedata: string;
}

export interface CreateInterviewRound {
  roundNumber: number;
  roundType: string;
  interviewer: string;
  date: string;
  status: string;
  feedback?: string;
  resourceId: string;
  attachments?: AttachmentValue[];
}

export interface UpdateInterviewRound extends Partial<CreateInterviewRound> {}

export const roundsApi = {
  // Core methods (raw)
  getRoundsByResource: async (resourceId: string): Promise<RoundOut[]> => {
    const response = await AxiosInstance.get<RoundOut[]>('/rounds/', {
      params: { resource_id: resourceId },
    });
    return response.data;
  },

  createRound: async (data: RoundCreate): Promise<RoundOut> => {
    const response = await AxiosInstance.post<RoundOut>('/rounds/', data);
    return response.data;
  },

  updateRound: async (roundId: string, data: RoundUpdate): Promise<RoundOut> => {
    const response = await AxiosInstance.put<RoundOut>(`/rounds/${roundId}`, data);
    return response.data;
  },

  // App adapter methods (enveloped)
  async getAllByResource(resourceId: string): Promise<ApiEnvelope<RoundOut[]>> {
    const data = await roundsApi.getRoundsByResource(resourceId);
    return ok(data);
  },

  async create(payload: RoundCreate): Promise<ApiEnvelope<RoundOut>> {
    const data = await roundsApi.createRound(payload);
    return ok(data);
  },

  async update(roundId: string, payload: RoundUpdate): Promise<ApiEnvelope<RoundOut>> {
    const data = await roundsApi.updateRound(roundId, payload);
    return ok(data);
  },
};

