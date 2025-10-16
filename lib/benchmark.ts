import { getApiKey } from './queries/api-keys'
import type { ApiKey } from './queries/api-keys'

export interface BenchmarkResult {
  provider: string
  model: string
  response: string
  responseTime: number
  cost: number
  tokens: {
    prompt: number
    completion: number
    total: number
  }
  error?: string
}

export interface BenchmarkRequest {
  prompt: string
  models: string[]
  apiKeys: ApiKey[]
}

// Estimate token count (rough approximation)
function estimateTokens(text: string): number {
  return Math.ceil(text.length / 4)
}

// Calculate cost based on provider and model
function calculateCost(provider: string, model: string, promptTokens: number, completionTokens: number): number {
  const pricing: Record<string, { prompt: number; completion: number }> = {
    'openai-gpt-4': { prompt: 0.03, completion: 0.06 },
    'openai-gpt-4-turbo': { prompt: 0.01, completion: 0.03 },
    'openai-gpt-3.5-turbo': { prompt: 0.0005, completion: 0.0015 },
    'anthropic-claude-3-opus': { prompt: 0.015, completion: 0.075 },
    'anthropic-claude-3-sonnet': { prompt: 0.003, completion: 0.015 },
    'anthropic-claude-3-haiku': { prompt: 0.00025, completion: 0.00125 },
    'google-gemini-pro': { prompt: 0.0005, completion: 0.0015 },
    'google-gemini-ultra': { prompt: 0.002, completion: 0.006 },
    'deepseek-deepseek-chat': { prompt: 0.00014, completion: 0.00028 },
  }

  const rate = pricing[`${provider}-${model}`] || { prompt: 0.001, completion: 0.002 }
  const promptCost = (promptTokens / 1000000) * rate.prompt
  const completionCost = (completionTokens / 1000000) * rate.completion
  
  return promptCost + completionCost
}

