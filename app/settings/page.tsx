'use client'

import { UnifiedLayout } from '@/components/unified-layout'
import { ApiKeyManager } from '@/components/api-key-manager'

export default function SettingsPage() {
  return (
    <UnifiedLayout currentPage="settings">
      <ApiKeyManager />
    </UnifiedLayout>
  )
}