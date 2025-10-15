'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  Download, 
  Filter, 
  Search, 
  Calendar,
  Star,
  Clock,
  Zap,
  TrendingUp,
  TrendingDown,
  BarChart3,
  Target,
  Eye,
  EyeOff
} from 'lucide-react'
import { Navigation } from '@/components/navigation'

interface PerformanceMetrics {
  model: string
  avgResponseTime: number
  avgRating: number
  totalRequests: number
  successRate: number
  avgCost: number
  reliability: number
}

interface BenchmarkHistory {
  id: string
  promptTitle: string
  models: string[]
  testInput: string
  results: Array<{
    model: string
    responseTime: number
    rating: number
    cost: number
    success: boolean
  }>
  createdAt: string
  winner: string
}

export default function PerformanceAnalyticsPage() {
  const [performanceMetrics, setPerformanceMetrics] = useState<PerformanceMetrics[]>([])
  const [benchmarkHistory, setBenchmarkHistory] = useState<BenchmarkHistory[]>([])
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d'>('30d')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadPerformanceData = async () => {
      setLoading(true)
      await new Promise(resolve => setTimeout(resolve, 800))
      
      // Mock performance data
      const mockMetrics: PerformanceMetrics[] = [
        {
          model: 'GPT-4',
          avgResponseTime: 2100,
          avgRating: 4.2,
          totalRequests: 156,
          successRate: 98.7,
          avgCost: 0.045,
          reliability: 99.2
        },
        {
          model: 'Claude-3-Sonnet',
          avgResponseTime: 1650,
          avgRating: 4.5,
          totalRequests: 134,
          successRate: 99.3,
          avgCost: 0.038,
          reliability: 99.5
        },
        {
          model: 'Gemini-Pro',
          avgResponseTime: 1450,
          avgRating: 3.8,
          totalRequests: 89,
          successRate: 96.6,
          avgCost: 0.025,
          reliability: 97.8
        },
        {
          model: 'GPT-3.5-Turbo',
          avgResponseTime: 1200,
          avgRating: 3.9,
          totalRequests: 203,
          successRate: 99.5,
          avgCost: 0.012,
          reliability: 99.8
        },
        {
          model: 'DeepSeek-Chat',
          avgResponseTime: 1800,
          avgRating: 4.1,
          totalRequests: 67,
          successRate: 97.0,
          avgCost: 0.018,
          reliability: 98.5
        }
      ]

      const mockHistory: BenchmarkHistory[] = Array.from({ length: 20 }, (_, i) => ({
        id: `benchmark-${i + 1}`,
        promptTitle: `Test Prompt ${i + 1}`,
        models: ['GPT-4', 'Claude-3-Sonnet', 'Gemini-Pro'].slice(0, Math.floor(Math.random() * 3) + 1),
        testInput: `Sample test input for prompt ${i + 1}`,
        results: [
          { model: 'GPT-4', responseTime: 2100, rating: 4.2, cost: 0.045, success: true },
          { model: 'Claude-3-Sonnet', responseTime: 1650, rating: 4.5, cost: 0.038, success: true },
          { model: 'Gemini-Pro', responseTime: 1450, rating: 3.8, cost: 0.025, success: true }
        ].slice(0, Math.floor(Math.random() * 3) + 1),
        createdAt: new Date(Date.now() - i * 24 * 60 * 60 * 1000).toISOString(),
        winner: ['GPT-4', 'Claude-3-Sonnet', 'Gemini-Pro'][Math.floor(Math.random() * 3)]
      }))

      setPerformanceMetrics(mockMetrics)
      setBenchmarkHistory(mockHistory)
      setLoading(false)
    }

    loadPerformanceData()
  }, [timeRange])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-gray-200 rounded w-1/3"></div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-32 bg-gray-200 rounded-lg"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  const exportPerformanceData = () => {
    const csvContent = [
      ['Model', 'Avg Response Time (ms)', 'Avg Rating', 'Total Requests', 'Success Rate (%)', 'Avg Cost ($)', 'Reliability (%)'],
      ...performanceMetrics.map(metric => [
        metric.model,
        metric.avgResponseTime,
        metric.avgRating,
        metric.totalRequests,
        metric.successRate,
        metric.avgCost,
        metric.reliability
      ])
    ].map(row => row.join(',')).join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `performance-analytics-${timeRange}.csv`
    a.click()
    window.URL.revokeObjectURL(url)
  }

  const bestPerformer = performanceMetrics.reduce((best, current) => 
    current.avgRating > best.avgRating ? current : best
  )

  const fastestModel = performanceMetrics.reduce((fastest, current) => 
    current.avgResponseTime < fastest.avgResponseTime ? current : fastest
  )

  const mostReliable = performanceMetrics.reduce((most, current) => 
    current.reliability > most.reliability ? current : most
  )

  const mostCostEffective = performanceMetrics.reduce((most, current) => 
    (current.avgRating / current.avgCost) > (most.avgRating / most.avgCost) ? current : most
  )

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Performance Analytics</h1>
            <p className="text-gray-600 mt-1">Analyze model performance and optimization opportunities</p>
          </div>
          
          <div className="flex items-center gap-3">
            {(['7d', '30d', '90d'] as const).map((range) => (
              <button
                key={range}
                onClick={() => setTimeRange(range)}
                className={`px-3 py-1 text-sm font-medium rounded-md transition-colors ${
                  timeRange === range
                    ? 'bg-blue-600 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300'
                }`}
              >
                {range}
              </button>
            ))}
            
            <Button onClick={exportPerformanceData} variant="outline" size="sm">
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
          </div>
        </div>

        {/* Performance Leaders */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Best Quality</p>
                  <p className="text-lg font-bold text-gray-900">{bestPerformer.model}</p>
                </div>
                <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                  <Star className="w-6 h-6 text-yellow-600" />
                </div>
              </div>
              <div className="mt-4 flex items-center">
                <span className="text-sm text-gray-600">
                  {bestPerformer.avgRating.toFixed(1)}/5.0 rating
                </span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Fastest Response</p>
                  <p className="text-lg font-bold text-gray-900">{fastestModel.model}</p>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <Zap className="w-6 h-6 text-green-600" />
                </div>
              </div>
              <div className="mt-4 flex items-center">
                <span className="text-sm text-gray-600">
                  {(fastestModel.avgResponseTime / 1000).toFixed(1)}s avg
                </span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Most Reliable</p>
                  <p className="text-lg font-bold text-gray-900">{mostReliable.model}</p>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Target className="w-6 h-6 text-blue-600" />
                </div>
              </div>
              <div className="mt-4 flex items-center">
                <span className="text-sm text-gray-600">
                  {mostReliable.reliability}% uptime
                </span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Best Value</p>
                  <p className="text-lg font-bold text-gray-900">{mostCostEffective.model}</p>
                </div>
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-purple-600" />
                </div>
              </div>
              <div className="mt-4 flex items-center">
                <span className="text-sm text-gray-600">
                  ${mostCostEffective.avgCost.toFixed(3)} per request
                </span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Performance Comparison Table */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5" />
              Model Performance Comparison
            </CardTitle>
            <CardDescription>Detailed performance metrics across all models</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Model</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Avg Response Time</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Quality Rating</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Success Rate</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Reliability</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Avg Cost</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Total Requests</th>
                  </tr>
                </thead>
                <tbody>
                  {performanceMetrics.map((metric) => (
                    <tr key={metric.model} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-gray-900">{metric.model}</span>
                          {metric.model === bestPerformer.model && (
                            <Badge className="bg-yellow-100 text-yellow-800 text-xs">
                              Best Quality
                            </Badge>
                          )}
                          {metric.model === fastestModel.model && (
                            <Badge className="bg-green-100 text-green-800 text-xs">
                              Fastest
                            </Badge>
                          )}
                        </div>
                      </td>
                      <td className="py-3 px-4 text-gray-700">
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4 text-gray-400" />
                          {(metric.avgResponseTime / 1000).toFixed(1)}s
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <span className="text-gray-700">{metric.avgRating.toFixed(1)}</span>
                          <div className="flex">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <Star
                                key={star}
                                className={`w-3 h-3 ${
                                  star <= metric.avgRating ? 'text-yellow-400 fill-current' : 'text-gray-300'
                                }`}
                              />
                            ))}
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-gray-700">
                        <div className="flex items-center gap-2">
                          <div className="w-16 bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-green-500 h-2 rounded-full"
                              style={{ width: `${metric.successRate}%` }}
                            />
                          </div>
                          <span className="text-sm">{metric.successRate}%</span>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-gray-700">
                        <div className="flex items-center gap-2">
                          <div className="w-16 bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-blue-500 h-2 rounded-full"
                              style={{ width: `${metric.reliability}%` }}
                            />
                          </div>
                          <span className="text-sm">{metric.reliability}%</span>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-gray-700">${metric.avgCost.toFixed(3)}</td>
                      <td className="py-3 px-4 text-gray-700">{metric.totalRequests}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Benchmark History */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="w-5 h-5" />
              Recent Benchmark History
            </CardTitle>
            <CardDescription>Latest benchmark runs and their results</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {benchmarkHistory.slice(0, 10).map((benchmark) => (
                <div key={benchmark.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <h4 className="font-medium text-gray-900">{benchmark.promptTitle}</h4>
                      <p className="text-sm text-gray-600">
                        {benchmark.models.length} models tested
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className="bg-green-100 text-green-800">
                        Winner: {benchmark.winner}
                      </Badge>
                      <span className="text-sm text-gray-500">
                        {new Date(benchmark.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    <span>Models: {benchmark.models.join(', ')}</span>
                    <span>Avg Response: {(benchmark.results.reduce((sum, r) => sum + r.responseTime, 0) / benchmark.results.length / 1000).toFixed(1)}s</span>
                    <span>Avg Rating: {(benchmark.results.reduce((sum, r) => sum + r.rating, 0) / benchmark.results.length).toFixed(1)}/5</span>
                    <span>Total Cost: ${benchmark.results.reduce((sum, r) => sum + r.cost, 0).toFixed(3)}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Performance Insights */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="w-5 h-5" />
              Performance Optimization Insights
            </CardTitle>
            <CardDescription>AI-powered recommendations to improve your prompt performance</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex items-start gap-3">
                  <Zap className="w-5 h-5 text-green-600 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-green-900">Speed Optimization</h4>
                    <p className="text-sm text-green-800 mt-1">
                      {fastestModel.model} is your fastest model at {(fastestModel.avgResponseTime / 1000).toFixed(1)}s. 
                      Consider using it for real-time applications.
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex items-start gap-3">
                  <Star className="w-5 h-5 text-blue-600 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-blue-900">Quality Improvement</h4>
                    <p className="text-sm text-blue-800 mt-1">
                      {bestPerformer.model} consistently delivers the highest quality responses. 
                      Use it for critical applications requiring accuracy.
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="p-4 bg-purple-50 border border-purple-200 rounded-lg">
                <div className="flex items-start gap-3">
                  <Target className="w-5 h-5 text-purple-600 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-purple-900">Reliability Focus</h4>
                    <p className="text-sm text-purple-800 mt-1">
                      {mostReliable.model} has the highest reliability at {mostReliable.reliability}%. 
                      Best choice for production workloads.
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="p-4 bg-orange-50 border border-orange-200 rounded-lg">
                <div className="flex items-start gap-3">
                  <TrendingUp className="w-5 h-5 text-orange-600 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-orange-900">Cost Efficiency</h4>
                    <p className="text-sm text-orange-800 mt-1">
                      {mostCostEffective.model} offers the best value at ${mostCostEffective.avgCost.toFixed(3)} per request 
                      with {(mostCostEffective.avgRating / mostCostEffective.avgCost).toFixed(0)} rating per dollar.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
