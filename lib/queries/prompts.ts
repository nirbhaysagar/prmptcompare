import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { createClient } from '@/lib/supabase/client'
import { Tables, InsertTables, UpdateTables } from '@/lib/supabase'

type Prompt = Tables<'prompts'>
type PromptInsert = InsertTables<'prompts'>
type PromptUpdate = UpdateTables<'prompts'>

const supabase = createClient()

// Fetch all prompts for the current user
export function usePrompts() {
  return useQuery({
    queryKey: ['prompts'],
    queryFn: async () => {
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
