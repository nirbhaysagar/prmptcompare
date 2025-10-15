'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  BarChart3, 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Clock, 
  Zap, 
  Users,
  FileText,
  Target,
  Calendar,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react'
import { Navigation } from '@/components/navigation'

interface AnalyticsData {
  totalPrompts: number
  totalBenchmarks: number
  totalCost: number
  avgResponseTime: number
  topModels: Array<{ model: string; usage: number }>
  dailyUsage: Array<{ date: string; benchmarks: number; cost: number }>
  monthlyTrends: {
    prompts: number
    benchmarks: number
    cost: number
    avgResponseTime: number
  }
  modelPerformance: Array<{
    model: string
    avgResponseTime: number
    totalCost: number
    usageCount: number
    avgRating: number
  }>
}

export default function AnalyticsPage() {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null)
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d'>('30d')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Simulate loading analytics data
    const loadAnalytics = async () => {
      setLoading(true)
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Mock analytics data
      const mockData: AnalyticsData = {
        totalPrompts: 47,
        totalBenchmarks: 156,
        totalCost: 12.47,
        avgResponseTime: 1847,
        topModels: [
          { model: 'GPT-4', usage: 45 },
          { model: 'Claude-3-Sonnet', usage: 38 },
          { model: 'Gemini-Pro', usage: 32 },
          { model: 'GPT-3.5-Turbo', usage: 28 },
          { model: 'DeepSeek-Chat', usage: 13 }
        ],
        dailyUsage: Array.from({ length: 30 }, (_, i) => ({
          date: new Date(Date.now() - (29 - i) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          benchmarks: Math.floor(Math.random() * 20) + 1,
          cost: Math.random() * 2 + 0.1
        })),
        monthlyTrends: {
          prompts: 23,
          benchmarks: 89,
          cost: 8.34,
          avgResponseTime: -156
        },
        modelPerformance: [
          { model: 'GPT-4', avgResponseTime: 2100, totalCost: 4.23, usageCount: 45, avgRating: 4.2 },
          { model: 'Claude-3-Sonnet', avgResponseTime: 1650, totalCost: 3.89, usageCount: 38, avgRating: 4.5 },
          { model: 'Gemini-Pro', avgResponseTime: 1450, totalCost: 2.14, usageCount: 32, avgRating: 3.8 },
          { model: 'GPT-3.5-Turbo', avgResponseTime: 1200, totalCost: 1.67, usageCount: 28, avgRating: 3.9 },
          { model: 'DeepSeek-Chat', avgResponseTime: 1800, totalCost: 0.54, usageCount: 13, avgRating: 4.1 }
        ]
      }
      
      setAnalytics(mockData)
      setLoading(false)
    }

    loadAnalytics()
  }, [timeRange])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-gray-200 rounded w-1/4"></div>
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

  if (!analytics) return null

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Analytics</h1>
            <p className="text-gray-600 mt-1">Track your prompt optimization performance</p>
          </div>
          
          <div className="flex items-center gap-2">
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
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Prompts</p>
                  <p className="text-2xl font-bold text-gray-900">{analytics.totalPrompts}</p>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <FileText className="w-6 h-6 text-blue-600" />
                </div>
              </div>
              <div className="mt-4 flex items-center">
                <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                <span className="text-sm text-green-600 font-medium">+{analytics.monthlyTrends.prompts} this month</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Benchmark Runs</p>
                  <p className="text-2xl font-bold text-gray-900">{analytics.totalBenchmarks}</p>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <Zap className="w-6 h-6 text-green-600" />
                </div>
              </div>
              <div className="mt-4 flex items-center">
                <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                <span className="text-sm text-green-600 font-medium">+{analytics.monthlyTrends.benchmarks} this month</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Cost</p>
                  <p className="text-2xl font-bold text-gray-900">${analytics.totalCost.toFixed(2)}</p>
                </div>
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <DollarSign className="w-6 h-6 text-purple-600" />
                </div>
              </div>
              <div className="mt-4 flex items-center">
                <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                <span className="text-sm text-green-600 font-medium">+${analytics.monthlyTrends.cost.toFixed(2)} this month</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Avg Response Time</p>
                  <p className="text-2xl font-bold text-gray-900">{(analytics.avgResponseTime / 1000).toFixed(1)}s</p>
                </div>
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                  <Clock className="w-6 h-6 text-orange-600" />
                </div>
              </div>
              <div className="mt-4 flex items-center">
                {analytics.monthlyTrends.avgResponseTime < 0 ? (
                  <>
                    <TrendingDown className="w-4 h-4 text-green-500 mr-1" />
                    <span className="text-sm text-green-600 font-medium">
                      {Math.abs(analytics.monthlyTrends.avgResponseTime)}ms faster
                    </span>
                  </>
                ) : (
                  <>
                    <TrendingUp className="w-4 h-4 text-red-500 mr-1" />
                    <span className="text-sm text-red-600 font-medium">
                      +{analytics.monthlyTrends.avgResponseTime}ms slower
                    </span>
                  </>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Usage Chart */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5" />
                Daily Usage
              </CardTitle>
              <CardDescription>Benchmark runs and costs over time</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-64 flex items-end justify-between gap-1">
                {analytics.dailyUsage.slice(-14).map((day, index) => {
                  const maxBenchmarks = Math.max(...analytics.dailyUsage.map(d => d.benchmarks))
                  const height = (day.benchmarks / maxBenchmarks) * 100
                  return (
                    <div key={index} className="flex flex-col items-center gap-1">
                      <div
                        className="bg-blue-500 rounded-t w-6 transition-all hover:bg-blue-600"
                        style={{ height: `${height}%` }}
                        title={`${day.benchmarks} benchmarks, $${day.cost.toFixed(2)} cost`}
                      />
                      <span className="text-xs text-gray-500">
                        {new Date(day.date).getDate()}
                      </span>
                    </div>
                  )
                })}
              </div>
              <div className="mt-4 flex items-center justify-between text-sm text-gray-600">
                <span>Last 14 days</span>
                <span>Benchmark runs</span>
              </div>
            </CardContent>
          </Card>

          {/* Top Models */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="w-5 h-5" />
                Most Used Models
              </CardTitle>
              <CardDescription>Model usage distribution</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {analytics.topModels.map((model, index) => {
                  const totalUsage = analytics.topModels.reduce((sum, m) => sum + m.usage, 0)
                  const percentage = (model.usage / totalUsage) * 100
                  
                  return (
                    <div key={model.model} className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center text-sm font-medium">
                        {index + 1}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm font-medium text-gray-900">{model.model}</span>
                          <span className="text-sm text-gray-600">{model.usage} runs</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-blue-600 h-2 rounded-full transition-all"
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Model Performance Table */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5" />
              Model Performance Comparison
            </CardTitle>
            <CardDescription>Detailed performance metrics for each model</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Model</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Usage</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Avg Response Time</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Total Cost</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Avg Rating</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Cost per Run</th>
                  </tr>
                </thead>
                <tbody>
                  {analytics.modelPerformance.map((model) => (
                    <tr key={model.model} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-gray-900">{model.model}</span>
                          {model.avgRating >= 4.0 && (
                            <Badge className="bg-green-100 text-green-800 text-xs">
                              Top Performer
                            </Badge>
                          )}
                        </div>
                      </td>
                      <td className="py-3 px-4 text-gray-700">{model.usageCount} runs</td>
                      <td className="py-3 px-4 text-gray-700">{(model.avgResponseTime / 1000).toFixed(1)}s</td>
                      <td className="py-3 px-4 text-gray-700">${model.totalCost.toFixed(3)}</td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-1">
                          <span className="text-gray-700">{model.avgRating.toFixed(1)}</span>
                          <div className="flex">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <Star
                                key={star}
                                className={`w-3 h-3 ${
                                  star <= model.avgRating ? 'text-yellow-400 fill-current' : 'text-gray-300'
                                }`}
                              />
                            ))}
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-gray-700">
                        ${(model.totalCost / model.usageCount).toFixed(4)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Insights */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="w-5 h-5" />
              Performance Insights
            </CardTitle>
            <CardDescription>AI-powered recommendations based on your usage patterns</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex items-start gap-3">
                  <TrendingUp className="w-5 h-5 text-green-600 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-green-900">Cost Optimization</h4>
                    <p className="text-sm text-green-800 mt-1">
                      Consider using GPT-3.5-Turbo for simple tasks - it's 60% cheaper than GPT-4 
                      with similar performance for basic prompts.
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex items-start gap-3">
                  <Clock className="w-5 h-5 text-blue-600 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-blue-900">Speed Optimization</h4>
                    <p className="text-sm text-blue-800 mt-1">
                      Gemini Pro shows the fastest average response time (1.4s). 
                      Use it for time-sensitive applications.
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="p-4 bg-purple-50 border border-purple-200 rounded-lg">
                <div className="flex items-start gap-3">
                  <Star className="w-5 h-5 text-purple-600 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-purple-900">Quality Leader</h4>
                    <p className="text-sm text-purple-800 mt-1">
                      Claude-3-Sonnet has the highest average rating (4.5/5). 
                      Best choice for complex reasoning tasks.
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="p-4 bg-orange-50 border border-orange-200 rounded-lg">
                <div className="flex items-start gap-3">
                  <Calendar className="w-5 h-5 text-orange-600 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-orange-900">Usage Pattern</h4>
                    <p className="text-sm text-orange-800 mt-1">
                      Your benchmark activity peaks on weekdays. 
                      Consider scheduling bulk tests during off-peak hours for better API rates.
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
