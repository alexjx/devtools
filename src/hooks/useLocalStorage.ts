import { useEffect, useState } from "react";

export function useLocalStorage<T>(key: string, fallback: T, validate: (value: unknown) => T | null) {
  const [value, setValue] = useState<T>(() => {
    if (typeof window === "undefined") return fallback;

    try {
      const stored = window.localStorage.getItem(key);
      if (!stored) return fallback;
      return validate(JSON.parse(stored)) ?? fallback;
    } catch {
      return fallback;
    }
  });

  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch {
      // Ignore storage failures; the tool remains fully usable without persistence.
    }
  }, [key, value]);

  return [value, setValue] as const;
}
