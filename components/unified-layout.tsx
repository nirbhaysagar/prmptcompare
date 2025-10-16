'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { LogOut, BarChart3, DollarSign, Key, Menu, X, Home } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

interface UnifiedLayoutProps {
  children: React.ReactNode
  currentPage?: string
}

export function UnifiedLayout({ children, currentPage = 'dashboard' }: UnifiedLayoutProps) {
  const disableAuth = process.env.NEXT_PUBLIC_DISABLE_AUTH === 'true'
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const router = useRouter()

  const handleSignOut = () => {
    router.push('/')
  }

  const navigationItems = [
    { href: '/dashboard', label: 'Dashboard', icon: Home, key: 'dashboard' },
    { href: '/analytics', label: 'Analytics', icon: BarChart3, key: 'analytics' },
    { href: '/analytics/costs', label: 'Costs', icon: DollarSign, key: 'costs' },
    { href: '/analytics/performance', label: 'Performance', icon: BarChart3, key: 'performance' },
    { href: '/settings', label: 'Settings', icon: Key, key: 'settings' },
  ]

  return (
    <div className="min-h-screen bg-white">
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/20 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-200 transform transition-transform duration-200 lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        {/* Logo */}
        <div className="h-16 border-b border-gray-200 flex items-center justify-between px-6">
          <Link href="/dashboard" className="text-xl font-bold text-gray-900">
            PromptForge
          </Link>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden p-2 hover:bg-gray-100 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="p-4 space-y-1">
          {navigationItems.map((item) => {
            const Icon = item.icon
            const isActive = currentPage === item.key
            
            return (
              <Link
                key={item.key}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-gray-900 text-white'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <Icon className="w-5 h-5" />
                {item.label}
              </Link>
            )
          })}
        </nav>

        {/* User Section */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200">
          <div className="flex items-center gap-3 px-4 py-3 mb-2">
            <div className="w-8 h-8 bg-gray-900 text-white rounded-full flex items-center justify-center text-sm font-medium">
              D
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">
                {disableAuth ? 'Demo User' : 'User'}
              </p>
              <p className="text-xs text-gray-500 truncate">
                {disableAuth ? 'demo@promptforge.com' : 'user@example.com'}
              </p>
            </div>
          </div>
          <Button
            onClick={handleSignOut}
            variant="outline"
            className="w-full justify-start border-gray-300"
            size="sm"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Sign Out
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="lg:pl-64">
        {/* Top Bar */}
        <header className="h-16 border-b border-gray-200 bg-white sticky top-0 z-30">
          <div className="h-full px-6 flex items-center justify-between">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 hover:bg-gray-100 rounded-lg"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div className="lg:hidden"></div>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-8">
          {children}
        </main>
      </div>
    </div>
  )
}