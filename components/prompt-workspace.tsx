'use client'

import { useState } from 'react'
import { usePrompts, useCreatePrompt, useUpdatePrompt, useDeletePrompt } from '@/lib/queries/prompts'
import { PromptCard } from '@/components/prompt-card'
import { CreatePromptDialog } from '@/components/create-prompt-dialog'
import { BenchmarkDialog } from '@/components/benchmark-dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Plus, Search, Zap } from 'lucide-react'

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

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <button 
          onClick={() => setShowCreateDialog(true)}
          className="border-2 border-dashed border-gray-300 hover:border-gray-900 rounded-lg p-6 text-left transition-colors group"
        >
          <div className="w-10 h-10 bg-gray-100 group-hover:bg-gray-900 rounded-lg flex items-center justify-center mb-3 transition-colors">
            <Plus className="w-5 h-5 text-gray-600 group-hover:text-white" />
          </div>
          <h3 className="font-semibold text-gray-900 mb-1">Create Prompt</h3>
          <p className="text-sm text-gray-600">Start building your AI prompt</p>
        </button>

        <button className="border border-gray-200 hover:border-gray-900 rounded-lg p-6 text-left transition-colors group">
          <div className="w-10 h-10 bg-gray-100 group-hover:bg-gray-900 rounded-lg flex items-center justify-center mb-3 transition-colors">
            <Search className="w-5 h-5 text-gray-600 group-hover:text-white" />
          </div>
          <h3 className="font-semibold text-gray-900 mb-1">Browse Templates</h3>
          <p className="text-sm text-gray-600">Explore prompt examples</p>
        </button>

        <button className="border border-gray-200 hover:border-gray-900 rounded-lg p-6 text-left transition-colors group">
          <div className="w-10 h-10 bg-gray-100 group-hover:bg-gray-900 rounded-lg flex items-center justify-center mb-3 transition-colors">
            <Zap className="w-5 h-5 text-gray-600 group-hover:text-white" />
          </div>
          <h3 className="font-semibold text-gray-900 mb-1">Quick Test</h3>
          <p className="text-sm text-gray-600">Test across multiple models</p>
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
        <div className="border border-gray-200 rounded-lg p-6">
          <p className="text-sm text-gray-600 mb-1">Total Prompts</p>
          <p className="text-3xl font-bold text-gray-900">{prompts?.length || 0}</p>
          <p className="text-xs text-green-600 mt-2">+2 this week</p>
        </div>
        <div className="border border-gray-200 rounded-lg p-6">
          <p className="text-sm text-gray-600 mb-1">Tests Run</p>
          <p className="text-3xl font-bold text-gray-900">156</p>
          <p className="text-xs text-green-600 mt-2">+23 this week</p>
        </div>
        <div className="border border-gray-200 rounded-lg p-6">
          <p className="text-sm text-gray-600 mb-1">Avg Response</p>
          <p className="text-3xl font-bold text-gray-900">1.8s</p>
          <p className="text-xs text-gray-600 mt-2">Across all models</p>
        </div>
        <div className="border border-gray-200 rounded-lg p-6">
          <p className="text-sm text-gray-600 mb-1">Success Rate</p>
          <p className="text-3xl font-bold text-gray-900">98%</p>
          <p className="text-xs text-green-600 mt-2">Highly reliable</p>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="border border-gray-200 rounded-lg p-6 mb-12">
        <h3 className="text-lg font-semibold text-gray-900 mb-1">Recent Activity</h3>
        <p className="text-sm text-gray-600 mb-6">Your latest prompt tests and updates</p>
        
        <div className="space-y-4">
          {[
            { action: 'Created prompt', title: 'Email Response Generator', time: '2 hours ago', type: 'create' },
            { action: 'Ran benchmark', title: 'Code Review Assistant', models: 'GPT-4, Claude-3', time: '5 hours ago', type: 'benchmark' },
            { action: 'Updated prompt', title: 'Customer Support Bot', time: '1 day ago', type: 'update' },
            { action: 'Tested prompt', title: 'Product Description Writer', models: 'Gemini Pro', time: '2 days ago', type: 'test' },
          ].map((activity, i) => (
            <div key={i} className="flex items-center gap-4 py-3 border-b border-gray-100 last:border-0">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                activity.type === 'create' ? 'bg-green-100' :
                activity.type === 'benchmark' ? 'bg-blue-100' :
                activity.type === 'update' ? 'bg-yellow-100' :
                'bg-purple-100'
              }`}>
                {activity.type === 'create' && <Plus className="w-4 h-4 text-green-700" />}
                {activity.type === 'benchmark' && <Zap className="w-4 h-4 text-blue-700" />}
                {activity.type === 'update' && <Search className="w-4 h-4 text-yellow-700" />}
                {activity.type === 'test' && <Search className="w-4 h-4 text-purple-700" />}
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">{activity.action}: {activity.title}</p>
                {activity.models && (
                  <p className="text-xs text-gray-600">{activity.models}</p>
                )}
              </div>
              <span className="text-xs text-gray-500">{activity.time}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Prompt Templates */}
      <div className="border border-gray-200 rounded-lg p-6 mb-12">
        <h3 className="text-lg font-semibold text-gray-900 mb-1">Quick Start Templates</h3>
        <p className="text-sm text-gray-600 mb-6">Popular prompt templates to get you started</p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            { title: 'Email Response Generator', description: 'Generate professional email responses', category: 'Communication' },
            { title: 'Code Review Assistant', description: 'Review and improve code quality', category: 'Development' },
            { title: 'Product Description Writer', description: 'Create compelling product descriptions', category: 'Marketing' },
            { title: 'Customer Support Bot', description: 'Handle customer inquiries automatically', category: 'Support' },
          ].map((template, i) => (
            <button 
              key={i}
              className="border border-gray-200 hover:border-gray-900 rounded-lg p-4 text-left transition-colors group"
              onClick={() => setShowCreateDialog(true)}
            >
              <div className="flex items-start justify-between mb-2">
                <h4 className="font-medium text-gray-900 group-hover:text-gray-700">{template.title}</h4>
                <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">{template.category}</span>
              </div>
              <p className="text-sm text-gray-600">{template.description}</p>
            </button>
          ))}
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
              {searchTerm ? 'No prompts found' : 'Create your first prompt'}
            </h3>
            <p className="text-gray-600 mb-6">
              {searchTerm 
                ? 'Try a different search term'
                : 'Use the templates above or create your own custom prompt'
              }
            </p>
            <Button 
              onClick={() => setShowCreateDialog(true)}
              className="bg-gray-900 hover:bg-gray-800 text-white"
            >
              <Plus className="w-5 h-5 mr-2" />
              Create Prompt
            </Button>
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