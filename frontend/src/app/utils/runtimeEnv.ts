export function getPublicEnv(name: string, fallback?: string) {
  try {
    // Prefer runtime-injected window.__ENV for client-side
    if (typeof window !== 'undefined' && (window as any).__ENV && (window as any).__ENV[name]) {
      return (window as any).__ENV[name] as string;
    }
    // Fallback to build-time NEXT_PUBLIC_* for SSR (if present)
    if (typeof process !== 'undefined' && process.env && process.env[name]) {
      return process.env[name] as string;
    }
  } catch (_) {
    // ignore
  }
  return fallback;
}