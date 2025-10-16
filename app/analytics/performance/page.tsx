'use client'

import { useState, useEffect } from 'react'
import { UnifiedLayout } from '@/components/unified-layout'
import { Clock, Star, Zap, Target, DollarSign } from 'lucide-react'

export default function PerformanceAnalyticsPage() {
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setTimeout(() => setLoading(false), 500)
  }, [])

  if (loading) {
    return (
      <UnifiedLayout currentPage="performance">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="w-8 h-8 border-2 border-gray-900 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
            <p className="text-sm text-gray-600">Loading performance...</p>
          </div>
        </div>
      </UnifiedLayout>
    )
  }

  return (
    <UnifiedLayout currentPage="performance">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Performance</h1>
          <p className="text-gray-600">Model performance comparison and insights</p>
        </div>

        {/* Top Performers */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          <div className="border border-gray-200 rounded-lg p-6">
            <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center mb-4">
              <Star className="w-5 h-5 text-yellow-700" />
            </div>
            <p className="text-sm text-gray-600 mb-1">Best Quality</p>
            <p className="text-xl font-bold text-gray-900">Claude-3</p>
            <p className="text-xs text-gray-600 mt-1">4.5/5 rating</p>
          </div>

          <div className="border border-gray-200 rounded-lg p-6">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center mb-4">
              <Zap className="w-5 h-5 text-green-700" />
            </div>
            <p className="text-sm text-gray-600 mb-1">Fastest</p>
            <p className="text-xl font-bold text-gray-900">Gemini Pro</p>
            <p className="text-xs text-gray-600 mt-1">1.4s avg</p>
          </div>

          <div className="border border-gray-200 rounded-lg p-6">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
              <Target className="w-5 h-5 text-blue-700" />
            </div>
            <p className="text-sm text-gray-600 mb-1">Most Reliable</p>
            <p className="text-xl font-bold text-gray-900">GPT-3.5</p>
            <p className="text-xs text-gray-600 mt-1">99.8% uptime</p>
          </div>

          <div className="border border-gray-200 rounded-lg p-6">
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
              <DollarSign className="w-5 h-5 text-purple-700" />
            </div>
            <p className="text-sm text-gray-600 mb-1">Best Value</p>
            <p className="text-xl font-bold text-gray-900">DeepSeek</p>
            <p className="text-xs text-gray-600 mt-1">$0.018/req</p>
          </div>
        </div>

        {/* Model Comparison Table */}
        <div className="border border-gray-200 rounded-lg p-6 mb-12">
          <h3 className="text-lg font-semibold text-gray-900 mb-1">Model Comparison</h3>
          <p className="text-sm text-gray-600 mb-6">Performance metrics across all models</p>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-900">Model</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-900">Usage</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-900">Avg Time</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-900">Rating</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-900">Success Rate</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-900">Cost/Req</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { model: 'GPT-4', usage: 156, time: '2.1s', rating: 4.2, success: 98.7, cost: '$0.045' },
                  { model: 'Claude-3-Sonnet', usage: 134, time: '1.7s', rating: 4.5, success: 99.3, cost: '$0.038' },
                  { model: 'Gemini Pro', usage: 89, time: '1.4s', rating: 3.8, success: 96.6, cost: '$0.025' },
                  { model: 'GPT-3.5-Turbo', usage: 203, time: '1.2s', rating: 3.9, success: 99.5, cost: '$0.012' },
                  { model: 'DeepSeek', usage: 67, time: '1.8s', rating: 4.1, success: 97.0, cost: '$0.018' },
                ].map((row) => (
                  <tr key={row.model} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-4 font-medium text-gray-900">{row.model}</td>
                    <td className="py-3 px-4 text-gray-700">{row.usage} runs</td>
                    <td className="py-3 px-4 text-gray-700">{row.time}</td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 text-yellow-500 fill-current" />
                        <span className="text-gray-700">{row.rating}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-gray-700">{row.success}%</td>
                    <td className="py-3 px-4 text-gray-700">{row.cost}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Performance Insights */}
        <div className="border border-gray-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-1">Performance Insights</h3>
          <p className="text-sm text-gray-600 mb-6">Recommendations based on your usage</p>
          
          <div className="space-y-4">
            <div className="flex gap-4">
              <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <Zap className="w-4 h-4 text-green-700" />
              </div>
              <div>
                <p className="font-medium text-gray-900 mb-1">Speed Optimization</p>
                <p className="text-sm text-gray-600">Gemini Pro is your fastest model - ideal for real-time applications</p>
              </div>
            </div>
            
            <div className="flex gap-4">
              <div className="w-8 h-8 bg-yellow-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <Star className="w-4 h-4 text-yellow-700" />
              </div>
              <div>
                <p className="font-medium text-gray-900 mb-1">Quality Leader</p>
                <p className="text-sm text-gray-600">Claude-3-Sonnet delivers highest quality - use for critical tasks</p>
              </div>
            </div>
            
            <div className="flex gap-4">
              <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <Target className="w-4 h-4 text-blue-700" />
              </div>
              <div>
                <p className="font-medium text-gray-900 mb-1">Reliability</p>
                <p className="text-sm text-gray-600">GPT-3.5-Turbo has best uptime - most reliable for production</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </UnifiedLayout>
  )
}