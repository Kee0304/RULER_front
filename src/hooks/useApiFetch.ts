import { useState, useEffect } from 'react';

interface UseApiFetchResult<T> {
  data: T;
  setData: React.Dispatch<React.SetStateAction<T>>;
  loading: boolean;
  error: string | null;
}

function normalizeApiUrl(url: string) {
  if (!url) return '';

  // 이미 /api로 시작하면 그대로 사용
  if (url.startsWith('/api')) return url;

  // /로 시작하면 /api만 앞에 붙임
  if (url.startsWith('/')) return `/api${url}`;

  // / 없이 들어오면 /api/를 붙임
  return `/api/${url}`;
}

export async function apiFetch<T>(
  url: string,
  options?: { method?: string; body?: unknown }
): Promise<T> {

  let abortTime = 120000;
  if (url === "/upload-pdf") {
    abortTime = 1800000;
  }
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), abortTime);

  const headers: Record<string, string> = {};
  let body: FormData | string | undefined;

  if (options?.body instanceof FormData) {
    body = options.body;
  } else if (options?.body) {
    headers['Content-Type'] = 'application/json';
    body = JSON.stringify(options.body);
  }

  try {
    const res = await fetch(normalizeApiUrl(url), {
      method: options?.method || 'GET',
      headers,
      body,
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!res.ok) {
      throw new Error(`서버에 에러가 발생했습니다 (HTTP ${res.status})`);
    }

    return (await res.json()) as T;
  } catch (err: any) {
    clearTimeout(timeoutId);

    if (err.name === 'AbortError') {
      throw new Error('요청 시간이 초과되었습니다');
    }

    if (
      err.message?.includes('Failed to fetch') ||
      err.message?.includes('NetworkError') ||
      err.message?.includes('fetch')
    ) {
      throw new Error('서버에 연결할 수 없습니다. 잠시 후 다시 시도해주세요.');
    }

    throw err;
  }
}

export function useApiFetch<T>(url: string, fallbackData: T): UseApiFetchResult<T> {
  const [data, setData] = useState<T>(fallbackData);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!url) return;

    let cancelled = false;
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000);

    setLoading(true);
    setError(null);

    fetch(normalizeApiUrl(url), { signal: controller.signal })
      .then((res) => {
        if (!res.ok) {
          throw new Error(`서버에 에러가 발생했습니다 (HTTP ${res.status})`);
        }
        return res.json();
      })
      .then((json: T) => {
        if (!cancelled) {
          setData(json);
        }
      })
      .catch((err: Error) => {
        if (cancelled) return;

        if (err.name === 'AbortError') {
          setError('요청 시간이 초과되었습니다');
        } else if (
          err.message.includes('Failed to fetch') ||
          err.message.includes('NetworkError') ||
          err.message.includes('fetch')
        ) {
          setError('서버에 연결할 수 없습니다. 잠시 후 다시 시도해주세요.');
        } else {
          setError(err.message);
        }
      })
      .finally(() => {
        clearTimeout(timeoutId);
        if (!cancelled) {
          setLoading(false);
        }
      });

    return () => {
      cancelled = true;
      controller.abort();
      clearTimeout(timeoutId);
    };
  }, [url]);

  return { data, setData, loading, error };
}