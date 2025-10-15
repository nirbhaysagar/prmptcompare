'use client'

import { ApiKeyManager } from '@/components/api-key-manager'
import { UnifiedLayout } from '@/components/unified-layout'

export default function SettingsPage() {
  return (
    <UnifiedLayout currentPage="settings">
      <ApiKeyManager />
    </UnifiedLayout>
  )
}
