'use client'

import { useState, useEffect } from 'react'
import { UnifiedLayout } from '@/components/unified-layout'
import { DollarSign, TrendingDown, BarChart3 } from 'lucide-react'

export default function CostAnalyticsPage() {
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setTimeout(() => setLoading(false), 500)
  }, [])

  if (loading) {
    return (
      <UnifiedLayout currentPage="costs">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="w-8 h-8 border-2 border-gray-900 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
            <p className="text-sm text-gray-600">Loading costs...</p>
          </div>
        </div>
      </UnifiedLayout>
    )
  }

  return (
    <UnifiedLayout currentPage="costs">
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Cost Analytics</h1>
          <p className="text-gray-600">Track and optimize your API spending</p>
        </div>

        {/* Cost Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="border border-gray-200 rounded-lg p-6">
            <p className="text-sm text-gray-600 mb-1">Total Spend</p>
            <p className="text-3xl font-bold text-gray-900">$47.23</p>
            <p className="text-xs text-green-600 mt-2 flex items-center">
              <TrendingDown className="w-3 h-3 mr-1" />
              12% lower than last month
            </p>
          </div>

          <div className="border border-gray-200 rounded-lg p-6">
            <p className="text-sm text-gray-600 mb-1">Avg per Request</p>
            <p className="text-3xl font-bold text-gray-900">$0.038</p>
            <p className="text-xs text-gray-600 mt-2">Across all models</p>
          </div>

          <div className="border border-gray-200 rounded-lg p-6">
            <p className="text-sm text-gray-600 mb-1">This Month</p>
            <p className="text-3xl font-bold text-gray-900">$12.47</p>
            <p className="text-xs text-gray-600 mt-2">1,247 requests</p>
          </div>
        </div>

        {/* Provider Breakdown */}
        <div className="border border-gray-200 rounded-lg p-6 mb-12">
          <h3 className="text-lg font-semibold text-gray-900 mb-1">Cost by Provider</h3>
          <p className="text-sm text-gray-600 mb-6">Monthly spending breakdown</p>
          
          <div className="space-y-4">
            {[
              { provider: 'OpenAI', cost: 18.45, percentage: 39, color: 'bg-gray-900' },
              { provider: 'Anthropic', cost: 15.23, percentage: 32, color: 'bg-gray-700' },
              { provider: 'Google', cost: 9.87, percentage: 21, color: 'bg-gray-500' },
              { provider: 'DeepSeek', cost: 3.68, percentage: 8, color: 'bg-gray-400' },
            ].map((item) => (
              <div key={item.provider}>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-medium text-gray-900">{item.provider}</span>
                    <span className="text-xs text-gray-600">{item.percentage}%</span>
                  </div>
                  <span className="text-sm font-medium text-gray-900">${item.cost.toFixed(2)}</span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-2">
                  <div
                    className={`${item.color} h-2 rounded-full transition-all`}
                    style={{ width: `${item.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Daily Costs */}
        <div className="border border-gray-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-1">Daily Spending</h3>
          <p className="text-sm text-gray-600 mb-6">Cost trends over time</p>
          
          <div className="h-48 flex items-end justify-between gap-2">
            {[1.2, 1.8, 1.5, 2.1, 2.5, 1.9, 2.3, 2.8, 2.4, 3.2, 2.9, 3.5, 4.1, 3.7].map((cost, i) => (
              <div
                key={i}
                className="flex-1 bg-gray-900 rounded-t hover:bg-gray-700 transition-colors cursor-pointer"
                style={{ height: `${(cost / 4.1) * 100}%` }}
                title={`$${cost.toFixed(2)}`}
              />
            ))}
          </div>
          <div className="flex justify-between mt-4">
            <p className="text-xs text-gray-500">Last 14 days</p>
            <p className="text-xs text-gray-900 font-medium">Total: $35.89</p>
          </div>
        </div>

        {/* Cost Optimization Tips */}
        <div className="mt-12 border border-gray-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-1">Optimization Tips</h3>
          <p className="text-sm text-gray-600 mb-6">Ways to reduce your API costs</p>
          
          <div className="space-y-4">
            <div className="flex gap-4">
              <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <DollarSign className="w-4 h-4 text-green-700" />
              </div>
              <div>
                <p className="font-medium text-gray-900 mb-1">Use GPT-3.5 for simple tasks</p>
                <p className="text-sm text-gray-600">Could save ~$8/month by switching simple prompts</p>
              </div>
            </div>
            
            <div className="flex gap-4">
              <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <TrendingDown className="w-4 h-4 text-blue-700" />
              </div>
              <div>
                <p className="font-medium text-gray-900 mb-1">Batch similar requests</p>
                <p className="text-sm text-gray-600">Reduce overhead by grouping related prompts</p>
              </div>
            </div>
            
            <div className="flex gap-4">
              <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <BarChart3 className="w-4 h-4 text-purple-700" />
              </div>
              <div>
                <p className="font-medium text-gray-900 mb-1">Optimize prompt length</p>
                <p className="text-sm text-gray-600">Shorter prompts mean lower token costs</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </UnifiedLayout>
  )
}