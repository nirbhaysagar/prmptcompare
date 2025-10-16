import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'

const isDemoMode = process.env.NEXT_PUBLIC_DISABLE_AUTH === 'true'
const DEMO_API_KEYS_KEY = 'promptforge_demo_api_keys'

export interface ApiKey {
  id: string
  provider: 'openai' | 'anthropic' | 'google' | 'deepseek'
  key: string
  is_valid: boolean
  created_at: string
}

// Fetch all API keys
export function useApiKeys() {
  return useQuery({
    queryKey: ['api-keys'],
    queryFn: async () => {
      if (isDemoMode) {
        const stored = localStorage.getItem(DEMO_API_KEYS_KEY)
        return stored ? JSON.parse(stored) : []
      }
      // In production, fetch from Supabase
      return []
    },
  })
}

// Save API key
export function useSaveApiKey() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ provider, key }: { provider: string; key: string }) => {
      if (isDemoMode) {
        const stored = localStorage.getItem(DEMO_API_KEYS_KEY)
        const keys: ApiKey[] = stored ? JSON.parse(stored) : []
        
        // Remove existing key for this provider
        const filtered = keys.filter(k => k.provider !== provider)
        
        const newKey: ApiKey = {
          id: crypto.randomUUID(),
          provider: provider as ApiKey['provider'],
          key,
          is_valid: true,
          created_at: new Date().toISOString(),
        }
        
        filtered.push(newKey)
        localStorage.setItem(DEMO_API_KEYS_KEY, JSON.stringify(filtered))
        return newKey
      }
      
      // In production, save to Supabase
      return null
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['api-keys'] })
    },
  })
}

// Delete API key
export function useDeleteApiKey() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (provider: string) => {
      if (isDemoMode) {
        const stored = localStorage.getItem(DEMO_API_KEYS_KEY)
        const keys: ApiKey[] = stored ? JSON.parse(stored) : []
        
        const filtered = keys.filter(k => k.provider !== provider)
        localStorage.setItem(DEMO_API_KEYS_KEY, JSON.stringify(filtered))
        return
      }
      
      // In production, delete from Supabase
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['api-keys'] })
    },
  })
}

// Get API key for a specific provider
export function getApiKey(provider: string, keys: ApiKey[]): string | null {
  const key = keys.find(k => k.provider === provider)
  return key?.key || null
}

