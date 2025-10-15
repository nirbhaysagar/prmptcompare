'use client'

import { ApiKeyManager } from '@/components/api-key-manager'
import { Navigation } from '@/components/navigation'

export default function SettingsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <ApiKeyManager />
      </div>
    </div>
  )
}
