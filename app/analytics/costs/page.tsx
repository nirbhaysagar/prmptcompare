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
  DollarSign,
  Clock,
  Zap,
  TrendingUp,
  TrendingDown,
  BarChart3,
  PieChart
} from 'lucide-react'
import { Navigation } from '@/components/navigation'

interface CostBreakdown {
  date: string
  openai: number
  anthropic: number
  google: number
  deepseek: number
  total: number
}

interface UsageStats {
  totalRequests: number
  totalCost: number
  avgCostPerRequest: number
  peakUsageDay: string
  mostExpensiveModel: string
  costTrend: 'up' | 'down'
  trendPercentage: number
}

export default function CostAnalyticsPage() {
  const [usageStats, setUsageStats] = useState<UsageStats | null>(null)
  const [costBreakdown, setCostBreakdown] = useState<CostBreakdown[]>([])
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d'>('30d')
  const [selectedProvider, setSelectedProvider] = useState<string>('all')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadCostData = async () => {
      setLoading(true)
      await new Promise(resolve => setTimeout(resolve, 800))
      
      // Mock cost data
      const mockStats: UsageStats = {
        totalRequests: 1247,
        totalCost: 47.23,
        avgCostPerRequest: 0.038,
        peakUsageDay: '2024-01-15',
        mostExpensiveModel: 'GPT-4',
        costTrend: 'down',
        trendPercentage: 12.5
      }

      const mockBreakdown: CostBreakdown[] = Array.from({ length: 30 }, (_, i) => ({
        date: new Date(Date.now() - (29 - i) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        openai: Math.random() * 3 + 0.5,
        anthropic: Math.random() * 2 + 0.3,
        google: Math.random() * 1.5 + 0.2,
        deepseek: Math.random() * 0.8 + 0.1,
        total: 0
      })).map(day => ({
        ...day,
        total: day.openai + day.anthropic + day.google + day.deepseek
      }))

      setUsageStats(mockStats)
      setCostBreakdown(mockBreakdown)
      setLoading(false)
    }

    loadCostData()
  }, [timeRange])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-gray-200 rounded w-1/3"></div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-32 bg-gray-200 rounded-lg"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!usageStats) return null

  const totalCost = costBreakdown.reduce((sum, day) => sum + day.total, 0)
  const openaiCost = costBreakdown.reduce((sum, day) => sum + day.openai, 0)
  const anthropicCost = costBreakdown.reduce((sum, day) => sum + day.anthropic, 0)
  const googleCost = costBreakdown.reduce((sum, day) => sum + day.google, 0)
  const deepseekCost = costBreakdown.reduce((sum, day) => sum + day.deepseek, 0)

  const providerData = [
    { name: 'OpenAI', cost: openaiCost, color: 'bg-green-500', percentage: (openaiCost / totalCost) * 100 },
    { name: 'Anthropic', cost: anthropicCost, color: 'bg-orange-500', percentage: (anthropicCost / totalCost) * 100 },
    { name: 'Google', cost: googleCost, color: 'bg-blue-500', percentage: (googleCost / totalCost) * 100 },
    { name: 'DeepSeek', cost: deepseekCost, color: 'bg-purple-500', percentage: (deepseekCost / totalCost) * 100 }
  ].sort((a, b) => b.cost - a.cost)

  const exportData = () => {
    const csvContent = [
      ['Date', 'OpenAI', 'Anthropic', 'Google', 'DeepSeek', 'Total'],
      ...costBreakdown.map(day => [
        day.date,
        day.openai.toFixed(4),
        day.anthropic.toFixed(4),
        day.google.toFixed(4),
        day.deepseek.toFixed(4),
        day.total.toFixed(4)
      ])
    ].map(row => row.join(',')).join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `cost-analytics-${timeRange}.csv`
    a.click()
    window.URL.revokeObjectURL(url)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Cost Analytics</h1>
            <p className="text-gray-600 mt-1">Track and optimize your AI API spending</p>
          </div>
          
          <div className="flex items-center gap-3">
            <select
              value={selectedProvider}
              onChange={(e) => setSelectedProvider(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Providers</option>
              <option value="openai">OpenAI</option>
              <option value="anthropic">Anthropic</option>
              <option value="google">Google</option>
              <option value="deepseek">DeepSeek</option>
            </select>
            
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
            
            <Button onClick={exportData} variant="outline" size="sm">
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Cost</p>
                  <p className="text-2xl font-bold text-gray-900">${usageStats.totalCost.toFixed(2)}</p>
                </div>
                <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                  <DollarSign className="w-6 h-6 text-red-600" />
                </div>
              </div>
              <div className="mt-4 flex items-center">
                {usageStats.costTrend === 'down' ? (
                  <>
                    <TrendingDown className="w-4 h-4 text-green-500 mr-1" />
                    <span className="text-sm text-green-600 font-medium">
                      {usageStats.trendPercentage}% decrease
                    </span>
                  </>
                ) : (
                  <>
                    <TrendingUp className="w-4 h-4 text-red-500 mr-1" />
                    <span className="text-sm text-red-600 font-medium">
                      {usageStats.trendPercentage}% increase
                    </span>
                  </>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Requests</p>
                  <p className="text-2xl font-bold text-gray-900">{usageStats.totalRequests.toLocaleString()}</p>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Zap className="w-6 h-6 text-blue-600" />
                </div>
              </div>
              <div className="mt-4 text-sm text-gray-600">
                Avg: ${usageStats.avgCostPerRequest.toFixed(4)} per request
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Most Expensive Model</p>
                  <p className="text-lg font-bold text-gray-900">{usageStats.mostExpensiveModel}</p>
                </div>
                <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                  <BarChart3 className="w-6 h-6 text-yellow-600" />
                </div>
              </div>
              <div className="mt-4 text-sm text-gray-600">
                Peak usage: {usageStats.peakUsageDay}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Cost Breakdown */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Daily Cost Chart */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5" />
                Daily Cost Breakdown
              </CardTitle>
              <CardDescription>Cost per provider over time</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-64 flex items-end justify-between gap-1">
                {costBreakdown.slice(-14).map((day, index) => {
                  const maxCost = Math.max(...costBreakdown.map(d => d.total))
                  const openaiHeight = (day.openai / maxCost) * 100
                  const anthropicHeight = (day.anthropic / maxCost) * 100
                  const googleHeight = (day.google / maxCost) * 100
                  const deepseekHeight = (day.deepseek / maxCost) * 100
                  
                  return (
                    <div key={index} className="flex flex-col items-center gap-1">
                      <div className="flex flex-col-reverse w-6 h-20">
                        <div className="bg-green-500 w-full" style={{ height: `${openaiHeight}%` }} />
                        <div className="bg-orange-500 w-full" style={{ height: `${anthropicHeight}%` }} />
                        <div className="bg-blue-500 w-full" style={{ height: `${googleHeight}%` }} />
                        <div className="bg-purple-500 w-full" style={{ height: `${deepseekHeight}%` }} />
                      </div>
                      <span className="text-xs text-gray-500">
                        {new Date(day.date).getDate()}
                      </span>
                    </div>
                  )
                })}
              </div>
              <div className="mt-4 flex items-center justify-between text-sm text-gray-600">
                <span>Last 14 days</span>
                <span>${totalCost.toFixed(2)} total</span>
              </div>
            </CardContent>
          </Card>

          {/* Provider Breakdown */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <PieChart className="w-5 h-5" />
                Provider Breakdown
              </CardTitle>
              <CardDescription>Cost distribution by provider</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {providerData.map((provider) => (
                  <div key={provider.name} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-900">{provider.name}</span>
                      <span className="text-sm text-gray-600">${provider.cost.toFixed(2)}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className={`${provider.color} h-2 rounded-full transition-all`}
                        style={{ width: `${provider.percentage}%` }}
                      />
                    </div>
                    <div className="text-xs text-gray-500">
                      {provider.percentage.toFixed(1)}% of total cost
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Cost Optimization Tips */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingDown className="w-5 h-5" />
              Cost Optimization Recommendations
            </CardTitle>
            <CardDescription>AI-powered suggestions to reduce your API costs</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex items-start gap-3">
                  <DollarSign className="w-5 h-5 text-green-600 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-green-900">Switch to Cheaper Models</h4>
                    <p className="text-sm text-green-800 mt-1">
                      Consider using GPT-3.5-Turbo instead of GPT-4 for simple tasks. 
                      Potential savings: ${(openaiCost * 0.4).toFixed(2)}/month
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex items-start gap-3">
                  <Clock className="w-5 h-5 text-blue-600 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-blue-900">Batch Processing</h4>
                    <p className="text-sm text-blue-800 mt-1">
                      Batch similar prompts together to reduce API call overhead. 
                      Estimated savings: 15-20% on total costs.
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="p-4 bg-purple-50 border border-purple-200 rounded-lg">
                <div className="flex items-start gap-3">
                  <Zap className="w-5 h-5 text-purple-600 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-purple-900">Optimize Prompt Length</h4>
                    <p className="text-sm text-purple-800 mt-1">
                      Shorter prompts reduce token usage. Review prompts longer than 100 tokens 
                      for optimization opportunities.
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="p-4 bg-orange-50 border border-orange-200 rounded-lg">
                <div className="flex items-start gap-3">
                  <BarChart3 className="w-5 h-5 text-orange-600 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-orange-900">Usage Monitoring</h4>
                    <p className="text-sm text-orange-800 mt-1">
                      Set up alerts for unusual spending patterns. 
                      Current peak usage detected on {usageStats.peakUsageDay}.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Detailed Cost Table */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Detailed Cost Breakdown</CardTitle>
            <CardDescription>Daily costs by provider for the selected period</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Date</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900">OpenAI</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Anthropic</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Google</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900">DeepSeek</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {costBreakdown.slice(-10).map((day) => (
                    <tr key={day.date} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-3 px-4 text-gray-700">
                        {new Date(day.date).toLocaleDateString()}
                      </td>
                      <td className="py-3 px-4 text-gray-700">${day.openai.toFixed(3)}</td>
                      <td className="py-3 px-4 text-gray-700">${day.anthropic.toFixed(3)}</td>
                      <td className="py-3 px-4 text-gray-700">${day.google.toFixed(3)}</td>
                      <td className="py-3 px-4 text-gray-700">${day.deepseek.toFixed(3)}</td>
                      <td className="py-3 px-4 font-medium text-gray-900">${day.total.toFixed(3)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
