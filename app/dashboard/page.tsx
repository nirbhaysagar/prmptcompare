'use client'

import { UnifiedLayout } from '@/components/unified-layout'
import { PromptWorkspace } from '@/components/prompt-workspace'

export default function DashboardPage() {
  const disableAuth = process.env.NEXT_PUBLIC_DISABLE_AUTH === 'true'

  // Skip auth checks if disabled
  if (disableAuth) {
    return (
      <UnifiedLayout currentPage="dashboard">
        <PromptWorkspace />
      </UnifiedLayout>
    )
  }

  // Original auth logic for when auth is enabled
  return (
    <UnifiedLayout currentPage="dashboard">
      <PromptWorkspace />
    </UnifiedLayout>
  )
}
