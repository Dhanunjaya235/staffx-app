import { useState, useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { setGlobalLoading } from '../store/slices/uiSlice';
import { addToast, removeToast, ToastType } from '../store/slices/toastSlice';
import { AppDispatch } from '../store';
import { delay } from "lodash";
import { AxiosError } from 'axios';
import { extractApiMessage } from '../utils';

interface UseApiOptions {
  showGlobalLoader?: boolean;
}

interface UseApiReturn<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
  execute: (...args: any[]) => Promise<T>;
  reset: () => void;
}

// Global promise tracker
let activePromises = new Set<Promise<any>>();

export const addToastWithTimeout =
  (message: string, type: ToastType, timeout = 3000) =>
    (dispatch: AppDispatch) => {
      const id = Date.now();
      dispatch(addToast({ id, message, type }));

      delay(() => {
        dispatch(removeToast(id));
      }, timeout);
    };

export function useApi<T>(
  apiFunction: (...args: any[]) => Promise<{ data: T; success: boolean; message?: string }>,
  options: UseApiOptions = { showGlobalLoader: true }
): UseApiReturn<T> {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const dispatch = useDispatch<AppDispatch>();

  const execute = useCallback(async (...args: any[]): Promise<T> => {
    setLoading(true);
    setError(null);

    const promise = apiFunction(...args);

    if (options.showGlobalLoader) {
      activePromises.add(promise);
      dispatch(setGlobalLoading(true));
    }

    try {
      const response = await promise;

      if (response.success) {
        setData(response.data);
        return response.data;
      } else {
        throw new Error(response.message || 'API request failed');
      }
    } catch (err) {
      const errorMessage = err instanceof AxiosError ? extractApiMessage(err?.response?.data?.detail) : 'An unknown error occurred';
      setError(errorMessage);
      dispatch(addToastWithTimeout(errorMessage, 'error'));
      throw err;
    } finally {
      setLoading(false);

      if (options.showGlobalLoader) {
        activePromises.delete(promise);
        if (activePromises.size === 0) {
          dispatch(setGlobalLoading(false));
        }
      }
    }
  }, [apiFunction, dispatch, options.showGlobalLoader]);

  const reset = useCallback(() => {
    setData(null);
    setError(null);
    setLoading(false);
  }, []);

  return { data, loading, error, execute, reset };
}

// Hook for multiple API calls
export function useMultipleApi() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const dispatch = useDispatch<AppDispatch>();

  const executeAll = useCallback(async (promises: Promise<any>[]): Promise<any[]> => {
    setLoading(true);
    setError(null);
    dispatch(setGlobalLoading(true));

    // Add all promises to the global tracker
    promises.forEach(promise => activePromises.add(promise));
    try {
      const results = await Promise.all(promises);
      return results;
    } catch (err) {
      const errorMessage = err instanceof AxiosError ? extractApiMessage(err?.response?.data?.detail) : 'An unknown error occurred';
      setError(errorMessage);
      dispatch(addToastWithTimeout(errorMessage, 'error'));
      throw err;
    } finally {
      setLoading(false);
      // Remove all promises from the global tracker
      promises.forEach(promise => activePromises.delete(promise));
      if (activePromises.size === 0) {
        dispatch(setGlobalLoading(false));
      }
    }
  }, [dispatch]);

  return { loading, error, executeAll };
}