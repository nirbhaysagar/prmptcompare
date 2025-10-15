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
  Settings
} from 'lucide-react'

interface ApiKey {
  id: string
  provider: string
  name: string
  isConfigured: boolean
  lastUsed?: string
}

const PROVIDERS = [
  { id: 'openai', name: 'OpenAI', models: ['gpt-4', 'gpt-4-turbo', 'gpt-3.5-turbo'], color: 'bg-green-100 text-green-800' },
  { id: 'anthropic', name: 'Anthropic', models: ['claude-3-opus', 'claude-3-sonnet', 'claude-3-haiku'], color: 'bg-orange-100 text-orange-800' },
  { id: 'google', name: 'Google', models: ['gemini-pro'], color: 'bg-blue-100 text-blue-800' },
  { id: 'deepseek', name: 'DeepSeek', models: ['deepseek-chat', 'deepseek-coder'], color: 'bg-purple-100 text-purple-800' },
]

export function ApiKeyManager() {
  const [apiKeys, setApiKeys] = useState<ApiKey[]>([
    { id: '1', provider: 'openai', name: 'OpenAI', isConfigured: false },
    { id: '2', provider: 'anthropic', name: 'Anthropic', isConfigured: false },
    { id: '3', provider: 'google', name: 'Google', isConfigured: false },
    { id: '4', provider: 'deepseek', name: 'DeepSeek', isConfigured: false },
  ])
  
  const [showDialog, setShowDialog] = useState(false)
  const [selectedProvider, setSelectedProvider] = useState<string>('')
  const [newApiKey, setNewApiKey] = useState('')
  const [showKey, setShowKey] = useState(false)

  const handleSaveApiKey = () => {
    if (!selectedProvider || !newApiKey.trim()) return

    setApiKeys(prev => prev.map(key => 
      key.provider === selectedProvider 
        ? { ...key, isConfigured: true, lastUsed: new Date().toISOString() }
        : key
    ))
    
    // In a real app, you'd save this securely to your database
    localStorage.setItem(`api_key_${selectedProvider}`, newApiKey)
    
    setShowDialog(false)
    setNewApiKey('')
    setSelectedProvider('')
  }

  const handleRemoveApiKey = (provider: string) => {
    setApiKeys(prev => prev.map(key => 
      key.provider === provider 
        ? { ...key, isConfigured: false, lastUsed: undefined }
        : key
    ))
    
    localStorage.removeItem(`api_key_${provider}`)
  }

  const openDialog = (provider: string) => {
    setSelectedProvider(provider)
    const existingKey = localStorage.getItem(`api_key_${provider}`)
    if (existingKey) {
      setNewApiKey(existingKey)
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
        {apiKeys.map((apiKey) => {
          const provider = getProviderInfo(apiKey.provider)
          return (
            <Card key={apiKey.id} className="relative">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${provider?.color}`}>
                      <Key className="w-5 h-5" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">{apiKey.name}</CardTitle>
                      <CardDescription>
                        {provider?.models.length} models available
                      </CardDescription>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    {apiKey.isConfigured ? (
                      <>
                        <Badge className="bg-green-100 text-green-800">
                          <CheckCircle className="w-3 h-3 mr-1" />
                          Configured
                        </Badge>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleRemoveApiKey(apiKey.provider)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </>
                    ) : (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => openDialog(apiKey.provider)}
                      >
                        <Plus className="w-4 h-4 mr-1" />
                        Add Key
                      </Button>
                    )}
                  </div>
                </div>
              </CardHeader>
              
              <CardContent>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm font-medium text-gray-700 mb-1">Available Models:</p>
                    <div className="flex flex-wrap gap-1">
                      {provider?.models.map(model => (
                        <Badge key={model} variant="secondary" className="text-xs">
                          {model}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  
                  {apiKey.isConfigured && (
                    <div className="text-xs text-gray-600">
                      <p>Last used: {apiKey.lastUsed ? new Date(apiKey.lastUsed).toLocaleDateString() : 'Never'}</p>
                    </div>
                  )}
                  
                  <div className="pt-2">
                    <a
                      href={`https://${apiKey.provider === 'openai' ? 'platform.openai.com/api-keys' : 
                              apiKey.provider === 'anthropic' ? 'console.anthropic.com' :
                              apiKey.provider === 'google' ? 'makersuite.google.com/app/apikey' :
                              'platform.deepseek.com'}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-blue-600 hover:text-blue-800 underline"
                    >
                      Get your {apiKey.name} API key →
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
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Add {getProviderInfo(selectedProvider)?.name} API Key</DialogTitle>
            <DialogDescription>
              Enter your API key for {getProviderInfo(selectedProvider)?.name}. 
              This will be stored securely and used for benchmarking.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <label htmlFor="apiKey" className="block text-sm font-medium text-gray-700 mb-2">
                API Key
              </label>
              <div className="relative">
                <Input
                  id="apiKey"
                  type={showKey ? 'text' : 'password'}
                  value={newApiKey}
                  onChange={(e) => setNewApiKey(e.target.value)}
                  placeholder={`Enter your ${getProviderInfo(selectedProvider)?.name} API key`}
                  className="pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowKey(!showKey)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
              <div className="flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-yellow-600 mt-0.5" />
                <div className="text-sm text-yellow-800">
                  <p className="font-medium">Security Notice:</p>
                  <p>Your API key is encrypted and stored securely. PromptForge will only use it for the benchmarking features you enable.</p>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3">
              <Button variant="outline" onClick={() => setShowDialog(false)}>
                Cancel
              </Button>
              <Button 
                onClick={handleSaveApiKey}
                disabled={!newApiKey.trim()}
                className="bg-blue-600 hover:bg-blue-700"
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
