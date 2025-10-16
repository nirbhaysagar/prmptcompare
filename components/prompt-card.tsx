'use client'

import { useState } from 'react'
import { Tables, UpdateTables } from '@/lib/supabase'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Edit, Trash2, Copy, MoreHorizontal, Play } from 'lucide-react'

type Prompt = Tables<'prompts'>

interface PromptCardProps {
  prompt: Prompt
  onUpdate: (data: UpdateTables<'prompts'> & { id: string }) => void
  onDelete: (id: string) => void
  onBenchmark?: (prompt: Prompt) => void
}

export function PromptCard({ prompt, onUpdate, onDelete, onBenchmark }: PromptCardProps) {
  const [showMenu, setShowMenu] = useState(false)

  const handleCopy = async () => {
    await navigator.clipboard.writeText(prompt.content)
  }

  const truncateContent = (content: string, maxLength: number = 120) => {
    if (content.length <= maxLength) return content
    return content.substring(0, maxLength) + '...'
  }

  return (
    <div className="group border border-gray-200 rounded-lg p-6 hover:border-gray-900 hover:shadow-sm transition-all">
      <div className="flex items-start justify-between gap-4 mb-4">
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-semibold text-gray-900 mb-1 truncate">
            {prompt.title}
          </h3>
          {prompt.description && (
            <p className="text-sm text-gray-600 line-clamp-2">
              {prompt.description}
            </p>
          )}
        </div>
        
        <div className="flex items-center gap-2">
          <Button
            onClick={() => onBenchmark && onBenchmark(prompt)}
            size="sm"
            className="bg-gray-900 hover:bg-gray-800 text-white opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <Play className="w-4 h-4 mr-1" />
            Test
          </Button>
          
          <div className="relative">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowMenu(!showMenu)}
              className="opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <MoreHorizontal className="w-4 h-4" />
            </Button>
            
            {showMenu && (
              <>
                <div 
                  className="fixed inset-0 z-10" 
                  onClick={() => setShowMenu(false)}
                />
                <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-20 py-1">
                  <button
                    onClick={() => {
                      handleCopy()
                      setShowMenu(false)
                    }}
                    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
                  >
                    <Copy className="w-4 h-4" />
                    Copy content
                  </button>
                  <button
                    onClick={() => {
                      // Edit functionality
                      setShowMenu(false)
                    }}
                    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
                  >
                    <Edit className="w-4 h-4" />
                    Edit
                  </button>
                  <hr className="my-1 border-gray-200" />
                  <button
                    onClick={() => {
                      onDelete(prompt.id)
                      setShowMenu(false)
                    }}
                    className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                  >
                    <Trash2 className="w-4 h-4" />
                    Delete
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      <div className="mb-4">
        <p className="text-sm text-gray-700 line-clamp-3">
          {truncateContent(prompt.content)}
        </p>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex flex-wrap gap-2">
          {prompt.tags.slice(0, 3).map((tag, index) => (
            <Badge 
              key={index} 
              variant="secondary" 
              className="text-xs bg-gray-100 text-gray-700 border-0"
            >
              {tag}
            </Badge>
          ))}
          {prompt.tags.length > 3 && (
            <Badge variant="secondary" className="text-xs bg-gray-100 text-gray-700 border-0">
              +{prompt.tags.length - 3}
            </Badge>
          )}
        </div>
        
        <span className="text-xs text-gray-500">
          {new Date(prompt.created_at).toLocaleDateString('en-US', { 
            month: 'short', 
            day: 'numeric' 
          })}
        </span>
      </div>
    </div>
  )
}