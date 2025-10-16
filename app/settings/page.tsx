'use client'

import { UnifiedLayout } from '@/components/unified-layout'
import { Key, Plus, ExternalLink } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function SettingsPage() {
  const providers = [
    { name: 'OpenAI', configured: false, url: 'https://platform.openai.com/api-keys' },
    { name: 'Anthropic', configured: false, url: 'https://console.anthropic.com' },
    { name: 'Google', configured: false, url: 'https://makersuite.google.com/app/apikey' },
    { name: 'DeepSeek', configured: false, url: 'https://platform.deepseek.com' },
  ]

  return (
    <UnifiedLayout currentPage="settings">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">API Keys</h1>
          <p className="text-gray-600">Configure your API keys for model testing</p>
        </div>

        {/* Info Banner */}
        <div className="border border-blue-200 bg-blue-50 rounded-lg p-4 mb-8">
          <div className="flex gap-3">
            <div className="w-5 h-5 bg-blue-600 rounded flex items-center justify-center flex-shrink-0 mt-0.5">
              <Key className="w-3 h-3 text-white" />
            </div>
            <div>
              <p className="font-medium text-blue-900 mb-1">BYOK - Bring Your Own Key</p>
              <p className="text-sm text-blue-800">
                You provide your own API keys from AI providers. PromptForge never stores your keys permanently 
                and you pay providers directly - no markup from us.
              </p>
            </div>
          </div>
        </div>

        {/* API Keys List */}
        <div className="space-y-4">
          {providers.map((provider) => (
            <div key={provider.name} className="border border-gray-200 rounded-lg p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-semibold text-gray-900">{provider.name}</h3>
                    {provider.configured ? (
                      <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded font-medium">
                        Configured
                      </span>
                    ) : (
                      <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded font-medium">
                        Not configured
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-600 mb-3">
                    Add your {provider.name} API key to enable benchmarking with their models
                  </p>
                  <a
                    href={provider.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-gray-900 hover:text-gray-700 flex items-center gap-1 font-medium"
                  >
                    Get API key
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
                
                <Button
                  variant="outline"
                  size="sm"
                  className="ml-4"
                >
                  {provider.configured ? 'Update' : 'Add Key'}
                </Button>
              </div>
            </div>
          ))}
        </div>

        {/* Security Notice */}
        <div className="mt-8 border border-yellow-200 bg-yellow-50 rounded-lg p-4">
          <p className="text-sm font-medium text-yellow-900 mb-1">Security Notice</p>
          <p className="text-sm text-yellow-800">
            Your API keys are encrypted and stored securely. PromptForge will only use them for the 
            benchmarking features you enable. You can remove them at any time.
          </p>
        </div>
      </div>
    </UnifiedLayout>
  )
}