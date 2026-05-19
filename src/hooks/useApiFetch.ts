import { useState, useEffect } from 'react';

interface UseApiFetchResult<T> {
  data: T;
  setData: React.Dispatch<React.SetStateAction<T>>;
  loading: boolean;
  error: string | null;
}

export async function apiFetch<T>(
  url: string,
  options?: { method?: string; body?: unknown }
): Promise<T> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 10000);

  try {
    const res = await fetch(url, {
      method: options?.method || 'GET',
      headers: { 'Content-Type': 'application/json' },
      body: options?.body ? JSON.stringify(options.body) : undefined,
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
      throw new Error('요청 시간이 초과되었습니다 (10초)');
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

/**
 * API fetch 훅 — fallback 데이터를 즉시 제공하고,
 * URL이 설정되면 fetch를 시도해 성공 시에만 데이터를 교체합니다.
 *
 * [사용법]
 * const { data, setData, loading, error } = useApiFetch<XXX>('/api/xxx', fallbackData);
 *
 * [특징]
 * - 10초 타임아웃 후 요청 자동 취소 (AbortController)
 * - HTTP 500 이상 또는 네트워크 에러 시 error 상태 반환
 * - fetch 성공 시에만 data가 교체됩니다 (fallback 유지)
 */
export function useApiFetch<T>(url: string, fallbackData: T): UseApiFetchResult<T> {
  const [data, setData] = useState<T>(fallbackData);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // URL이 비어있으면 fetch를 수행하지 않습니다 (mock/fallback 전용 모드)
    if (!url) return;

    let cancelled = false;
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000);

    setLoading(true);
    setError(null);

    fetch(url, { signal: controller.signal })
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
          setError('요청 시간이 초과되었습니다 (10초)');
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