import OpenAI from 'openai'
import Anthropic from '@anthropic-ai/sdk'
import { GoogleGenerativeAI } from '@google/generative-ai'

export interface LLMResponse {
  model: string
  response: string
  tokens?: number
  latency: number
  cost?: number
  error?: string
}

export interface LLMProvider {
  name: string
  models: string[]
  testPrompt: (prompt: string, model: string, apiKey: string) => Promise<LLMResponse>
}

// OpenAI Provider
export const openaiProvider: LLMProvider = {
  name: 'OpenAI',
  models: ['gpt-4', 'gpt-4-turbo', 'gpt-3.5-turbo'],
  
  async testPrompt(prompt: string, model: string, apiKey: string): Promise<LLMResponse> {
    const startTime = Date.now()
    
    try {
      const openai = new OpenAI({ apiKey })
      
      const completion = await openai.chat.completions.create({
        model: model,
        messages: [{ role: 'user', content: prompt }],
        max_tokens: 1000,
        temperature: 0.7,
      })
      
      const response = completion.choices[0]?.message?.content || ''
      const tokens = completion.usage?.total_tokens || 0
      const latency = Date.now() - startTime
      const cost = calculateOpenAICost(model, tokens)
      
      return {
        model: model,
        response: response,
        tokens: tokens,
        latency: latency,
        cost: cost,
      }
    } catch (error: any) {
      return {
        model: model,
        response: '',
        latency: Date.now() - startTime,
        error: error.message || 'Unknown error',
      }
    }
  }
}

// Anthropic Provider
export const anthropicProvider: LLMProvider = {
  name: 'Anthropic',
  models: ['claude-3-opus-20240229', 'claude-3-sonnet-20240229', 'claude-3-haiku-20240307'],
  
  async testPrompt(prompt: string, model: string, apiKey: string): Promise<LLMResponse> {
    const startTime = Date.now()
    
    try {
      const anthropic = new Anthropic({ apiKey })
      
      const message = await anthropic.messages.create({
        model: model,
        max_tokens: 1000,
        messages: [{ role: 'user', content: prompt }],
      })
      
      const response = message.content[0]?.text || ''
      const tokens = (message.usage.input_tokens || 0) + (message.usage.output_tokens || 0)
      const latency = Date.now() - startTime
      const cost = calculateAnthropicCost(model, message.usage)
      
      return {
        model: model,
        response: response,
        tokens: tokens,
        latency: latency,
        cost: cost,
      }
    } catch (error: any) {
      return {
        model: model,
        response: '',
        latency: Date.now() - startTime,
        error: error.message || 'Unknown error',
      }
    }
  }
}

// Google Provider
export const googleProvider: LLMProvider = {
  name: 'Google',
  models: ['gemini-pro', 'gemini-pro-vision'],
  
  async testPrompt(prompt: string, model: string, apiKey: string): Promise<LLMResponse> {
    const startTime = Date.now()
    
    try {
      const genAI = new GoogleGenerativeAI(apiKey)
      const genModel = genAI.getGenerativeModel({ model })
      
      const result = await genModel.generateContent(prompt)
      const response = result.response.text()
      const latency = Date.now() - startTime
      
      // Google doesn't provide token count in the same way
      const tokens = Math.ceil(response.length / 4) // Rough estimate
      const cost = calculateGoogleCost(model, tokens)
      
      return {
        model: model,
        response: response,
        tokens: tokens,
        latency: latency,
        cost: cost,
      }
    } catch (error: any) {
      return {
        model: model,
        response: '',
        latency: Date.now() - startTime,
        error: error.message || 'Unknown error',
      }
    }
  }
}

// DeepSeek Provider (OpenAI-compatible)
export const deepseekProvider: LLMProvider = {
  name: 'DeepSeek',
  models: ['deepseek-chat', 'deepseek-coder'],
  
  async testPrompt(prompt: string, model: string, apiKey: string): Promise<LLMResponse> {
    const startTime = Date.now()
    
    try {
      const openai = new OpenAI({
        baseURL: 'https://api.deepseek.com/v1',
        apiKey: apiKey,
      })
      
      const completion = await openai.chat.completions.create({
        model: model,
        messages: [{ role: 'user', content: prompt }],
        max_tokens: 1000,
        temperature: 0.7,
      })
      
      const response = completion.choices[0]?.message?.content || ''
      const tokens = completion.usage?.total_tokens || 0
      const latency = Date.now() - startTime
      const cost = calculateDeepSeekCost(model, tokens)
      
      return {
        model: model,
        response: response,
        tokens: tokens,
        latency: latency,
        cost: cost,
      }
    } catch (error: any) {
      return {
        model: model,
        response: '',
        latency: Date.now() - startTime,
        error: error.message || 'Unknown error',
      }
    }
  }
}

// Cost calculation functions
function calculateOpenAICost(model: string, tokens: number): number {
  const pricing: Record<string, { input: number; output: number }> = {
    'gpt-4': { input: 0.03, output: 0.06 },
    'gpt-4-turbo': { input: 0.01, output: 0.03 },
    'gpt-3.5-turbo': { input: 0.0015, output: 0.002 },
  }
  
  const prices = pricing[model] || pricing['gpt-3.5-turbo']
  // Rough estimate: assume 50/50 input/output split
  return (tokens * 0.5 * prices.input + tokens * 0.5 * prices.output) / 1000
}

function calculateAnthropicCost(model: string, usage: any): number {
  const pricing: Record<string, { input: number; output: number }> = {
    'claude-3-opus-20240229': { input: 0.015, output: 0.075 },
    'claude-3-sonnet-20240229': { input: 0.003, output: 0.015 },
    'claude-3-haiku-20240307': { input: 0.00025, output: 0.00125 },
  }
  
  const prices = pricing[model] || pricing['claude-3-sonnet-20240229']
  return (usage.input_tokens * prices.input + usage.output_tokens * prices.output) / 1000
}

function calculateGoogleCost(model: string, tokens: number): number {
  // Google pricing (approximate)
  return (tokens * 0.00025) / 1000
}

function calculateDeepSeekCost(model: string, tokens: number): number {
  // DeepSeek pricing (approximate)
  return (tokens * 0.0014) / 1000
}

export const providers = [openaiProvider, anthropicProvider, googleProvider, deepseekProvider]
