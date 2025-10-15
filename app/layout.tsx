import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Providers } from '@/lib/providers'
import { AuthProvider } from '@/components/auth-provider'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'PromptForge - AI Prompt Testing & Versioning',
  description: 'Test, compare, and version AI prompts across multiple LLMs. Find the best-performing prompt fast.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const disableAuth = process.env.NEXT_PUBLIC_DISABLE_AUTH === 'true'
  return (
    <html lang="en">
      <body className={inter.className} suppressHydrationWarning={true}>
        <Providers>
          {disableAuth ? (
            children
          ) : (
            <AuthProvider>
              {children}
            </AuthProvider>
          )}
        </Providers>
      </body>
    </html>
  )
}