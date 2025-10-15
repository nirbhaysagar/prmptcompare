export default function LandingPage() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-white">
      <div className="max-w-2xl mx-auto px-6 py-16 text-center">
        <h1 className="text-4xl font-bold tracking-tight text-gray-900">PromptForge</h1>
        <p className="mt-4 text-gray-600">
          Test and compare AI prompts across multiple models. Minimal landing page while we iterate.
        </p>
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
          <a
            href="/dashboard"
            className="inline-flex items-center rounded-md bg-blue-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-blue-700"
          >
            Go to Dashboard
          </a>
          <a
            href="/signup"
            className="inline-flex items-center rounded-md border border-gray-300 px-5 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Sign up
          </a>
          <a
            href="/login"
            className="inline-flex items-center rounded-md border border-gray-300 px-5 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Sign in
          </a>
        </div>
        <p className="mt-6 text-xs text-gray-400">
          Tip: set NEXT_PUBLIC_DISABLE_AUTH=true in .env.local to bypass auth temporarily.
        </p>
      </div>
    </main>
  )
}