import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { createClient } from '@/lib/supabase/client'
import { Tables, InsertTables, UpdateTables } from '@/lib/supabase'

type Prompt = Tables<'prompts'>
type PromptInsert = InsertTables<'prompts'>
type PromptUpdate = UpdateTables<'prompts'>

const supabase = createClient()
const isDemoMode = process.env.NEXT_PUBLIC_DISABLE_AUTH === 'true'

// Demo mode storage keys
const DEMO_PROMPTS_KEY = 'promptforge_demo_prompts'
const DEMO_API_KEYS_KEY = 'promptforge_demo_api_keys'
const DEMO_BENCHMARKS_KEY = 'promptforge_demo_benchmarks'

// Fetch all prompts for the current user
export function usePrompts() {
  return useQuery({
    queryKey: ['prompts'],
    queryFn: async () => {
      if (isDemoMode) {
        // In demo mode, use localStorage
        const stored = localStorage.getItem(DEMO_PROMPTS_KEY)
        if (stored) return JSON.parse(stored)
        
        // Initialize with sample prompts if none exist
        const samplePrompts = [
          {
            id: 'demo-1',
            user_id: 'demo-user',
            title: 'Email Response Generator',
            description: 'Generate professional email responses to customer inquiries',
            content: 'You are a professional customer service representative. Generate a helpful, polite, and professional email response to the following customer inquiry:\n\n[Customer Inquiry]\n\nGuidelines:\n- Be empathetic and understanding\n- Provide clear, actionable solutions\n- Maintain a professional tone\n- Keep it concise but thorough',
            tags: ['email', 'customer-service', 'professional'],
            is_public: false,
            created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
            updated_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
          },
          {
            id: 'demo-2',
            user_id: 'demo-user',
            title: 'Code Review Assistant',
            description: 'Review and provide feedback on code quality and best practices',
            content: 'You are an experienced software engineer conducting a code review. Analyze the following code and provide constructive feedback:\n\n[Code Block]\n\nPlease evaluate:\n1. Code quality and readability\n2. Performance considerations\n3. Security best practices\n4. Potential bugs or edge cases\n5. Suggestions for improvement\n\nBe specific and actionable in your feedback.',
            tags: ['code-review', 'development', 'feedback'],
            is_public: false,
            created_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
            updated_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
          },
          {
            id: 'demo-3',
            user_id: 'demo-user',
            title: 'Product Description Writer',
            description: 'Create compelling product descriptions for e-commerce',
            content: 'You are a skilled copywriter specializing in e-commerce product descriptions. Write an engaging, persuasive product description for:\n\n[Product Details]\n\nRequirements:\n- Highlight key benefits and features\n- Use persuasive language that drives sales\n- Include relevant keywords for SEO\n- Create urgency and desire\n- Keep it scannable with bullet points\n- Maintain authenticity and trust',
            tags: ['marketing', 'e-commerce', 'copywriting'],
            is_public: true,
            created_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
            updated_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
          }
        ]
        
        localStorage.setItem(DEMO_PROMPTS_KEY, JSON.stringify(samplePrompts))
        return samplePrompts
      }

      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('Not authenticated')

      const { data, error } = await supabase
        .from('prompts')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

      if (error) throw error
      return data
    },
  })
}

// Fetch a single prompt by ID
export function usePrompt(id: string) {
  return useQuery({
    queryKey: ['prompts', id],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('Not authenticated')

      const { data, error } = await supabase
        .from('prompts')
        .select('*')
        .eq('id', id)
        .eq('user_id', user.id)
        .single()

      if (error) throw error
      return data
    },
    enabled: !!id,
  })
}

// Create a new prompt
export function useCreatePrompt() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (prompt: PromptInsert) => {
      if (isDemoMode) {
        // In demo mode, save to localStorage
        const stored = localStorage.getItem(DEMO_PROMPTS_KEY)
        const prompts = stored ? JSON.parse(stored) : []
        
        const newPrompt = {
          ...prompt,
          id: crypto.randomUUID(),
          user_id: 'demo-user',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        }
        
        prompts.unshift(newPrompt) // Add to beginning
        localStorage.setItem(DEMO_PROMPTS_KEY, JSON.stringify(prompts))
        return newPrompt
      }

      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('Not authenticated')

      const { data, error } = await supabase
        .from('prompts')
        .insert({
          ...prompt,
          user_id: user.id,
        })
        .select()
        .single()

      if (error) throw error
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['prompts'] })
    },
  })
}

// Update a prompt
export function useUpdatePrompt() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ id, ...updates }: PromptUpdate & { id: string }) => {
      if (isDemoMode) {
        // In demo mode, update localStorage
        const stored = localStorage.getItem(DEMO_PROMPTS_KEY)
        const prompts = stored ? JSON.parse(stored) : []
        
        const index = prompts.findIndex((p: any) => p.id === id)
        if (index === -1) throw new Error('Prompt not found')
        
        prompts[index] = {
          ...prompts[index],
          ...updates,
          updated_at: new Date().toISOString(),
        }
        
        localStorage.setItem(DEMO_PROMPTS_KEY, JSON.stringify(prompts))
        return prompts[index]
      }

      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('Not authenticated')

      const { data, error } = await supabase
        .from('prompts')
        .update(updates)
        .eq('id', id)
        .eq('user_id', user.id)
        .select()
        .single()

      if (error) throw error
      return data
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['prompts'] })
      queryClient.invalidateQueries({ queryKey: ['prompts', data.id] })
    },
  })
}

// Delete a prompt
export function useDeletePrompt() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id: string) => {
      if (isDemoMode) {
        // In demo mode, remove from localStorage
        const stored = localStorage.getItem(DEMO_PROMPTS_KEY)
        const prompts = stored ? JSON.parse(stored) : []
        
        const filtered = prompts.filter((p: any) => p.id !== id)
        localStorage.setItem(DEMO_PROMPTS_KEY, JSON.stringify(filtered))
        return
      }

      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('Not authenticated')

      const { error } = await supabase
        .from('prompts')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id)

      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['prompts'] })
    },
  })
}
