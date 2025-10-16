'use client'

import { useEffect } from 'react'
import { redirect } from 'next/navigation'
import Link from 'next/link'

export default function LandingPage() {
  const disableAuth = process.env.NEXT_PUBLIC_DISABLE_AUTH === 'true'

  // Immediate redirect for disabled auth - no loading state
  if (disableAuth) {
    redirect('/dashboard')
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="text-xl font-semibold text-gray-900">
              PromptForge
            </div>
            <div className="flex items-center space-x-4">
              <a href="/dashboard" className="text-gray-600 hover:text-gray-900 text-sm font-medium">
                Dashboard
              </a>
              <a href="/login" className="text-gray-600 hover:text-gray-900 text-sm font-medium">
                Sign In
              </a>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-6">
            The Postman for AI Prompts
          </h1>
          
          <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
            Test and compare AI prompts across multiple models in seconds, not hours.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
            <a
              href="/dashboard"
              className="inline-flex items-center px-6 py-3 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Get Started
            </a>
            <a
              href="/signup"
              className="inline-flex items-center px-6 py-3 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Sign Up
            </a>
          </div>

          {/* Simple feature list */}
          <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
            <div>
              <h3 className="text-sm font-semibold text-gray-900 mb-2">Multi-Model Testing</h3>
              <p className="text-sm text-gray-600">Test across GPT-4, Claude, Gemini, and DeepSeek simultaneously</p>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-900 mb-2">Side-by-Side Comparison</h3>
              <p className="text-sm text-gray-600">Compare responses with detailed metrics and cost analysis</p>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-900 mb-2">BYOK Security</h3>
              <p className="text-sm text-gray-600">Use your own API keys with no markup or data sharing</p>
            </div>
          </div>
        </div>
      </main>

      {/* Minimal Footer */}
      <footer className="border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="text-center text-sm text-gray-500">
            © 2024 PromptForge
          </div>
        </div>
      </footer>
    </div>
  )
}