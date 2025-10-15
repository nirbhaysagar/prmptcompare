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
import { 
  Plus, 
  Search, 
  FileText, 
  Zap, 
  TrendingUp, 
  Clock,
  BarChart3,
  Star,
  ArrowRight,
  Sparkles,
  Target,
  Rocket,
  Activity
} from 'lucide-react'

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

  const recentPrompts = prompts?.slice(0, 3) || []
  const totalTags = new Set(prompts?.flatMap(p => p.tags) || []).size

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Error loading prompts</h2>
          <p className="text-gray-600">{error.message}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">Welcome back! 👋</h1>
            <p className="text-blue-100 text-lg">
              Ready to optimize your AI prompts? Let's create something amazing.
            </p>
          </div>
          <div className="hidden md:flex items-center space-x-4">
            <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4">
              <Sparkles className="w-8 h-8 text-yellow-300" />
            </div>
            <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4">
              <Rocket className="w-8 h-8 text-green-300" />
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-50 to-blue-100 hover:shadow-xl transition-all duration-300">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-600 mb-1">Total Prompts</p>
                <p className="text-3xl font-bold text-blue-900">{prompts?.length || 0}</p>
                <p className="text-xs text-blue-600 mt-1">+2 this week</p>
              </div>
              <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center">
                <FileText className="w-6 h-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg bg-gradient-to-br from-green-50 to-green-100 hover:shadow-xl transition-all duration-300">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-600 mb-1">Active Tests</p>
                <p className="text-3xl font-bold text-green-900">{prompts?.filter(p => p.is_public).length || 0}</p>
                <p className="text-xs text-green-600 mt-1">Benchmark ready</p>
              </div>
              <div className="w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center">
                <Zap className="w-6 h-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg bg-gradient-to-br from-purple-50 to-purple-100 hover:shadow-xl transition-all duration-300">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-purple-600 mb-1">Categories</p>
                <p className="text-3xl font-bold text-purple-900">{totalTags}</p>
                <p className="text-xs text-purple-600 mt-1">Organized</p>
              </div>
              <div className="w-12 h-12 bg-purple-500 rounded-xl flex items-center justify-center">
                <Target className="w-6 h-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg bg-gradient-to-br from-orange-50 to-orange-100 hover:shadow-xl transition-all duration-300">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-orange-600 mb-1">Performance</p>
                <p className="text-3xl font-bold text-orange-900">4.2</p>
                <p className="text-xs text-orange-600 mt-1">Avg rating</p>
              </div>
              <div className="w-12 h-12 bg-orange-500 rounded-xl flex items-center justify-center">
                <Star className="w-6 h-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Create Prompt Card */}
        <Card className="border-2 border-dashed border-gray-300 hover:border-blue-500 transition-all duration-300 cursor-pointer group"
              onClick={() => setShowCreateDialog(true)}>
          <CardContent className="p-8 text-center">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-blue-200 transition-colors">
              <Plus className="w-8 h-8 text-blue-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Create New Prompt</h3>
            <p className="text-gray-600 text-sm mb-4">Start building your AI prompt from scratch</p>
            <Button className="w-full">
              <Plus className="w-4 h-4 mr-2" />
              Get Started
            </Button>
          </CardContent>
        </Card>

        {/* Quick Benchmark Card */}
        <Card className="border-0 shadow-lg bg-gradient-to-br from-indigo-50 to-indigo-100 hover:shadow-xl transition-all duration-300">
          <CardContent className="p-6">
            <div className="flex items-center mb-4">
              <div className="w-10 h-10 bg-indigo-500 rounded-lg flex items-center justify-center mr-3">
                <BarChart3 className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-indigo-900">Quick Benchmark</h3>
                <p className="text-sm text-indigo-600">Test across models</p>
              </div>
            </div>
            <p className="text-sm text-indigo-700 mb-4">
              Compare your prompts across multiple AI models in seconds
            </p>
            <Button variant="outline" className="w-full border-indigo-200 text-indigo-700 hover:bg-indigo-50">
              <ArrowRight className="w-4 h-4 mr-2" />
              Run Test
            </Button>
          </CardContent>
        </Card>

        {/* Analytics Card */}
        <Card className="border-0 shadow-lg bg-gradient-to-br from-emerald-50 to-emerald-100 hover:shadow-xl transition-all duration-300">
          <CardContent className="p-6">
            <div className="flex items-center mb-4">
              <div className="w-10 h-10 bg-emerald-500 rounded-lg flex items-center justify-center mr-3">
                <TrendingUp className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-emerald-900">View Analytics</h3>
                <p className="text-sm text-emerald-600">Track performance</p>
              </div>
            </div>
            <p className="text-sm text-emerald-700 mb-4">
              Monitor usage, costs, and performance metrics
            </p>
            <Button variant="outline" className="w-full border-emerald-200 text-emerald-700 hover:bg-emerald-50">
              <Activity className="w-4 h-4 mr-2" />
              View Insights
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Enhanced Search and Filter */}
      <Card className="border-0 shadow-lg">
        <CardContent className="p-6">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <Input
                  placeholder="Search prompts by title, description, or tags..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-12 h-12 text-lg border-2 focus:border-blue-500"
                />
              </div>
            </div>
            <Button 
              onClick={() => setShowCreateDialog(true)}
              size="lg"
              className="h-12 px-8 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
            >
              <Plus className="w-5 h-5 mr-2" />
              New Prompt
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Recent Activity or Empty State */}
      {filteredPrompts.length === 0 ? (
        <Card className="border-0 shadow-lg">
          <CardContent className="flex flex-col items-center justify-center py-16">
            <div className="w-24 h-24 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center mb-6">
              <Sparkles className="w-12 h-12 text-blue-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-3">
              {searchTerm ? 'No prompts found' : 'Ready to create your first prompt?'}
            </h3>
            <p className="text-gray-600 text-center mb-8 max-w-md">
              {searchTerm 
                ? 'Try adjusting your search terms or create a new prompt'
                : 'Start building amazing AI prompts and test them across multiple models'
              }
            </p>
            {!searchTerm && (
              <div className="flex flex-col sm:flex-row gap-4">
                <Button 
                  onClick={() => setShowCreateDialog(true)}
                  size="lg"
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                >
                  <Plus className="w-5 h-5 mr-2" />
                  Create Your First Prompt
                </Button>
                <Button variant="outline" size="lg">
                  <Rocket className="w-5 h-5 mr-2" />
                  Learn More
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      ) : (
        <div>
          {/* Section Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Your Prompts</h2>
              <p className="text-gray-600 mt-1">
                {filteredPrompts.length} prompt{filteredPrompts.length !== 1 ? 's' : ''} found
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                <Clock className="w-3 h-3 mr-1" />
                Recently updated
              </Badge>
            </div>
          </div>

          {/* Prompts Grid */}
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
        </div>
      )}

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