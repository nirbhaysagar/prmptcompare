'use client'

import { useState } from 'react'
import { useAuth } from '@/components/auth-provider'
import { usePrompts, useCreatePrompt, useUpdatePrompt, useDeletePrompt } from '@/lib/queries/prompts'
import { PromptCard } from '@/components/prompt-card'
import { CreatePromptDialog } from '@/components/create-prompt-dialog'
import { BenchmarkDialog } from '@/components/benchmark-dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Plus, Search, LogOut } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

export function PromptWorkspace() {
  const { user } = useAuth()
  const [searchTerm, setSearchTerm] = useState('')
  const [showCreateDialog, setShowCreateDialog] = useState(false)
  const [showBenchmarkDialog, setShowBenchmarkDialog] = useState(false)
  const [selectedPrompt, setSelectedPrompt] = useState<any>(null)
  const { data: prompts, isLoading, error } = usePrompts()
  const createPrompt = useCreatePrompt()
  const updatePrompt = useUpdatePrompt()
  const deletePrompt = useDeletePrompt()
  const supabase = createClient()

  const handleSignOut = async () => {
    await supabase.auth.signOut()
  }

  const handleBenchmark = (prompt: any) => {
    setSelectedPrompt(prompt)
    setShowBenchmarkDialog(true)
  }

  const handleRunBenchmark = async (promptId: string, models: string[], testInput: string) => {
    // For now, just show an alert - we'll implement the actual benchmarking next
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
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Error loading prompts</h2>
          <p className="text-gray-600">{error.message}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-gray-900">PromptForge</h1>
              <Badge variant="secondary" className="ml-3">
                {user?.email}
              </Badge>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="outline" onClick={handleSignOut}>
                <LogOut className="w-4 h-4 mr-2" />
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Prompts</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{prompts?.length || 0}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Public Prompts</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {prompts?.filter(p => p.is_public).length || 0}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Tags Used</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {new Set(prompts?.flatMap(p => p.tags) || []).size}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search and Create */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search prompts by title, description, or tags..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          <Button onClick={() => setShowCreateDialog(true)}>
            <Plus className="w-4 h-4 mr-2" />
            New Prompt
          </Button>
        </div>

        {/* Prompts Grid */}
        {filteredPrompts.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <div className="text-center">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {searchTerm ? 'No prompts found' : 'No prompts yet'}
                </h3>
                <p className="text-gray-600 mb-4">
                  {searchTerm 
                    ? 'Try adjusting your search terms'
                    : 'Create your first prompt to get started with PromptForge'
                  }
                </p>
                {!searchTerm && (
                  <Button onClick={() => setShowCreateDialog(true)}>
                    <Plus className="w-4 h-4 mr-2" />
                    Create Your First Prompt
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
      </main>

      {/* Create Prompt Dialog */}
      <CreatePromptDialog
        open={showCreateDialog}
        onOpenChange={setShowCreateDialog}
        onCreate={createPrompt.mutate}
        isLoading={createPrompt.isPending}
      />

      {/* Benchmark Dialog */}
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
