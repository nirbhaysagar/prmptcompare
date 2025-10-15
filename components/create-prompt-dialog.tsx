'use client'

import { useState } from 'react'
import { InsertTables } from '@/lib/supabase'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { X } from 'lucide-react'

interface CreatePromptDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onCreate: (prompt: InsertTables<'prompts'>) => void
  isLoading: boolean
}

export function CreatePromptDialog({ 
  open, 
  onOpenChange, 
  onCreate, 
  isLoading 
}: CreatePromptDialogProps) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    content: '',
    tags: '',
    is_public: false,
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.title.trim() || !formData.content.trim()) {
      return
    }

    const tagsArray = formData.tags
      .split(',')
      .map(tag => tag.trim())
      .filter(tag => tag.length > 0)

    onCreate({
      title: formData.title.trim(),
      description: formData.description.trim() || null,
      content: formData.content.trim(),
      tags: tagsArray,
      is_public: formData.is_public,
    })

    // Reset form
    setFormData({
      title: '',
      description: '',
      content: '',
      tags: '',
      is_public: false,
    })
    onOpenChange(false)
  }

  const handleClose = () => {
    setFormData({
      title: '',
      description: '',
      content: '',
      tags: '',
      is_public: false,
    })
    onOpenChange(false)
  }

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-60" 
        onClick={handleClose}
      />
      
      {/* Modal */}
      <div className="relative w-full max-w-2xl bg-white rounded-lg shadow-2xl border border-gray-200 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Create New Prompt</h2>
            <p className="text-sm text-gray-600 mt-1">Add a new prompt to your workspace</p>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleClose}
            disabled={isLoading}
            className="h-8 w-8 text-gray-500 hover:text-gray-700"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Content */}
        <div className="p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                Title *
              </label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                placeholder="e.g., Product Description Generator"
                required
                className="bg-white"
              />
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Brief description of what this prompt does..."
                rows={3}
                className="bg-white"
              />
            </div>

            <div>
              <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-2">
                Prompt Content *
              </label>
              <Textarea
                id="content"
                value={formData.content}
                onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
                placeholder="Enter your prompt content here..."
                rows={8}
                required
                className="bg-white"
              />
              <p className="text-xs text-gray-500 mt-1">
                You can use variables like {`{variable_name}`} that you'll fill in when testing
              </p>
            </div>

            <div>
              <label htmlFor="tags" className="block text-sm font-medium text-gray-700 mb-2">
                Tags
              </label>
              <Input
                id="tags"
                value={formData.tags}
                onChange={(e) => setFormData(prev => ({ ...prev, tags: e.target.value }))}
                placeholder="e.g., ecommerce, copywriting, product-descriptions"
                className="bg-white"
              />
              <p className="text-xs text-gray-500 mt-1">
                Separate tags with commas
              </p>
            </div>

            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="is_public"
                checked={formData.is_public}
                onChange={(e) => setFormData(prev => ({ ...prev, is_public: e.target.checked }))}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <label htmlFor="is_public" className="text-sm font-medium text-gray-700">
                Make this prompt public
              </label>
            </div>

            <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
              <Button
                type="button"
                variant="outline"
                onClick={handleClose}
                disabled={isLoading}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isLoading || !formData.title.trim() || !formData.content.trim()}
              >
                {isLoading ? 'Creating...' : 'Create Prompt'}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}