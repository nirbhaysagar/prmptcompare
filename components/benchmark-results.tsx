'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  ThumbsUp, 
  ThumbsDown, 
  Clock, 
  DollarSign, 
  Zap, 
  Star,
  Copy,
  Download
} from 'lucide-react'

interface ModelResponse {
  model: string
  response: string
  responseTime: number
  tokenCount: number
  cost: number
  rating?: number
  isWinner?: boolean
}

interface BenchmarkResultsProps {
  responses: ModelResponse[]
  promptTitle: string
  testInput: string
  onClose: () => void
}

export function BenchmarkResults({ 
  responses, 
  promptTitle, 
  testInput, 
  onClose 
}: BenchmarkResultsProps) {
  const [selectedWinner, setSelectedWinner] = useState<string | null>(null)
  const [ratings, setRatings] = useState<Record<string, number>>({})

  const handleRate = (model: string, rating: number) => {
    setRatings(prev => ({ ...prev, [model]: rating }))
  }

  const handleSelectWinner = (model: string) => {
    setSelectedWinner(selectedWinner === model ? null : model)
  }

  const handleCopyResponse = async (response: string) => {
    try {
      await navigator.clipboard.writeText(response)
      // You could add a toast notification here
    } catch (err) {
      console.error('Failed to copy text: ', err)
    }
  }

  const totalCost = responses.reduce((sum, r) => sum + r.cost, 0)
  const avgResponseTime = responses.reduce((sum, r) => sum + r.responseTime, 0) / responses.length

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Benchmark Results</h2>
          <p className="text-gray-600 mt-1">Prompt: {promptTitle}</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => window.print()}>
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center">
              <Zap className="w-8 h-8 text-blue-600 mr-3" />
              <div>
                <p className="text-sm text-gray-600">Models Tested</p>
                <p className="text-2xl font-bold">{responses.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center">
              <Clock className="w-8 h-8 text-green-600 mr-3" />
              <div>
                <p className="text-sm text-gray-600">Avg Response Time</p>
                <p className="text-2xl font-bold">{avgResponseTime.toFixed(0)}ms</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center">
              <DollarSign className="w-8 h-8 text-purple-600 mr-3" />
              <div>
                <p className="text-sm text-gray-600">Total Cost</p>
                <p className="text-2xl font-bold">${totalCost.toFixed(4)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center">
              <Star className="w-8 h-8 text-yellow-600 mr-3" />
              <div>
                <p className="text-sm text-gray-600">Winner</p>
                <p className="text-2xl font-bold">
                  {selectedWinner ? responses.find(r => r.model === selectedWinner)?.model.split('-')[0] : 'None'}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Test Input */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Test Input</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-700 bg-gray-50 p-3 rounded-lg">{testInput}</p>
        </CardContent>
      </Card>

      {/* Model Responses */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Model Responses</h3>
        
        {responses.map((response, index) => (
          <Card key={response.model} className={`${selectedWinner === response.model ? 'ring-2 ring-blue-500' : ''}`}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <CardTitle className="text-lg">{response.model}</CardTitle>
                  {selectedWinner === response.model && (
                    <Badge className="bg-blue-600">Winner</Badge>
                  )}
                </div>
                
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleCopyResponse(response.response)}
                  >
                    <Copy className="w-4 h-4 mr-1" />
                    Copy
                  </Button>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleSelectWinner(response.model)}
                    className={selectedWinner === response.model ? 'bg-blue-50 border-blue-300' : ''}
                  >
                    <Star className="w-4 h-4 mr-1" />
                    {selectedWinner === response.model ? 'Winner' : 'Select Winner'}
                  </Button>
                </div>
              </div>
              
              <div className="flex items-center gap-4 text-sm text-gray-600">
                <span className="flex items-center">
                  <Clock className="w-4 h-4 mr-1" />
                  {response.responseTime}ms
                </span>
                <span className="flex items-center">
                  <Zap className="w-4 h-4 mr-1" />
                  {response.tokenCount} tokens
                </span>
                <span className="flex items-center">
                  <DollarSign className="w-4 h-4 mr-1" />
                  ${response.cost.toFixed(4)}
                </span>
              </div>
            </CardHeader>
            
            <CardContent>
              <div className="mb-4">
                <p className="text-gray-700 whitespace-pre-wrap bg-gray-50 p-4 rounded-lg">
                  {response.response}
                </p>
              </div>
              
              {/* Rating */}
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-gray-700">Rate this response:</span>
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((rating) => (
                    <button
                      key={rating}
                      onClick={() => handleRate(response.model, rating)}
                      className={`p-1 rounded ${
                        ratings[response.model] >= rating 
                          ? 'text-yellow-400' 
                          : 'text-gray-300 hover:text-yellow-300'
                      }`}
                    >
                      <Star className="w-4 h-4 fill-current" />
                    </button>
                  ))}
                </div>
                {ratings[response.model] && (
                  <span className="text-sm text-gray-600">
                    ({ratings[response.model]}/5)
                  </span>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Analysis */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Analysis</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
              <span className="font-medium">Fastest Response:</span>
              <span className="text-blue-600 font-semibold">
                {responses.reduce((fastest, current) => 
                  current.responseTime < fastest.responseTime ? current : fastest
                ).model} ({Math.min(...responses.map(r => r.responseTime))}ms)
              </span>
            </div>
            
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
              <span className="font-medium">Most Cost-Effective:</span>
              <span className="text-green-600 font-semibold">
                {responses.reduce((cheapest, current) => 
                  current.cost < cheapest.cost ? current : cheapest
                ).model} (${Math.min(...responses.map(r => r.cost)).toFixed(4)})
              </span>
            </div>
            
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
              <span className="font-medium">Longest Response:</span>
              <span className="text-purple-600 font-semibold">
                {responses.reduce((longest, current) => 
                  current.response.length > longest.response.length ? current : longest
                ).model} ({Math.max(...responses.map(r => r.response.length))} chars)
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