// Call OpenAI API
async function callOpenAI(prompt: string, model: string, apiKey: string): Promise<BenchmarkResult> {
  const startTime = Date.now()
  
  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: model,
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.7,
        max_tokens: 1000,
      }),
    })

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.statusText}`)
    }

    const data = await response.json()
    const responseTime = Date.now() - startTime
    
    const promptTokens = data.usage?.prompt_tokens || estimateTokens(prompt)
    const completionTokens = data.usage?.completion_tokens || estimateTokens(data.choices[0].message.content)
    
    return {
      provider: 'openai',
      model: model,
      response: data.choices[0].message.content,
      responseTime,
      cost: calculateCost('openai', model, promptTokens, completionTokens),
      tokens: {
        prompt: promptTokens,
        completion: completionTokens,
        total: data.usage?.total_tokens || promptTokens + completionTokens,
      },
    }
  } catch (error: any) {
    return {
      provider: 'openai',
      model: model,
      response: '',
      responseTime: Date.now() - startTime,
      cost: 0,
      tokens: { prompt: 0, completion: 0, total: 0 },
      error: error.message || 'Unknown error',
    }
  }
}

// Call Anthropic API
async function callAnthropic(prompt: string, model: string, apiKey: string): Promise<BenchmarkResult> {
  const startTime = Date.now()
  
  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: model,
        messages: [{ role: 'user', content: prompt }],
        max_tokens: 1000,
      }),
    })

    if (!response.ok) {
      throw new Error(`Anthropic API error: ${response.statusText}`)
    }

    const data = await response.json()
    const responseTime = Date.now() - startTime
    
    const promptTokens = data.usage?.input_tokens || estimateTokens(prompt)
    const completionTokens = data.usage?.output_tokens || estimateTokens(data.content[0].text)
    
    return {
      provider: 'anthropic',
      model: model,
      response: data.content[0].text,
      responseTime,
      cost: calculateCost('anthropic', model, promptTokens, completionTokens),
      tokens: {
        prompt: promptTokens,
        completion: completionTokens,
        total: promptTokens + completionTokens,
      },
    }
  } catch (error: any) {
    return {
      provider: 'anthropic',
      model: model,
      response: '',
      responseTime: Date.now() - startTime,
      cost: 0,
      tokens: { prompt: 0, completion: 0, total: 0 },
      error: error.message || 'Unknown error',
    }
  }
}

// Call Google Gemini API
async function callGoogle(prompt: string, model: string, apiKey: string): Promise<BenchmarkResult> {
  const startTime = Date.now()
  
  try {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 1000,
        },
      }),
    })

    if (!response.ok) {
      throw new Error(`Google API error: ${response.statusText}`)
    }

    const data = await response.json()
    const responseTime = Date.now() - startTime
    
    const responseText = data.candidates?.[0]?.content?.parts?.[0]?.text || ''
    const promptTokens = data.usageMetadata?.promptTokenCount || estimateTokens(prompt)
    const completionTokens = data.usageMetadata?.candidatesTokenCount || estimateTokens(responseText)
    
    return {
      provider: 'google',
      model: model,
      response: responseText,
      responseTime,
      cost: calculateCost('google', model, promptTokens, completionTokens),
      tokens: {
        prompt: promptTokens,
        completion: completionTokens,
        total: data.usageMetadata?.totalTokenCount || promptTokens + completionTokens,
      },
    }
  } catch (error: any) {
    return {
      provider: 'google',
      model: model,
      response: '',
      responseTime: Date.now() - startTime,
      cost: 0,
      tokens: { prompt: 0, completion: 0, total: 0 },
      error: error.message || 'Unknown error',
    }
  }
}

// Call DeepSeek API (OpenAI-compatible)
async function callDeepSeek(prompt: string, model: string, apiKey: string): Promise<BenchmarkResult> {
  const startTime = Date.now()
  
  try {
    const response = await fetch('https://api.deepseek.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: model,
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.7,
        max_tokens: 1000,
      }),
    })

    if (!response.ok) {
      throw new Error(`DeepSeek API error: ${response.statusText}`)
    }

    const data = await response.json()
    const responseTime = Date.now() - startTime
    
    const promptTokens = data.usage?.prompt_tokens || estimateTokens(prompt)
    const completionTokens = data.usage?.completion_tokens || estimateTokens(data.choices[0].message.content)
    
    return {
      provider: 'deepseek',
      model: model,
      response: data.choices[0].message.content,
      responseTime,
      cost: calculateCost('deepseek', model, promptTokens, completionTokens),
      tokens: {
        prompt: promptTokens,
        completion: completionTokens,
        total: data.usage?.total_tokens || promptTokens + completionTokens,
      },
    }
  } catch (error: any) {
    return {
      provider: 'deepseek',
      model: model,
      response: '',
      responseTime: Date.now() - startTime,
      cost: 0,
      tokens: { prompt: 0, completion: 0, total: 0 },
      error: error.message || 'Unknown error',
    }
  }
}

// Main benchmarking function
export async function runBenchmark(request: BenchmarkRequest): Promise<BenchmarkResult[]> {
  const { prompt, models, apiKeys } = request
  const results: BenchmarkResult[] = []

  // Run all benchmarks in parallel
  const promises = models.map(async (modelName) => {
    const [provider, model] = modelName.split('-')
    const apiKey = getApiKey(provider, apiKeys)

    if (!apiKey) {
      return {
        provider,
        model,
        response: '',
        responseTime: 0,
        cost: 0,
        tokens: { prompt: 0, completion: 0, total: 0 },
        error: 'API key not found',
      }
    }

    switch (provider) {
      case 'openai':
        return callOpenAI(prompt, model, apiKey)
      case 'anthropic':
        return callAnthropic(prompt, model, apiKey)
      case 'google':
        return callGoogle(prompt, model, apiKey)
      case 'deepseek':
        return callDeepSeek(prompt, model, apiKey)
      default:
        return {
          provider,
          model,
          response: '',
          responseTime: 0,
          cost: 0,
          tokens: { prompt: 0, completion: 0, total: 0 },
          error: 'Unknown provider',
        }
    }
  })

  return Promise.all(promises)
}

