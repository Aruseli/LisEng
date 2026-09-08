/**
 * Шим next/navigation → TanStack Router (для портированных компонентов).
 */
import { useNavigate } from '@tanstack/react-router'

export function useRouter() {
  const navigate = useNavigate()
  return {
    push: (to: string) => navigate({ to }),
    replace: (to: string) => navigate({ to, replace: true }),
    back: () => window.history.back(),
  }
}

export function useSearchParams() {
  return new URLSearchParams(typeof window !== 'undefined' ? window.location.search : '')
}
