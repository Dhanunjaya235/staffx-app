export interface ApiEnvelope<T> {
  data: T;
  success: boolean;
  message?: string;
}

export function unwrap<T>(response: ApiEnvelope<T>): T {
  return response.data;
}

export function ok<T>(data: T, message?: string): ApiEnvelope<T> {
  return { data, success: true, message };
}

