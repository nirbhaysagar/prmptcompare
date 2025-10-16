'use client'

import { useState } from 'react'
import { Tables } from '@/lib/supabase'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { X, Play, Settings, Loader2 } from 'lucide-react'
import { runBenchmark, BenchmarkResult } from '@/lib/benchmark'
import { useApiKeys } from '@/lib/queries/api-keys'
import { BenchmarkResultsView } from './benchmark-results-view'

type Prompt = Tables<'prompts'>

interface BenchmarkDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  prompt: Prompt | null
  onRunBenchmark?: (promptId: string, models: string[], testInput: string) => void
  isLoading?: boolean
}

const AVAILABLE_MODELS = [
  { provider: 'openai', name: 'OpenAI', models: ['gpt-4', 'gpt-4-turbo', 'gpt-3.5-turbo'] },
  { provider: 'anthropic', name: 'Anthropic', models: ['claude-3-opus-20240229', 'claude-3-sonnet-20240229', 'claude-3-haiku-20240307'] },
  { provider: 'google', name: 'Google', models: ['gemini-pro'] },
  { provider: 'deepseek', name: 'DeepSeek', models: ['deepseek-chat', 'deepseek-coder'] },
]

export function BenchmarkDialog({ 
  open, 
  onOpenChange, 
  prompt,
  onRunBenchmark,
  isLoading: externalIsLoading 
}: BenchmarkDialogProps) {
  const { data: apiKeys = [] } = useApiKeys()
  const [selectedModels, setSelectedModels] = useState<string[]>(['openai-gpt-4', 'anthropic-claude-3-sonnet-20240229'])
  const [testInput, setTestInput] = useState('')
  const [showApiKeys, setShowApiKeys] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [results, setResults] = useState<BenchmarkResult[] | null>(null)

  if (!open || !prompt) return null

  const handleModelToggle = (model: string) => {
    setSelectedModels(prev => 
      prev.includes(model) 
        ? prev.filter(m => m !== model)
        : [...prev, model]
    )
  }

  const handleRunBenchmark = async () => {
    if (selectedModels.length === 0) return
    
    setIsLoading(true)
    try {
      const benchmarkResults = await runBenchmark({
        prompt: testInput || prompt.content,
        models: selectedModels,
        apiKeys,
      })
      setResults(benchmarkResults)
      
      if (onRunBenchmark) {
        onRunBenchmark(prompt.id, selectedModels, testInput)
      }
    } catch (error) {
      console.error('Benchmark error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleClose = () => {
    setResults(null)
    onOpenChange(false)
  }

  const extractVariables = (content: string): string[] => {
    const matches = content.match(/\{([^}]+)\}/g)
    return matches ? matches.map(match => match.slice(1, -1)) : []
  }

  const variables = extractVariables(prompt.content)

  // Show results if available
  if (results) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div 
          className="fixed inset-0 bg-black bg-opacity-60" 
          onClick={handleClose}
        />
        <div className="relative w-full max-w-6xl bg-white rounded-lg shadow-2xl border border-gray-200 max-h-[90vh] overflow-y-auto">
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Benchmark Results</h2>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleClose}
                className="h-8 w-8 text-gray-500 hover:text-gray-700"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            <BenchmarkResultsView results={results} onClose={handleClose} />
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-60" 
        onClick={() => !isLoading && onOpenChange(false)}
      />
      
      {/* Modal */}
      <div className="relative w-full max-w-4xl bg-white rounded-lg shadow-2xl border border-gray-200 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Benchmark Prompt</h2>
            <p className="text-sm text-gray-600 mt-1">
              Test "{prompt.title}" across multiple AI models
            </p>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onOpenChange(false)}
            disabled={isLoading}
            className="h-8 w-8 text-gray-500 hover:text-gray-700"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Prompt Preview */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-medium text-gray-900 mb-2">Prompt Content:</h3>
            <p className="text-sm text-gray-700 whitespace-pre-wrap">{prompt.content}</p>
            {variables.length > 0 && (
              <div className="mt-3">
                <p className="text-xs text-gray-600 mb-2">Variables found: {variables.join(', ')}</p>
              </div>
            )}
          </div>

          {/* Test Input */}
          <div>
            <label htmlFor="testInput" className="block text-sm font-medium text-gray-700 mb-2">
              Test Input {variables.length > 0 && `(Fill in variables like {${variables[0]}})`}
            </label>
            <Textarea
              id="testInput"
              value={testInput}
              onChange={(e) => setTestInput(e.target.value)}
              placeholder={variables.length > 0 
                ? `Enter test data for variables: ${variables.join(', ')}`
                : "Enter test input for this prompt..."
              }
              rows={4}
              className="bg-white"
            />
          </div>

          {/* Model Selection */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-medium text-gray-900">Select Models to Test</h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowApiKeys(!showApiKeys)}
                className="text-blue-600 hover:text-blue-700"
              >
                <Settings className="w-4 h-4 mr-1" />
                API Keys
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {AVAILABLE_MODELS.map((provider) => {
                const hasApiKey = apiKeys.some(k => k.provider === provider.provider)
                return (
                  <div key={provider.provider} className={`border rounded-lg p-4 ${
                    hasApiKey ? 'border-gray-200' : 'border-yellow-300 bg-yellow-50'
                  }`}>
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-medium text-gray-900">{provider.name}</h4>
                      {!hasApiKey && (
                        <Badge variant="secondary" className="bg-yellow-100 text-yellow-800 text-xs">
                          API Key Required
                        </Badge>
                      )}
                    </div>
                    <div className="space-y-2">
                      {provider.models.map((model) => {
                        const fullModelName = `${provider.provider}-${model}`
                        return (
                          <div key={model} className="flex items-center space-x-2">
                            <input
                              type="checkbox"
                              id={fullModelName}
                              checked={selectedModels.includes(fullModelName)}
                              onChange={() => handleModelToggle(fullModelName)}
                              disabled={!hasApiKey}
                              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 disabled:opacity-50"
                            />
                            <label htmlFor={fullModelName} className={`text-sm ${hasApiKey ? 'text-gray-700' : 'text-gray-500'}`}>
                              {model}
                            </label>
                            {selectedModels.includes(fullModelName) && (
                              <Badge variant="secondary" className="text-xs">
                                Selected
                              </Badge>
                            )}
                          </div>
                        )
                      })}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* API Keys Section */}
          {showApiKeys && (
            <div className="border border-yellow-200 bg-yellow-50 p-4 rounded-lg">
              <h4 className="font-medium text-yellow-800 mb-2">API Keys Required</h4>
              <p className="text-sm text-yellow-700 mb-3">
                To run benchmarks, you need to provide your own API keys for the selected models.
              </p>
              <div className="text-xs text-yellow-600">
                <p>• OpenAI: Get your key from <a href="https://platform.openai.com/api-keys" target="_blank" className="underline">platform.openai.com</a></p>
                <p>• Anthropic: Get your key from <a href="https://console.anthropic.com/" target="_blank" className="underline">console.anthropic.com</a></p>
                <p>• Google: Get your key from <a href="https://makersuite.google.com/app/apikey" target="_blank" className="underline">makersuite.google.com</a></p>
                <p>• DeepSeek: Get your key from <a href="https://platform.deepseek.com/" target="_blank" className="underline">platform.deepseek.com</a></p>
              </div>
            </div>
          )}

          {/* Cost Estimate */}
          <div className="bg-blue-50 p-4 rounded-lg">
            <h4 className="font-medium text-blue-900 mb-2">Estimated Cost</h4>
            <p className="text-sm text-blue-700">
              Running {selectedModels.length} models will cost approximately $
              {(selectedModels.length * 0.01).toFixed(3)} - $
              {(selectedModels.length * 0.05).toFixed(3)} per test.
            </p>
          </div>

          {/* Actions */}
          <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              onClick={handleRunBenchmark}
              disabled={isLoading || selectedModels.length === 0}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Running Benchmark...
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 mr-2" />
                  Run Benchmark ({selectedModels.length} models)
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
