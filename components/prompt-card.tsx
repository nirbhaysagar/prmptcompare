'use client'

import { useState } from 'react'
import { Tables, UpdateTables } from '@/lib/supabase'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Edit, Trash2, Copy, Eye, EyeOff, Zap } from 'lucide-react'

type Prompt = Tables<'prompts'>

interface PromptCardProps {
  prompt: Prompt
  onUpdate: (data: UpdateTables<'prompts'> & { id: string }) => void
  onDelete: (id: string) => void
  onBenchmark?: (prompt: Prompt) => void
}

export function PromptCard({ prompt, onUpdate, onDelete, onBenchmark }: PromptCardProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [editData, setEditData] = useState({
    title: prompt.title,
    description: prompt.description || '',
    content: prompt.content,
    tags: prompt.tags.join(', '),
    is_public: prompt.is_public,
  })

  const handleSave = () => {
    const tagsArray = editData.tags
      .split(',')
      .map(tag => tag.trim())
      .filter(tag => tag.length > 0)

    onUpdate({
      id: prompt.id,
      title: editData.title,
      description: editData.description || null,
      content: editData.content,
      tags: tagsArray,
      is_public: editData.is_public,
    })
    setIsEditing(false)
  }

  const handleCancel = () => {
    setEditData({
      title: prompt.title,
      description: prompt.description || '',
      content: prompt.content,
      tags: prompt.tags.join(', '),
      is_public: prompt.is_public,
    })
    setIsEditing(false)
  }

  const handleCopy = async () => {
    await navigator.clipboard.writeText(prompt.content)
    // You could add a toast notification here
  }

  const handleTogglePublic = () => {
    onUpdate({
      id: prompt.id,
      is_public: !prompt.is_public,
    })
  }

  const truncateContent = (content: string, maxLength: number = 150) => {
    if (content.length <= maxLength) return content
    return content.substring(0, maxLength) + '...'
  }

  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            {isEditing ? (
              <input
                value={editData.title}
                onChange={(e) => setEditData(prev => ({ ...prev, title: e.target.value }))}
                className="text-lg font-semibold bg-transparent border-b border-gray-300 focus:outline-none focus:border-blue-500 w-full"
              />
            ) : (
              <CardTitle className="text-lg">{prompt.title}</CardTitle>
            )}
            {isEditing ? (
              <textarea
                value={editData.description}
                onChange={(e) => setEditData(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Description (optional)"
                className="text-sm text-gray-600 bg-transparent border-b border-gray-300 focus:outline-none focus:border-blue-500 w-full mt-2 resize-none"
                rows={2}
              />
            ) : (
              prompt.description && (
                <CardDescription className="mt-2">{prompt.description}</CardDescription>
              )
            )}
          </div>
          <div className="flex items-center space-x-1 ml-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={handleTogglePublic}
              title={prompt.is_public ? 'Make private' : 'Make public'}
            >
              {prompt.is_public ? (
                <Eye className="w-4 h-4 text-green-600" />
              ) : (
                <EyeOff className="w-4 h-4 text-gray-400" />
              )}
            </Button>
          </div>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-2 mt-3">
          {isEditing ? (
            <input
              value={editData.tags}
              onChange={(e) => setEditData(prev => ({ ...prev, tags: e.target.value }))}
              placeholder="Tags (comma-separated)"
              className="text-sm bg-transparent border-b border-gray-300 focus:outline-none focus:border-blue-500 flex-1 min-w-0"
            />
          ) : (
            prompt.tags.map((tag, index) => (
              <Badge key={index} variant="secondary" className="text-xs">
                {tag}
              </Badge>
            ))
          )}
        </div>
      </CardHeader>

      <CardContent className="flex-1">
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-700">Content:</span>
            {!isEditing && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleCopy}
                className="h-6 px-2 text-xs"
              >
                <Copy className="w-3 h-3 mr-1" />
                Copy
              </Button>
            )}
          </div>
          
          {isEditing ? (
            <textarea
              value={editData.content}
              onChange={(e) => setEditData(prev => ({ ...prev, content: e.target.value }))}
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              rows={isExpanded ? 8 : 4}
              placeholder="Enter your prompt content..."
            />
          ) : (
            <div className="bg-gray-50 p-3 rounded-md">
              <p className="text-sm text-gray-700 whitespace-pre-wrap">
                {isExpanded ? prompt.content : truncateContent(prompt.content)}
              </p>
              {prompt.content.length > 150 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsExpanded(!isExpanded)}
                  className="mt-2 h-6 px-2 text-xs text-blue-600 hover:text-blue-700"
                >
                  {isExpanded ? 'Show less' : 'Show more'}
                </Button>
              )}
            </div>
          )}
        </div>

        {/* Metadata */}
        <div className="text-xs text-gray-500 mt-4 pt-3 border-t">
          Created: {new Date(prompt.created_at).toLocaleDateString()}
          {prompt.updated_at !== prompt.created_at && (
            <span className="ml-2">
              • Updated: {new Date(prompt.updated_at).toLocaleDateString()}
            </span>
          )}
        </div>
      </CardContent>

      <CardFooter className="flex justify-between">
        {isEditing ? (
          <div className="flex space-x-2">
            <Button size="sm" onClick={handleSave}>
              Save
            </Button>
            <Button size="sm" variant="outline" onClick={handleCancel}>
              Cancel
            </Button>
          </div>
        ) : (
          <div className="flex space-x-2">
            {onBenchmark && (
              <Button
                size="sm"
                variant="outline"
                onClick={() => onBenchmark(prompt)}
                className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
              >
                <Zap className="w-3 h-3 mr-1" />
                Benchmark
              </Button>
            )}
            <Button
              size="sm"
              variant="outline"
              onClick={() => setIsEditing(true)}
            >
              <Edit className="w-3 h-3 mr-1" />
              Edit
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => onDelete(prompt.id)}
              className="text-red-600 hover:text-red-700 hover:bg-red-50"
            >
              <Trash2 className="w-3 h-3 mr-1" />
              Delete
            </Button>
          </div>
        )}
      </CardFooter>
    </Card>
  )
}
