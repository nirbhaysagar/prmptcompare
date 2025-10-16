'use client'

import { useState } from 'react'
import { BenchmarkResult } from '@/lib/benchmark'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { 
  CheckCircle, 
  XCircle, 
  Clock, 
  DollarSign, 
  Copy,
  TrendingUp,
  TrendingDown,
  AlertCircle
} from 'lucide-react'

interface BenchmarkResultsViewProps {
  results: BenchmarkResult[]
  onClose: () => void
}

export function BenchmarkResultsView({ results, onClose }: BenchmarkResultsViewProps) {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null)

  const handleCopy = (text: string, index: number) => {
    navigator.clipboard.writeText(text)
    setCopiedIndex(index)
    setTimeout(() => setCopiedIndex(null), 2000)
  }

  const successfulResults = results.filter(r => !r.error)
  const failedResults = results.filter(r => r.error)
  
  const totalCost = results.reduce((sum, r) => sum + r.cost, 0)
  const avgResponseTime = successfulResults.length > 0
    ? successfulResults.reduce((sum, r) => sum + r.responseTime, 0) / successfulResults.length
    : 0

  const fastestResult = successfulResults.reduce((prev, current) => 
    (prev.responseTime < current.responseTime) ? prev : current, 
    successfulResults[0]
  )

  const cheapestResult = successfulResults.reduce((prev, current) => 
    (prev.cost < current.cost) ? prev : current, 
    successfulResults[0]
  )

  return (
    <div className="space-y-6">
      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Tests</p>
                <p className="text-2xl font-bold text-gray-900">{results.length}</p>
              </div>
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <CheckCircle className="w-5 h-5 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Success Rate</p>
                <p className="text-2xl font-bold text-green-600">
                  {((successfulResults.length / results.length) * 100).toFixed(0)}%
                </p>
              </div>
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Avg Response Time</p>
                <p className="text-2xl font-bold text-gray-900">{(avgResponseTime / 1000).toFixed(2)}s</p>
              </div>
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                <Clock className="w-5 h-5 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Cost</p>
                <p className="text-2xl font-bold text-gray-900">${totalCost.toFixed(4)}</p>
              </div>
              <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
                <DollarSign className="w-5 h-5 text-yellow-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Winners */}
      {successfulResults.length > 1 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card className="border-green-200 bg-green-50">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="w-5 h-5 text-green-600" />
                <p className="font-semibold text-green-900">Fastest Model</p>
              </div>
              <p className="text-lg font-bold text-green-800">{fastestResult.model}</p>
              <p className="text-sm text-green-700">{(fastestResult.responseTime / 1000).toFixed(2)}s response time</p>
            </CardContent>
          </Card>

          <Card className="border-blue-200 bg-blue-50">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <DollarSign className="w-5 h-5 text-blue-600" />
                <p className="font-semibold text-blue-900">Most Cost-Effective</p>
              </div>
              <p className="text-lg font-bold text-blue-800">{cheapestResult.model}</p>
              <p className="text-sm text-blue-700">${cheapestResult.cost.toFixed(4)} per request</p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Results */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900">Detailed Results</h3>
        
        {results.map((result, index) => (
          <Card key={index} className={result.error ? 'border-red-200' : ''}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                    result.provider === 'openai' ? 'bg-green-100' :
                    result.provider === 'anthropic' ? 'bg-orange-100' :
                    result.provider === 'google' ? 'bg-blue-100' :
                    'bg-purple-100'
                  }`}>
                    {result.error ? (
                      <XCircle className="w-5 h-5 text-red-600" />
                    ) : (
                      <CheckCircle className="w-5 h-5 text-green-600" />
                    )}
                  </div>
                  <div>
                    <CardTitle className="text-lg">{result.model}</CardTitle>
                    <p className="text-sm text-gray-600 capitalize">{result.provider}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-4">
                  {!result.error && (
                    <>
                      <div className="text-right">
                        <p className="text-sm text-gray-600">Response Time</p>
                        <p className="text-sm font-semibold text-gray-900">{(result.responseTime / 1000).toFixed(2)}s</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-600">Cost</p>
                        <p className="text-sm font-semibold text-gray-900">${result.cost.toFixed(4)}</p>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </CardHeader>

            <CardContent>
              {result.error ? (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <div className="flex items-start gap-2">
                    <AlertCircle className="w-5 h-5 text-red-600 mt-0.5" />
                    <div>
                      <p className="font-medium text-red-900">Error</p>
                      <p className="text-sm text-red-700 mt-1">{result.error}</p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm text-gray-600">
                    <span>Tokens: {result.tokens.prompt} prompt + {result.tokens.completion} completion = {result.tokens.total} total</span>
                  </div>
                  
                  <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-sm font-medium text-gray-700">Response</p>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleCopy(result.response, index)}
                        className="h-7"
                      >
                        {copiedIndex === index ? (
                          <span className="text-xs text-green-600">Copied!</span>
                        ) : (
                          <>
                            <Copy className="w-3 h-3 mr-1" />
                            <span className="text-xs">Copy</span>
                          </>
                        )}
                      </Button>
                    </div>
                    <p className="text-sm text-gray-800 whitespace-pre-wrap">{result.response}</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Actions */}
      <div className="flex justify-end">
        <Button onClick={onClose} className="bg-gray-900 hover:bg-gray-800 text-white">
          Close Results
        </Button>
      </div>
    </div>
  )
}

