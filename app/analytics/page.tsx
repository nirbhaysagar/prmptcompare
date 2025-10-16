'use client'

import { useState, useEffect } from 'react'
import { UnifiedLayout } from '@/components/unified-layout'
import { BarChart3, TrendingUp, Clock, DollarSign } from 'lucide-react'

export default function AnalyticsPage() {
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setTimeout(() => setLoading(false), 500)
  }, [])

  if (loading) {
    return (
      <UnifiedLayout currentPage="analytics">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="w-8 h-8 border-2 border-gray-900 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
            <p className="text-sm text-gray-600">Loading analytics...</p>
          </div>
        </div>
      </UnifiedLayout>
    )
  }

  return (
    <UnifiedLayout currentPage="analytics">
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Analytics</h1>
          <p className="text-gray-600">Track your prompt performance and usage</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="border border-gray-200 rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                <BarChart3 className="w-5 h-5 text-gray-700" />
              </div>
            </div>
            <p className="text-sm text-gray-600 mb-1">Total Runs</p>
            <p className="text-3xl font-bold text-gray-900">156</p>
            <p className="text-xs text-green-600 mt-2 flex items-center">
              <TrendingUp className="w-3 h-3 mr-1" />
              +12% from last month
            </p>
          </div>

          <div className="border border-gray-200 rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                <Clock className="w-5 h-5 text-gray-700" />
              </div>
            </div>
            <p className="text-sm text-gray-600 mb-1">Avg Response</p>
            <p className="text-3xl font-bold text-gray-900">1.8s</p>
            <p className="text-xs text-green-600 mt-2 flex items-center">
              <TrendingUp className="w-3 h-3 mr-1" />
              15% faster
            </p>
          </div>

          <div className="border border-gray-200 rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                <DollarSign className="w-5 h-5 text-gray-700" />
              </div>
            </div>
            <p className="text-sm text-gray-600 mb-1">Total Cost</p>
            <p className="text-3xl font-bold text-gray-900">$12.47</p>
            <p className="text-xs text-gray-600 mt-2">This month</p>
          </div>

          <div className="border border-gray-200 rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                <BarChart3 className="w-5 h-5 text-gray-700" />
              </div>
            </div>
            <p className="text-sm text-gray-600 mb-1">Success Rate</p>
            <p className="text-3xl font-bold text-gray-900">98%</p>
            <p className="text-xs text-gray-600 mt-2">Reliability</p>
          </div>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Usage Chart */}
          <div className="border border-gray-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-1">Usage Trends</h3>
            <p className="text-sm text-gray-600 mb-6">Daily benchmark runs</p>
            
            <div className="h-48 flex items-end justify-between gap-2">
              {[4, 7, 5, 9, 12, 8, 11, 15, 13, 16, 14, 18, 20, 17].map((height, i) => (
                <div
                  key={i}
                  className="flex-1 bg-gray-900 rounded-t hover:bg-gray-700 transition-colors cursor-pointer"
                  style={{ height: `${(height / 20) * 100}%` }}
                  title={`${height} runs`}
                />
              ))}
            </div>
            <p className="text-xs text-gray-500 mt-4">Last 14 days</p>
          </div>

          {/* Top Models */}
          <div className="border border-gray-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-1">Top Models</h3>
            <p className="text-sm text-gray-600 mb-6">Most frequently used</p>
            
            <div className="space-y-4">
              {[
                { model: 'GPT-4', usage: 45, color: 'bg-gray-900' },
                { model: 'Claude-3-Sonnet', usage: 38, color: 'bg-gray-700' },
                { model: 'Gemini-Pro', usage: 32, color: 'bg-gray-500' },
                { model: 'GPT-3.5-Turbo', usage: 28, color: 'bg-gray-400' },
              ].map((item) => (
                <div key={item.model}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-900">{item.model}</span>
                    <span className="text-sm text-gray-600">{item.usage} runs</span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-2">
                    <div
                      className={`${item.color} h-2 rounded-full transition-all`}
                      style={{ width: `${(item.usage / 45) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="border border-gray-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-1">Recent Activity</h3>
          <p className="text-sm text-gray-600 mb-6">Latest benchmark runs</p>
          
          <div className="space-y-3">
            {[
              { title: 'Product Description Generator', models: 3, time: '2 hours ago', status: 'success' },
              { title: 'Code Review Assistant', models: 2, time: '5 hours ago', status: 'success' },
              { title: 'Email Response Template', models: 4, time: '1 day ago', status: 'success' },
              { title: 'Customer Support Bot', models: 3, time: '2 days ago', status: 'success' },
            ].map((activity, i) => (
              <div key={i} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0">
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">{activity.title}</p>
                  <p className="text-xs text-gray-600">{activity.models} models tested</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-gray-600">{activity.time}</p>
                  <span className="inline-block px-2 py-1 bg-green-100 text-green-700 text-xs rounded mt-1">
                    {activity.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </UnifiedLayout>
  )
}