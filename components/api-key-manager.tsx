'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle 
} from '@/components/ui/dialog'
import { 
  Key, 
  Eye, 
  EyeOff, 
  Plus, 
  Trash2, 
  CheckCircle,
  AlertCircle,
  Settings,
  ExternalLink
} from 'lucide-react'
import { useApiKeys, useSaveApiKey, useDeleteApiKey } from '@/lib/queries/api-keys'

const PROVIDERS = [
  { id: 'openai', name: 'OpenAI', models: ['gpt-4', 'gpt-4-turbo', 'gpt-3.5-turbo'], color: 'bg-green-100 text-green-800' },
  { id: 'anthropic', name: 'Anthropic', models: ['claude-3-opus', 'claude-3-sonnet', 'claude-3-haiku'], color: 'bg-orange-100 text-orange-800' },
  { id: 'google', name: 'Google', models: ['gemini-pro'], color: 'bg-blue-100 text-blue-800' },
  { id: 'deepseek', name: 'DeepSeek', models: ['deepseek-chat', 'deepseek-coder'], color: 'bg-purple-100 text-purple-800' },
]

export function ApiKeyManager() {
  const { data: apiKeys = [] } = useApiKeys()
  const saveApiKey = useSaveApiKey()
  const deleteApiKey = useDeleteApiKey()
  
  const [showDialog, setShowDialog] = useState(false)
  const [selectedProvider, setSelectedProvider] = useState<string>('')
  const [newApiKey, setNewApiKey] = useState('')
  const [showKey, setShowKey] = useState(false)

  const handleSaveApiKey = () => {
    if (!selectedProvider || !newApiKey.trim()) return

    saveApiKey.mutate({
      provider: selectedProvider,
      key: newApiKey,
    })
    
    setShowDialog(false)
    setNewApiKey('')
    setSelectedProvider('')
  }

  const handleRemoveApiKey = (provider: string) => {
    deleteApiKey.mutate(provider)
  }

  const openDialog = (provider: string) => {
    setSelectedProvider(provider)
    const existingKey = apiKeys.find(k => k.provider === provider)
    if (existingKey) {
      setNewApiKey(existingKey.key)
    }
    setShowDialog(true)
  }

  const getProviderInfo = (providerId: string) => {
    return PROVIDERS.find(p => p.id === providerId)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">API Key Management</h2>
          <p className="text-gray-600 mt-1">Configure your API keys for AI model access</p>
        </div>
        <Badge variant="secondary" className="bg-blue-100 text-blue-800">
          BYOK - Bring Your Own Key
        </Badge>
      </div>

      {/* Info Card */}
      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5" />
            <div>
              <h3 className="font-medium text-blue-900">How BYOK Works</h3>
              <p className="text-sm text-blue-800 mt-1">
                You provide your own API keys from AI providers. PromptForge never stores your keys permanently 
                and you pay the providers directly at their rates - no markup from us.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* API Keys Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {PROVIDERS.map((provider) => {
          const apiKey = apiKeys.find(k => k.provider === provider.id)
          const isConfigured = !!apiKey
          
          return (
            <Card key={provider.id} className={`relative transition-all hover:shadow-md ${
              isConfigured ? 'border-green-200 bg-green-50/30' : 'border-gray-200'
            }`}>
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${provider.color} shadow-sm`}>
                      <Key className="w-6 h-6" />
                    </div>
                    <div>
                      <CardTitle className="text-lg font-bold">{provider.name}</CardTitle>
                      <CardDescription className="text-sm">
                        {provider.models.length} models available
                      </CardDescription>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    {isConfigured ? (
                      <>
                        <Badge className="bg-green-100 text-green-800 border-green-300">
                          <CheckCircle className="w-3 h-3 mr-1" />
                          Active
                        </Badge>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRemoveApiKey(provider.id)}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </>
                    ) : (
                      <Button
                        onClick={() => openDialog(provider.id)}
                        size="sm"
                        className="bg-gray-900 hover:bg-gray-800 text-white"
                      >
                        <Plus className="w-4 h-4 mr-1" />
                        Add Key
                      </Button>
                    )}
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="pt-0">
                <div className="space-y-4">
                  <div>
                    <p className="text-sm font-semibold text-gray-700 mb-2">Available Models:</p>
                    <div className="flex flex-wrap gap-2">
                      {provider.models.map(model => (
                        <Badge 
                          key={model} 
                          variant="secondary" 
                          className="text-xs bg-white border border-gray-200"
                        >
                          {model}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  
                  {isConfigured && apiKey && (
                    <div className="text-xs text-gray-600 bg-white p-2 rounded border border-gray-200">
                      <p className="font-medium">✓ Configured on {new Date(apiKey.created_at).toLocaleDateString()}</p>
                    </div>
                  )}
                  
                  <div className="pt-2 border-t border-gray-200">
                    <a
                      href={`https://${provider.id === 'openai' ? 'platform.openai.com/api-keys' : 
                              provider.id === 'anthropic' ? 'console.anthropic.com' :
                              provider.id === 'google' ? 'makersuite.google.com/app/apikey' :
                              'platform.deepseek.com'}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-blue-600 hover:text-blue-800 font-medium flex items-center gap-1"
                    >
                      Get your {provider.name} API key
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Add API Key Dialog */}
      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle className="text-xl">Add {getProviderInfo(selectedProvider)?.name} API Key</DialogTitle>
            <DialogDescription className="text-base">
              Enter your API key for {getProviderInfo(selectedProvider)?.name}. 
              This will be stored securely in your browser and used for benchmarking.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6 py-4">
            <div>
              <label htmlFor="apiKey" className="block text-sm font-semibold text-gray-900 mb-2">
                API Key
              </label>
              <div className="relative">
                <Input
                  id="apiKey"
                  type={showKey ? 'text' : 'password'}
                  value={newApiKey}
                  onChange={(e) => setNewApiKey(e.target.value)}
                  placeholder={`sk-...`}
                  className="pr-12 h-11 text-base"
                />
                <button
                  type="button"
                  onClick={() => setShowKey(!showKey)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 p-1"
                  title={showKey ? 'Hide key' : 'Show key'}
                >
                  {showKey ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              <p className="text-xs text-gray-500 mt-2">
                Your API key starts with <code className="bg-gray-100 px-1 py-0.5 rounded">sk-</code>
              </p>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <Key className="w-4 h-4 text-blue-600" />
                </div>
                <div className="text-sm">
                  <p className="font-semibold text-blue-900 mb-1">How it works:</p>
                  <ul className="text-blue-800 space-y-1">
                    <li>• Your key is stored locally in your browser</li>
                    <li>• Used only for benchmarking when you run tests</li>
                    <li>• You pay providers directly at their rates</li>
                    <li>• No markup or data sharing with PromptForge</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <Button 
                variant="outline" 
                onClick={() => setShowDialog(false)}
                className="px-6"
              >
                Cancel
              </Button>
              <Button 
                onClick={handleSaveApiKey}
                disabled={!newApiKey.trim()}
                className="bg-gray-900 hover:bg-gray-800 text-white px-6"
              >
                Save API Key
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
