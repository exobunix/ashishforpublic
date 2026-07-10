import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { SiteContent, DEFAULT_CONTENT } from '@/lib/site-content';

type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends (infer U)[] ? U[] : T[P] extends object ? DeepPartial<T[P]> : T[P];
};

function deepMerge<T>(base: T, override: Partial<T>): T {
  const result = { ...base } as T;
  for (const key in override) {
    const val = override[key as keyof typeof override];
    const baseVal = result[key as keyof T];
    if (Array.isArray(val)) {
      (result as Record<string, unknown>)[key] = val;
    } else if (val !== null && typeof val === 'object' && !Array.isArray(baseVal) && typeof baseVal === 'object') {
      (result as Record<string, unknown>)[key] = deepMerge(baseVal as object, val as object);
    } else if (val !== undefined) {
      (result as Record<string, unknown>)[key] = val;
    }
  }
  return result;
}

interface SiteContextValue {
  content: SiteContent;
  update: (partial: DeepPartial<SiteContent>) => Promise<void>;
  reset: () => Promise<void>;
}

const STORAGE_KEY = 'ashish_site_v2';
const API_URL = import.meta.env.VITE_API_URL || 'https://ashishforpublic.onrender.com';

const SiteContext = createContext<SiteContextValue>({
  content: DEFAULT_CONTENT,
  update: async () => {},
  reset: async () => {},
});

export function SiteProvider({ children }: { children: React.ReactNode }) {
  const [content, setContent] = useState<SiteContent>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) return deepMerge(DEFAULT_CONTENT, JSON.parse(saved) as Partial<SiteContent>);
    } catch { /* ignore */ }
    return DEFAULT_CONTENT;
  });

  useEffect(() => {
    fetch(`${API_URL}/api/content`)
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch');
        return res.json();
      })
      .then(data => {
        if (data) {
          setContent(prev => deepMerge(prev, data));
          try { localStorage.setItem(STORAGE_KEY, JSON.stringify(data)); } catch { /* ignore */ }
        }
      })
      .catch(err => console.error('Failed to fetch content from database', err));
  }, []);

  const update = useCallback(async (partial: DeepPartial<SiteContent>) => {
    let nextContent: SiteContent | null = null;
    setContent(prev => {
      const next = deepMerge(prev, partial as Partial<SiteContent>);
      nextContent = next;
      try { localStorage.setItem(STORAGE_KEY, JSON.stringify(next)); } catch { /* ignore */ }
      return next;
    });

    if (nextContent) {
      const res = await fetch(`${API_URL}/api/content`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(nextContent),
      });
      if (!res.ok) {
        throw new Error('Failed to save content to database');
      }
    }
  }, []);

  const reset = useCallback(async () => {
    try { localStorage.removeItem(STORAGE_KEY); } catch { /* ignore */ }
    setContent(DEFAULT_CONTENT);

    const res = await fetch(`${API_URL}/api/content`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(DEFAULT_CONTENT),
    });
    if (!res.ok) {
      throw new Error('Failed to reset content in database');
    }
  }, []);

  return (
    <SiteContext.Provider value={{ content, update, reset }}>
      {children}
    </SiteContext.Provider>
  );
}

export function useSite() {
  return useContext(SiteContext);
}
