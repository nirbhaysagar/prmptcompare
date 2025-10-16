'use client'

import { useState } from 'react'
import { usePrompts, useCreatePrompt, useUpdatePrompt, useDeletePrompt } from '@/lib/queries/prompts'
import { PromptCard } from '@/components/prompt-card'
import { CreatePromptDialog } from '@/components/create-prompt-dialog'
import { BenchmarkDialog } from '@/components/benchmark-dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Plus, Search } from 'lucide-react'

export function PromptWorkspace() {
  const disableAuth = process.env.NEXT_PUBLIC_DISABLE_AUTH === 'true'
  const [searchTerm, setSearchTerm] = useState('')
  const [showCreateDialog, setShowCreateDialog] = useState(false)
  const [showBenchmarkDialog, setShowBenchmarkDialog] = useState(false)
  const [selectedPrompt, setSelectedPrompt] = useState<any>(null)
  const { data: prompts, isLoading, error } = usePrompts()
  const createPrompt = useCreatePrompt()
  const updatePrompt = useUpdatePrompt()
  const deletePrompt = useDeletePrompt()

  const handleBenchmark = (prompt: any) => {
    setSelectedPrompt(prompt)
    setShowBenchmarkDialog(true)
  }

  const handleRunBenchmark = async (promptId: string, models: string[], testInput: string) => {
    alert(`Running benchmark for prompt ${promptId} with models: ${models.join(', ')}`)
    console.log('Test input:', testInput)
  }

  const filteredPrompts = prompts?.filter(prompt =>
    prompt.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    prompt.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    prompt.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
  ) || []

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-gray-900 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
          <p className="text-sm text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <p className="text-red-600 font-medium mb-2">Error loading prompts</p>
          <p className="text-sm text-gray-600">{error.message}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header Section */}
      <div className="mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-3">Prompts</h1>
        <p className="text-gray-600 text-lg">Manage and test your AI prompts</p>
      </div>

      {/* Search and Create */}
      <div className="mb-8 flex gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <Input
            type="text"
            placeholder="Search prompts..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-12 h-12 border-gray-300 focus:border-gray-900 focus:ring-gray-900"
          />
        </div>
        <Button 
          onClick={() => setShowCreateDialog(true)}
          className="h-12 px-6 bg-gray-900 hover:bg-gray-800 text-white"
        >
          <Plus className="w-5 h-5 mr-2" />
          New Prompt
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-6 mb-12">
        <div className="border border-gray-200 rounded-lg p-6">
          <p className="text-sm text-gray-600 mb-1">Total Prompts</p>
          <p className="text-3xl font-bold text-gray-900">{prompts?.length || 0}</p>
        </div>
        <div className="border border-gray-200 rounded-lg p-6">
          <p className="text-sm text-gray-600 mb-1">Active</p>
          <p className="text-3xl font-bold text-gray-900">{prompts?.filter(p => p.is_public).length || 0}</p>
        </div>
        <div className="border border-gray-200 rounded-lg p-6">
          <p className="text-sm text-gray-600 mb-1">Categories</p>
          <p className="text-3xl font-bold text-gray-900">{new Set(prompts?.flatMap(p => p.tags) || []).size}</p>
        </div>
      </div>

      {/* Prompts List */}
      {filteredPrompts.length === 0 ? (
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-16 text-center">
          <div className="max-w-sm mx-auto">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Plus className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              {searchTerm ? 'No prompts found' : 'No prompts yet'}
            </h3>
            <p className="text-gray-600 mb-6">
              {searchTerm 
                ? 'Try a different search term'
                : 'Create your first prompt to get started'
              }
            </p>
            {!searchTerm && (
              <Button 
                onClick={() => setShowCreateDialog(true)}
                className="bg-gray-900 hover:bg-gray-800 text-white"
              >
                <Plus className="w-5 h-5 mr-2" />
                Create Prompt
              </Button>
            )}
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredPrompts.map((prompt) => (
            <PromptCard
              key={prompt.id}
              prompt={prompt}
              onUpdate={updatePrompt.mutate}
              onDelete={deletePrompt.mutate}
              onBenchmark={handleBenchmark}
            />
          ))}
        </div>
      )}

      {/* Dialogs */}
      <CreatePromptDialog
        open={showCreateDialog}
        onOpenChange={setShowCreateDialog}
        onCreate={createPrompt.mutate}
        isLoading={createPrompt.isPending}
      />

      <BenchmarkDialog
        open={showBenchmarkDialog}
        onOpenChange={setShowBenchmarkDialog}
        prompt={selectedPrompt}
        onRunBenchmark={handleRunBenchmark}
        isLoading={false}
      />
    </div>
  )
}